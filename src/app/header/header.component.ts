import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {ConfigService} from "../config.service";
import {FormsModule} from "@angular/forms";
import {ErrorViewComponent} from "../error-view/error-view.component";
import {TokenService} from "../token.service";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    ErrorViewComponent,
    FormsModule
  ]
})
export class HeaderComponent {
  token: string = '';

  constructor(
    private router: Router,
    private configService: ConfigService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.token = this.tokenService.getToken();
    console.log(this.token);
  }

  refresh() {
    this.tokenService.setToken(this.token);
  }

  toAddUser() {
    this.router.navigateByUrl(
      this.configService.config.routing.baseUrl + '/add-user'
    );
  }

  toUsers() {
    this.router.navigateByUrl(
      this.configService.config.routing.baseUrl
    );
  }
}
