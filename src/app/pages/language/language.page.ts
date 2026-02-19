import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { addIcons } from 'ionicons';
import { globeOutline, checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LanguagePage implements OnInit {

  selectedLanguage = 'fr';
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
    private navCtrl: NavController
  ) {
    addIcons({ globeOutline, checkmarkCircle });
  }

  ngOnInit() {
    // We should ideally have a getLanguage method in storage
    this.selectedLanguage = localStorage.getItem('photo_measure_language') || 'fr';
  }

  selectLanguage(code: string) {
    this.selectedLanguage = code;
    localStorage.setItem('photo_measure_language', code);
    // In a real app, this would trigger the translation service update
    setTimeout(() => {
      this.navCtrl.back();
    }, 300);
  }

}
