import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private accessToken: string;
  private profile: SpotifyProfile;

  constructor(private http: HttpClient) { }

  public setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  public setProfile(profile: SpotifyProfile) {
    this.profile = profile;
  }

  public isAuth() {
    return this.accessToken !== undefined;
  }

  public auth() {
    const url = environment.SPOTIFY.API.AUTHORIZE +
    '?response_type=code' +
    '&client_id=' + environment.SPOTIFY.CLIENT_ID +
    '&scope=' + encodeURIComponent(environment.SPOTIFY.SCOPE) + 
    '&redirect_uri=' + encodeURIComponent(environment.SPOTIFY.CALLBACK_URL);

    window.location.href = url;
  }

  public getDevices() {
    return this.http.get(environment.SPOTIFY.API.DEVICES, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
  }

  public playOnCurrentDevice(uri: string) {
    let body = {
      'uris': [uri]
    }
    return this.http.put(environment.SPOTIFY.API.PLAY, JSON.stringify(body), {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
  }

  public pauseOnDevice(device: string) {
    return this.http.put(environment.SPOTIFY.API.PAUSE, null, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken
      }),
      params: {
        'device_id': device
      }
    });
  }

  public playTrackOnDevice(uri: string, device: string) {
    let body = {
      'uris': [uri]
    }
    return this.http.put(environment.SPOTIFY.API.PLAY, JSON.stringify(body), {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken
      }),
      params: {
        'device_id': device
      }
    });
  }

  public getProfile() {
    return this.http.get(environment.SPOTIFY.API.PROFILE, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
  }

  public searchTrack(name: string) {
    return this.http.get(environment.SPOTIFY.API.SEARCH, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken
      }),
      params: {
        'q': name,
        'type': 'track',
        'limit': '5'
      }
    });
  }

  public getTrack(id: string) {
    return this.http.get(environment.SPOTIFY.API.TRACK + id, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
  }
}

export interface SpotifyDevicesRes {
  devices: [SpotifyDevice]
}

export interface SpotifyDevice {
  id: string,
  is_active: boolean,
  is_private_session: boolean,
  is_restricted: boolean,
  name: string,
  type: string,
  volume_percent: number,
}

export interface SpotifyProfile {
  birthday: string,
  country: string,
  display_name: string,
  email: string,
  external_urls: {
    spotify: string,
  },
  followers: {
    total: number,
  },
  href: string,
  id: string,
  images: string[],
  product: string,
  type: string,
  uri: string,
}