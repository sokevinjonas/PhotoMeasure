import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ViewDidEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, personOutline, chevronForward } from 'ionicons/icons';
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

  lastMeasurement: MeasurementRecord | null = null;
  totalStats = 0;

  constructor(
    private router: Router,
    private storage: StorageService
  ) {
    addIcons({ cameraOutline, personOutline, chevronForward });
  }

  ionViewDidEnter() {
    this.lastMeasurement = this.storage.getLastMeasurement();
    this.totalStats = this.storage.getMeasurements().length;
  }

  goToDetails(measurement: MeasurementRecord) {
    // Navigate to results page with state
    this.router.navigate(['/results'], { 
      state: { 
        data: {
          prediction_id: measurement.id,
          measurements: measurement.measurements,
          mesh_url: measurement.mesh_url,
          metadata: { mode: 'history' } // Flag to know it's from history
        }
      } 
    });
  }

  startNewMeasurement() {
    this.router.navigate(['/measure-wizard']);
  }
}
