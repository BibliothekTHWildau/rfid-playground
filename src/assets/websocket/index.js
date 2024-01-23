var websocket;
var wsPromiseResolve = null;
var wsPromiseReject = null;
var wsUrl;
var onTag;
var onGetTagsDone;

async function initWebsocket(u, onTagCB, onGetTagsCB) {

  return new Promise(function (resolve, reject) {

    wsUrl = u;
    onTag = onTagCB;
    onGetTagsDone = onGetTagsCB;
    console.log("initWebsocket: " + wsUrl)
    
    websocket = new WebSocket(wsUrl);
    websocket.onopen = websocketOnOpen;
    websocket.onerror = onError;
    websocket.onmessage = websocketOnMessage;
    websocket.onclose = onError;

    wsPromiseResolve = resolve;
    wsPromiseReject = reject;
  });
}

function onError(err) {
  if (!err.wasClean)
    console.log('WebSocket Error ', err);
  
  if (wsPromiseReject) 
    wsPromiseReject(err);
}

function websocketOnOpen() {

  console.log("Websocket opened to " + wsUrl);
  wsPromiseResolve();

}

function websocketOnMessage(e) {
  console.log("<<<", e);
  let response = null;
  try {
    response = JSON.parse(e.data);
  } catch (error) {
    // todo throw error

    return false;
  }

  //{"request":"getTags","keepOpen":true,"readData":true,"iso":false,"idle":false,"blocksToRead":3,"readSystemInfo":false,"wsRequestComplete":true,"readerId":"pi2","runningSince":42}

  switch (response.request) {

    case "getTags": {
      // websocket sends tags when discovered and bundles them in a complete (wsRequestComplete) response afterwards
      if (response.wsRequestComplete) {
        if (response.error) {
          onGetTagsDone(response.error);
          //return wsPromiseReject(response);
        } else if (Object.hasOwn(response, 'idle') && !response.idle) {// if( response.hasOwnProperty('idle') && !response.idle ) {
          onGetTagsDone({ error: true, errorMsg: "runningSince " + response.runningSince });
        } else {
          onGetTagsDone(null, response.tags || []);
        }

        //return wsPromiseResolve(response);
      }

      if (response.tag) {
        onTag(response.tag);
        //processTag(response.tag);
      }


    } break;

  }

}

function closeWebsocket() {
  console.log("closing websocket");
  try {
    websocket.close();
  } catch (err) {
    console.log("Error closing websocket: " + JSON.stringify(err))
  }
}

async function rfOff(readerId) {
  return new Promise((resolve, reject) => {
    let request = {
      request: "rfOff",
      readerId: readerId
    };
    try {
      wsPromiseResolve = resolve;
      wsPromiseReject = reject;
      send(request);

    } catch (ex) {
      return reject(ex);
    }

  });
}

function send(request) {
  try {
    console.log("websocket >>>", JSON.stringify(request))
    websocket.send(JSON.stringify(request));
  } catch (err){
    console.log("Error in websocket.send: " + JSON.stringify(err))
  } 
}


async function getTags(readerId,fast = true) {

  return new Promise((resolve, reject) => {
    let request = {
      request: "getTags",
      readerId: readerId,
      keepOpen: true,
      readSystemInfo: true,
      readData: true,
      blocksToRead: 0,
      iso: false
    };
    if (fast){
      request.readSystemInfo = false;
      request.readData = true;
      request.blocksToRead = 3;
    }
    try {
      wsPromiseResolve = resolve;
      wsPromiseReject = reject;
      send(request);

    } catch (ex) {
      return reject(ex);
    }

  });
}

export default {
  initWebsocket,
  closeWebsocket,
  getTags,
  rfOff
}