import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  public async addNewToGallery(): Promise<Photo> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90
    });

    return capturedPhoto;
  }

  public async pickFromGallery(): Promise<Photo> {
    const pickedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 90
    });

    return pickedPhoto;
  }
  
  // Helper to convert blob to file if needed for upload
  public async getFileFromPhoto(photo: Photo): Promise<File> {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      return new File([blob], `photo_${new Date().getTime()}.jpeg`, { type: 'image/jpeg' });
  }
}
