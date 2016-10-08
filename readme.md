# POV: Mobile Storytelling Tool

[Project Description]

## Get Started

* Update the `production/assets/snap.json` file. (Look at the `Snap JSON Format` section below to understand how to update this file)
* After making changes to `snap.json` file. Upload all the files in production folder to your server.
* Navigate where you uploaded the files and you should see project loading on top of your intro image.

### How to Navigate
* Desktop
  * Right key to go to next snap.
  * Left key to go back to previous snap.
  * Down key to go down on the current snap. (This will only work if you see **Watch** or **Read** on cover snap)
  * Up key to go back to cover snap.
* Mobile or Touch Device
  * Swipe Left to go to next snap.
  * Swipe Right to go back to previous snap.
  * Swipe Up to go down on the current snap. (This will only work if you see **Watch** or **Read** on cover snap)
  * Swipe Down key to go back to cover snap.

### Snap JSON Format

**Intro Snap**

First element in array will be intro snap and it can only be image.

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

**Regular Snap:**

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

**Regular Snap:**

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

### Markup for Dev Environment
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
This will install the npm and gulp in your computer.


### Run the Dev Environment

Go to project folder
```sh
  cd path/to/my/project-folder
```
Run the command below to download all the node modules packages.
```sh
  npm install;
```

Now everything is downloaded let's tell gulp to start watching development folder. This will build the project from development folder to production folder and option link in browser with broswer-sync.
```sh
  gulp serve;
```


If you just want to rebuild the project use this commend. This will build the project from development folder to production folder without browser-sync.
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
Original code is made available under [License info], Copyright (c) 2016 American Documentary Inc.

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