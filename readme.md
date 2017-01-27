# POV: Mobile Stories Tool

In 2016, POV produced the first films ever made for [Snapchat Discover](http://www.pbs.org/pov/snapchatfilms/). We searched for tools to help us storyboard, prototype and publish what we made and we couldn't find any — other than private proprietary systems like Snapchat Discover, Instagram Stories and Twitter Moments, so we made our own!

Now we are excited to give the world the ability to pre-edit photos, videos and audio into a mobile-native storytelling tool. You can use it for branching video, dynamic slideshows, one-on-one presentations, or for prototyping stories made for social media apps. POV Mobile Stories is free and provided as open-source software and doesn't depend on a social media app — so you can keep it online as long as you want.

## Get Started

Visit [www.pbs.org/pov/stories/](http://www.pbs.org/pov/stories/) to get started.

**OR** 

* Update the `production/assets/story.json` file. (Look at the `Story JSON Format` section below to understand how to update this file)
* After making changes to `story.json` file. Upload all the files in production folder to your server.
* Navigate where you uploaded the files and you should see project loading on top of your intro image.

### How to Navigate
* Desktop
  * Right key to go to next story.
  * Left key to go back to previous story.
  * Down key to go down on the current story. (This will only work if you see **Watch** or **Read** on cover story)
  * Up key to go back to cover story.
* Mobile or Touch Device
  * Swipe Left to go to next story.
  * Swipe Right to go back to previous story.
  * Swipe Up to go down on the current story. (This will only work if you see **Watch** or **Read** on cover story)
  * Swipe Down key to go back to cover story.

### Story JSON Format

**Intro Story**

First element in array will be intro story and it can only be image.

```json
[
  {
    "cover": {
      "image": "path/to/image/file"
    }
  },
  ...
]
```

**Regular Story:**

**Note:** For cover you can have video or image with audio but you can't have video and audio files or video and image files.

If you only want video in content section.

```json
[
  ...
  {
    "cover": {
      "video": "path/to/video.mp4",
      "image": "path/to/image.jpg",
      "audio": "path/to/audio.mp3"
    },
    "content":{
      "type": "video",
      "src":  "path/to/video.mp4"
    }
  }
  ...
]
```

**Regular Story:**

If you want HTML in content section.

```json
[
  ...
  {
    "cover": {
      "video": "path/to/video.mp4",
      "image": "path/to/image.jpg",
      "audio": "path/to/audio.mp3"
    },
    "content":{
      "type": "HTML",
      "src":  "HTML formated content"
    }
  }
  ...
]
```


## Setup Development Environment

If you want to make changes to this project you in the right section. Please follow the guide below.

### Project Folder/File Setup

Let's get understand how the development environment is setup.

* **assets**: All the plugins files
* **js**: All the JavaScript files
* **json**: json data file
* **media**: All the media file used in project
* **pages**: All the html pages
* **sass**: All the SASS files

### Install NPM and Gulp

We need [NPM](https://npmjs.org). which you can get by going to [http://www.nodejs.org](http://www.nodejs.org).
After you done installing NPM. Open terminal and type:
```sh
sudo npm install -g; sudo npm install -g gulp;
```
This will install the npm and gulp in your computer. You can skip this if you already have NPM and Gulp installed.


### Run the Dev Environment

Go to project folder
```sh
  cd path/to/my/project-folder
```
Run the command below to download all the node modules packages.
```sh
  npm install;
```

Now everything is downloaded let's tell gulp to start watching development folder. This will build the project from development folder to production folder and option link in browser with browser-sync.
```sh
  gulp serve;
```


If you just want to rebuild the project use this commend. This will rebuild the project from development folder to production folder without browser-sync.
```sh
  gulp build;
```

## Change Log

* 1.0.0
  * Public Release.
* 0.3.0
  * Fixed the iOS video aspect ratio.
* 0.2.0
  * Added playsinline attribute for iOS device.
* 0.1.0
  * Finish building backbone of the project.


## License
Original code is made available under [GPL-3.0](https://opensource.org/licenses/GPL-3.0), Copyright (c) 2016 POV | American Documentary Inc.

### Plugins
Following plugins are made available under their respective licenses.
* [Typebase.css](http://devinhunt.github.io/typebase.css/) v0.1.0
* [Normalize.css](github.com/necolas/normalize.css) v4.1.1
* [jQuery](jquery.org/license) v3.1.0

## Author
Code, concept and design by [Sunil Patel](https://github.com/sunil523), Developer, [POV](http://www.pbs.org/pov/) Digital

* Sunil Patel
  * https://www.twitter.com/sunil523
  * https://github.com/sunil523
  * http://www.sunil523.com
* POV Digital
  * https://www.twitter.com/povdocs
  * https://github.com/povdocs
  * http://www.pbs.org/pov
  * http://www.pbs.org/pov/digital