import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app-settings';
import { map } from 'rxjs/operators';
import {SpinnerVisibilityService} from 'ng-http-loader';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class AuthService {
  loggedIn = true;
  isTemporaryLogin = false;
  loginCode: any;

  userId: number;
  token: any;
  user: any;

  // endpoints
  resetPasswordEndPoint = 'users/password/change';
  logoutEndPoint = 'backend/request';
  loginEndPoint = 'backend/request';

  constructor(private router: Router, private httpClient: HttpClient,
              private spinner: SpinnerVisibilityService, public toastr: ToastrService) {}


  getUserDetails(): any {
    const userDetails = JSON.parse(sessionStorage.getItem(AppSettings.userDataKey));
    return userDetails;
  }

  getActiveSession(): any {
    const session = JSON.parse(sessionStorage.getItem(AppSettings.sessionKey));
    return session;
  }

  resetUserpassword(data: any, model: string): any {
      const headers = new HttpHeaders({
        Accept: 'application/json',
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'x-auth, content-type',
        'Access-Control-Allow-Methods': 'POST'
    });
      const payload = {
      header: {
        userId: this.userId,
        token: this.token,
        channelCode: AppSettings.channelCode,
        channelSecurityCode: AppSettings.channelSecurityCode
      },
      data
    };
      return this.httpClient.post(`${AppSettings.baseURL}${this.resetPasswordEndPoint}`,
      payload, { headers }
    )
     .pipe(map(res => {
        return JSON.parse(JSON.stringify(res));
      }));
  }

  logIn(systemId: string, password: string): any {
    const httpOptions = {
      headers: new HttpHeaders({
         Accept: 'application/json',
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'x-auth, content-type',
        'Access-Control-Allow-Methods': 'POST'
      })
    };
    const data = {
        requestType: 'USER_LOGIN',
        username: systemId,
        password: password,
    };
    return this.httpClient.post(AppSettings.baseURL, data, { headers: httpOptions.headers }
     )
      .pipe(map(user => JSON.parse(JSON.stringify(user))));
   }

  logOut(): any {
    this.spinner.show();
    this.loggedIn = false;

    const payload = {
      header: {
        userId: this.getUserDetails().id,
        token: this.getActiveSession().token,
        channelCode: AppSettings.channelCode,
        channelSecurityCode: AppSettings.channelSecurityCode
    },
    data: {
      "requestType": "USER_LOGOUT"
    }
};
    const headers = new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'x-auth, content-type',
    'Access-Control-Allow-Methods': 'POST'
    });
    // this.router.navigate(['/login']);
    return this.httpClient.post(`${AppSettings.baseURL}${this.logoutEndPoint}`, payload , {headers})
      .pipe(map(response => JSON.parse(JSON.stringify(response)))).subscribe(res => {
        const response = res;
          sessionStorage.removeItem(AppSettings.isLoggedInKey);
          sessionStorage.removeItem(AppSettings.sessionKey);
          sessionStorage.clear();
          this.router.navigate(['/login']);
          this.spinner.hide();
      }, err => {
        sessionStorage.removeItem(AppSettings.isLoggedInKey);
        sessionStorage.removeItem(AppSettings.sessionKey);
        sessionStorage.clear();
        this.router.navigate(['/login']);
        this.spinner.hide();
      });
  }
  changeUserpassword(data: any, path: string): any {
    const user = this.getUserDetails();
    const  session = this.getActiveSession();

    const payload = {
        header: {
          userId: user.id,
          token: session.token,
          channelCode: AppSettings.channelCode,
          channelSecurityCode: AppSettings.channelSecurityCode
      },
      data
  };
    const headers = new HttpHeaders({
     Accept: 'application/json',
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'x-auth, content-type',
    'Access-Control-Allow-Methods': 'POST'
    });
    return this.httpClient.post(AppSettings.baseURL + path,
      payload, {headers}
    )
    .pipe(map(resp => JSON.parse(JSON.stringify(resp))));
  }
  get isLoggedIn(): boolean {
    this.loginCode = sessionStorage.getItem(AppSettings.isLoggedInKey);
    if (this.loginCode == 2000) {
       this.loggedIn = true;
       this.isTemporaryLogin = false;
    } else if (this.loginCode == 2113) {
      this.isTemporaryLogin = true;
      this.loggedIn = false;
    } else {
       this.loggedIn = false;
    }
    return this.loggedIn;
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {

        const isLoggedIn = this.authService.isLoggedIn;

        const isLoginForm = route.routeConfig.path === 'login';

        const isTempLogin = this.authService.isTemporaryLogin;

        if (isLoggedIn && isLoginForm && !isTempLogin) {
            this.router.navigate(['/home']);
            return false;
        }
        if (!isLoggedIn && isTempLogin && isLoginForm) {
            this.router.navigate(['/change-temporary-password']);
            return false;
        }

        if (!isLoggedIn && !isLoginForm) {
            this.router.navigate(['/login']);
        }

        return isLoggedIn || isLoginForm || isTempLogin;

    }
}


@Injectable()
export class AuthGuardServiceAdminsOnly implements CanActivate {
    constructor(private router: Router, private authService: AuthService, private toast: ToastrService) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {

        const user = this.authService.getUserDetails();

        const expectedRole = route.data.expectedRole;
        const isLoggedIn = this.authService.isLoggedIn;
        const isLoginForm = route.routeConfig.path === 'login';

        if (isLoggedIn && isLoginForm && expectedRole.includes(user.roleId)) {
          this.router.navigate(['/']);
          return false;
      }
        if (!isLoggedIn && !isLoginForm) {
        this.toast.error('You are not authorized to access this route, login first.', 'Access Denied');
        this.router.navigate(['/login']);
    }
        if (isLoggedIn && !expectedRole.includes(user.roleId)) {
          this.toast.error('You don\'t have rights to access this route, logging you out.', 'Access Denied');
          this.authService.logOut();
      }
        return isLoggedIn || isLoginForm;

    }
}
