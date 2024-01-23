<template>
  
  <v-main>
    <template v-if="loggingEnabled">
      <v-btn @click="logstore.clearLog">clear</v-btn>
      <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>Logs</v-expansion-panel-title>
            <v-expansion-panel-text >
              <div v-for="log in logs">
                {{ log }}
              </div>
            </v-expansion-panel-text>

          </v-expansion-panel>

        </v-expansion-panels>
    </template>
    <v-alert v-if="store.readers && Object.keys(store.readers).length == 0" type="warning" class="ml-2 mr-2">No readers found. 
    
      <v-btn @click="store.getReaders" color="warning" class="ml-1" text elevation="0">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
    </v-alert>
    
    <router-view />
    
  </v-main>
</template>

<script setup>
  import { useRFIDStore } from '@/store/rfid'
  import { useLogStore } from '@/store/log'
  import { storeToRefs } from 'pinia'
  const store = useRFIDStore();
  const logstore = useLogStore();
  const { logs,loggingEnabled } = storeToRefs(logstore)
  console.log(loggingEnabled)
</script>
