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

var
  ua       = window.navigator.userAgent,
  platform = window.navigator.platform,
  mobile   = 0,
  browser,
  version,
  os,
  osversion,
  bit
;

// IE
if(/MSIE/.test(ua)){
  browser = 'Internet Explorer';
  version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];
  if(/IEMobile/.test(ua)) mobile = 1;
}
// iOS chrome
else if(/CriOS/.test(ua)){
  browser  = 'Chrome';
  version  = /CriOS\/[\d\.]+/.exec(ua)[0].split('/')[1];
  os       = 'iOS';
  mobile   = 1;

  if((/iPhone/.test(ua))) platform = 'iPhone';
  if((/iPad/.test(ua)))   platform = 'iPad';
  if((/iPod/.test(ua)))   platform = 'iPod';
}
// Chrome
else if(/Chrome/.test(ua)){
  browser = 'Chrome';
  version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];

  // Check if chrome is Chrome OS
  if(/CrOS/.test(ua)) platform = 'CrOS';
}
// Firefox
else if(/Firefox/.test(ua)){
  browser = 'Firefox';
  version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];
  // check for mobile
  if(/Fennec/.test(ua)) mobile = 1;
}
// Opera
else if(/Opera/.test(ua)){
  browser = 'Opera';
  if (/mini/.test(ua) || /Mobile/.test(ua)) mobile = 1;
}
// Android
else if(/Android/.test(ua)){
  browser = 'Android Webkit Browser';
  os      = /Android\s[\.\d]+/.exec(ua)[0];
  mobile  = 1;
}
// Safari
else if(/Safari/.test(ua)){
  browser = 'Safari';
  version = /Version\/[\.\d]+/.exec(ua)[0].split('/')[1];

  if((/iPhone/.test(ua))) platform = 'iPhone';
  if((/iPad/.test(ua)))   platform = 'iPad';
  if((/iPod/.test(ua)))   platform = 'iPod';
} 
//
if(!version){
  version = /Version\/[\.\d]+/.exec(ua);
  version = (version) ? version[0].split('/')[1] : /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1];
}
//
if(platform === 'iPhone' || platform === 'iPad' || platform === 'iPod'){
  os        = 'iOS';
  mobile    = 1;
  osversion = /OS\s[\_\d]+/.exec(ua)[0].split(' ')[1].replace(/_/g, '.');
}
//
else if(platform==='MacIntel' || platform==='MacPPC'){
  os        = 'Mac OS X';
  osversion = /10[\.\_\d]+/.exec(ua);
  if(osversion){
    osversion = osversion[0];
    if(/[\_]/.test(osversion)){
      osversion = osversion.split('_').join('.');
    }
  }
}
//
else if(platform==='CrOS'){
  os  = 'ChromeOS';
}
//
else if(platform==='Win32' || platform==='Win64'){
  os  = 'Windows';
  bit = platform.replace(/[^0-9]+/,'');
}
//
else if(!os && /Android/.test(ua)){
  os  = 'Android';
}
//
else if(!os && /Linux/.test(platform)){
  os  = 'Linux';
}
//
else if(!os && /Windows/.test(ua)){
  os  = 'Windows';
} 

// setup device info
window.device = {
  mobile:    mobile,
  browser:   browser,
  version:   version,
  os:        os,
  osversion: osversion,
  bit:       bit,
  platform: platform
};
