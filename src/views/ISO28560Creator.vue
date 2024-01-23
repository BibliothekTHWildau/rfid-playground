<script setup>
import { useRFIDStore } from '@/store/rfid'
import Tag from '@/components/Tag.vue'
import { ref, computed } from 'vue'


//import tagData from "../assets/konvertierungsTag.json";
import tagDataJSON from "../assets/konvertierung/konvertierungsTag_all.json";
//import tagData from "../assets/newstructuredblock.json";
const store = useRFIDStore();

const tagData = ref(tagDataJSON);
const rawData = ref(null);//[17,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-60,-64,68,69,53,50,54,0,0,0,0,0,0,0,0,-95,255,255,-56,1,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,0,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,48,2,0,66,0,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,0,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,0,0,0,0,0],
const tagFromByte = ref(null);//undefined;
const tagSize = ref(false);
const tagSizes = [
  { text: "unset", value: false },
  { text: "32 bytes truncated basic block", value: 32 },
  { text: "34 bytes untruncated basic block", value: 34 },
  { text: "112 bytes with extension blocks (28blocks)", value: 112 },
  { text: "320 bytes with extension blocks (80blocks)", value: 320 },
]

const removeEmptyExtensionBlocks = ref(true)



const rawDataHex = computed(() => {
  if (!rawData.value) return undefined;

  return rawData.value.map(v => v.toString(16));
})

function rawToHex() {
  let foo = "";
  for (let i in rawData.value) {
    foo += ("0" + rawData.value[i].toString(16)).slice(-2)

  }
  return foo
}

function getTagFromByte() {
  // first run
  if (!tagFromByte.value)
    tagFromByte.value = { data: Array.from(rawData.value)};
  else {
    // if we do would call tagFromByte.value = { data: Array.from(rawData.value)};
    // it would not be reactive
    console.log("update tagFromByte")
    tagFromByte.value.data = Array.from(rawData.value);
  }


}

function createTagDataForKonvertierung () {
  // including empty extension blocks
  if (!removeEmptyExtensionBlocks.value)
  return rawData.value = store.modelToData(tagData.value.model,tagSize.value);
  
  // 
  let tmpModel = JSON.parse(JSON.stringify(tagData.value.model));
  tmpModel.extensionBlocks = [];

  // and copy only the ones with data
  for (let index in tagData.value.model.extensionBlocks) {
    let eBlock = tagData.value.model.extensionBlocks[index];
    //console.log(eBlock.dataBlockID);
    let keepBlock = false;
    for (let key in eBlock) {
      if (key.toLowerCase() === "datablockid") continue;
      //console.log(key);
      keepBlock = eBlock[key] && !keepBlock ? true : false;
      if (keepBlock) {
        //console.log("value found, keeping block");
        tmpModel.extensionBlocks.push({ ...eBlock });
        break;
      }
    }
  }
  return rawData.value = store.modelToData(tmpModel,tagSize.value);
}

</script>
<template>

<v-container class="">
    

      
      <v-row class="">
        <v-col cols="auto">
          <div v-if="rawData" class="mono">
            RawData: {{ rawData }} <br />RawData (hex): {{ rawToHex(rawData) }} ({{ rawDataHex.length }})
          </div>
        </v-col>

       
      </v-row>
      <v-row class="">
        <v-col cols="6">
          <v-btn @click="createTagDataForKonvertierung">tag2byte</v-btn>
          <v-radio-group v-model="tagSize" label="tag size">
            <v-radio v-for="ts in tagSizes" :key="ts.value" :label="ts.text" :value="ts.value"></v-radio>
          </v-radio-group>
          <v-checkbox v-model="removeEmptyExtensionBlocks" label="remove empty extension blocks"></v-checkbox>
        </v-col>

       

        <v-col cols="6">
          <v-btn @click="getTagFromByte">byte2tag</v-btn>
        </v-col>
      </v-row>

      <v-row class="">
        <v-col cols="6">
          <Tag :tag="tagData" ref="sourceTag" :focus="'primaryItemIdentifier'"></Tag>
        </v-col>

        

        <v-col cols="6">
          <Tag v-if="tagFromByte" :tag="tagFromByte"></Tag>
        </v-col>
      </v-row>
    
  </v-container>


  
</template>
<style scoped>
  .mono {
    font-family: monospace;
}
</style>
