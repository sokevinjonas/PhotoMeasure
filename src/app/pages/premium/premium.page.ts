import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController, ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { addIcons } from 'ionicons';
import { diamond, banOutline, cloudDownloadOutline, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.page.html',
  styleUrls: ['./premium.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PremiumPage implements OnInit {

  isLoading = false;

  constructor(
    private navController: NavController,
    private storage: StorageService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { 
    addIcons({ diamond, banOutline, cloudDownloadOutline, heartOutline });
  }

  ngOnInit() {
  }

  async buyPremium() {
    this.isLoading = true;

    // Simulate Payment Process
    setTimeout(async () => {
      this.isLoading = false;
      this.storage.setPremium(true);
      
      const toast = await this.toastCtrl.create({
        message: 'Félicitations ! Vous êtes maintenant Premium.',
        duration: 3000,
        position: 'top',
        color: 'success',
        icon: 'checkmark-circle'
      });
      toast.present();

      this.navController.pop(); // Go back to settings
    }, 2000);
  }

  async restorePurchases() {
    this.isLoading = true;
    setTimeout(async () => {
      this.isLoading = false;
      // Mock logic: check if "previously bought"
      // For now just say "No purchases found" or restore if we want to mock that too
      const alert = await this.alertCtrl.create({
        header: 'Restauration',
        message: 'Aucun achat trouvé pour ce compte (Simulation).',
        buttons: ['OK']
      });
      await alert.present();
    }, 1500);
  }

}
