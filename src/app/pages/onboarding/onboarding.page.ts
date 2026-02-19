import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { UserProfile } from '../../models/photo-measure.model';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OnboardingPage implements OnInit {

  profile: UserProfile = {
    gender: 'male',
    age: undefined,
    weight: undefined
  };

  constructor(
    private router: Router,
    private storage: StorageService
  ) { }

  ngOnInit() {
  }

  startApp() {
    if (this.profile.age && this.profile.weight && this.profile.gender) {
      this.storage.saveUserProfile(this.profile);
      this.router.navigate(['/tabs']);
    } else {
      alert('Veuillez remplir toutes les informations pour continuer.');
    }
  }

}
