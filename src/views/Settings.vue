<script setup>
import { ref , watch} from 'vue'
import { useRFIDStore } from '@/store/rfid'
import { useLogStore } from '@/store/log'

const store = useRFIDStore();
const logstore = useLogStore();

const restUrl = ref(store.restBaseUrl);
const websocketUrl = ref(store.websocketBaseUrl);

const debug = ref(logstore.loggingEnabled)
watch(debug, async (debugVal) => {
  console.log("watch debug", debugVal)
  if (debugVal)
    logstore.enableLogging()
  else
    logstore.disableLogging()

})



function save(){
  store.setRestBaseUrl(restUrl.value);
  store.setWebsocketBaseUrl(websocketUrl.value)

}
  

</script>

<template>
  <v-row>
    <v-col >
      <v-card>
        <v-card-title>Einstellungen</v-card-title>
        <v-card-text>
          <v-checkbox v-model="debug" label="debug"></v-checkbox>
          <v-text-field v-model="restUrl" label="Rest base url" placeholder="http://localhost:8080/rfid-rest/rest/">
          </v-text-field>

          <v-text-field v-model="websocketUrl" label="Websocket base url"
            placeholder="ws://127.0.0.1:8080/rfid-rest/websocket/"></v-text-field>
          <v-btn @click="save">Speichern</v-btn>
        </v-card-text>

      </v-card>
    </v-col>
  </v-row>
</template>


