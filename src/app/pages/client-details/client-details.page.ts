import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  arrowBack, 
  personOutline, 
  calendarOutline, 
  accessibilityOutline, 
  downloadOutline, 
  callOutline, 
  shareOutline,
  copyOutline,
  manOutline,
  womanOutline
} from 'ionicons/icons';
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

  constructor(
    private router: Router,
    private toastCtrl: ToastController
  ) { 
    addIcons({ 
      arrowBack, 
      personOutline, 
      calendarOutline, 
      accessibilityOutline, 
      downloadOutline, 
      callOutline, 
      shareOutline,
      copyOutline,
      manOutline,
      womanOutline
    });
    
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.client = navigation.extras.state['data'];
      this.prepareMeasurements();
    }
  }

  ngOnInit() {
    if (!this.client) {
      this.router.navigate(['/tabs/tab2']);
    }
  }

  prepareMeasurements() {
    if (this.client && this.client.measurements) {
      this.measurementsList = Object.entries(this.client.measurements)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => {
          const valueInCm = Math.round(((value as number) / 10) * 10) / 10;
          return {
            key: key,
            value: valueInCm,
            label: this.formatLabel(key)
          };
        });
    }
  }

  formatLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  async share() {
    if (!this.client) return;

    const name = this.client.userProfile?.name || 'Client';
    const date = new Date(this.client.date).toLocaleDateString();
    let text = `Mesures de ${name} (${date}):\n\n`;
    
    this.measurementsList.forEach(m => {
      text += `- ${m.label}: ${m.value} cm\n`;
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mesures - ${name}`,
          text: text,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(text);
      const toast = await this.toastCtrl.create({
        message: 'Mesures copiées dans le presse-papier',
        duration: 2000,
        position: 'bottom',
        color: 'dark'
      });
      await toast.present();
    }
  }

  goBack() {
    this.router.navigate(['/tabs/tab2']);
  }
}
