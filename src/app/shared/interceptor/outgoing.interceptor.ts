import { Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncryptionService } from '../services/encryption.service';

@Injectable()
export class OutgoingInterceptor implements HttpInterceptor {

  constructor(private securityService: EncryptionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // request = request.clone({
    //   body: {request: this.securityService.encryptString(request.body)}
    // });
    // console.log(this.securityService.encryptString(request.body));
    return next.handle(request);
  }
}
