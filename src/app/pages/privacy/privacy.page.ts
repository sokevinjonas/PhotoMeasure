import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { shieldCheckmark, imagesOutline, lockClosedOutline, serverOutline, informationCircle } from 'ionicons/icons';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PrivacyPage implements OnInit {

  constructor() { 
    addIcons({ shieldCheckmark, imagesOutline, lockClosedOutline, serverOutline, informationCircle });
  }

  ngOnInit() {
  }

}
