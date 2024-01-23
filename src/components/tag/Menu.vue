<script setup>
const  options = [
        {'text': 'get' , 'value' : 'getTag'},
        {'text': 'erase' , 'value' : 'eraseTag'},
        {'text': 'write' , 'value' : 'writeTag'},
        {'text': 'get AFI' , 'value' : 'getAFI'},
        {'text': 'set AFI' , 'value' : 'setAFI'},
      ];
</script>
<template>
  <span>
    <v-btn 
      v-for="item in options" 
      :key="item.text"
      elevation="0" 
      size="small"
      variant="text"
      @click="$emit('on-action',item.value)">
        {{item.text}}
      </v-btn>
 </span>
  
</template>
    