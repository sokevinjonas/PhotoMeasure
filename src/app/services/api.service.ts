import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstimationResponse, FeedbackRequest, Gender } from '../models/photo-measure.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // TODO: Move this to environment.ts later
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  /**
   * Sends photos and user details to get body measurements.
   * @param frontPhoto File object for front view
   * @param sidePhoto File object for side view
   * @param height User height in meters
   * @param gender User gender
   * @param measures List of measurement names
   * @param includeMesh Whether to request the 3D mesh
   * @param includeVisualPaths Whether to request 3D visual paths for measurements
   */
  estimate(
    frontPhoto: File, 
    sidePhoto: File, 
    height: number, 
    gender: Gender, 
    measures: string[], 
    includeMesh: boolean = true,
    includeVisualPaths: boolean = false
  ): Observable<EstimationResponse> {
    const formData = new FormData();
    formData.append('photos', frontPhoto);
    formData.append('photos', sidePhoto);
    formData.append('height', height.toString());
    formData.append('gender', gender);
    formData.append('include_mesh', includeMesh.toString());
    formData.append('include_visual_paths', includeVisualPaths.toString());
    
    // API expects a comma-separated string for measures_table
    formData.append('measures_table', measures.join(','));

    return this.http.post<EstimationResponse>(`${this.apiUrl}/estimate`, formData);
  }

  /**
   * Sends user corrections back to the server for training.
   * @param feedback The feedback data object
   */
  sendFeedback(feedback: FeedbackRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/feedback`, feedback, { headers });
  }
}
