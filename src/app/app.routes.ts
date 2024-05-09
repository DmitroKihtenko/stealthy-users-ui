import { Routes } from '@angular/router';
import {AddUserComponent} from './add-user/add-user.component';
import {Config} from '../config';
import {ErrorComponent} from "./error/error.component";
import {UsersListComponent} from "./users-list/users-list.component";


export function createAppRoutes(config: Config | null): Routes {
  if (config) {
    let baseUrlAsPart = config.routing.baseUrl;
    if (baseUrlAsPart != '') {
      baseUrlAsPart += '/';
    }
    return [
      { path: config.routing.baseUrl + '', component: UsersListComponent },
      { path: baseUrlAsPart + 'add-user', component: AddUserComponent },
      { path: '**', component: ErrorComponent }
    ]
  } else {
    return [
      { path: '**', component: ErrorComponent }
    ]
  }
}
