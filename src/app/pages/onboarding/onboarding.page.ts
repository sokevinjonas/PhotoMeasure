import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { register } from 'swiper/element/bundle';

register(); // Register Swiper custom elements

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule]
})
export class OnboardingPage implements OnInit {

  constructor(
    private router: Router,
    private storage: StorageService
  ) { }

  ngOnInit() {
  }

  completeOnboarding() {
    // Mark tutorial as seen
    this.storage.saveUserProfile({ tutorialSeen: true });
    
    this.router.navigate(['/tabs']);
  }

}
