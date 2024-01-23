async function doHttpRequest(url = '', data = null, method = 'GET') {
  // Default options are marked with *
  //const response = await fetch(url)/*

  const params = { method: method, 'credentials': 'include' };
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
    
    return Promise.reject(new Error('Network response was not ok: ' + response.status + " " + response.statusText));
  }

  return response.json();

}

export default { doHttpRequest }