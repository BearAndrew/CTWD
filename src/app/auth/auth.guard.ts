import { AuthenticationService } from './../_service/authentication.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authenticationService.isLoginSuccess().pipe(map((data) => {
      console.log('authGuard: ' + data);
      if (!data) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      }
      return data;
    }));
  }

}
