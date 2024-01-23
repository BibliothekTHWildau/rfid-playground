<script setup>
import { useRFIDStore } from '@/store/rfid'
import Reader from '../components/Reader.vue'
import Tag from '@/components/Tag.vue'
import { reactive } from 'vue'

const store = useRFIDStore();
var tags = reactive([])

async function handleReaderResponse(response) {
  console.log("handleReaderResponse", response)

  if (response.tags && tags.length > 0) {

    //tags.splice(0);
    await flush();
  }

  if (response.tags || response.inventory) {

    response.tags.forEach(tag => {
      console.log("pushing to tags")
      tag['_reader'] = response.reader
      tags.push(tag)
    });


  }
}



function onTagAction(response) {

  console.log("Playground onTagAction", response)

  if (!response.tag)
    return console.log("NO TAG in response")

  // find the tag that caused the action  
  let targetTag = tags.find((t) => { return t.UID === response.tag.UID });
  if (targetTag) {
    console.log("assigning new tag data")
    console.log(JSON.stringify(targetTag));
    console.log(JSON.stringify(response.tag));
    targetTag = Object.assign(targetTag, response.tag)
  } else { }

  /*tags.value.forEach(tag =>{ 
      
      if (tag.UID === response.UID){
        
      }
  })*/
}

async function flush() {
  console.log("empty tags")
  tags.splice(0);
}


</script>

<template>
  <v-row>
    <v-col cols="auto" class="scroll">
          <Reader v-for="reader in store.readers" :reader="reader" @reader-response="handleReaderResponse" />
        </v-col>
  </v-row>
  <v-row>
    
    <v-col>
      <v-row>
        <v-col cols="12">
          <Tag v-for="tag in tags" :key=tag.UID class="d-inline-block mr-2 mt-2" :tag="tag" options=true
            @tagAction="onTagAction"></Tag>
        </v-col>
      </v-row>

    </v-col>
  </v-row>
</template>

<style>
@media (max-width: 1024px) {
  .scroll {
  white-space: nowrap;
  /* [1] */
  overflow-x: auto;
  /* [2] */
  -webkit-overflow-scrolling: touch;
  /* [3] */
  -ms-overflow-style: -ms-autohiding-scrollbar;
  /* [4] */
}

/* [5] */
.scroll::-webkit-scrollbar {
  display: none;
}
}
.playground {
  display: grid;
  grid-template-columns: 1fr 4fr;
}

.fixed {
  position: sticky;
  width: 100%;
  top: 0;
  left: 0;
}

.tags {
  display: flex
}

.tags .IDD {
  display: none;
  ;
}

/*@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}*/
</style>
