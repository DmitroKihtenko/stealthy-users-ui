import {Component, HostBinding} from '@angular/core';
import {ErrorViewComponent} from "../error-view/error-view.component";
import {ErrorsService} from "../errors.service";
import {ConfigService} from "../config.service";
import {NgForOf, NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {TokenService} from "../token.service";
import {UsersService} from "../users.service";
import {ClipboardModule} from "ngx-clipboard";

@Component({
  selector: 'app-users-list',
  standalone: true,
  templateUrl: './users-list.component.html',
  imports: [
    ErrorViewComponent,
    NgIf,
    NgForOf,
    ClipboardModule,
  ]
})
export class UsersListComponent {
  @HostBinding('class') classes = 'col-10 d-flex justify-content-md-center align-items-center bg-diluted mx-2 my-2';

  limit: number = 6;
  usersList: any[] = [];
  firstPageToken: string | null = null;
  nextPageToken: string | null = null;
  isFirstPage: boolean = true;
  tokenSubscription: Subscription | null = null;
  getUsersSubscription: Subscription | null = null;
  deleteUserSubscription: Subscription | null = null;

  constructor(
    private tokenService: TokenService,
    private usersService: UsersService,
    private configService: ConfigService,
    private errorsService: ErrorsService,
  ) {
    this.limit = this.configService.config.pagination.perPageLimit;
  }

  ngOnInit() {
    this.getUsersSubscription = this.usersService.
    getUsersRequest.subscribe(
      {next: value => {
        this.errorsService.setHidden(true);
        this.firstPageToken = value['first_page_token'];
        this.nextPageToken = value['next_page_token'];
        this.usersList = value['list']
      }}
    );

    this.deleteUserSubscription = this.usersService.
    deleteUserRequest.subscribe(
      {
        next: value => {
          this.errorsService.setHidden(true);
          this.isFirstPage = true;
          this.nextPageToken = null;
          this.updateUsersList();
        }
      }
    );

    this.tokenSubscription = this.tokenService.token.subscribe({
      next: value => {
        this.updateUsersList();
      }
    });

    this.updateUsersList();
  }

  ngOnDestroy() {
    if (this.deleteUserSubscription) {
      this.deleteUserSubscription.unsubscribe();
    }
    if (this.getUsersSubscription) {
      this.getUsersSubscription.unsubscribe();
    }
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
  }

  updateUsersList() {
    let pageToken = this.firstPageToken;
    if (this.nextPageToken) {
      pageToken = this.nextPageToken;
    }

    this.usersService.getUsers(this.limit, pageToken);
  }

  deleteUser(userId: string) {
    this.usersService.deleteUser(userId);
  }

  onNextPage() {
    this.errorsService.setHidden(true);
    this.updateUsersList();
    this.isFirstPage = false;
  }

  onFirstPage() {
    this.errorsService.setHidden(true);
    this.updateUsersList();
    this.isFirstPage = true;
  }

  isFirstPageDisabled(): boolean {
    return this.isFirstPage;
  }

  isNextPageDisabled(): boolean {
    return this.nextPageToken == null;
  }
}
