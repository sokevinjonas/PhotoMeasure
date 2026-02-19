export type Gender = 'male' | 'female' | 'neutral';

export interface UserProfile {
  name: string;
  phone?: string;
  age?: number;
  weight?: number; // in kg
  gender: Gender;
  height?: number; // in meters
}

export interface EstimationRequest {
  photos: File[]; // Array of image files
  gender: Gender;
  height: number;
  measures_table?: string[]; // Optional specific measures
  include_mesh?: boolean;
}

export interface Measurements {
  [key: string]: number;
}

export interface EstimationResponse {
  prediction_id: string;
  measurements: Measurements;
  mesh_url?: string;
  metadata: {
    num_views: number;
    mode: string;
    validation_errors: any[];
  };
}

export interface FeedbackRequest {
  prediction_id: string;
  corrected_measurements: Measurements; // Only changed values
  user_profile?: {
    weight?: number;
    age?: number;
  };
}

export interface MeasurementRecord {
  id: string;
  date: string; // ISO string
  measurements: Measurements;
  mesh_url?: string;
  userProfile?: UserProfile;
  synced: boolean; // True if feedback sent
}
