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
  
  private currentId: any;
  private device_id: string;
  private status: boolean = false;

  constructor(private af: AngularFireDatabase, private roomService: RoomService, private spotifyService: SpotifyService, private router: Router) { }

  ngOnInit() {

    if (!this.roomService.getRoomId()) {
      this.router.navigate(['']);
    }

    if (!this.spotifyService.isAuth()) {
      this.router.navigate(['']);
    }

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
        if (this.device_id) {
          this.spotifyService.playTrackOnDevice(this.playUri, this.device_id).subscribe();
        } else {
          this.spotifyService.getDevices().subscribe( (spotifyRes: SpotifyDevicesRes) => {
            if (spotifyRes.devices.length > 0) {
              this.device_id = spotifyRes.devices[0].id;
              this.spotifyService.playTrackOnDevice(this.playUri, spotifyRes.devices[0].id).subscribe( (play) => {
              });
            }
          });
        }
      } else {
        this.textStatus = 'Ready to Play!';
        this.btnText = 'Start';
        if (this.device_id) {
          this.spotifyService.pauseOnDevice(this.device_id).subscribe();
        }
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
}
