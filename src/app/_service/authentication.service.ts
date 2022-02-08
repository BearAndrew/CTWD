import { ManagerService } from './manager.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginResponse } from '../_interface/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private dTokenLoginUrl: string;
  private dLoginUrl: string;

  private userTokenSubject: BehaviorSubject<string>;
  private logStateSubject: BehaviorSubject<boolean>; // if login success, set true (Usage: auth guard)
  private showLoginPageSubject: BehaviorSubject<boolean>; // if login failed, set true (Usage: hide login page until login() is called)

  constructor(private http: HttpClient,
    private router: Router, private activatedRoute: ActivatedRoute,
    private managerService: ManagerService,
    private httpService: HttpService) {
    this.logStateSubject = new BehaviorSubject<boolean>(false);
    this.showLoginPageSubject = new BehaviorSubject<boolean>(false);

    this.dLoginUrl = this.httpService.dLoginUrl;
    this.dTokenLoginUrl = this.httpService.dTokenLoginUrl;
  }

  // Check login state
  isLoginSuccess(): Observable<boolean> {
    return this.logStateSubject as Observable<boolean>;
  }


  // Show login page if first time login is called or logout
  showLoginPage(): Observable<boolean> {
    return this.showLoginPageSubject as Observable<boolean>;
  }


  checkUrlToken(urlToken: string) {
    if (urlToken) {
      this.userTokenSubject = new BehaviorSubject<string>(urlToken);
    } else {
      this.userTokenSubject = new BehaviorSubject<string>(localStorage.getItem('CTWDriverToken'));
    }

    console.log('token: ' + this.userTokenSubject.value);
    this.tokenLogin();
  }


  // Login by account and password
  login(account, password): Promise<LoginResponse> {
    console.log('account: ' + account + ', password:' + password);
    return new Promise((resolve, reject) => {
      this.http.post(this.dLoginUrl, {Account: account, Password: password}).toPromise().then(
        (data: LoginResponse) => {
          console.log('DLogin response: ' + JSON.stringify(data));
          if (data.IsSuccess) {
            this.loginSuccess(data.Token, data.Name, data.CallNo, data.Config.MaxQueryDay);
            resolve(data);
          } else {
            reject(data);
          }
        });
    });
  }


  // Login by token
  tokenLogin() {
    if (this.userTokenSubject.value) {
      // If there is token
      this.http.post(this.dTokenLoginUrl, {Token: this.userTokenSubject.value})
      .subscribe((data: LoginResponse) => {
        console.log('DTokenLogin response: ' + JSON.stringify(data));
        // login success, change state to "true", route
        if (data.IsSuccess) {
          this.loginSuccess(data.Token, data.Name, data.CallNo, data.Config.MaxQueryDay);
        } else {
          this.showLoginPageSubject.next(true);
        }
      });
    } else {
      // If there isn't token
      this.logStateSubject.next(false);
      this.showLoginPageSubject.next(true);
    }
  }


  private loginSuccess(token: string, name: string, callNo: string, maxQueryDay: number) {
    this.logStateSubject.next(true);
    localStorage.setItem('CTWDriverToken', token);
    this.httpService.token = token;
    this.managerService.userName = callNo + '(' + name + ')';
    this.managerService.maxQueryDay = maxQueryDay;
    console.log('this.managerService.maxQueryDay: ' + this.managerService.maxQueryDay)
    this.loginRoute();
  }


  private loginRoute() {
    // get return url from route parameters or default to '/'
    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigate([returnUrl], { replaceUrl: true });
  }


  logout() {
    console.log('logout !');
    localStorage.removeItem('CTWDriverToken');
    this.showLoginPageSubject.next(true);
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
