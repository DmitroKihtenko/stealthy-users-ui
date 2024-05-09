import { Injectable } from '@angular/core';
import {Subject, Subscription} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private TOKEN_KEY: string = 'admin_access_token';

    token: Subject<string> = new Subject<string>();
    private tokenSubscription: Subscription | null = null;
    private lastToken = '';

    constructor() {
        console.log('INIT');

        const tokenInStorage = localStorage.getItem(this.TOKEN_KEY);
        if (tokenInStorage) {
            this.lastToken = tokenInStorage;
        }

        console.log(typeof tokenInStorage);
        console.log(tokenInStorage);

        this.tokenSubscription = this.token.subscribe(
            {next: value => {
                this.lastToken = value;
            }}
        );
    }

    setToken(token: string) {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.token.next(token);
    }

    getToken(): string {
        return this.lastToken;
    }
}
