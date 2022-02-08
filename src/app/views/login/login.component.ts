import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../_service/authentication.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {

  fg: FormGroup;
  isLoginCalled = false;
  isLoginFailed = false;
  isBusy = false;

  private showLoginPageSub: Subscription;

  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService, private activatedRoute: ActivatedRoute) {
    this.showLoginPageSub = authenticationService.showLoginPage().subscribe((data) => {
      this.isLoginCalled = data;
    });

    this.checkUrlToken();
  }

  ngOnInit(): void {
    const accountValue = localStorage.getItem('account');
    this.fg = this.fb.group({
      account: [accountValue, Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  ngOnDestroy(): void {
    this.showLoginPageSub.unsubscribe();
  }

  get account() { return this.fg.get('account'); }
  get password() { return this.fg.get('password'); }
  get remember() { return this.fg.get('remember'); }

  login() {
    this.isBusy = true;

    this.authenticationService.login(this.account.value, this.password.value).then((resolve) => {
      console.log('login resolve !');
      // 記住帳號
      if (this.remember.value) {
        localStorage.setItem('account', this.account.value);
      } else {
        localStorage.removeItem('account');
      }
    }, (reject) => {
      console.log('login reject: ' + JSON.stringify(reject));
      this.isLoginFailed = true;
      this.isBusy = false;
    });
  }

  checkUrlToken() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const urlToken = param.get('token');
      console.log('urlToken: ' + urlToken);
      this.authenticationService.checkUrlToken(urlToken);
    });
  }

}
