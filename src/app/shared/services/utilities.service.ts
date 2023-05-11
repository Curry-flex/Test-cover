import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../app-settings';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  config: any;
  userId: number; // private authService:AuthService
  token: any;
  sessionData: any;
  user: any;
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    if (this.authService.getUserDetails()) {
      this.user = this.authService.getUserDetails(),
      this.sessionData = this.authService.getActiveSession();

      this.userId = this.user.id;
      const activeSession = this.authService.getActiveSession();
      this.token = activeSession.token;
      } else {

      }
   }

  // tslint:disable-next-line: typedef
  postServiceCall(data, path) {
    const payload = {
      header: {
        userId: this.userId,
        token: this.token,
        channelCode: AppSettings.channelCode,
        channelSecurityCode: AppSettings.channelSecurityCode
      },
      data
    };
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'x-auth, content-type',
      'Access-Control-Allow-Methods': 'POST'
    });
    return this.httpClient.post(`${AppSettings.baseURL}${path}`, payload, {headers}).pipe(map(res => JSON.parse(JSON.stringify(res))));
  }

  postServiceCallNew(data) {
    const payload = {
      header: {
        userId: this.userId,
        token: this.token,
        channelCode: AppSettings.channelCode,
        channelSecurityCode: AppSettings.channelSecurityCode
      },
      data
    };
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'x-auth, content-type',
      'Access-Control-Allow-Methods': 'POST'
    });
    return this.httpClient.post(AppSettings.baseURL, payload, {headers}).pipe(map(res => JSON.parse(JSON.stringify(res))));
  }


  postServiceCallX(data) {
    const payload = {
      header: {
        TOKEN: this.token,
        CHANNEL: AppSettings.channelCode,
        CHANNELSECURITYCODE: AppSettings.channelSecurityCode
      },
      data
    };
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'x-auth, content-type',
      'Access-Control-Allow-Methods': 'POST'
    });
    return this.httpClient.post(AppSettings.baseURL, payload, {headers}).pipe(map(res => JSON.parse(JSON.stringify(res))));
  }

  baseApiPostServiceCall(data) {
    const payload = {
      header: {
        userId: this.userId,
        token: this.token,
        channelCode: AppSettings.channelCode,
        channelSecurityCode: AppSettings.channelSecurityCode
      },
      data
    };
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'x-auth, content-type',
      'Access-Control-Allow-Methods': 'POST'
    });
    return this.httpClient.post(`${AppSettings.baseAPI}`, payload, {headers}).pipe(map(res => JSON.parse(JSON.stringify(res))));
   
  }

 

  helperApiCall(data, path) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'x-auth, content-type',
      'Access-Control-Allow-Methods': 'POST'
    });
    return this.httpClient.post(`${AppSettings.apiUrl}${path}`, data, {headers}).pipe(map(res => JSON.parse(JSON.stringify(res))));
  }
}

