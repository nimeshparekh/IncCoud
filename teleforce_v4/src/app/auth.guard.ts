import { Injectable } from '@angular/core';
import { Router,CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,NavigationEnd, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentRoute: string;

  constructor(
    private router: Router, 
    private authService: AuthService) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event) => {
          this.currentRoute = event['url'];
      });
    }
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // async canActivate() {
  //   var valid = this.authService.isAccessValid()
  //   console.log(valid)
  //   if (!this.authService.isTokenExpired()) {
  //     return true;
  //   }
  //   localStorage.clear();
  //   this.router.navigate(['/']);
  //   return false;
  // }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated(this.currentRoute).pipe(map((response: { authenticated: boolean}) => {
        if (response.authenticated && !this.authService.isTokenExpired()) {
            return true;
        }
        localStorage.clear();
        this.router.navigate(['/accessdenied']);
        window.location.href = '/accessdenied/';
        return false;
    }), catchError((error) => {
        localStorage.clear();
        this.router.navigate(['/accessdenied']);
        window.location.href = '/';
        return of(false);
    }));
  }
}
