var assetManager = new AssetManager();

var app = {
  DEBUG:         true,
  snapFile:      'assets/snap.json',
  touchX:        null,
  touchY:        null,
  video:         null,
  audio:         null,
  currentScroll: 0,
  currentSnap:   0,
  assets:        [],
  allAssets:     [],
  snaps:         [],
  started:       false,
  title:         document.title,
  width:         $('main').width(),

  init: function () {
    app.readFile();
    app.start();
  },

  start: function () {
    setTimeout(function(){
      app.eventListener();
      app.downloadAssets();
      app.snap.init();
    }, 1000);
  },

  readFile: function(){
    $.getJSON(app.snapFile, function(snaps){
      for (var i = 0, l = snaps.length; i < l; i++) {
        app.snap.create(i, snaps[i]);
        app.snap.index(i);
      }
    });
  },

  eventListener: function () {
    // start snap story
    $('#snap0,.intro').on('click', function () {
      if(app.DEBUG) console.log('intro click.');
      if(!app.started){
        app.toggleFullScreen();
        app.started = true;
        for (var i = 0, l = app.snaps.length; i < l; i++) {
          var snap = app.snaps[i];
          if(snap.video.length){
            app.playMedia(snap.video, false);
            setTimeout(function(){app.stopMedia(snap.video);}, 5000);
          }
          if(snap.audio.length){
            app.playMedia(snap.audio, false);
            setTimeout(function(){app.stopMedia(snap.audio);}, 5000);
          }
        }
      }
      app.snap.next();
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
    }).on('touchstart', function(event){
      // event.preventDefault();
    }).on('touchmove', function(event){
      // event.preventDefault();
    }).on('touchend', function(event){
      // event.preventDefault();
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

    // update progress bar on screen
    var progressState = setInterval(function() {
      var progress = assetManager.progress();
      if (progress<100) {
        $('#progress-bar').css({'width': progress+'%'});
        document.title = progress+'% | '+app.title;
      }else{
        clearInterval(progressState);
        document.title = app.title;
      }
    }, 500);

    assetManager.constructor(app.allAssets, function(){
      for (var i = 0; i < app.allAssets.length; i++) {
        var asset = app.allAssets[i];
        var src   = assetManager.getAsset(asset.path);
        if(asset.type=='audio' || asset.type=='video'){
          $('[data-asset-id="'+i+'"]').each(function(){
            $(this).get(0).src = src;
            $(this).children().get(0).src = src;
            // $(this).get(0).src = asset.path;
            // $(this).children().get(0).src = asset.path;
          });
        }
        else if(asset.type=='image'){
          $('[data-asset-id="'+i+'"]').attr('src', asset.path);
        }
        else continue;
        //  if(DEBUG) console.info(i, asset.path, 'downloaded');
      }
      $('#launcher').hide();
      app.snap.play(app.snap.getCurrent());
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
    // console.log(media);
    media.animate({volume: 0}, 500, function(){
      media.get(0).pause();
      media.get(0).currentTime = 0;
      media.get(0).volume = 0;
      media.prop('muted', true);
    });
  },

  playMedia: function (media, sound) {
    if(!media) return false;
    media.prop('muted', ((sound===false) ? true : false));
    media.get(0).currentTime = 0;
    media.get(0).volume = 1;
    media.get(0).play();
  },

  toggleFullScreen: function () {
    var docEl = document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
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