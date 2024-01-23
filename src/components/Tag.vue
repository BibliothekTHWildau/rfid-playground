<script setup>
import { ref, onMounted, onUpdated, computed, onBeforeMount, watch } from 'vue'
import Tag28560v2 from "./Tag28560v2.vue";
import Menu from "./tag/Menu.vue";
import { useRFIDStore } from '@/store/rfid'


const emit = defineEmits(['tagAction'])

const props = defineProps(["tag", "focus", "options", "konvertierung"])

const store = useRFIDStore();

const debug = ref(false)
const tagCopy = ref({}) // was null before

var predefinedAFIs = [
  {
    value: 0x07,
    title: "(07h) checked in (ISO28560)",
  },
  {
    value: 0x9e,
    title: "(9Eh) checked in (since 2005)",
  },
  {
    value: 0x92,
    title: "(92h) checked in (until 2005)",
  },
  {
    value: 0xc2,
    title: "(C2h) checked out (ISO28560)",
  },
  {
    value: 0x9d,
    title: "(9Dh) checked out (since 2005)",
  },
  {
    value: 0x91,
    title: "(91h) checked out (until 2005)",
  },
]

onBeforeMount(() => {
  console.log("onBeforeMount")
  tagCopy.value = Object.assign({}, props.tag)
  //tagCopy.value = JSON.parse(JSON.stringify(props.tag))
  if (!tagCopy.value.model && tagCopy.value.data) {
    console.log("onBeforeMount: no model but data given build model");
    tagCopy.value.model = store.dataToISO28560(tagCopy.value.data);
  } else {
    console.log("onBeforeMount: model given");
    //tagCopy.value.model = {...props.tag.model}//Object.assign({},props.tag.model)
    //delete(props.tag.model)
  }
})

watch(props.tag, async (newTagData, oldTagData) => {
  console.log("watch tag:")

  let buildNewModel = false;
  if (tagCopy.value && tagCopy.value.data && newTagData.data){
    
    if (newTagData.data.length !== tagCopy.value.data.length || !newTagData.data.every((value, index) => value === tagCopy.value.data[index])) {
      console.log("  new model from data")
      buildNewModel = true;
    }
   
  }

  // assign new elements to tagCopy - while keeping old data
  tagCopy.value = Object.assign(tagCopy.value, props.tag)
  

  // build model if no model was build before
  if (!tagCopy.value.model && newTagData.data) {
    console.log("watch: no model but data given build model");
    //tagCopy.value = Object.assign({}, props.tag);
    tagCopy.value.model = store.dataToISO28560(newTagData.data);
  }

  // rebuild model if data changed
  /*if (newTagData.data && (newTagData.data.length !== oldTagData.data.length || newTagData.data.every((value, index) => value !== oldTagData.data[index]))) {
    // data changed
    console.log("watch: data changed, rebuild model");
    tagCopy.value = Object.assign({}, props.tag);
    tagCopy.value.model = store.dataToISO28560(newTagData.data);
  }*/

  if (buildNewModel){
    // data changed
    console.log("watch: data changed, rebuild model");
    tagCopy.value.model = store.dataToISO28560(newTagData.data);
  }
},/*{ immediate: true }*/)



const selectAFIValues = computed(() => {
  if (predefinedAFIs.find((ele) => ele.value === props.tag.AFI))
    return predefinedAFIs;
  else
    return predefinedAFIs.concat({
      //value: tg.value.AFI,
      value: props.tag.AFI,
      //title: "(" + tg.value.AFI.toString(16).toUpperCase() + "h) eigener Wert",
      title: "(" + props.tag.AFI.toString(16).toUpperCase() + "h) eigener Wert",
    });
})

/*const tagCopy = computed(() => {
  return Object.assign({},props.tag)
})*/



async function tagAction(action) {

  console.log("tagAction:", action)

  let response = null;
  let reader = tagCopy.value._reader;
  let uid = tagCopy.value.IDD;

  try {
    switch (action) {
      // props.tag -> tagCopy.value
      case "getTag":
        response = await store.perform(reader, action, uid)
        break;

      case "getAFI":
        response = await store.perform(reader, action, uid)
        break;

      case "eraseTag":
        let confirm = window.confirm("erase Tag");
        if (!confirm) return false;

        let tagToDelete = { 'UID': uid };
        response = await store.perform(reader, "deleteTag", tagToDelete)
        break;
      case "writeTag": {

        let dataToWrite = store.modelToData(tagCopy.value.model, tagCopy.value['MEM-SIZE']);

        if (tagCopy.value.blockSecurityStatus) {
          let secStatus = tagCopy.value.blockSecurityStatus;
          console.log(secStatus)
          let offset = 0;
          for (let i in secStatus) {
            console.log(i, secStatus[i])
            // each block
            if (secStatus[i] === 1 && dataToWrite[offset]) {
              //return alert(`Block ${i} is locked and data shall be written to it. Writing will result in an ISOError.`)
            }
            offset += tagCopy.value.BLOCKSIZE;
          }
        }

        let tagToWrite = { 'UID': uid, data: dataToWrite, 'AFI': tagCopy.value.AFI };
        response = await store.perform(reader, "writeTag", tagToWrite)
      }
        break;

      case "setAFI":

        let tagToWrite = { 'UID': uid, 'AFI': tagCopy.value.AFI };
        response = await store.perform(reader, "setAFI", tagToWrite)
        break;

      default:
        console.log(action + " not implemented yet");
    }

    emit("tagAction", response);

  } catch (error) {
    console.log(error)
  }

  

}

</script >
<template>
  <div class="tag" :class="{ konvertierungsTag: konvertierung }">
    <Menu v-if="options == 'true'" @on-action="tagAction"></Menu>
    <label><input type="checkbox" v-model="debug" /> Debug </label><template v-if="debug"><br>tag:{{ tag }}<br>tagCopy:{{
      tagCopy }}</template>
    <div class="container">
      <template v-for="(value, key) in tagCopy">
        <v-text-field class="item" :class="key" v-if="['model', 'data', 'AFI'].indexOf(key) == -1"
          :title="JSON.stringify(value)" :key=key v-model="tagCopy[key]" :label="key" :readonly="['TR-TYPE',
            'idd',
            'syssize',
            'blocksize',
            'blocks',
            'memsize',
            'mem-size',
            'ic-ref',
            'name',
            'uid',
            'datamodel',
            'data',
            'afihex',
            'tr-type'
          ].indexOf(key.toLowerCase()) > -1
            " density="compact"></v-text-field>
        <v-select class="item" density="compact" v-if="key === 'AFI'" :key=key :items="selectAFIValues" label="AFI"
          v-model="tagCopy.AFI">
        </v-select>
        <template v-if="key === 'model' && tagCopy.model" :key=key><!--key === 'data' ||-->
          <template v-if="tagCopy.blockSecurityStatus && tagCopy.blockSecurityStatus.indexOf(1) > -1"><v-alert class="ml-2 mr-2 line" type="warning">Blocks on this tag are locked. Writing will result in an ISOError</v-alert></template>
          <Tag28560v2 :tag="tagCopy" :focus="focus" ></Tag28560v2>
        </template>
      </template>

    </div>

  </div>
</template >
<style scoped>
.tag {
  /*display: block;
  max-width: 600px;*/
  
  max-width: 450px;
  border: 1px solid #777;
  border-radius: 2px;

}

.container {
  display: flex;
  flex-wrap: wrap
}

.item {
  padding: 5px;
  flex-basis: 48%;
}

.line {
  padding: 5px;
  flex-basis: 98%;
}

._reader {
  display: none
}

.blockSecurityStatus {
  display:none
}
</style>