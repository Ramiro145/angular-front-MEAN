import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl:string = environments.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User|null>(null);

  private _authStatus = signal<AuthStatus>(AuthStatus.checking)

  //! al mundo exterior
  public currentUser = computed(()=> this._currentUser());
  public authStatus = computed(()=> this._authStatus());

  constructor() {

      this.checkAuthStatus().subscribe();

   }

  private setAuthentication({user, token}:LoginResponse):boolean{
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }


  login(email:string, password:string):Observable<boolean>{

    const url = `${this.baseUrl}/auth/login`;

    const body = {
      email: email,
      password: password
    }

    return this.http.post<LoginResponse | CheckTokenResponse>(url, body)
      .pipe(
        map((resp)=> {
          return this.setAuthentication(resp);
        }),
        //todo errores:
        catchError(err => throwError(()=> err.error.message)
        )
      );

  }


  checkAuthStatus():Observable<boolean> {

    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if(!token) {
      this._authStatus.set(AuthStatus.notAuthenticated);
      this._currentUser.set(null);
      return of(false);
    };

    const headers = new HttpHeaders()
      .set('Authorization',`Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, {headers})
      .pipe(
        map((resp)=>{
          return this.setAuthentication(resp);
        }),

        //Error
        catchError(()=> {

          this._authStatus.set(AuthStatus.notAuthenticated);

          return of(false)
        })
      )
  }

  logout(){
    localStorage.removeItem('token');
    this.checkAuthStatus();
  }

}
