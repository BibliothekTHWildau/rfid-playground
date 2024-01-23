<script setup>
import { useRFIDStore } from '@/store/rfid'
import { useKonvertierungStore } from '@/store/konvertierung'
import Reader from '../components/Reader.vue'
import Tag from '@/components/Tag.vue'

import KonvertierungsTagData from "../assets/konvertierung/konvertierungsTag.json";
//import KonvertierungsTagData from "../assets/ISO28560-3/test/error.json";
//import ISO28560DataModel from "../assets/ISO28560-3/src/ISO28560.js";
import ISO28560DataModel from "iso28560-3";

import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const store = useRFIDStore();
const konvertierungStore = useKonvertierungStore();
//store.getReaders();
const selectedReaderID = ref(konvertierungStore.defaultReader)
//const selectedReader = ref(null)

watch(selectedReaderID, async (newSelectedReaderID, oldSelectedReaderID) => {
  console.log("watch", selectedReaderID)
  konvertierungStore.setDefaultReader(newSelectedReaderID)
  reset();
})


const konvTag = ref(KonvertierungsTagData)
const tagsToWrite = ref([])
const availTags = ref([])
const doingKonvertierung = ref(false)
const konvertierungsResult = ref({
  state: false,
  text: "",
  class: 'green'
})
const confirmedMediaPackage = ref(false)
const sendBytes = ref(true)
const standardInventory = ref(true)



onBeforeUnmount(() => {
  store.perform(selectedReaderID.value, 'rfOff').then( () => {}).catch(err => { console.log( err )})

})

function createTagDataForKonvertierung(availTag, partNumber, totalParts) {

  // deep copy from vorlage AFI,DSFID, UID, but not model
  let tmpTag = JSON.parse(JSON.stringify(konvTag.value));
  tmpTag.UID = availTag.UID;
  tmpTag.dataModel = "ISO28560-3";

  // get model which is not reactive
  let tmpModel = Object.assign({}, konvTag.value.model);

  // set partnumber and total parts if mediapackage is initialized
  if (confirmedMediaPackage.value) {
    tmpModel.basicBlock.partNumber = partNumber;
    tmpModel.basicBlock.partsInItem = totalParts;
  }


  if (sendBytes.value) {

    tmpTag.data = Array.from(new ISO28560DataModel(tmpModel).getByte(availTag.tagSize));
    delete tmpTag.model;
    return tmpTag;
  }

  // empty extension blocks
  tmpTag.model.basicBlock = tmpModel.basicBlock;
  tmpTag.model.extensionBlocks = [];

  // and copy only the ones with data
  for (let index in tmpModel.extensionBlocks) {
    let eBlock = tmpModel.extensionBlocks[index];
    //console.log(eBlock.dataBlockID);
    let keepBlock = false;
    for (let key in eBlock) {
      if (key.toLowerCase() === "datablockid") continue;
      //console.log(key);
      keepBlock = eBlock[key] && !keepBlock ? true : false;
      if (keepBlock) {
        //console.log("value found, keeping block");
        tmpTag.model.extensionBlocks.push({ ...eBlock });
        break;
      }
    }
  }

  return tmpTag;
}

