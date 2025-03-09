import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './service/auth.service';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  if (request.url.startsWith("https://localhost:7194/")) {
    let token = null;
    
    if (isBrowser) {
      const session = localStorage.getItem('appSession');
      token = session ? JSON.parse(session).token : null;
    }

    if (token) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ בקשה עם טוקן:", clonedRequest.headers.get('Authorization'));
      return next(clonedRequest);
    }
    
    console.warn("⚠️ בקשה לשרת המקומי נשלחת ללא טוקן");
  }

  return next(request);
};