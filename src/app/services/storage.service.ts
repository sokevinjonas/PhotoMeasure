import { Injectable } from '@angular/core';
import { MeasurementRecord } from '../models/photo-measure.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly KEY_USER_PROFILE = 'photo_measure_user_profile';
  private readonly KEY_MEASUREMENTS = 'photo_measure_history';
  private readonly KEY_IS_PREMIUM = 'photo_measure_is_premium';

  constructor() { }

  // --- Premium Status ---

  isPremium(): boolean {
    return localStorage.getItem(this.KEY_IS_PREMIUM) === 'true';
  }

  setPremium(status: boolean): void {
    localStorage.setItem(this.KEY_IS_PREMIUM, String(status));
  }

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

  // --- Measurement History ---

  getMeasurements(): MeasurementRecord[] {
    const data = localStorage.getItem(this.KEY_MEASUREMENTS);
    return data ? JSON.parse(data) : [];
  }

  saveMeasurement(record: MeasurementRecord): void {
    const history = this.getMeasurements();
    // Check if exists to update, or add new
    const index = history.findIndex(m => m.id === record.id);
    if (index >= 0) {
      history[index] = record;
    } else {
      history.unshift(record); // Add to beginning
    }
    localStorage.setItem(this.KEY_MEASUREMENTS, JSON.stringify(history));
  }

  deleteMeasurement(id: string): void {
    let history = this.getMeasurements();
    history = history.filter(m => m.id !== id);
    localStorage.setItem(this.KEY_MEASUREMENTS, JSON.stringify(history));
  }

  getLastMeasurement(): MeasurementRecord | null {
    const history = this.getMeasurements();
    return history.length > 0 ? history[0] : null;
  }
}
