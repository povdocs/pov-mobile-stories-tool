var browser,
  version,
  mobile = 0,
  os,
  osversion,
  bit,
  ua = window.navigator.userAgent,
  platform = window.navigator.platform;

// IE
if (/MSIE/.test(ua)){
  browser = 'Internet Explorer';
  version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];
  if(/IEMobile/.test(ua)) mobile = 1;
}
// iOS chrome
else if(/CriOS/.test(ua)){
  browser  = 'Chrome';
  version  = /CriOS\/[\d\.]+/.exec(ua)[0].split('/')[1];
  platform = 'iOS';
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

  if ((/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua))){
    os = 'iOS';
    platform = 'iOS';
    mobile = 1;
  }
} 

if ( !version ) {
  
   version = /Version\/[\.\d]+/.exec(ua);
   
   if (version) {
     version = version[0].split('/')[1];
   } else {
     version = /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1];
   }
   
}

if(platform === 'iPhone' || platform === 'iPad' || platform === 'iPod' || platform==='iOS'){
  os = 'iOS';
  mobile = 1;
  osversion = /OS\s[\_\d]+/.exec(ua)[0].split(' ')[1].replace(/_/g, '.');
}
else if ( platform === 'MacIntel' || platform === 'MacPPC' ) {
  os = 'Mac OS X';
  osversion = /10[\.\_\d]+/.exec(ua);
  if(osversion){
    osversion = osversion[0];
    if ( /[\_]/.test(osversion) ) {
      osversion = osversion.split('_').join('.');
    }
  }
}
else if ( platform === 'CrOS' ) {
  os = 'ChromeOS';
}
else if ( platform === 'Win32' || platform == 'Win64' ) {
  os = 'Windows';
  bit = platform.replace(/[^0-9]+/,'');
}
else if ( !os && /Android/.test(ua) ) {
  os = 'Android';
}
else if ( !os && /Linux/.test(platform) ) {
  os = 'Linux';
}
else if ( !os && /Windows/.test(ua) ) {
  os = 'Windows';
} 
 
window.ui = {
  browser : browser,
  version : version,
  mobile : mobile,
  os : os,
  osversion : osversion,
  bit: bit
};