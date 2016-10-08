app.snap = {

  init: function () {
    app.snap.cover.eventListeners();
    app.snap.content.eventListeners();
  },

  howTo: function(){
    var main = document.getElementById('main');
    var section = document.createElement('div');
    section.setAttribute('class', 'how-to');
    section.setAttribute('id', 'how-to');

    var close = document.createElement('div');
    close.setAttribute('id', 'how-to-close');
    close.setAttribute('class', 'how-to-close');


    var howTo = document.createElement('img');
    howTo.setAttribute('class', 'how-to-image');
    howTo.setAttribute('src', 'assets/media/mobile-storytelling-how-to.svg');
    howTo.setAttribute('alt', "Mobile Storytelling How To");
    howTo.setAttribute('width', "200");
    howTo.setAttribute('height', "auto");


    section.appendChild(close);

    if('ui' in window && window.ui){
      var message = document.createElement('div');
      message.setAttribute('class', 'how-to-message');
      if(window.ui.os.toLowerCase()=='ios'){
        if(parseInt(window.ui.osversion)<10){
          message.innerHTML = app.iosLessThen10;
          section.appendChild(message);
        }
        else if(window.ui.browser.toLowerCase()=='chrome' && parseInt(window.ui.version)<54){
          message.innerHTML = app.iosChromeLessThen54;
          section.appendChild(message);
        }
      }
    }

    section.appendChild(howTo);
    main.appendChild(section);
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
    section = document.createElement('section');
    section.setAttribute('class', (i===0) ? 'intro' : 'snap');
    section.setAttribute('id', 'snap'+i);

    if(i===0){

      if(snap.cover.image){
        section.setAttribute('style', "background-image: url('"+snap.cover.image+"')");
      }else{
        var povLogo = document.createElement('img');
        povLogo.setAttribute('src', 'assets/media/pov-logo-web-transparent-bg-white-text.svg');
        povLogo.setAttribute('alt', 'POV Logo');
        povLogo.setAttribute('width', '200');
        povLogo.setAttribute('height', 'auto');
        povLogo.setAttribute('class', 'intro-pov-logo');

        var title = document.createElement('h1');
        title.setAttribute('class', 'intro-title');
        title.innerHTML = "Mobile Story Telling";

        section.appendChild(povLogo);
        section.appendChild(title);
      }
      var playButton = document.createElement('button');
      playButton.setAttribute('type', 'button');
      playButton.setAttribute('id', 'intro-play');
      playButton.setAttribute('class', 'intro-play-btn');
      playButton.innerHTML = "Start";

      section.appendChild(playButton);
    }else{

      // cover
      var cover = document.createElement('div');
      cover.setAttribute('class', 'snap-cover');
      // add cover content
      if(snap.cover.video){
        var video = document.createElement('video');
        video.setAttribute('playsinline', true);
        video.setAttribute('webkit-playsinline', true);
        video.setAttribute('src', snap.cover.video);
        video.setAttribute('preload', 'metadata');
        video.setAttribute('loop', true);
        video.setAttribute('controls', false);
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
          audio.setAttribute('controls', false);
          audio.setAttribute('class', 'snap-cover-audio');
          cover.appendChild(audio);
          obj.audio = audio;
        }
      }
      section.appendChild(cover);
      obj.cover = cover;

      // content
      if(i>0 && snap.content.type!=='' && snap.content.src!==''){
        var content = document.createElement('article');
        content.setAttribute('class', 'snap-content '+snap.content.type);
        // add html content to snap
        if(snap.content.type=='html'){
          content.innerHTML = snap.content.src;
        }
        if(snap.content.type=='video'){
          var contentVideo = document.createElement('video');
          contentVideo.setAttribute('playsinline', true);
          contentVideo.setAttribute('webkit-playsinline', true);
          contentVideo.setAttribute('src', snap.content.src);
          contentVideo.setAttribute('preload', 'metadata');
          contentVideo.setAttribute('loop', false);
          contentVideo.setAttribute('controls', true);
          contentVideo.setAttribute('class', 'snap-content-video');
          content.appendChild(contentVideo);
          obj.contentVideo = contentVideo;
        }
        section.appendChild(content);
        if(snap.content.type){
          $(section).addClass('content-more');
          $(section).addClass(snap.content.type);
        }
        obj.content = content;
      }
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
      }, app.transitionSpeed, function(){
        var id = (scroll/width);
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
      }, app.transitionSpeed, function(){
        var id = (scroll/width);
        app.currentScroll = scroll;
        app.currentSnap   = id;
        app.snap.stop(app.snap.get(id+1));
        app.snap.play(app.snap.get(id));
      });
    }
  },

  play: function (snap) {
    if(!snap) return false;
    if(snap.video) app.playMedia(snap.video);
    else if(snap.audio) app.playMedia(snap.audio);
  },

  stop: function (snap) {
    if(!snap) return false;
    if(snap.video) app.stopMedia(snap.video);
    else if(snap.audio) app.stopMedia(snap.audio);
  },

  content: {
    show: function () {
      var snap = app.snap.getCurrent();
      if(!snap.content || $(snap.cover).hasClass('over')) return false;
      $(snap.cover).animate({
        top: '-110%'
      }, app.transitionSpeed, function(){
        $(this).addClass('over');
      });
      app.snap.stop(snap);
      if(snap.contentVideo) app.playMedia(snap.contentVideo);
    },

    stop: function (snap) {
      if(!snap) snap = app.snap.getCurrent();
      if(!snap.content) return false;
      // stop all the video and audio in the content
      $(snap.content).find('video,audio').each(function(){
        app.stopMedia(this);
      });
    },

    eventListeners: function () {
      $('.snap-content').on('touchstart', function(event){
        if(!app.startedTF) return;
        app.touchX = event.originalEvent.touches[0].clientX;
        app.touchY = event.originalEvent.touches[0].clientY;
        app.mainScroll = app.getScroll();
      })
      .on('touchmove', function(event){
        if(!app.touchX && !app.touchY) return;
        var x = app.touchX - event.originalEvent.touches[0].clientX;
        var y = app.touchY - event.originalEvent.touches[0].clientY;
        
        if(Math.abs(x) > Math.abs(y)){
          // scroll main as user moves from left to right
          $('main').scrollLeft(app.getScroll() + x);
        }else{
          var snap = app.snap.getCurrent();
          if(snap.content && $(snap.cover).hasClass('over') && y<0 && $(snap.content).scrollTop()===0){
            y = ((y + $('main').height())/$('main').height()) * 100;
            $(snap.cover).css({'top': (y * -1)+'%'});
          }
        }
      })
      .on('touchend', function(event){
        if(!app.touchX && !app.touchY) return;
        var x      = app.touchX - event.originalEvent.changedTouches[0].clientX;
        var y      = app.touchY - event.originalEvent.changedTouches[0].clientY;
        console.log(x, y, app.touchX, app.touchY, event.originalEvent.changedTouches[0].clientX, event.originalEvent.changedTouches[0].clientY);
        app.touchX = null;
        app.touchY = null;
        // reset the main scroll
        if(Math.abs(x)<app.touchThreshold){
          $('main').scrollLeft(app.mainScroll);
        }

        app.mainScroll = null;
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
      if(!$(snap.cover).hasClass('over')) return;
      if(!snap.content){
        $(snap.cover).removeAttr('style').removeClass('over');
      }else{
        // stop any media playing in the content
        app.snap.content.stop(snap);
        // reset content scroll to zero
        $(snap.content).stop().animate({
          scrollTop: 0
        }, app.transitionSpeed);
        // bring the cover down
        $(snap.cover).animate({
          top: '0%'
        }, app.transitionSpeed, function(){
          $(this).removeClass('over').removeAttr('style');
        });
      }
      console.log('show cover: ',play);
      if(play===true) app.snap.play(snap);
    },

    eventListeners: function () {
      $('.snap-cover').on('touchstart', function(event){
        if(!app.startedTF) return;
        app.touchX = event.originalEvent.touches[0].clientX;
        app.touchY = event.originalEvent.touches[0].clientY;
        app.mainScroll = app.getScroll();
      })
      .on('touchmove', function(event){
        if(!app.touchX || !app.touchY) return;
        var x = app.touchX - event.originalEvent.touches[0].clientX;
        var y = app.touchY - event.originalEvent.touches[0].clientY;
        
        if(Math.abs(x) > Math.abs(y)){
          // scroll main as user moves from left to right
          $('main').scrollLeft(app.getScroll() + x);
        }else{
          var snap = app.snap.getCurrent();
          if(snap.content && !$(snap.cover).hasClass('over') && y>0){
            y = (y/$('main').height()) * 100;
            $(snap.cover).css({'top': (y * -1)+'%'});
          }
        }
        event.preventDefault();
      })
      .on('touchend', function(event){
        if(!app.touchX && !app.touchY) return;
        var x      = app.touchX - event.originalEvent.changedTouches[0].clientX;
        var y      = app.touchY - event.originalEvent.changedTouches[0].clientY;
        console.log(x, y, app.touchX, app.touchY, event.originalEvent.changedTouches[0].clientX, event.originalEvent.changedTouches[0].clientY);
        app.touchX = null;
        app.touchY = null;
        //
        if(Math.abs(x)<app.touchThreshold){
          $('main').scrollLeft(app.mainScroll);
        }
        //
        if(Math.abs(y)<app.touchThreshold){
          var snap = app.snap.getCurrent();
          $(snap.cover).animate({
            top: '0%'
          }, app.transitionSpeed, function(){
            $(this).removeAttr('style').removeClass('over');
          });
        }
        app.mainScroll = null;
        app.snap.cover.swipe(x, y);
      });
    },

    swipe: function (x, y) {
      if(!x && !y) return;
      console.log(x, y);
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