import {Component, HostBinding} from '@angular/core';
import {ErrorViewComponent} from "../error-view/error-view.component";
import {FormsModule} from "@angular/forms";
import {UsersService} from "../users.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-add-user',
  standalone: true,
  templateUrl: './add-user.component.html',
  imports: [
    ErrorViewComponent,
    FormsModule
  ]
})
export class AddUserComponent {
  @HostBinding('class') classes = 'col-8 d-flex justify-content-md-center align-items-center bg-diluted text-lg mx-2 my-2';

  username: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';

  addUserSubscription: Subscription | null = null;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.addUserSubscription = this.usersService.addUserRequest.subscribe(
      {next: value => {
          this.router.navigateByUrl(
              this.configService.config.routing.baseUrl
          )
      }}
    )
  }

  onOnDestroy() {
    if (this.addUserSubscription) {
      this.addUserSubscription.unsubscribe();
    }
  }

  onAddUser() {
    this.usersService.addUser({
      username: this.username,
      password: this.password,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email
    });
  }
}
