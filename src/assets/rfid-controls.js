'use strict';

//const applicationName = "vue-rfid-konv";
var baseUrl = 'http://localhost:4001/';
var keepOpen = false;

function setRestBaseUrl(url) {
  baseUrl = url;
}

function getReaders() {
  return doRequest(baseUrl + 'info/');
}

/*function getISO28560Items(id) {
  return doRequest(baseUrl + 'reader/' + id + '/isoitems');
}*/

/*function writeISO28560tag(id,ISO28560tag){
  return doRequest(baseUrl + 'reader/' + id + '/rawRequest',ISO28560tag);
}*/

function getTag(id, uid) {
  return doRequest(baseUrl + 'tag/' + id + '/' + uid);
}

function writeTag(id, tag) {
  return doRequest(baseUrl + 'tag/' + id, tag, 'POST');
}

function deleteTag(id, tag) {
  return doRequest(baseUrl + 'tag/' + id, tag, 'DELETE');
}

function getAFI(id,uid){
  return doRequest(baseUrl + 'afi/' + id + '/' + uid);
}


function setAFI(id, uidOrTag, afi = null){
  if (typeof uidOrTag === "string"){
    // uid is given, assume afi is given too
    return doRequest(baseUrl + 'afi/' + id + '/' + uidOrTag + '/' + afi, null , "PUT");
  } else {
    // 2nd param is tag object
    return doRequest(baseUrl + 'afi/' + id , uidOrTag, "PUT");
  }
  
}


function inventory(id) {
  return doRequest(baseUrl + 'inventory/' + id );
}

function rfOff(id) {
  return doRequest(baseUrl + 'rfOff/' + id, null, "PUT");
}

function getTags(id) {
  return doRequest(baseUrl + 'tags/' + id);
}

function setKeepOpen(val){
  keepOpen = val
  return Promise.resolve(`setKeepOpen=${val}`);
}

function raw(request) {
  return doRequest(baseUrl + 'reader/rawRequest', request, "POST");
}

function changeSetting(id, setting) {
  return doRequest(baseUrl + 'reader/' + id + '/', setting, "PATCH");
}
/*function getItems(id,ws = false){
  if (ws)
    return _wsRequest({'readerId' : id, 'request' : 'getItems'})
  else
    return doRequest(baseUrl + 'reader/'+id+'/items');
}



function inventory(id,ws = false){
  if (ws)
    return _wsRequest({'readerId' : id, 'request' : 'inventory'})
  else
    return doRequest(baseUrl + 'reader/'+id+'/inventory');
}*/

/**
 * reads a limited number of data blocks, ignoring system info of tag
 * @param {*} id 
 */
/*function getFastItems(id,ws = false){
  if (ws)
    return _wsRequest({'readerId' : id, 'request' : 'getFastItems'})
  else
    return doRequest(baseUrl + 'reader/'+id+'/fastitems');
}

/**
 * resetting reader by id
 * @param {*} id 
 */
function resetReader(id) {
  return doRequest(baseUrl + 'reader/' + id + '/reset');
}

/**
 * switch on/off rf
 */
/*function rf(){
  return null;
}*/

/*function getAfi(id,uid,ws = false){
  if (ws)
    return _wsRequest({'readerId' : id, 'request' : 'getISO28560Items'})
  else
    return doRequest(baseUrl + 'reader/'+id+'/afi/' + uid);
}*/

async function doRequest(url = '', data = null, method = 'GET') {
  // Default options are marked with *
  //const response = await fetch(url)/*

  const params = { method: method, 'credentials': 'include' };

  url +=  keepOpen ? '?keepOpen=true':'';

  if (data) {
    params.headers = {
      'Content-Type': 'application/json'
    };
    params.body = JSON.stringify(data)
  }

  /*{
    method: method, // *GET, POST, PUT, DELETE, etc.
    //mode: 'cors', // no-cors, *cors, same-origin
    //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    //headers: {
      //'Content-Type': 'application/json'
      //'Content-Type': 'application/x-www-form-urlencoded',
    //},
    //redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //body: data === null ? data : JSON.stringify(data) // body data type must match "Content-Type" header
  }*/

  console.log(">>>", url, JSON.stringify(params))

  const response = await fetch(url, params);

  console.log("<<<", response);

  if (!response.ok) {
    //throw(new Error('Network response was not ok: ' + response.status + " " + response.statusText))
    let error = await response.json();
    return Promise.reject(error);
    //return Promise.reject(new Error('Network response was not ok: ' + response.status + " " + response.statusText));
    //return Promise.reject(new Error({ statusText:response.statusText,status:response.status }))
  }
  try {
    return response.json();
  } catch (error) {
    return error
  }
  

}




export default {
  getReaders,
  //getISO28560Items,
  writeTag,
  deleteTag,
  raw,
  inventory,
  changeSetting,
  resetReader,
  setRestBaseUrl,
  rfOff,
  getTags,
  getTag,
  setKeepOpen,
  getAFI,
  setAFI,
  /*getItems,
  getISO28560Items,
  inventory,
  rf,
  getAfi,
  getFastItems,
  resetReader,
  init,
  raw*/
}