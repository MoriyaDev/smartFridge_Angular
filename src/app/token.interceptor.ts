import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './service/auth.service';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


// export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
//   const authService = inject(AuthService);

//   const isRequestAuthorized = authService.isAuthenticated && request.url.startsWith("https://localhost:7194/");

//   if (isRequestAuthorized) {    
//     const clonedRequest = request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${'JWT TOKEN'}`,
//       },
//     });

//     return next(clonedRequest);
//   }

//   return next(request);

// };
// export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
//   const authService = inject(AuthService);

//   const isRequestAuthorized = authService.isAuthenticated$.getValue() && request.url.startsWith("https://localhost:7194/");

//   if (isRequestAuthorized) {    
//     const session = localStorage.getItem('appSession');
//     const token = session ? JSON.parse(session).token : null;

//     if (token) {
//       const clonedRequest = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       return next(clonedRequest);
//     }
//   }

//   return next(request);
// };
// 2. עכשיו נתקן את ה-Interceptor

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // בדיקה אם הבקשה צריכה להיות מאומתת (לשרת המקומי)
  if (request.url.startsWith("https://localhost:7194/")) {
    let token = null;
    
    // מנסים לקבל את הטוקן רק אם אנחנו בדפדפן
    if (isBrowser) {
      const session = localStorage.getItem('appSession');
      token = session ? JSON.parse(session).token : null;
    }

    // אם יש טוקן, נוסיף אותו לראש הבקשה
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

  // אם לא צריך אימות או אין טוקן, שולחים את הבקשה המקורית
  return next(request);
};