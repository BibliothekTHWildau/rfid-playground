import { ref } from 'vue'
import { defineStore } from 'pinia'
import rfid from "../assets/rfid-controls.js"


// todo import 
import ISO28560DataModel from "iso28560-3"

export const useRFIDStore = defineStore('rfid', () => {

  const readers = ref(null);
  //const restBaseUrl = ref("world");
  const restBaseUrl = ref(localStorage.getItem('/vue3/restBaseUrl') || "http://localhost:4000/")
  const websocketBaseUrl = ref(localStorage.getItem('/vue3/websocketBaseUrl') || "ws://127.0.0.1:4001/")

  function setRestBaseUrl(url) {
    restBaseUrl.value = url
    localStorage.setItem('/vue3/restBaseUrl', url);
    getReaders();
  }

  function setWebsocketBaseUrl(url) {
    url = url.replace(/^http/,"ws")
    websocketBaseUrl.value = url
    localStorage.setItem('/vue3/websocketBaseUrl', url);
  }


  async function getReaders() {
    console.log("restBaseUrl.value", restBaseUrl.value)
    //console.log("process.env.BASE_URL",process.env.BASE_URL);
    //console.log("import.meta.env.BASE_URL",import.meta.env.BASE_URL);
    rfid.setRestBaseUrl(restBaseUrl.value);

    try {
      readers.value = await rfid.getReaders();
    } catch (err) {
      console.log(err)
      readers.value = []
    }

  }

  function perform(reader, method, value = null) {
    return new Promise((resolve, reject) => {
      console.log("store", reader, method, value)

      if (readers.value[reader].busy){
        return reject({ error:"busy"})
      }

      readers.value[reader].busy = true;

      rfid[method](reader, value).then(response => {
        
        resolve(response)
        readers.value[reader].busy = false;

      }).catch(err => {
        // throw err 
        reject(err)
        readers.value[reader].busy = false;
      })
    })
  }

  function dataToISO28560(data){
    return  new ISO28560DataModel(data);
  }

  function modelToData(model,size){
    return Array.from(new ISO28560DataModel(model).getByte(size));
  }

  return { readers, restBaseUrl, getReaders, websocketBaseUrl, setRestBaseUrl, setWebsocketBaseUrl, perform, dataToISO28560, modelToData }
})
