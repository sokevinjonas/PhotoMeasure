import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PhotoService } from 'src/app/services/photo.service';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { finalize } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { manOutline, womanOutline, arrowForward, arrowBack, bodyOutline, accessibilityOutline, addCircle, lockClosedOutline, checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import { camera } from 'ionicons/icons';

@Component({
  selector: 'app-measure-wizard',
  templateUrl: './measure-wizard.page.html',
  styleUrls: ['./measure-wizard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MeasureWizardPage implements OnInit {

  currentStep = 1;

  // Step 1: Client Info
  gender: 'male' | 'female' | 'neutral' = 'male';
  height: number | undefined;
  
  // Step 2: Measurement Selection
  readonly availableMeasures = [
    "Dos", "Epaule", "Poitrine", "Long Manche", "Tour de Manche", 
    "Long Taille", "Tour Taille", "Pinces", "Long Camisole", "Long Robe", 
    "Long Chemise", "Ceinture", "Bassin", "Cuisse", "Genou", 
    "Long jupe", "Long Pantalon", "Bas", "Poignet", "Tour Emanchure"
  ];
  
  selectedMeasures: string[] = [...this.availableMeasures]; // Default select all

  // Step 3: Photos
  frontPhoto: Photo | undefined;
  sidePhoto: Photo | undefined;
  frontPhotoWebPath: string | undefined;
  sidePhotoWebPath: string | undefined;

  isLoading = false;

  constructor(
    private photoService: PhotoService,
    private apiService: ApiService,
    private storage: StorageService,
    private router: Router
  ) { 
    addIcons({ 
      manOutline, womanOutline, arrowForward, arrowBack, 
      bodyOutline, accessibilityOutline, addCircle,
      lockClosedOutline, checkmarkCircle, ellipseOutline
    });
  }

  ngOnInit() {}

  nextStep() {
    if (this.currentStep === 1) {
      if (this.height && this.gender) {
        this.currentStep++;
      } else {
        alert('Veuillez renseigner la taille et le sexe.');
      }
    } else if (this.currentStep === 2) {
      if (this.selectedMeasures.length > 0) {
        this.currentStep++;
      } else {
        alert('Veuillez sélectionner au moins une mesure.');
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['/tabs/tab1']);
    }
  }

  toggleMeasure(measure: string) {
    if (this.selectedMeasures.includes(measure)) {
      this.selectedMeasures = this.selectedMeasures.filter(m => m !== measure);
    } else {
      this.selectedMeasures.push(measure);
    }
  }

  toggleAll(event: any) {
    if (event.detail.checked) {
      this.selectedMeasures = [...this.availableMeasures];
    } else {
      this.selectedMeasures = [];
    }
  }

  async takePhoto(type: 'front' | 'side') {
    try {
      const photo = await this.photoService.addNewToGallery();
      if (type === 'front') {
        this.frontPhoto = photo;
        this.frontPhotoWebPath = photo.webPath;
      } else {
        this.sidePhoto = photo;
        this.sidePhotoWebPath = photo.webPath;
      }
    } catch (e) {
      console.error('Error taking photo', e);
    }
  }

  async startEstimation() {
    if (!this.frontPhoto || !this.sidePhoto || !this.height) return;

    this.isLoading = true;
    
    try {
      const frontFile = await this.photoService.getFileFromPhoto(this.frontPhoto);
      const sideFile = await this.photoService.getFileFromPhoto(this.sidePhoto);

      this.apiService.estimate(
        frontFile, 
        sideFile, 
        this.height, 
        this.gender, 
        this.selectedMeasures, // Pass selection
        true 
      ).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (response) => {
          const resultData = {
            ...response,
            userProfile: { 
              gender: this.gender,
              height: this.height
            }
          };
          this.router.navigate(['/results'], { state: { data: resultData } });
        },
        error: (err) => {
          console.error('Estimation error', err);
          alert('Erreur: ' + (err.error?.error || 'Une erreur est survenue lors de l\'estimation.'));
        }
      });
    } catch (e) {
      this.isLoading = false;
      console.error(e);
      alert('Erreur lors de la préparation des fichiers.');
    }
  }

}