async function konvertiere() {
  doingKonvertierung.value = true;

  //selectedReader.value.perform('setKeepOpen', true)
  await store.perform(selectedReaderID.value, 'setKeepOpen', true);

  console.log("Beginne Konvertierung");
  if (availTags.value.length === 0) {

    console.log("UIDs holen via konvertierungsInventory (liefert uids und tagSize)");

    // todo
    // either send inventory OR konvertierungsInventory 
    let inventoryCommand = standardInventory.value ? "inventory" : "konvertierungsInventory";

    let inventoryResponse;
    try {
      //inventoryResponse = await selectedReader.value.perform(inventoryCommand);
      inventoryResponse = await store.perform(selectedReaderID.value, inventoryCommand);
    } catch (error) {

      return alert(JSON.stringify(error));

    }



    if (!inventoryResponse || !inventoryResponse.tags) {
      // error on inventory
      alert("ToDo" + JSON.stringify(inventoryResponse))
      return false;
    }

    if (inventoryResponse.tags && inventoryResponse.tags.length > 0) {
      if (inventoryResponse.tags[0].tagSize) {
        availTags.value = inventoryResponse.tags.map(t => { return { "UID": t.UID, "tagSize": t.blockSize * t.memSize } });
      } else {
        availTags.value = inventoryResponse.tags.map(t => { return { "UID": t.UID, "tagSize": false } });
      }

    } else {
      //availTags = inventoryResponse.tags.map(t => { return { "UID": t.UID, "tagSize": t.blockSize * t.memSize } });
    }



  }

  // for tests only
  //this.availTags = [{ "UID": "E004010812AA5FCB", "tagSize": 320 } ]  
  // for testing only, remove uids in production
  //this.availTags = ["E004010812AA5FCC", "E004010812AA5FCB", "E004010812AA5FBF"];
  //this.availTags = [ { "UID": "E004010812AA5FCC", "tagSize": 320 }, { "UID": "E004010812AA5FCB", "tagSize": 320 }, { "UID": "E004010812AA5FBF", "tagSize": 320 } ]



  console.log("UIDs vorhanden, Prüfung auf Anzahl");
  if (availTags.value.length > 1) {

    let confirmation = await window.confirm(
      availTags.value.length + " Transponder im Lesefeld. Medienpaket erstellen?"
    );
    if (!confirmation) {
      console.log(
        "Medienpaket soll nicht initialisiert werden. Stoppe Konvertierung."
      );

      return reset();
    } else {
      // partNumber and partsInItem will be generated 
      confirmedMediaPackage.value = true;
    }
  }

  tagsToWrite.value = [];

  console.log("Schreibe Tag auf Reader " + selectedReaderID.value);
  let partNumber = 1;

  konvertierungsResult.value.class = "green";
  konvertierungsResult.value.text = "Fertig";

  for (const availTag of availTags.value) {

    // strip out empty fields from model
    let tag = createTagDataForKonvertierung(
      availTag,
      partNumber,
      availTags.value.length
    );

    console.log("this tag gets written: ", tag);
    tag.class = "orange";
    tag.error = "";
    tagsToWrite.value.push(tag);
    partNumber++;

    //let response = await selectedReader.value.perform("writeTag", tag);
    let response = await store.perform(selectedReaderID.value, "writeTag", tag);
    console.log("response", response);
    if (!response.error) {
      tag.class = "green";
    } else {
      tag.class = "red";
      tag.error = response.error;
      if (konvertierungsResult.value.class == "green") {
        konvertierungsResult.value.class == "red";
        konvertierungsResult.value.text == "Fehler";
      }
    }
  }

  // show snackbar
  konvertierungsResult.value.state = true;
  //selectedReader.value.perform('setKeepOpen', false)
  await store.perform(selectedReaderID.value, 'setKeepOpen', false);
  reset();
}
function reset() {
  doingKonvertierung.value = false;
  konvTag.value.model.basicBlock.primaryItemIdentifier = "";
  availTags.value = [];
}

</script>

<template>
  <p v-if="!store.readers">Loading...</p>
  <v-container class="" v-if="store.readers">
    <v-row>
      <v-col cols="12" md="3">
        <template v-if="selectedReaderID">
          <v-btn @click="konvertiere" :disabled="doingKonvertierung">Konvertierung</v-btn>
          <v-chip v-for="tag in tagsToWrite" :key="tag.UID" :color="tag.class" :title="tag.error">{{ tag.UID }} {{
            tag.error
          }}</v-chip>
        </template>
      </v-col>

      <v-col cols="12" md="6">
        <template v-if="selectedReaderID">
          <v-form @submit.prevent="konvertiere">
            <input style="display: none" type="submit" />
            <!--{{ konvTag }}-->
            <Tag :tag="konvTag" focus="primaryItemIdentifier" konvertierung=true></Tag><!--ref="konvTag"-->

          </v-form>
        </template>
      </v-col>

      <v-col cols="12" md="3">
        <v-select :items="Object.keys(store.readers)" v-model="selectedReaderID" label="Select reader"></v-select>



        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>Settings</v-expansion-panel-title>
            <v-expansion-panel-text>
              ToDo: Inventory oder getTags (inkl. tag info) um den Speicher für das
              Modell zu ermitteln. Unsere kleinsten Tags haben 28Blocks a 4Byte =
              112Byte. Da passt der BasicBlock und libExtension Block problemlos drauf.

              <v-checkbox v-model="sendBytes" label="send data as byte Array (recommended)"></v-checkbox>
              <v-checkbox v-model="standardInventory"
                label="use standard inventory to get uids (will not fetch tag size)"></v-checkbox>
            </v-expansion-panel-text>

          </v-expansion-panel>

        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row no-gutters>

      <v-col cols="12">
        <v-snackbar v-model="konvertierungsResult.state" timeout="1000" :color="konvertierungsResult.class">
          {{ konvertierungsResult.text }}
        </v-snackbar></v-col>


    </v-row>
  </v-container>
</template>

<style>
.konvertierungsWrapper {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
}

/* hide unneccessary keys */
.konvertierungsTag .UID,
.konvertierungsTag .dataModel,
.konvertierungsTag .dataBlockID,
.konvertierungsTag .ItemIdentifier,
.konvertierungsTag .OwnerInstitution {
  display: none
}
</style>