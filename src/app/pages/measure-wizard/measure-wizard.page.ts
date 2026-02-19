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

@Component({
  selector: 'app-measure-wizard',
  templateUrl: './measure-wizard.page.html',
  styleUrls: ['./measure-wizard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MeasureWizardPage implements OnInit {

  currentStep = 1;
  height: number | undefined;
  
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
  ) { }

  ngOnInit() {
    // Pre-fill height if available in profile
    const profile = this.storage.getUserProfile();
    if (profile && profile.weight) {
      // Logic for height if saved? We didn't save height in onboarding, only age/weight/gender
      // But if we did...
    }
  }

  nextStep() {
    if (this.currentStep === 1 && this.height) {
      this.currentStep++;
    }
  }

  async takePhoto(type: 'front' | 'side') {
    try {
      const photo = await this.photoService.addNewToGallery();
      if (type === 'front') {
        this.frontPhoto = photo;
        this.frontPhotoWebPath = photo.webPath; // For preview
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
    const profile = this.storage.getUserProfile();
    
    // Convert photos to Files
    const frontFile = await this.photoService.getFileFromPhoto(this.frontPhoto);
    const sideFile = await this.photoService.getFileFromPhoto(this.sidePhoto);

    this.apiService.estimate(
      frontFile, 
      sideFile, 
      this.height, 
      profile.gender || 'male', // Default to male if missing
      true // Include mesh
    ).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        // Navigate to results page with data
        // For now, let's just log it or pass it via state
        console.log('Estimation result:', response);
        // We need a results page. Passing data via state or service is best.
        // Let's use router state for simplicity in V1
        this.router.navigate(['/results'], { state: { data: response } });
      },
      error: (err) => {
        console.error('Estimation error', err);
        alert('Erreur lors de l\'estimation. Veuillez réessayer.');
      }
    });

  }

}
