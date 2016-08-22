/**
 * Copyright (c) POV | American Documentary
 * Asset Manager code is heavily modified from orignal source to expend from just managing image to managing video and audio.
 *
 * html5rocks.com Copyright (c)
 * Except as otherwise [noted](http://code.google.com/policies.html#restrictions), the content of this page is licensed under the [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/), and code samples are licensed under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).
 * createCORSRequest is Copyright (c) html5rocks.com (http://www.html5rocks.com/en/tutorials/cors/)
 * Asset Manager is Copyright (c) html5rocks.com (http://www.html5rocks.com/en/tutorials/games/assetmanager/)
 */

/**
 * Using CORS
 * source: http://www.html5rocks.com/en/tutorials/cors/
 */
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);
  }
  else if (typeof XDomainRequest != "undefined") {
    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  }
  else {
    // Otherwise, CORS is not supported by the browser.
    xhr = null;
  }
  return xhr;
}


/**
 * Simple Asset Management for HTML5 Games
 * Source: http://www.html5rocks.com/en/tutorials/games/assetmanager/
 * This code is heavily modified from orignal source to expend from just managing image to managing video and audio.
 */
function AssetManager() {
  this.DEBUG = true;
  this.successCount = 0;
  this.errorCount = 0;
  this.cache = {};
  this.downloadQueue = [];
  this.inQueue = {};
}

AssetManager.prototype.queueDownload = function(path) {
  this.downloadQueue.push(path);
}

AssetManager.prototype.constructor = function(queue, downloadCallback) {
  if(typeof queue!=="undefined") this.downloadQueue = queue;
  if (this.downloadQueue.length === 0 && typeof downloadCallback!=="undefined") downloadCallback();
  var parentThis = this;
  for (var i = 0; i < this.downloadQueue.length; i++) {
    var obj = this.downloadQueue[i];
    // skip if the asset is already downloaded
    // if(this.getAsset(obj.path)!="undefined") continue;

    if(obj.type=='image'){
      this.downloadImage(obj.path, function(path, result){
        parentThis.cache[path] = result;
        if(parentThis.isDone()) downloadCallback();
      });
    }
    else if(obj.type=='audio'){
      this.downloadAudio(obj.path, function(path, result){
        parentThis.cache[path] = result;
        if(parentThis.isDone()) downloadCallback();
      });
    }
    else if(obj.type=='video'){
      this.downloadVideo(obj.path, function(path, result){
        parentThis.cache[path] = result;
        if(parentThis.isDone()) downloadCallback();
      });
    }
    else continue;
  }
}

AssetManager.prototype.downloadImage = function(path, downloadCallback){
  var image      = new Image();
  var parentThis = this;
  if(parentThis.DEBUG) console.log("IMAGE DOWNLOADING: ", path);

  image.addEventListener("progress", function (event) {
    parentThis.progressCount(path, event.loaded, event.total);
  });
  image.addEventListener("load", function() {
    parentThis.successCount += 1;
    if(parentThis.DEBUG) console.log("IMAGE DOWNLOADED: ", path);
    downloadCallback(path, image);
  }, false);
  image.addEventListener("error", function() {
    parentThis.errorCount += 1;
  }, false);
  image.src = path;
}

AssetManager.prototype.downloadAudio = function(path, downloadCallback){
  var audio      = new Audio();
  var parentThis = this;
  var xhr        = createCORSRequest('GET', path);
  
  if (!xhr) throw new Error('CORS not supported');
  if(parentThis.DEBUG) console.log("AUDIO DOWNLOADING: ", path);

  xhr.responseType = 'blob';

  xhr.addEventListener("progress", function (event) {
    parentThis.progressCount(path, event.loaded, event.total);
  });
  xhr.addEventListener("load", function() {
    if(parentThis.DEBUG) console.log("AUDIO DOWNLOADED: ", path);
    parentThis.successCount += 1;
    window.URL = window.URL || window.webkitURL;
    audio = window.URL.createObjectURL(this.response);
    downloadCallback(path, audio);
  }, false);
  xhr.addEventListener("error", function() {
    parentThis.errorCount += 1;
  }, false);
  xhr.send();
}

AssetManager.prototype.downloadVideo = function(path, downloadCallback){
  var video      = null;
  var parentThis = this;
  var xhr        = createCORSRequest('GET', path);
  if (!xhr) throw new Error('CORS not supported');
  if(parentThis.DEBUG) console.log("VIDEO DOWNLOADING: ", path);

	xhr.responseType = 'blob';

  xhr.addEventListener("progress", function (event) {
    parentThis.progressCount(path, event.loaded, event.total);
  });
	xhr.addEventListener("load", function() {
    if(parentThis.DEBUG) console.log("VIDEO DOWNLOADED: ", path);
    parentThis.successCount += 1;
    window.URL = window.URL || window.webkitURL;
		video = window.URL.createObjectURL(this.response);
    downloadCallback(path, video);
	}, false);
  xhr.addEventListener("error", function() {
    parentThis.errorCount += 1;
  }, false);
	xhr.send();
}

AssetManager.prototype.isDone = function() {
  return (this.progress()<100) ? false : true;
}

AssetManager.prototype.progress = function() {
  var progress = 0;
  var total    = 0;

  for (var key in this.inQueue){
    if(this.inQueue.hasOwnProperty(key)){
      progress += this.inQueue[key].progress;
      total    += this.inQueue[key].total;
    }
  }

  return Math.round((progress / total) * 100);
}

AssetManager.prototype.getAsset = function(path) {
  if(!this.cache.hasOwnProperty(path)) return path;
  else return this.cache[path];
}

AssetManager.prototype.updateProgress = function(path, oEvent) {
  if (oEvent.lengthComputable) {
    var percentComplete = oEvent.loaded / oEvent.total;
    if(parentThis.DEBUG) console.log(path, percentComplete);
  } else {
  }
}
AssetManager.prototype.progressCount = function(path, loaded, total){
  this.inQueue[path] = {progress: event.loaded, total: event.total};
}