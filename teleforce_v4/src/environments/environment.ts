// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: '/api',
  OBDapiUrl: 'https://obd.cloudX.in/api',
  SOCKET_ENDPOINT: 'http://localhost:3002/',
  firebase: {
    apiKey: "AIzaSyB5sad2Z_4k2sceJ2VOrIpbctP5t8fsX3w",
    authDomain: "televoice-e6dc2.firebaseapp.com",
    projectId: "televoice-e6dc2",
    storageBucket: "televoice-e6dc2.appspot.com",
    messagingSenderId: "242062901427",
    appId: "1:242062901427:web:73d284bc0291ae80a670c6",
    measurementId: "G-Y4RSRDWTQ5"
  },
  fb_appId : '909402286379582',
  media_path:'https://c8d8-122-186-210-218.ngrok.io/api/',
  CHAT_SOCKET_ENDPOINT: 'http://localhost:3002/',
  GOOGLE_WEBHOOK_URL_BASE_PATH: 'https://web.cloudX.in/api/digital/google_webhook/',
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
