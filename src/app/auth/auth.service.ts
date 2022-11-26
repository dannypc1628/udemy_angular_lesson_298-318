import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject } from "rxjs";

import { User } from "./user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  user = new Subject<User>();

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBOpS4Q3-KEGDLoCUm8ne87ajAlKgnj3OY ",
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorRes) => {
          let errorMessage = "An unknown error occurred!";
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
          }

          switch (errorRes.error.error.message) {
            case "EMAIL_EXISTS":
              errorMessage = "This email exists already";
          }
          return throwError(errorMessage);
        })
      );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyBOpS4Q3-KEGDLoCUm8ne87ajAlKgnj3OY",
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }
}