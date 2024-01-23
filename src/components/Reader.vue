<script setup>
const props = defineProps(['reader', 'showTags'])
const emit = defineEmits(['readerResponse'])


import { ref, onMounted } from 'vue'
import rfid from "../assets/rfid-controls.js"
import Tag from './Tag.vue'

import { useRFIDStore } from '@/store/rfid'
const store = useRFIDStore();


// reactive state
//const output = ref("")
const tags = ref({})
const keepOpen = ref(false)

const methods = [
  { name: "inventory" },
  { name: "rfOff" },
  { name: "getTags" }
]

const readerError = ref(false)

async function rfOff() {
  rfid.rfOff(props.reader.id).then(response => console.log(response))
}

async function click(method, value = null) {
  
  try {
    let response = await store.perform(props.reader.id, method, value)
    
    // todo check
    // setKeepOpen f.e.
    //if (!response) return resolve()
    
    if (props.showTags !== undefined && response.tags) {
      console.log("yes")
      tags.value = response.tags
    } 

    // hide error
    readerError.value = false
    emit("readerResponse", response);
    //resolve(response)

    //
  } catch (err) {
    console.log("error in click", err)
    readerError.value = JSON.stringify(err)
    emit("readerResponse", err);   
  } finally {
    
  }

  /*try { await perform(method, value) }
  catch (err) {

  }*/
}



function onTagAction() { }

// lifecycle hooks
onMounted(() => {
  //  console.log(`The initial count is ${count.value}.`)
})

</script>

<template>
  <v-card :loading="reader.busy" class="d-inline-block reader" max-width="fit-content" density="compact">
    <v-card-title :title="JSON.stringify(reader)">
      {{ reader.id }} <!--<v-icon v-if="reader.busy" size="x-small" color="" class="loading">
        mdi-loading
      </v-icon>-->
    </v-card-title>
    <v-card-text >
      <div v-if="readerError" :class="{ 'bg-red': readerError }">{{ readerError }}</div>
      <div v-if="props.showTags !== undefined" id="tags">
        <Tag v-for="tag in tags" :key=tag.uid :tag="tag" options=true @tagAction="onTagAction" />
      </div>
    
   
      <v-btn size="small" v-for="method in methods" @click="click(method.name, method.value)">{{ method.name }}</v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.reader {
 
  margin: 5px;
}





.loading {
  animation:spin 1s linear infinite;
}

@keyframes spin { 
    100% { 
        -webkit-transform: rotate(360deg); 
        transform:rotate(360deg); 
    } 
}
</style>
