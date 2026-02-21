import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab2Page implements ViewDidEnter {

  measurements: MeasurementRecord[] = [];
  searchTerm: string = '';

  constructor(
    private storage: StorageService,
    private router: Router
  ) {
    addIcons({ timeOutline, manOutline, womanOutline, chevronForward, trashOutline, searchOutline, personOutline });
  }

  ionViewDidEnter() {
    this.refresh();
  }

  get filteredMeasurements() {
    if (!this.searchTerm.trim()) return this.measurements;
    
    const term = this.searchTerm.toLowerCase();
    return this.measurements.filter(m => {
      const name = (m.userProfile?.name || '').toLowerCase();
      const phone = (m.userProfile?.phone || '').toLowerCase();
      const id = m.id.toLowerCase();
      return name.includes(term) || phone.includes(term) || id.includes(term);
    });
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
