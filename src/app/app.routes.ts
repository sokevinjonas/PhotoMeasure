import { Routes } from '@angular/router';
import { OnboardingGuard } from './guards/onboarding.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [OnboardingGuard]
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.page').then( m => m.OnboardingPage)
  },
  {
    path: 'measure-wizard',
    loadComponent: () => import('./pages/measure-wizard/measure-wizard.page').then( m => m.MeasureWizardPage)
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results.page').then( m => m.ResultsPage)
  },
  {
    path: 'client-details',
    loadComponent: () => import('./pages/client-details/client-details.page').then( m => m.ClientDetailsPage)
  },
  {
    path: 'premium',
    loadComponent: () => import('./pages/premium/premium.page').then( m => m.PremiumPage)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.page').then( m => m.PrivacyPage)
  },
];
