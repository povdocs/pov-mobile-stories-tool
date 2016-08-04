var assetManager = new AssetManager();

var app = {
  DEBUG: true,
  snapFile: 'assets/snap.json',
  touchX: null,
  touchY: null,
  video: null,
  audio: null,
  canvas: null,
  assets: [],
  allAssets: [],
  snaps: [],
  appReady: false,
  init: function () {
    app.readFile();
    app.start();
    // app.eventListener();
  },

  start: function () {
    setTimeout(function(){
      app.eventListener();
      app.downloadAssets();
    }, 1000);
  },

  eventListener: function () {
    $('#startStory').on('click', function () {
      for (var i = 0, l = app.snaps.length; i < l; i++) {
        var snap = app.snaps[i];
        if(snap.video.length){
          app.playObj(snap.video);
          app.stopObj(snap.video);
        }
        if(snap.audio.length){
          app.playObj(snap.audio);
          app.stopObj(snap.audio);
        }
      }
      app.nextSnap();
    });

    $('section').on('mousedown', function(event){
      if(!$(this).hasClass('snap')) return;
      app.touchX = event.clientX;
      app.touchY = event.clientY;
    })
    .on('mousemove', function(event){
      if(!app.touchX || !app.touchY) return;
      var diffX = app.touchX - event.clientX;
      var diffY = app.touchY - event.clientY;
      app.swipe(diffX, diffY);
      app.touchX = null;
      app.touchY = null;
    })
    .on('touchstart', function(event){
      if(!$(this).hasClass('snap')) return;
      app.touchX = event.originalEvent.touches[0].clientX;
      app.touchY = event.originalEvent.touches[0].clientY;
    })
    .on('touchmove', function(event){
      if(!app.touchX || !app.touchY) return;
      var diffX = app.touchX - event.originalEvent.touches[0].clientX;
      var diffY = app.touchY - event.originalEvent.touches[0].clientY;
      app.swipe(diffX, diffY);
      app.touchX = null;
      app.touchY = null;
    });

    $(document).on('keydown', function(event){
      // if(!$(this).hasClass('snap')) return;
      // left key
      if(event.keyCode==37){
        app.previousSnap();
      }
      // up key
      else if(event.keyCode==38){
        app.backToCover();
      }
      // right key
      else if(event.keyCode==39){
        app.nextSnap();
      }
      // down key
      else if(event.keyCode==40){
        app.snapContent();
      }
    });
  },

  readFile: function(){
    $.getJSON(app.snapFile, function(snaps){
      for (var i = 1, l = snaps.length; i <= l; i++) {
        app.createSnap(i, snaps[i-1]);
        app.indexSnap(i);
      }
    });
  },

  createSnap: function (i, snap) {
    var section = $('<section id="snap'+i+'" class="snap"></section>');
    var cover = $('<div class="snap-cover"></div>');
    var content = $('<div class="snap-content"></div>');
    // add cover content
    if(snap.cover.image){
      cover.append('<img class="snap-cover-image" data-asset-id="'+app.addAssetManager('image', snap.cover.image)+'" src="" alt="" width="100%" height="">');
    }
    if(snap.cover.video){
      cover.append('<video class="snap-cover-video" data-asset-id="'+app.addAssetManager('video', snap.cover.video)+'" loop muted><source src="" type="video/mp4"></video>');
    }
    if(snap.cover.audio){
      cover.append('<audio class="snap-cover-audio" loop muted><source src="'+snap.cover.audio+'" type="audio/mp3"></audio>');
      // app.allAssets.push({'type': 'audio', 'path': snap.cover.audio});
    }
    // add html content to snap
    if(snap.content.type=='html'){
      content.html(snap.content.src);
    }
    cover.appendTo(section);
    content.appendTo(section);
    section.appendTo('main');
  },

  indexSnap: function (i) {
    var snap = {
      video: $('#snap'+i+' .snap-cover video'),
      audio: $('#snap'+i+' .snap-cover audio'),
      cover: $('#snap'+i+' .snap-cover'),
      content: $('#snap'+i+' .snap-content')
    };
    app.snaps.push(snap);
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
        $('.progress-bar').css({'width': progress+'%'});
      }else{
        clearInterval(progressState);
      }
    }, 100);

    /**
     * using the assetManager libery to download all.
     * After all the assets are downloaded add there source in the DOM to there elements
     * @param array            app.allAssets give list of assets to download
     * @param callbackFunction                update downloaded assets source in DOM
     */
    assetManager.constructor(app.allAssets, function(){
      /**
       * loop through app.allAssets
       * add all the src back to right dom object by finding data-asset-id=[app.allAssets i]
       */
      for (var i = 0; i < app.allAssets.length; i++) {
        var asset = app.allAssets[i];
        var src   = assetManager.getAsset(asset.path);
        if(asset.type=='audio' || asset.type=='video'){
          $('[data-asset-id="'+i+'"]').each(function(){
            $(this).get(0).src = src;
            $(this).children().get(0).src = src;
          });
        }
        else if(asset.type=='image'){
          $('[data-asset-id="'+i+'"]').src = asset.path;
        }
        else continue;
        //  if(DEBUG) console.info(i, asset.path, 'downloaded');
      }
      app.appReady = true;
      $('#startStory').show();
      $('#loading').hide();
    });
  },

  swipe: function(x, y){
    if(!x || !y) return;
    if(Math.abs(x) > Math.abs(y)){
      if(x < 0){
        // left swipe
        console.log('swipe left');
        app.previousSnap();
      }else{
        // right swipe
        console.log('swipe right');
        app.nextSnap();
      }
    }else{
      if(y < 0){
        // up swipe
        console.log('swipe up');
      }else{
        // down swipe
        console.log('swipe down');
      }
    }
  },

  getScroll: function () {
    var scroll = $('main').attr('data-scroll');
    scroll = (scroll) ? parseInt(scroll) : 0;
    if(scroll % $('main').width() !== 0) scroll = scroll - (scroll % $('main').width());
    return scroll;
  },

  getCurrentSnap: function () {
    var id   = parseInt($('main').attr('data-snap'));
    if(id<1) return null;
    return app.getSnap(id);
  },

  getSnap: function (id) {
    // change the index and return the snap object
    return app.snaps[id-1];
  },


  nextSnap: function () {
    var width = $('section').width();
    var section = $('section.snap').length;
    var scroll = app.getScroll() + width;
    if(scroll<=(width*section)){
      $('main').stop().animate({
        scrollLeft: scroll
      }, 500, function(){
        var id = scroll/width;
        $('main').attr({'data-scroll': scroll, 'data-snap': id});
        app.stopSnap(app.getSnap(id-1));
        app.playSnap(app.getSnap(id));
      });
    }
  },

  previousSnap: function () {
    var width = $('section').width();
    var scroll = app.getScroll() - width;
    if(scroll>=0){
      $('main').stop().animate({
        scrollLeft: scroll
      }, 500, function(){
        var id = scroll/width;
        $('main').attr({'data-scroll': scroll, 'data-snap': id});
        app.stopSnap(app.getSnap(id+1));
        app.playSnap(app.getSnap(id));
      });
    }
  },

  snapContent: function () {
    var snap = app.getCurrentSnap();
    snap.cover.addClass('over');
  },

  backToCover: function () {
    var snap = app.getCurrentSnap();
    snap.content.stop().animate({
      scrollTop: 0
    }, 1000, function(){
      snap.cover.removeClass('over');
    });
  },

  stopSnap: function (snap) {
    if(!snap) return false;
    if(snap.video.length) app.stopObj(snap.video);
    if(snap.audio.length) app.stopObj(snap.audio);
  },

  playSnap: function (snap) {
    if(!snap) return false;
    if(snap.video.length) app.playObj(snap.video);
    if(snap.audio.length) app.playObj(snap.audio);
  },

  stopObj: function (obj) {
    if(!obj) return false;
    obj.animate({volume: 0}, 500, function(){
      obj.get(0).pause();
      obj.currentTime = 0;
      obj.get(0).volume = 1;
      obj.prop('muted', true);
    });
  },

  playObj: function (obj) {
    if(!obj) return false;
    obj.prop('muted', false);
    obj.currentTime = 0;
    obj.get(0).play();
  },
};