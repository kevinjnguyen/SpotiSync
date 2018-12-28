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

  constructor(private spotifyService: SpotifyService, private af: AngularFireDatabase, private roomService: RoomService, private router: Router) {
    if (!this.spotifyService.isAuth()) {
      this.router.navigate(['']);
    }
  }

  public join(room: string) {
    this.roomService.setRoomId(room);
    this.router.navigate(['/room']);
  }

  public onSubmit() {
    this.roomService.setRoomId(this.roomCode.toLowerCase());
    this.router.navigate(['/room']);
  }
}
