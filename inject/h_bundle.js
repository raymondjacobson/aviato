(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global console: false, require: false */

window.stop();

var num_workers = 0;
var img_regx = new RegExp(/<img.*>/g);
var src_regx = new RegExp(/src=('.*(.jpg|.png)'|".*(.jpg|.png)")/g);
// this gets replaced with script via 'shell.js'
var workerScript = "<WORKER>";

$.get('', function(data) {
//  matches = regx.exec(String(data));
  data = String(data);
  var img_match = img_regx.exec(data);
  while((img_match != null)) {
    var check_reg = src_regx.exec(img_match[0]);
    if (check_reg) {
    num_workers++;
    // cut out src=
    // console.log(check_reg);
    var img_url = check_reg[0].slice(5, -1);
    
    // console.log(img_url);
    if (img_url.search("http") !== 0) {
      if (img_url.search("/") === 0) {
        console.log("/////");
        img_url = window.location.origin + img_url;
      }
      else {
        img_url = window.location.href + img_url;
      }
    }
    new_url = Asset(img_url);

// //    console.log("img_match:", img_match);
    console.log("img_url:", img_url);
    console.log("new_url:", new_url);
    }
    img_match = img_regx.exec(data);
  }
/*
  replaced = data.replace(regx, function (match, offset, string) {
    return "fucker" + String(match) + "fucker";
  });
*/

  document.write(data);
});


/*
// parse out the image tags and put them here
var images = ['url1.ipg'];

// for each of those image tags create Asset object which wraps a web worker
for(var i = 0; i < images.length; i++) {

    var asset = new Asset(images[i]);

}
*/

function Asset(url) {

    console.log('asset created');

    var blob        =   new Blob([workerScript], {type: 'text/plain'});
    // var worker      =   new Worker(URL.createObjectURL(blob));
    var worker = new Worker(chrome.extension.getURL("inject/w_bundle.js"));
    worker.postMessage({cmd:"start"});

    worker.onmessage = function(e) {
        console.log('worker message received');
        switch (e.data.cmd) {
            case 'response':
              console.log(e.data.url);
              if (e.data.url !== -1) {
                worker.postMessage({cmd: 'stop'});
                return e.data.url;
              }
              return url;
            break;
            case 'message':
              console.log(e.data.message);
            break;
            default:
              console.log('unknown message');
        };
    };

    // send worker the url
    worker.postMessage({cmd: 'image', url: url});
}

},{}]},{},[1]);