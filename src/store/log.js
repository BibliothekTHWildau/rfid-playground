// Utilities
import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useLogStore = defineStore('log', () => {

  const logs = reactive([])
  const loggingEnabled = ref(false)
  var redirected = false;

  /*function log(messages) {
    alert(messages)
    logs.value += messages
  }*/

  function enableLogging() {

    loggingEnabled.value = true;

    if (redirected) {
      return;
    }

    console.log("moving log");
    redirected = true;
    var oldLog = console.log;
    console.log = function (...messages) {

      logs.push(messages);

      oldLog.apply(console, messages);
      //alert(messages + " typeof:" + typeof messages)
    };


  }

  function clearLog() {
    logs.splice(0);
  }

  function disableLogging() {
    loggingEnabled.value = false;
  }

  return { loggingEnabled, logs, enableLogging, disableLogging, clearLog }
})

