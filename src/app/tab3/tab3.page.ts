import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  star, globeOutline, moonOutline, cloudDownloadOutline, 
  trashOutline, informationCircleOutline, shieldCheckmarkOutline, 
  logOutOutline, diamondOutline, lockClosedOutline,
  chevronForward, checkmarkCircle, imagesOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class Tab3Page {

  isPremium = false;
  selectedLanguage = 'fr';
  darkMode = false; // Mock for now

  readonly languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'ar', name: 'العربية (Arabic)' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'de', name: 'Deutsch' }
  ];

  constructor(
    private storage: StorageService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    addIcons({ 
      star, globeOutline, moonOutline, cloudDownloadOutline, 
      trashOutline, informationCircleOutline, shieldCheckmarkOutline, 
      logOutOutline, diamondOutline, lockClosedOutline,
      chevronForward, checkmarkCircle, imagesOutline
    });
  }

  ionViewWillEnter() {
    this.isPremium = this.storage.isPremium();
    this.darkMode = this.storage.isDarkMode();
    this.updateTheme();
  }

  toggleDarkMode() {
    this.storage.setDarkMode(this.darkMode);
    this.updateTheme();
  }

  private updateTheme() {
    document.body.classList.toggle('dark', this.darkMode);
  }

  getLanguageName(code: string): string {
    return this.languages.find(l => l.code === code)?.name || code;
  }

  selectLanguage(code: string) {
    this.selectedLanguage = code;
    this.modalCtrl.dismiss();
    // Here we would implement real translation switch
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  buyPremium() {
    if (this.isPremium) return;
    this.router.navigate(['/premium']);
  }


  async exportData() {
    if (!this.isPremium) {
      await this.showPremiumLockAlert('L\'export des données est réservé aux membres Premium.');
      return;
    }

    // Mock Export
    this.showAlert('Export', 'Vos données ont été exportées (Simulation).');
  }

  async clearHistory() {
    const alert = await this.alertCtrl.create({
      header: 'Attention',
      message: 'Voulez-vous vraiment supprimer tout l\'historique des mesures ? Cette action est irréversible.',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { 
          text: 'Supprimer', 
          role: 'destructive',
          handler: () => {
            // In a real app we'd call storage.clearAllMeasurements() (needs impl)
            // For now just simulate
            this.showAlert('Nettoyage', 'Historique supprimé.');
          }
        }
      ]
    });
    await alert.present();
  }

  async showPremiumLockAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Fonctionnalité Verrouillée',
      message: message,
      buttons: [
        { text: 'Plus tard', role: 'cancel' },
        { 
          text: 'Voir l\'offre Premium', 
          handler: () => this.buyPremium() 
        }
      ]
    });
    await alert.present();
  }

  // openPrivacyPolicy is now handled via modal trigger in HTML

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
