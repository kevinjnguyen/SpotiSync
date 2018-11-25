import { Component } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'SpotiSync';
  public accessToken;

  constructor(private spotifyService: SpotifyService) { }

  public login() {
    this.spotifyService.auth();
  }
}
