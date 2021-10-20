import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

import { User } from "./user.model";

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }
    
    signup(email: string, password: string) {
        const body = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        return this.http
            .post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, body)
            .pipe(catchError(this.handleError), tap(res => {
                this.handleAuthentication(
                    res.email,
                    res.localId,
                    res.idToken,
                    +res.expiresIn
                );
            }));
    }

    login(email: string, password: string) {
        const body = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        return this.http
            .post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, body)
            .pipe(catchError(this.handleError), tap(res => {
                this.handleAuthentication(
                    res.email,
                    res.localId,
                    res.idToken,
                    +res.expiresIn
                );
            }));
    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }
        
        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');

        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(
        email: string, 
        userId: string, 
        token: string, 
        expiresIn: number
    ) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            email, 
            userId, 
            token, 
            expirationDate
        );
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(err: HttpErrorResponse) {
        let errMessage = 'An unknown error occurred';
        console.log(err.error);

        if (!err.error || !err.error.error) {
            return throwError(errMessage);
        }
        switch (err.error.error.message) {
            case 'EMAIL_EXISTS':
                errMessage = 'An account with this email already exists'
                break;
            case 'EMAIL_NOT_FOUND':
                errMessage = 'Incorrect email or password'
                break;
            case 'INVALID_PASSWORD':
                errMessage = 'Incorrect email or password'
                break;
        }
        return throwError(errMessage);
    }
}