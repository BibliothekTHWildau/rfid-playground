<template>
  <v-navigation-drawer v-model="sidebar" location="left" temporary>
    <v-list>
      <v-list-item class="px-2">

      </v-list-item>
      <v-list-item v-for="view in views" :key="view.title" :to="view.path">

        <v-list-item-title v-text="view.title"></v-list-item-title>

      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar color="light">
    <v-app-bar-nav-icon variant="text" @click.stop="sidebar = !sidebar"></v-app-bar-nav-icon>

    <v-toolbar-title><a href="/" class="simple">RFID</a></v-toolbar-title>

    <v-toolbar-items class="scroll">
      <v-btn v-for="view in views" :key="view.title" :to="view.path" text color="red-darken-4">
        {{ view.title }}
      </v-btn>

    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-btn to="/settings" icon>
      <v-icon dense color="">
        mdi-cogs
      </v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>


import { ref } from 'vue'

const sidebar = ref(false)
const views = ref([
  // { "title": "/", "path": "/" },
  { "title": "Playground", "path": "/playground" },
  { "title": "Create tag", "path": "/konvertierung" },
  //{ "title": "VorOrt", "path": "/vorort" },
  { "title": "ISO28560", "path": "iso28560" },
  //{ "title": "Selfcheck", "path": "/selfcheck" },
  //{ "title": "Inventory", "path": "/inventory" }

])
</script>
<style scoped>
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

.simple {
  text-decoration: none;
  color: inherit;
}
</style>
