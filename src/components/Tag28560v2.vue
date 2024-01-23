<script setup>
import { ref, onMounted, onUpdated, computed } from 'vue'

const props = defineProps(["tag", "focus"])

const typeOfUsage = [
  {
    value: 0,
    title: "Acquisition item",
  },
  {
    value: 1,
    title: "Item for circulation",
  },
  {
    value: 2,
    title: "Item not for circulation",
  },
  {
    value: 3,
    title: "For local use",
  },
  {
    value: 4,
    title: "For local use",
  },
  {
    value: 5,
    title: "For future use",
  },
  {
    value: 6,
    title: "No information about usage of the tag",
  },
  {
    value: 7,
    title: "Discarded item",
  },
  {
    value: 8,
    title: "Patron card",
  },
  {
    value: 9,
    title: "Library equipment",
  }
]
const mediaFormat = [
  {
    value: 0,
    title: "Undefined",
  },
  {
    value: 1,
    title: "Book",
  },
  {
    value: 2,
    title: "CD/DVD",
  },
  {
    value: 3,
    title: "Magnetic tape",
  },
  {
    value: 4,
    title: "Other",
  },
  {
    value: 5,
    title: "Other, careful handling is required",
  },
  {
    value: 6,
    title: "Very small item, special handling is required",
  },
]

onMounted(() => {
  console.log("tag28560 created", props.tag.UID, props.tag);
})

onUpdated(() => {
  console.log("tag28560 updated", props.tag.UID, props.tag.AFI, props.tag);

})

</script>
<template>
  

  <div class="divider"></div>
  <!-- basic block -->
  <template v-for="(value, key) in tag.model.basicBlock">
    <v-select class="item" :class="key" density="compact" v-if="key.toLowerCase() === 'typeofusage'" :key=key
      :items="typeOfUsage" :title="tag.model.basicBlock[key]" label="typeOfUsage"
      v-model="tag.model.basicBlock[key]"></v-select>
    <v-text-field class="item" :class="key" density="compact" v-if="key.toLowerCase() !== 'typeofusage' && key !== focus"
      :type="['partnumber', 'partsinitem', 'contentparameter'].indexOf(key.toLowerCase()) > -1 ? 'number' : 'text'"
      :key=key v-model="tag.model.basicBlock[key]" :label="key" :disabled="[
        'truncatedBasicBlock',
        'crc',
        'crcError',
        'typeOfUsageToString',
      ].indexOf(key.toLowerCase()) > -1
        "></v-text-field>
    <v-text-field class="item" :class="key" density="compact" v-if="key === focus" :key=key
      v-model="tag.model.basicBlock[key]" :label="key" autofocus></v-text-field>
  </template>
  <div class="divider"></div>
  <!-- extension blocks -->
  <template v-for="(eBlock, index) in tag.model.extensionBlocks">
    <template v-for="(value, key) in eBlock">
      <v-text-field class="item" :class="key" density="compact" v-if="key.toLowerCase() !== 'mediaformat'"
        :key="key + index" v-model="eBlock[key]" :label="key" :disabled="['datablockid', 'name', 'mediaformatstring'].indexOf(
          key.toLowerCase()
        ) > -1
          "></v-text-field>
      <v-select class="item" :class="key" density="compact" v-if="key.toLowerCase() === 'mediaformat'" :key="key"
        :items="mediaFormat" label="mediaFormat" v-model="eBlock[key]">

      </v-select>
    </template>
  </template>
</template>
<style scoped>
.container {
  display: flex;
  flex-wrap: wrap
}

.item {
  flex-basis: 48%;
  padding: 5px;
}

.divider {
  flex-basis: 100%;
}
</style>