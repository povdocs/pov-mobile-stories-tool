# POV: Snapchat Tool

### Markup for production site
**Upload only folders and files which are inside the production folder.**
* production/index.html
* production/assets/*

### Markup for development
* assets `All the theme files`
* images `All the images used in project`
* pages `All the html pages`
* js `All the JavaScript files`
* sass `All the SASS files`
* google-fonts.txt `add the Google-fonts and gulp will download the fonts for project`

## Installation

We need [NPM](https://npmjs.org). which you can get by going to [http://www.nodejs.org](http://www.nodejs.org).
After you done installing NPM. Open terminal and type:
```sh
sudo npm install -g; sudo npm install -g gulp;
```
This will install the npm and gulp in your computer.

### Run the development

Go to project folder
```sh
  cd path/to/my/project-folder
```
Run the command below to download all the node modules packages.
```sh
  npm install;
```
Now everything is downloaded let's tell gulp to start watching development folder.
```sh
  gulp;
```

If you just want to rebuild the project use this commend.
```sh
  gulp build;
```