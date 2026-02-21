import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ViewDidEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, trendingUpOutline, peopleOutline, timeOutline, chevronForwardOutline } from 'ionicons/icons';
import { StorageService } from '../services/storage.service';
import { MeasurementRecord } from '../models/photo-measure.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab1Page implements ViewDidEnter {

  totalScans = 0;
  scansThisMonth = 0;
  lastScan: MeasurementRecord | null = null;

  constructor(
    private router: Router,
    private storage: StorageService
  ) {
    addIcons({ 
      cameraOutline, 
      trendingUpOutline, 
      peopleOutline, 
      timeOutline, 
      chevronForwardOutline 
    });
  }

  ionViewDidEnter() {
    this.loadStats();
  }

  loadStats() {
    const measurements = this.storage.getMeasurements();
    this.totalScans = measurements.length;
    this.lastScan = this.storage.getLastMeasurement();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    this.scansThisMonth = measurements.filter(m => {
      const d = new Date(m.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
  }

  startNewMeasurement() {
    this.router.navigate(['/measure-wizard']);
  }

  viewLastScan() {
    if (this.lastScan) {
      this.router.navigate(['/client-details'], { 
        state: { 
          data: this.lastScan 
        } 
      });
    }
  }
}
