import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { notificationsOutline, scanCircle, scanOutline, camera, chevronForward } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab1Page {
  constructor(private router: Router) {
    addIcons({ notificationsOutline, scanCircle, scanOutline, camera, chevronForward });
  }

  startNewMeasurement() {
    this.router.navigate(['/measure-wizard']);
  }
}
