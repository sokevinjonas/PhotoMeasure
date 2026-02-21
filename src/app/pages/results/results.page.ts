import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { EstimationResponse, FeedbackRequest, Measurements, MeasurementRecord } from 'src/app/models/photo-measure.model';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { ThreeService } from 'src/app/services/three.service';
import { addIcons } from 'ionicons';
import { 
  cubeOutline, alertCircleOutline, informationCircleOutline, 
  checkmarkDoneOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ResultsPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: false }) rendererCanvas!: ElementRef<HTMLCanvasElement>;

  result: EstimationResponse | undefined;
  originalMeasurements: Measurements | undefined;
  
  // Flattened for easy editing in template
  measurementsList: { key: string, value: number, original: number }[] = [];

  userProfile: any; // To store the passed context

  constructor(
    private router: Router,
    private apiService: ApiService,
    private storage: StorageService,
    private threeService: ThreeService
  ) { 
    addIcons({ 
      cubeOutline, alertCircleOutline, informationCircleOutline, 
      checkmarkDoneOutline 
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const data = navigation.extras.state['data'];
      this.result = data; // This now has extra properties mixed in, but that's fine for runtime
      this.userProfile = data.userProfile; // Extract the profile context

      if(this.result) {
        this.originalMeasurements = { ...this.result.measurements }; 
        this.initializeList();
      }
    }
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if (this.result?.mesh_url && this.rendererCanvas) {
      console.log('Initializing 3D view with canvas:', this.rendererCanvas.nativeElement);
      // Initialize ThreeJS
      this.threeService.initialize(this.rendererCanvas.nativeElement);
      
      // Construct full URL
      const meshUrl = this.result.mesh_url.startsWith('http') 
        ? this.result.mesh_url 
        : `http://localhost:5000${this.result.mesh_url}`; 

      this.threeService.loadMesh(meshUrl);
    } else {
      console.warn('Cannot init 3D: Missing result or canvas');
    }
  }

  ngAfterViewInit() {
    // Moved to ionViewDidEnter
  }

  ngOnDestroy() {
    // Optional cleanup if ThreeService needs it
  }

  initializeList() {
    if (!this.result) return;
    
    // The backend returns measurements in mm. 
    // We convert to cm for the UI and filter out zero values.
    this.measurementsList = Object.entries(this.result.measurements)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => {
        const valueInCm = Math.round((value / 10) * 10) / 10; // Round to 1 decimal
        return {
          key,
          value: valueInCm,
          original: valueInCm
        };
      });
  }

  hasChanges(): boolean {
    return this.measurementsList.some(m => m.value !== m.original);
  }

  sendFeedback() {
    if (!this.result) return;
    
    // Create corrections object
    const corrections: Measurements = {};
    let hasCorrections = false;

    this.measurementsList.forEach(m => {
      if (m.value !== m.original) {
        // Convert back to mm for backend
        corrections[m.key] = m.value * 10;
        hasCorrections = true;
      }
    });

    const profile = this.storage.getUserProfile();
    const feedback: FeedbackRequest = {
      prediction_id: this.result.prediction_id,
      corrected_measurements: corrections,
      user_profile: {
        weight: profile?.weight,
        age: profile?.age
      }
    };

    // Save to local storage
    const record: MeasurementRecord = {
      id: this.result.prediction_id,
      date: new Date().toISOString(),
      measurements: {}, // Will be filled below
      mesh_url: this.result.mesh_url,
      userProfile: this.userProfile,
      synced: true 
    };

    // Reconstruct full measurements object from list (stored in mm)
    const finalMeasurements: Measurements = {};
    this.measurementsList.forEach(m => finalMeasurements[m.key] = m.value * 10);
    record.measurements = finalMeasurements;

    this.storage.saveMeasurement(record);

    this.apiService.sendFeedback(feedback).subscribe({
      next: () => {
        alert('Mesures enregistrées !');
        this.router.navigate(['/tabs/tab1']);
      },
      error: (e) => {
        console.error(e);
        // Even if API fails, we saved locally.
        alert('Sauvegardé localement (Erreur envoi feedback serveur).');
        this.router.navigate(['/tabs/tab1']);
      }
    });
  }

}
