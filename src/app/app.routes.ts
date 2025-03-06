// app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProjectOverviewComponent } from './pages/project-overview/project-overview.component';
import { AuthGuard } from '../app/pages/auth.guard'; // וודא שהנתיב מתאים למיקום הקובץ

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'project', component: ProjectOverviewComponent },

  // טעינה עצלה עם Guard למשתמשים מחוברים בלבד
  { 
    path: 'notes',
    canActivate: [AuthGuard], // הגנה ברמת המודול
    loadChildren: () => import('../app/components/note/note.routes').then(m => m.NOTE_ROUTES)
  },

  { 
    path: 'pro',
    canActivate: [AuthGuard], // הגנה ברמת המודול
    loadChildren: () => import('../app/components/product/product.routes').then(m => m.PRODUCT_ROUTES)
  },

  { 
    path: 'rec',
    canActivate: [AuthGuard], // הגנה ברמת המודול
    loadChildren: () => import('../app/components/recipe/recipe.routes').then(m => m.RECIPE_ROUTES)
  },

  { 
    path: 'fridge',
    loadChildren: () => import('../app/components/fridge/fridge.routes').then(m => m.FRIDGE_ROUTES)
  },

  { path: '**', redirectTo: 'home' }
];