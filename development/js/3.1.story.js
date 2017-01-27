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
app.story = {

  init: function () {
    app.story.cover.eventListeners();
    app.story.content.eventListeners();
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

    if('device' in window && window.device){
      var message = document.createElement('div');
      message.setAttribute('class', 'how-to-message');
      if(window.device.os.toLowerCase()=='ios'){
        if(parseInt(window.device.osversion)<10){
          message.innerHTML = app.iosLessThen10;
          section.appendChild(message);
        }
        else if(window.device.browser.toLowerCase()=='chrome' && parseInt(window.device.version)<54){
          message.innerHTML = app.iosChromeLessThen54;
          section.appendChild(message);
        }
      }
    }

    section.appendChild(howTo);
    main.appendChild(section);
  },

  create: function (i, story) {
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
    section.setAttribute('class', (i===0) ? 'intro' : 'story');
    section.setAttribute('id', 'story'+i);

    if(i===0){

      if(story.cover.image){
        section.setAttribute('style', "background-image: url('"+story.cover.image+"')");
      }else{
        var povLogo = document.createElement('img');
        povLogo.setAttribute('src', app.introLogo);
        povLogo.setAttribute('alt', 'POV Logo');
        povLogo.setAttribute('width', '200');
        povLogo.setAttribute('height', 'auto');
        povLogo.setAttribute('class', 'intro-pov-logo');

        var title = document.createElement('h1');
        title.setAttribute('class', 'intro-title');
        title.innerHTML = app.introTitle;

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
      cover.setAttribute('class', 'story-cover');
      // add cover content
      if(story.cover.video){
        var video = document.createElement('video');
        video.setAttribute('playsinline', true);
        video.setAttribute('webkit-playsinline', true);
        video.setAttribute('src', story.cover.video);
        video.setAttribute('preload', 'metadata');
        video.setAttribute('loop', true);
        video.setAttribute('controls', false);
        video.setAttribute('class', 'story-cover-video');
        cover.appendChild(video);
        obj.video = video;
      }else{
        if(story.cover.image){
          var image = document.createElement('img');
          image.setAttribute('src', story.cover.image);
          image.setAttribute('alt', '');
          image.setAttribute('width', '100%');
          image.setAttribute('height', '');
          image.setAttribute('class', 'story-cover-image');
          cover.appendChild(image);
          obj.image = image;
        }
        if(story.cover.audio){
          var audio = document.createElement('audio');
          audio.setAttribute('src', story.cover.audio);
          audio.setAttribute('preload', 'metadata');
          audio.setAttribute('loop', true);
          audio.setAttribute('controls', false);
          audio.setAttribute('class', 'story-cover-audio');
          cover.appendChild(audio);
          obj.audio = audio;
        }
      }
      section.appendChild(cover);
      obj.cover = cover;

      // content
      if(i>0 && story.content.type!=='' && story.content.src!==''){
        var content = document.createElement('article');
        content.setAttribute('class', 'story-content '+story.content.type);
        // add html content to story
        if(story.content.type=='html'){
          content.innerHTML = story.content.src;
        }
        if(story.content.type=='video'){
          var contentVideo = document.createElement('video');
          contentVideo.setAttribute('playsinline', true);
          contentVideo.setAttribute('webkit-playsinline', true);
          contentVideo.setAttribute('src', story.content.src);
          contentVideo.setAttribute('preload', 'metadata');
          contentVideo.setAttribute('loop', false);
          contentVideo.setAttribute('controls', true);
          contentVideo.setAttribute('class', 'story-content-video');
          content.appendChild(contentVideo);
          obj.contentVideo = contentVideo;
        }
        section.appendChild(content);
        if(story.content.type){
          $(section).addClass('content-more');
          $(section).addClass(story.content.type);
        }
        obj.content = content;
      }
    }
    main.appendChild(section);
    app.stories.push(obj);
  },

  getCurrent: function () {
    if(app.currentStory<0) app.currentStory = 0;
    return app.story.get(app.currentStory);
  },

  get: function (id) {
    // change the index and return the story object
    if(id<0 || id>app.stories.length) return null;
    return app.stories[id];
  },

  next: function () {
    var width   = app.width;
    var section = $('section.story').length;
    var scroll  = app.getScroll() + width;
    app.story.cover.show(false);
    if(scroll<=(width*section)){
      $('main').stop().animate({
        scrollLeft: scroll
      }, app.transitionSpeed, function(){
        var id = (scroll/width);
        app.currentScroll = scroll;
        app.currentStory   = id;
        app.story.stop(app.story.get(id-1));
        app.story.play(app.story.get(id));
      });
    }
  },

  previous: function () {
    var width  = app.width;
    var scroll = app.getScroll() - width;
    app.story.cover.show(false);
    if(scroll>=0){
      $('main').stop().animate({
        scrollLeft: scroll
      }, app.transitionSpeed, function(){
        var id = (scroll/width);
        app.currentScroll = scroll;
        app.currentStory   = id;
        app.story.stop(app.story.get(id+1));
        app.story.play(app.story.get(id));
      });
    }
  },

  play: function (story) {
    if(!story) return false;
    if(story.video) app.playMedia(story.video);
    else if(story.audio) app.playMedia(story.audio);
  },

  stop: function (story) {
    if(!story) return false;
    if(story.video) app.stopMedia(story.video);
    else if(story.audio) app.stopMedia(story.audio);
  },

  content: {
    show: function () {
      var story = app.story.getCurrent();
      if(!story.content || $(story.cover).hasClass('over')) return false;
      $(story.cover).animate({
        top: '-110%'
      }, app.transitionSpeed, function(){
        $(this).addClass('over');
      });
      app.story.stop(story);
      if(story.contentVideo) app.playMedia(story.contentVideo);
    },

    stop: function (story) {
      if(!story) story = app.story.getCurrent();
      if(!story.content) return false;
      // stop all the video and audio in the content
      $(story.content).find('video,audio').each(function(){
        app.stopMedia(this);
      });
    },

    eventListeners: function () {
      $('.story-content').on('touchstart', function(event){
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
          var story = app.story.getCurrent();
          if(story.content && $(story.cover).hasClass('over') && y<0 && $(story.content).scrollTop()===0){
            y = ((y + $('main').height())/$('main').height()) * 100;
            $(story.cover).css({'top': (y * -1)+'%'});
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
        app.story.content.swipe(x, y, $(this).scrollTop());
      });
    },

    swipe: function (x, y, top) {
      if(!x || !y) return;
      if(Math.abs(x) > Math.abs(y)){
        if(x < 0){
          // left swipe
          if(x < -Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('content swipe left');
            app.story.previous();
          }
        }else{
          // right swipe
          if(x > Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('content swipe right');
            app.story.next();
          }
        }
      }else{
        if(y < 0){
          // up swipe
          if(y < -Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('content swipe up');
            if(top<2) app.story.cover.show(true);
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




  // Cover story Functions
  cover: {
    show: function (play) {
      var story = app.story.getCurrent();
      if(!$(story.cover).hasClass('over')) return;
      if(!story.content){
        $(story.cover).removeAttr('style').removeClass('over');
      }else{
        // stop any media playing in the content
        app.story.content.stop(story);
        // reset content scroll to zero
        $(story.content).stop().animate({
          scrollTop: 0
        }, app.transitionSpeed);
        // bring the cover down
        $(story.cover).animate({
          top: '0%'
        }, app.transitionSpeed, function(){
          $(this).removeClass('over').removeAttr('style');
        });
      }
      console.log('show cover: ',play);
      if(play===true) app.story.play(story);
    },

    eventListeners: function () {
      $('.story-cover').on('touchstart', function(event){
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
          var story = app.story.getCurrent();
          if(story.content && !$(story.cover).hasClass('over') && y>0){
            y = (y/$('main').height()) * 100;
            $(story.cover).css({'top': (y * -1)+'%'});
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
          var story = app.story.getCurrent();
          $(story.cover).animate({
            top: '0%'
          }, app.transitionSpeed, function(){
            $(this).removeAttr('style').removeClass('over');
          });
        }
        app.mainScroll = null;
        app.story.cover.swipe(x, y);
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
            app.story.previous();
          }
        }else{
          // right swipe
          if(x > Math.abs(app.swipeThreshold)){
            if(app.DEBUG) console.log('swipe right');
            app.story.next();
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
            app.story.content.show();
          }
        }
      }
    }
  }
};
