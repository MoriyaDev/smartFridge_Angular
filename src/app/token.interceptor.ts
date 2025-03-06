import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './service/auth.service';
import { inject } from '@angular/core';


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
export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  const isRequestAuthorized = authService.isAuthenticated$.getValue() && request.url.startsWith("https://localhost:7194/");
  const session = localStorage.getItem('appSession');
  const token = session ? JSON.parse(session).token : null;

  console.log("🔹 טוקן מתוך ה-Interceptor:", token); // הדפסת הטוקן ב-Console

  if (isRequestAuthorized && token) {
    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ בקשה עם טוקן:", clonedRequest.headers.get('Authorization')); // לבדוק אם נשלח נכון

    return next(clonedRequest);
  }

  console.warn("⚠️ בקשה נשלחת **ללא** טוקן");
  return next(request);
};
