import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass']
})
export class SigninComponent{

  constructor(private spotify: SpotifyService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        this.spotify.setAccessToken(params.code);
        this.router.navigate(['login']);
      }
    });
  }

  public login() {
    this.spotify.auth();
  }
}
