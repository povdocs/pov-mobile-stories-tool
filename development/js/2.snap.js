app.snap = {

  init: function () {
    app.snap.cover.eventListeners();
    app.snap.content.eventListeners();
  },

  create: function (i, snap) {
    var main = document.getElementById('main');
    var section = '';
    var obj = {
      video: null,
      audio: null,
      image: null,
      cover: null,
      content: null,
      contentVideo: null
    };
    if(i==0){
      section = document.createElement('section');
      section.setAttribute('class', 'intro');
    }else{
      section = document.createElement('section');
      section.setAttribute('class', 'snap');
    }
    section.setAttribute('id', 'snap'+i);

    // cover
    var cover = document.createElement('div');
    cover.setAttribute('class', 'snap-cover');
    // add cover content
    if(snap.cover.video){
      var video = document.createElement('video');
      video.setAttribute('webkit-playsinline', true);
      video.setAttribute('src', snap.cover.video);
      video.setAttribute('preload', 'metadata');
      video.setAttribute('loop', true);
      video.setAttribute('muted', true);
      video.setAttribute('controls', true);
      video.setAttribute('class', 'snap-cover-video');
      cover.appendChild(video);
      obj.video = video;
    }else{
      if(snap.cover.image){
        var image = document.createElement('img');
        image.setAttribute('src', snap.cover.image);
        image.setAttribute('alt', '');
        image.setAttribute('width', '100%');
        image.setAttribute('height', '');
        image.setAttribute('class', 'snap-cover-image');
        cover.appendChild(image);
        obj.image = image;
      }
      if(snap.cover.audio){
        var audio = document.createElement('audio');
        audio.setAttribute('src', snap.cover.audio);
        audio.setAttribute('preload', 'metadata');
        audio.setAttribute('loop', true);
        audio.setAttribute('muted', true);
        audio.setAttribute('controls', false);
        audio.setAttribute('class', 'snap-cover-audio');
        cover.appendChild(audio);
        obj.audio = audio;
      }
    }
    section.appendChild(cover);
    obj.cover = cover;

    // content
    if(i>0){
      var content = document.createElement('div');
      content.setAttribute('class', 'snap-content '+snap.content.type);
      // add html content to snap
      if(snap.content.type=='html'){
        content.innerHTML = snap.content.src;
      }
      if(snap.content.type=='video'){
        var video = document.createElement('video');
        video.setAttribute('webkit-playsinline', true);
        video.setAttribute('src', snap.content.src);
        video.setAttribute('preload', 'metadata');
        video.setAttribute('loop', false);
        video.setAttribute('muted', false);
        video.setAttribute('controls', true);
        video.setAttribute('class', 'snap-content-video');
        content.appendChild(video);
        obj.contentVideo = video;
      }
      section.appendChild(content);
      obj.content = content;
    }
    main.appendChild(section);
    app.snaps.push(obj);
  },

  getCurrent: function () {
    if(app.currentSnap<0) app.currentSnap = 0;
    return app.snap.get(app.currentSnap);
  },

  get: function (id) {
    // change the index and return the snap object
    if(id<0 || id>app.snaps.length) return null;
    return app.snaps[id];
  },

  next: function () {
    var width   = app.width;
    var section = $('section.snap').length;
    var scroll  = app.getScroll() + width;
    app.snap.cover.show(false);
    if(scroll<=(width*section)){
      $('main').stop().animate({
        scrollLeft: scroll
      }, 500, function(){
        var id = scroll/width;
        app.currentScroll = scroll;
        app.currentSnap   = id;
        app.snap.stop(app.snap.get(id-1));
        app.snap.play(app.snap.get(id));
      });
    }
  },

  previous: function () {
    var width  = app.width;
    var scroll = app.getScroll() - width;
    app.snap.cover.show(false);
    if(scroll>=0){
      $('main').stop().animate({
        scrollLeft: scroll
      }, 500, function(){
        var id = scroll/width;
        app.currentScroll = scroll;
        app.currentSnap   = id;
        app.snap.stop(app.snap.get(id+1));
        app.snap.play(app.snap.get(id));
      });
    }
  },

  play: function (snap) {
    if(!snap) return false;
    if(snap.video) app.playMedia(snap.video, true);
    else if(snap.audio) app.playMedia(snap.audio, true);
  },

  stop: function (snap) {
    if(!snap) return false;
    if(snap.video) app.stopMedia(snap.video);
    else if(snap.audio) app.stopMedia(snap.audio);
  },

  content: {
    show: function () {
      var snap = app.snap.getCurrent();
      if(!snap.content) return false;
      $(snap.cover).addClass('over');
      app.snap.stop(snap);
      if(snap.contentVideo){
        snap.contentVideo.volume = 1;
        snap.contentVideo.muted = false;
        snap.contentVideo.play();
      }
    },
    stop: function (snap) {
      if(!snap) snap = app.snap.getCurrent();
      if(!snap.content) return false;
      // stop all the video and audio in the content
      $(snap.content).find('video,audio').each(function(){
        var media = $(this);
        media.animate({volume: 0}, 500, function(){
          media.get(0).pause();
          media.get(0).currentTime = 0;
        });
      });
    },

    eventListeners: function () {
      // $('.snap-content').on('scroll', function(event){
      //   if($(this).scrollTop()<1){
      //     app.snap.cover.show();
      //   }
      // });
      $('.snap-content').on('mousedown', function(event){
        if(!app.started) return;
        app.touchX = event.clientX;
        app.touchY = event.clientY;
      })
      .on('mousemove', function(event){
        if(!app.touchX || !app.touchY) return;
        var x      = app.touchX - event.clientX;
        var y      = app.touchY - event.clientY;
        app.touchX = null;
        app.touchY = null;
        app.snap.content.swipe(x, y, $(this).scrollTop());
      })
      .on('touchstart', function(event){
        if(!app.started) return;
        app.touchX = event.originalEvent.touches[0].clientX;
        app.touchY = event.originalEvent.touches[0].clientY;
      })
      .on('touchmove', function(event){
        if(!app.touchX || !app.touchY) return;
        var x      = app.touchX - event.originalEvent.touches[0].clientX;
        var y      = app.touchY - event.originalEvent.touches[0].clientY;
        app.touchX = null;
        app.touchY = null;
        app.snap.content.swipe(x, y, $(this).scrollTop());
      });
    },

    swipe: function (x, y, top) {
      if(!x || !y) return;
      if(Math.abs(x) > Math.abs(y)){
        if(x < 0){
          // left swipe
          if(x < -Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('content swipe left');
            app.snap.previous();
          }
        }else{
          // right swipe
          if(x > Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('content swipe right');
            app.snap.next();
          }
        }
      }else{
        if(y < 0){
          // up swipe
          if(y < -Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('content swipe up');
            if(top<2) app.snap.cover.show(true);
          }
        }else{
          // down swipe
          if(y > Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('content swipe down');
          }
        }
      }
    }
  },




  // Cover Snap Functions
  cover: {
    show: function (play) {
      var snap = app.snap.getCurrent();
      if(!snap.content){
        $(snap.cover).removeClass('over');
        if(play===true) app.snap.play(snap);
      }else{
        app.snap.content.stop(snap);
        $(snap.content).stop().animate({
          scrollTop: 0
        }, 500, function(){
          $(snap.cover).removeClass('over');
          if(play===true) app.snap.play(snap);
        });
      }
    },

    eventListeners: function () {
      $('.snap-cover').on('mousedown', function(event){
        if(!app.started) return;
        app.touchX = event.clientX;
        app.touchY = event.clientY;
      })
      .on('mousemove', function(event){
        if(!app.touchX || !app.touchY) return;
        var x      = app.touchX - event.clientX;
        var y      = app.touchY - event.clientY;
        app.touchX = null;
        app.touchY = null;
        app.snap.cover.swipe(x, y);
      })
      .on('touchstart', function(event){
        if(!app.started) return;
        app.touchX = event.originalEvent.touches[0].clientX;
        app.touchY = event.originalEvent.touches[0].clientY;
      })
      .on('touchmove', function(event){
        if(!app.touchX || !app.touchY) return;
        var x      = app.touchX - event.originalEvent.touches[0].clientX;
        var y      = app.touchY - event.originalEvent.touches[0].clientY;
        app.touchX = null;
        app.touchY = null;
        app.snap.cover.swipe(x, y);
      });
    },

    swipe: function (x, y) {
      if(!x || !y) return;
      if(Math.abs(x) > Math.abs(y)){
        if(x < 0){
          // left swipe
          if(x < -Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('swipe left');
            app.snap.previous();
          }
        }else{
          // right swipe
          if(x > Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('swipe right');
            app.snap.next();
          }
        }
      }else{
        if(y < 0){
          // up swipe
          if(y < -Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('swipe up');
          }
        }else{
          // down swipe
          if(y > Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('swipe down');
            app.snap.content.show();
          }
        }
      }
    }
  }
};