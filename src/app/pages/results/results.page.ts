import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { EstimationResponse, FeedbackRequest, Measurements } from 'src/app/models/photo-measure.model';
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
    this.measurementsList = Object.entries(this.result.measurements).map(([key, value]) => ({
      key,
      value,
      original: value
    }));
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
        corrections[m.key] = m.value;
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

    // Even if no corrections, maybe we want to validate? 
    // The prompt implied only sending corrections.
    // If no corrections, we can still send "validation" by sending empty corrections ??
    // Or just "Perfect"?
    // For now let's send what we have.

    this.apiService.sendFeedback(feedback).subscribe({
      next: () => {
        alert('Merci pour votre retour !');
        this.router.navigate(['/tabs/tab1']);
      },
      error: (e) => {
        console.error(e);
        alert('Erreur lors de l\'envoi du feedback.');
      }
    });
  }

}
