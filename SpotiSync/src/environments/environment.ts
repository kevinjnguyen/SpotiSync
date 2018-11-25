// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  SPOTIFY: {
    CLIENT_ID: '515f1bd1424341c09ccf1aae64bb0e91',
    CALLBACK_URL: 'https://opy5ngmrb4.execute-api.us-east-1.amazonaws.com/dev/api/callback',
    SCOPE: 'streaming user-read-birthdate user-read-email user-read-private user-read-playback-state user-modify-playback-state',
    API: {
      AUTHORIZE: 'https://accounts.spotify.com/authorize',
      DEVICES: 'https://api.spotify.com/v1/me/player/devices',
      PLAY: 'https://api.spotify.com/v1/me/player/play',
      PROFILE: 'https://api.spotify.com/v1/me',
      PAUSE: 'https://api.spotify.com/v1/me/player/pause',
    }
  },
  firebase: {
    apiKey: "AIzaSyBFWK0xjRlrAcjVL_r_BHfv4BPD8NDggzs",
    authDomain: "spotisync-19dfa.firebaseapp.com",
    databaseURL: "https://spotisync-19dfa.firebaseio.com",
    projectId: "spotisync-19dfa",
    storageBucket: "spotisync-19dfa.appspot.com",
    messagingSenderId: "963217928430"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
