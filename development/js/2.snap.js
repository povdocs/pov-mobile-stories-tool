app.snap = {
  init: function () {
    app.snap.cover.eventListeners();
    app.snap.content.eventListeners();
  },

  create: function (i, snap) {
    var section = '';
    if(i==0){
      section = $('<section id="snap'+i+'" class="intro"></section>');
    }else{
      section = $('<section id="snap'+i+'" class="snap"></section>');
    }

    // cover
    var cover = $('<div class="snap-cover"></div>');
    // add cover content
    if(snap.cover.video){
      cover.append('<video class="snap-cover-video" data-asset-id="'+app.addAssetManager('video', snap.cover.video)+'" loop muted><source src="" type="video/mp4"></video>');
    }else{
      if(snap.cover.image){
        cover.append('<img class="snap-cover-image" data-asset-id="'+app.addAssetManager('image', snap.cover.image)+'" src="" alt="" width="100%" height="">');
      }
      if(snap.cover.audio){
        cover.append('<audio class="snap-cover-audio" loop muted><source src="'+snap.cover.audio+'" type="audio/mp3"></audio>');
      }
    }
    cover.appendTo(section);

    // content
    if(i>0){
      var content = $('<div class="snap-content"></div>');
      // add html content to snap
      if(snap.content.type=='html'){
        content.html(snap.content.src);
      }
      if(snap.content.type=='video'){
        content.append('<video class="snap-content-video" data-asset-id="'+app.addAssetManager('video', snap.content.src)+'" controls><source src="" type="video/mp4"></video>');;
      }
      content.addClass(snap.content.type);
      content.appendTo(section);
    }
    section.appendTo('main');
  },

  index: function (i) {
    var snap = {
      video: $('#snap'+i+' .snap-cover video'),
      audio: $('#snap'+i+' .snap-cover audio'),
      cover: $('#snap'+i+' .snap-cover'),
      content: $('#snap'+i+' .snap-content')
    };
    app.snaps.push(snap);
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
    if(snap.video.length) app.playMedia(snap.video, true);
    if(snap.audio.length) app.playMedia(snap.audio, true);
  },

  stop: function (snap) {
    if(!snap) return false;
    if(snap.video.length) app.stopMedia(snap.video);
    if(snap.audio.length) app.stopMedia(snap.audio);
  },

  content: {
    show: function () {
      var snap = app.snap.getCurrent();
      if(!snap.content.html()) return false;
      snap.cover.addClass('over');
      app.snap.stop(snap);
      if(snap.content.find('.snap-content-video').length){
        snap.content.find('.snap-content-video').each(function(){
          $(this).get(0).volume = 1;
          $(this).prop('muted', false);
          $(this).get(0).play();
        });
      }
    },
    stop: function (snap) {
      if(!snap) snap = app.snap.getCurrent();
      if(!snap.content.html()) return false;
      // stop all the video and audio in the content
      snap.content.find('video,audio').each(function(){
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
        // if(!$(this).hasClass('snap')) return;
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
        // if(!$(this).hasClass('snap')) return;
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
          if(app.DEBUG) console.log('content swipe left');
          app.snap.previous();
        }else{
          // right swipe
          if(app.DEBUG) console.log('content swipe right');
          app.snap.next();
        }
      }else{
        if(y < 0){
          // up swipe
          if(app.DEBUG) console.log('content swipe up');
          if(top<2) app.snap.cover.show(true);
        }else{
          // down swipe
          if(app.DEBUG) console.log('content swipe down');
        }
      }
    }
  },




  // Cover Snap Functions
  cover: {
    show: function (play) {
      var snap = app.snap.getCurrent();
      if(!snap.content.html() && snap.cover.hasClass('over')){
        snap.cover.removeClass('over');
        if(play===true) app.snap.play(snap);
      }else{
        app.snap.content.stop(snap);
        snap.content.stop().animate({
          scrollTop: 0
        }, 500, function(){
          snap.cover.removeClass('over');
          if(play===true) app.snap.play(snap);
        });
      }
    },

    eventListeners: function () {
      $('.snap-cover').on('mousedown', function(event){
        // if(!$(this).hasClass('snap')) return;
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
        // if(!$(this).hasClass('snap')) return;
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
          if(app.DEBUG) console.log('swipe left');
          app.snap.previous();
        }else{
          // right swipe
          if(app.DEBUG) console.log('swipe right');
          app.snap.next();
        }
      }else{
        if(y < 0){
          // up swipe
          if(app.DEBUG) console.log('swipe up');
        }else{
          // down swipe
          if(app.DEBUG) console.log('swipe down');
          app.snap.content.show();
        }
      }
    }
  }
};