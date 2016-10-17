/*!
Sunil Patel, Developer, POV Digital | github.com/povdocs/pov-mobile-storytelling
Copyright (C) 2016 POV | American Documentary Inc.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var app = {
  DEBUG:           false,
  snapFile:        'assets/snap.json',
  assetManager:    new AssetManager(),
  touchX:          null,
  touchY:          null,
  currentScroll:   0,
  currentSnap:     0,
  assets:          [],
  allAssets:       [],
  data:            [],
  snaps:           [],
  startedTF:       false,
  loadedTF:        false,
  title:           document.title,
  width:           $('main').width(),
  height:          $('main').height(),
  swipeThreshold:  6,
  cacheCover:      true,
  casheContent:    true,
  touchThreshold:  40,
  transitionSpeed: 600,
  introLogo:       "assets/media/pov-logo-web-transparent-bg-white-text.svg",
  introTitle:      "Mobile Story Telling",
  iosLessThen10:       "For better experience please view this on iOS 10.",
  iosChromeLessThen54: "For better experience please view this on Safari in iOS 10.",

  init: function () {
    app.assetManager.DEBUG = app.DEBUG;
    app.readFile(app.downloadAssets);

    if(window.device){
      var os = window.device.os.replace(/\s/g, "");
      $('body').addClass(os.toLowerCase());
      $('body').addClass(window.device.browser.toLowerCase());
      $('body').addClass(window.device.platform.toLowerCase());
    }

    if(("standalone" in window.navigator) && window.navigator.standalone){
      $('body').addClass('fullscreen');
    }

    app.snap.howTo();

    $('#how-to-close').on('click', function(){
      $('#how-to').animate({
        top: '-110%'
      }, app.transitionSpeed, function(){
        $(this).hide();
      });
    });
  },

  readFile: function(callback){
    $.getJSON(app.snapFile, function(data){
      app.data = data;
      for (var i = 0, d = null, l = data.length; i < l; i++) {
        d = data[i];
        if(d.cover && app.cacheCover){
          if(d.cover.image) app.addAssetManager('image', d.cover.image);
          if(d.cover.audio) app.addAssetManager('audio', d.cover.audio);
          if(d.cover.video) app.addAssetManager('video', d.cover.video);
        }
        if(d.content && app.casheContent){
          if(d.content.type=='video') app.addAssetManager('video', d.content.src);
        }
        if(i==l-1) callback();
      }
    });
  },

  addAssetManager: function (type, path) {
    var index = app.assets.indexOf(path);
    if(index<0){
      app.allAssets.push({'type': type, 'path': path});
      app.assets.push(path);
      return app.allAssets.length - 1;
    }
    return index;
  },

  downloadAssets: function (){

    app.assetManager.constructor(app.allAssets, function(){
      for (var i = 0, d = null, l = app.data.length; i < l; i++) {
        d = app.data[i];
        if(d.cover && app.cacheCover){
          if(d.cover.audio) d.cover.audio = app.assetManager.getAsset(d.cover.audio);
          if(d.cover.video) d.cover.video = app.assetManager.getAsset(d.cover.video);
        }
        if(d.content && app.casheContent){
          if(d.content.type=='video') d.content.src = app.assetManager.getAsset(d.content.src);
        }
      }
      app.start();
    });


    // update progress bar on screen
    var progressState = setInterval(function() {
      var progress = app.assetManager.progress();
      if (progress<100) {
        $('#progress-bar').css({'width': progress+'%'});
        document.title = progress+'% | '+app.title;
      }else{
        clearInterval(progressState);
        document.title = app.title;
      }
    }, 1000);
  },

  start: function () {
    if(!app.loadedTF){
      for (var i = 0, l = app.data.length; i < l; i++) {
        app.snap.create(i, app.data[i]);
        if(i==l-1) app.loadedTF = true;
      }
    }
    var time = setInterval(function(){
      if(app.loadedTF){
        $('#launcher').hide();
        app.eventListener();
        app.snap.init();
        app.snap.play(app.snap.getCurrent());
        clearInterval(time);
      }
    }, 1000);
  },

  eventListener: function () {

    $(document).on('touchmove', function(event){
      var snap = app.snap.getCurrent();
      if(!$(snap.content).hasClass('html')) event.preventDefault();
    });

    // start snap story
    $('#intro-play').on('click', function () {
      if(!app.startedTF){
        app.toggleFullScreen();
        app.startedTF = true;
        for (var i = 0, snap = null, l = app.snaps.length; i < l; i++) {
          snap = app.snaps[i];
          if(snap.video) app.preload(snap.video);
          if(snap.audio) app.preload(snap.audio);
          if(snap.contentVideo) app.preload(snap.contentVideo);
        }
      }
      app.snap.next();
    });

    $('video,audio').bind('abort', function(e){
      if(app.DEBUG) console.log(this.currentSrc, 'abort function fired');
      this.controls = true;
    }).bind('emptied', function(e){
      if(app.DEBUG) console.log(this.currentSrc, 'emptied function fired');
      this.controls = true;
    }).bind('error', function(e){
      if(app.DEBUG) console.log(this.currentSrc, 'error function fired');
      this.controls = true;
    }).bind('stalled', function(e){
      if(app.DEBUG) console.log(this.currentSrc, 'stalled function fired');
      this.controls = true;
    }).bind('ended', function(e){
      if(app.DEBUG) console.log(this.currentSrc, 'ended function fired');
      if(!this.loop) this.controls = true;
    }).bind('pause', function(e){
      if(app.DEBUG) console.log(this.currentSrc, 'pause function fired');
      this.volume      = 0;
    }).bind('play', function(e){
      if(app.DEBUG) console.log(this.currentSrc, 'play function fired');
      this.volume      = 1;
      if(this.tagName && this.tagName==="VIDEO" && $('body').hasClass('iphone') && $('body').hasClass('ios')){
        $(this).attr('style', 'height: '+$('main').height()+'px');
      }
    }).bind('playing', function(e){
      if(app.DEBUG) console.log(this.currentSrc, 'playing function fired');
      if($(this).parent().hasClass('snap-cover')) this.controls = false;
    });

    // navigate using keyboard
    $(document).on('keydown', function(event){
      // left key
      if(event.keyCode==37) app.snap.previous();
      // up key
      else if(event.keyCode==38) app.snap.cover.show(true);
      // right key
      else if(event.keyCode==39) app.snap.next();
      // down key
      else if(event.keyCode==40) app.snap.content.show();
    });
  },

  getScroll: function () {
    var scroll = app.currentScroll;
    var width  = $('main').width();
    scroll = (scroll<0) ? 0 : scroll;
    if((scroll % width) !== 0) scroll = scroll - (scroll % width);
    return scroll;
  },

  stopMedia: function (media) {
    if(!media) return false;
    media.pause();
    media.currentTime = 0;
  },

  playMedia: function (media) {
    if(!media) return false;
    media.play();
  },

  preload: function (media) {
    if(!media) return false;
    media.load();
    media.play();
    media.pause();
    media.currentTime = 0;
  },

  toggleFullScreen: function () {
    var docEl = document.documentElement;
    if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
           if(docEl.requestFullscreen)       { docEl.requestFullscreen(); }
      else if(docEl.msRequestFullscreen)     { docEl.msRequestFullscreen(); }
      else if(docEl.mozRequestFullScreen)    { docEl.mozRequestFullScreen(); }
      else if(docEl.webkitRequestFullscreen) { docEl.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT); }
      else{}
    } else {
           if (document.exitFullscreen)      { document.exitFullscreen(); }
      else if(document.msExitFullscreen)     { document.msExitFullscreen(); }
      else if(document.mozCancelFullScreen)  { document.mozCancelFullScreen(); }
      else if(document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
      else{}
    }
  },
};
