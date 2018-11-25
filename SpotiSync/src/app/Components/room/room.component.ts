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

  public room: any;
  private device_id: string;
  private status: boolean;

  constructor(private af: AngularFireDatabase, private roomService: RoomService, private spotifyService: SpotifyService, private router: Router) { }

  ngOnInit() {

    if (!this.roomService.getRoomId()) {
      this.router.navigate(['']);
    }

    this.af.object('rooms/123/members').valueChanges().subscribe( (res) => {
      this.room = res;
    });

    this.af.object('rooms/123').update({
      status: false,
    });

    this.af.object('rooms/123/status').valueChanges().subscribe( (res: boolean) => {
      this.status = res;
      if (res) {
        if (this.device_id) {
          this.spotifyService.playTrackOnDevice('spotify:track:2rPE9A1vEgShuZxxzR2tZH', this.device_id).subscribe();
        } else {
          this.spotifyService.getDevices().subscribe( (spotifyRes: SpotifyDevicesRes) => {
            if (spotifyRes.devices.length > 0) {
              this.device_id = spotifyRes.devices[0].id;
              this.spotifyService.playTrackOnDevice('spotify:track:2rPE9A1vEgShuZxxzR2tZH', spotifyRes.devices[0].id).subscribe( (play) => {
              });
            }
          });
        }
      } else {
        if (this.device_id) {
          this.spotifyService.pauseOnDevice(this.device_id).subscribe();
        }
      }
    })
  }

  public toggle() {
    this.af.object('rooms/123').update({
      status: !this.status,
    });
  }
}
