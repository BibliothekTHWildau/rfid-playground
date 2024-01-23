<template>
  <router-view />
</template>

<script setup>
import { useRFIDStore } from '@/store/rfid'
const store = useRFIDStore();
store.getReaders();
</script>
