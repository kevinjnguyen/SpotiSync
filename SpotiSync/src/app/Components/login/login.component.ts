import { Component, OnInit } from '@angular/core';
import { SpotifyService, SpotifyDevicesRes, SpotifyProfile } from 'src/app/services/spotify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {

  public accessToken: string;
  public roomCode: string;

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, private af: AngularFireDatabase, private roomService: RoomService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (!params.code) {
        this.router.navigate(['']);
      }
      this.accessToken = params.code;
      this.spotifyService.setAccessToken(params.code);
    });
  }

  public join(room: string) {
    this.roomService.setRoomId(room);
    this.router.navigate(['/room']);
  }

  public onSubmit() {
    this.roomService.setRoomId(this.roomCode);
    this.router.navigate(['/room']);
  }
}
