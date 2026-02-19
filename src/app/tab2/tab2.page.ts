import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ViewDidEnter } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { MeasurementRecord } from '../models/photo-measure.model';
import { addIcons } from 'ionicons';
import { timeOutline, manOutline, womanOutline, chevronForward, trashOutline, searchOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Tab2Page implements ViewDidEnter {

  measurements: MeasurementRecord[] = [];

  constructor(
    private storage: StorageService,
    private router: Router
  ) {
    addIcons({ timeOutline, manOutline, womanOutline, chevronForward, trashOutline, searchOutline, personOutline });
  }

  ionViewDidEnter() {
    this.refresh();
  }

  refresh() {
    this.measurements = this.storage.getMeasurements();
  }

  delete(id: string) {
    this.storage.deleteMeasurement(id);
    this.refresh();
  }

  goToDetails(measurement: MeasurementRecord) {
    this.router.navigate(['/client-details'], { 
      state: { 
        data: measurement
      } 
    });
  }

}
