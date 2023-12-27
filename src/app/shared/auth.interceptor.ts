import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    const token = this.authService.token;
    if (!token) {
      return next.handle(request)
    }
//Two methods for setting authorization
    const authRequest = request.clone({ headers: request.headers.set("authorization", token) })
    // const authRequest = request.clone({ setHeaders:{
    //   "Content-Type":"application/json",
    //   Authorization:"Bearer " +token
    // }
    //  })

    return next.handle(authRequest);

  }
}
