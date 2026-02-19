import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly KEY_USER_PROFILE = 'photo_measure_user_profile';

  constructor() { }

  saveUserProfile(profile: any): void {
    localStorage.setItem(this.KEY_USER_PROFILE, JSON.stringify(profile));
  }

  getUserProfile(): any {
    const data = localStorage.getItem(this.KEY_USER_PROFILE);
    return data ? JSON.parse(data) : null;
  }

  clearUserProfile(): void {
    localStorage.removeItem(this.KEY_USER_PROFILE);
  }
}
