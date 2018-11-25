import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { SpotifyService, SpotifyDevicesRes } from 'src/app/services/spotify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.sass']
})
export class RoomComponent implements OnInit {

  public songName: string;
  public room: any;
  public results: any[] = [];
  public currentTrack: any;
  public textStatus: string = 'Ready to Play!';
  public btnText: string = 'Start';
  public playUri: any;
  public devices: any[] = [];
  public isDeviceRefreshing: boolean = false;

  private currentId: any;
  private device_id: string;
  private current_device_id: string;
  private status: boolean = false;

  constructor(private af: AngularFireDatabase, private roomService: RoomService, private spotifyService: SpotifyService, private router: Router) { }

  ngOnInit() {

    if (!this.roomService.getRoomId()) {
      this.router.navigate(['']);
    }

    if (!this.spotifyService.isAuth()) {
      this.router.navigate(['']);
    }

    this.refresh();

    this.af.object('rooms/' + this.roomService.getRoomId() + '/members').valueChanges().subscribe( (res) => {
      this.room = res;
    });

    this.af.object('rooms/' + this.roomService.getRoomId() + '/playUri').valueChanges().subscribe( (res) => {
      this.playUri = res;
    });

    this.af.object('rooms/' + this.roomService.getRoomId() + '/currentUri').valueChanges().subscribe( (res) => {
      this.currentId = res;
      this.spotifyService.getTrack(this.currentId).subscribe( (res) => {
        this.currentTrack = res;
      });
    });

    this.af.object('rooms/' + this.roomService.getRoomId() + '/status').valueChanges().subscribe( (res: boolean) => {
      this.status = res;
      if (res) {
        this.textStatus = 'Playing...';
        this.btnText = 'Stop';
        this.spotifyService.playTrackOnDevice(this.playUri, this.current_device_id).subscribe();
      } else {
        this.textStatus = 'Ready to Play!';
        this.btnText = 'Start';
        this.spotifyService.pauseOnDevice(this.current_device_id).subscribe();
      }
    });

    this.af.object('rooms/' + this.roomService.getRoomId()).update({
      status: this.status,
    });

  }

  public toggle() {
    if(!this.status) {
      this.af.object('rooms/' + this.roomService.getRoomId()).update({
        currentUri: this.currentTrack.id,
      });
      this.current_device_id = this.device_id;
    }
    this.af.object('rooms/' + this.roomService.getRoomId()).update({
      status: !this.status,
    });
  }

  public onSubmit() {;
    this.spotifyService.searchTrack(this.songName).subscribe( (res:any) => {
      this.results = res.tracks.items;
    });
  }

  public select(track: any) {
    this.af.object('rooms/' + this.roomService.getRoomId()).update({
      playUri: track.uri,
    }).then( () => {
      this.currentTrack = track;
    });
  }

  public back() {
    this.currentTrack = null;
  }

  public viewNowPlaying() {
    this.spotifyService.getTrack(this.currentId).subscribe( (res) => {
      this.currentTrack = res;
    });
  }

  public refresh() {
    this.isDeviceRefreshing = true;
    this.spotifyService.getDevices().subscribe((res: any) => {
      this.devices = res.devices;
      if (this.devices.length > 0) {
        if (this.device_id) {
          let previous = null;
          for (let id of this.devices) {
            if (id === this.current_device_id) {
              previous = id;
            }
          }
          if (!previous) {
            this.device_id = this.devices[0].id;
          }
        } else {
          this.device_id = this.devices[0].id;
        }
      } else {
        this.devices.push({name: 'No Devices Found', id: null});
        this.device_id = null;
      }
    }, null, () => {
      this.isDeviceRefreshing = false;
    });
  }

  public onChange(deviceValue) {
    this.device_id = deviceValue;
  }
}
