import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useKonvertierungStore = defineStore('konvertierung', () => {
  
  const defaultReader = ref(localStorage.getItem('/vue3/konvertierung/selectedReaderID') || "pi2")

  function setDefaultReader(r) {
    localStorage.setItem('/vue3/konvertierung/selectedReaderID', r);
  }
  
  return { defaultReader, setDefaultReader }
})
