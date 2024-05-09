import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import {catchError, Subject, Subscription, throwError} from 'rxjs';
import {ConfigService} from './config.service';
import {ErrorsService} from './errors.service';
import {TokenService} from "./token.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  getUsersRequest: Subject<any> = new Subject<any>();
  deleteUserRequest: Subject<any> = new Subject<any>();
  addUserRequest: Subject<any> = new Subject<any>();

  tokenSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorsService: ErrorsService,
    private tokenService: TokenService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.tokenSubscription = this.tokenService.token.subscribe({
      next: value => this.getUsersRequest.next(value)
    })
  }

  ngOnDestroy() {
    if (this.tokenSubscription != null) {
      this.tokenSubscription.unsubscribe()
    }
  }

  getAuthorizationHeaders(): HttpHeaders {
    let token = this.tokenService.getToken();
    if (token != '') {
      token = 'Bearer ' + token
    }
    return new HttpHeaders({
      Authorization: token
    });
  }

  addUser(user: any) {
    const headers = this.getAuthorizationHeaders();

    this.http.post(
      this.configService.config.backend.apiUrl + 'users',
      user,
      {headers: headers}
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorsService.handleError(
          error, error.error, error.status
        )}
      )
    ).subscribe({
      next: value => this.addUserRequest.next(value)
    });
  }

  deleteUser(userId: string) {
    const headers = this.getAuthorizationHeaders();

    this.http.delete(
        this.configService.config.backend.apiUrl + 'users/' + userId,
        {headers: headers}
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorsService.handleError(
              error, error.error, error.status
          )}
        )
    ).subscribe({
      next: value => this.deleteUserRequest.next(value)
    });
  }

  getUsers(limit: number | null = null, pageToken: string | null = null) {
    const headers = this.getAuthorizationHeaders();
    let params: {[index: string]:any} = {}
    if (limit != null) {
      params['limit'] = limit;
    }
    if (pageToken != null) {
      params['page_token'] = pageToken
    }

    this.http.get(
        this.configService.config.backend.apiUrl + 'users',
        {headers: headers, params: params}
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorsService.handleError(
              error, error.error, error.status
          )}
        )
    ).subscribe({
      next: value => this.getUsersRequest.next(value)
    });
  }
}
