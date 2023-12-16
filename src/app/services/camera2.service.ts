import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, FilesystemDirectory} from '@capacitor/filesystem'

/**
 * Try simplied ver for camera.
 * Simply converts image to base64 string and
 * saves to database, then converets back to image for 
 * display
 */


@Injectable({
  providedIn: 'root'
})

export class Camera2Service {

  constructor() { }

  async takePhoto(): Promise<string> {
    // Take a photo using device camera

    console.log("Camera2Service- takePhoto called.")

    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt, // Prompt for new photo or gallery 
        quality: 100
      });

      // Cpacitor retinrs a webPath virtual path so we can display photo just taken
      return capturedPhoto.webPath ?? "Error No Photo path Found"; // return phone path of Photo or if not found rtn message
    } catch (error) {
      console.log("CameraService: error returning photo: ", error);
      throw error; // Re-throw the error so that the calling code can handle it if needed
    }
  }
async convertImageToBase64String(webPath : string ) : Promise<string>{
  // Convert a image file URI to base 64 for storing in DB
  console.log("CameraService2: convert image (taken form webPath virtual path, ) in phone to base 64.")
  
  try {
    // convert webPath to file path
    const fileUri = Capacitor.convertFileSrc(webPath);
    const file = await Filesystem.readFile({
    
      path: fileUri,
      directory: FilesystemDirectory.Data
    });

    return 'data:image/jpeg;base64,' + file.data;
} catch (error) {
  console.error("Error converting image to base64: ", error);
  throw error;
}
}

convertbase64ToImage(base64String : string) : HTMLImageElement {
  // Convert the base64 Image from the database and reurn as image for rendering

const img = new Image();
img.src = base64String;
return img;
}

}



