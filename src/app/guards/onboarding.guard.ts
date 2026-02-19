import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanActivate {

  constructor(private storage: StorageService, private router: Router) {}

  canActivate(): boolean {
    const profile = this.storage.getUserProfile();
    if (profile) {
      return true;
    } else {
      this.router.navigate(['/onboarding']);
      return false;
    }
  }
}
