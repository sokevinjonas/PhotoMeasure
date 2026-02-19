import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack, personOutline, calendarOutline, accessibilityOutline, downloadOutline, callOutline } from 'ionicons/icons';
import { MeasurementRecord } from '../../models/photo-measure.model';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.page.html',
  styleUrls: ['./client-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ClientDetailsPage implements OnInit {

  client: MeasurementRecord | null = null;
  measurementsList: {key: string, value: number, label: string}[] = [];

  constructor(private router: Router) { 
    addIcons({ arrowBack, personOutline, calendarOutline, accessibilityOutline, downloadOutline, callOutline });
    
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.client = navigation.extras.state['data'];
      this.prepareMeasurements();
    }
  }

  ngOnInit() {
    if (!this.client) {
      // Fallback if accessed directly or reload (optional: redirect back)
      this.router.navigate(['/tabs/tab2']);
    }
  }

  prepareMeasurements() {
    if (this.client && this.client.measurements) {
      this.measurementsList = Object.entries(this.client.measurements).map(([key, value]) => ({
        key: key,
        value: value as number, // simplistic casting
        // Create a pretty label (e.g. "chest_circumference" -> "Chest Circumference")
        label: this.formatLabel(key)
      }));
    }
  }

  formatLabel(key: string): string {
    // Basic formatting: replace underscores with spaces and capitalize
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  goBack() {
    this.router.navigate(['/tabs/tab2']);
  }
}
