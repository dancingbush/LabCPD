import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import { Filesystem, Directory} from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences'; 
import { CertifcatePhoto } from './interfaces';
import { __await } from 'tslib';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})

// Interface to display photo once taken

export class CameraService {
  /**
   * Tutoiral https://ionicframework.com/docs/angular/your-first-app/taking-photos
   * Service that handles taking photos and file sytsyem storage
   * We deine a array of photos using Interafce from interfaces file
   */

  public photos : CertifcatePhoto[] = [];
  private PHOTO_STORAGE : string = 'photos'; // Key for stroing photos
  private platform : Platform;


  constructor(platform : Platform) {
    // get the modile / web platfomr app is running on
    console.log("Camera service constructor: platform = ",  platform);
    this.platform = platform;
   }

   /**
    * Use these method for this app only
    * All other are fomr ionic demo
    */

   /** COMMENT ALL OUT AS THIS IS CHAT GP  */
    
  //  public async capturePhotoAndGetBase64() : Promise<string> {
  //   /**
  //    * Takes aphoto by device and returns the 
  //    * base 64 string repreentaion
  //    */

  //   const capturePhoto = await Camera.getPhoto({
  //     // .getPhoto apllies to Web / iOS/ android
  //     resultType: CameraResultType.DataUrl, // Use DataUrl to get base64 rep
  //     source: CameraSource.Camera,
  //     quality: 100
  //   })

  //   // capturePhoto.webviewPath holds the url to the path on teh photo just taken
    
  //   // Use optional chaining operator and nullish coalescing operator to handle undefined
  // return capturePhoto?.dataUrl ?? '';

  //  }
  //  public async cconvertbase64ToImage(dataUrl: string) : Promise<HTMLImageElement>{
  //   /**
  //    * Converts a base62 string to an FULL image and retuns
  //    * it as an HTMLImageElemnt
  //    * See separte method for retruning saller thumbnails
  //    */

  //   return new Promise((resolve, reject)=>{
  //     const image = new Image();
  //     image.onload = () => {
  //       resolve(image);
  //     };
  //     image.onerror = reject;
  //     image.src = dataUrl;
  //   });
  //  }

   /* TO USE IN DISPLAY IMAGE CLASS
   export class YourComponent {
    imageData: string | null = null;
  
    constructor(private cameraService: CameraService) {}
  
    loadAndDisplayImage() {
      this.cameraService
        .capturePhotoAndGetBase64()
        .then((base64Data) => {
          this.imageData = base64Data; // Set imageData to the base64 data
        })
        .catch((error) => {
          console.error('Error loading and displaying the image:', error);
        });
    }
  }
  **/


  // THIS IS FOMR IONIC TUTORAL
  public async addNewPhotoToDevice() : Promise<string> {
    /**
     * Takes a photo by device and stores it in mobile
     * device file system.
     * Retruns base64 + photo file location as string promise 
     * This servuce will be used globaly so must state as a provider
     * in app.module.ts and then injected as dependacy in a componment.
     * This will be used in event-modal to capture images
     * Applies to brwoser / mobile (iOS and Android)
     * 
     */

    console.log("CameraService: Add new photo called.");

    const capturePhoto = await Camera.getPhoto({
      // Promots user to take a photo or select from photo album, applis to all platforms! Web / mobile
      
      resultType: CameraResultType.Uri,
      allowEditing: true,
      source: CameraSource.Photos, // Promopt for upload or take new photo
      quality: 90

    });

    // Get base64 for svaing to databse
    const base64Data = await this.readAsBase64(capturePhoto);

    // Save the photo and add it to photo collection as first index of photos[]- RETURNS A BASE64 file!
    const savedImageFile = await this.savePhoto(capturePhoto);
    this.photos.unshift(savedImageFile);

    
    this.photos.unshift({
      // Inserts new photos at start of phtot array

      filepath: "soon...",
      webviewPath: capturePhoto.webPath  // webath is location of photo on system
    });
    
 
    // Save the photos array to filesystem each time a photo is taken,
    // so photos will persist if app is closed

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value : JSON.stringify(this.photos),
    })


    return base64Data as string; // TRY THIS TO RETRUN IMAGE BASE64!
  }

  public async loadSavedPhotod() {
    // Retrive cached array of photos saved to mobile device

    const { value } = await Preferences.get({ key : this.PHOTO_STORAGE});
    this.photos = (value ? JSON.parse(value) : []) as CertifcatePhoto[];

    // Easiest way to detect when running on the web:
    // *when the platform is NOT hybrid (mobile) do this
    if (!this.platform.is('hybrid')){
      //  Display the phot by reading into base64 fomrat

      for (let photo of this.photos){
      // Read each saved photos data from the filesystem
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });

      // Web platform only: Load the photo as base64 data
      photo.webviewPath = 'data:image/jpeg;base64,${readFile.data}';
    }
  }
  }

/** TRY RETURNUNG TE saveFile OBJECT HERE TO THE CALLING CLASS SO BASE^$CAN BE SAVED TO RMEOTE DATABSEQ */
private async savePhoto(photo : Photo){
  // Save photo file on devoce
  // Convert photo  to base64 format, req by Filesystem API and remote DB  to save
  const base64Data = await this.readAsBase64(photo);

  // Write the file to the data dir
  const fileName = Date.now() + '.jpeg';
  const savedFile = await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Data
  });

  if (this.platform.is('hybrid')){
    /**
     * Use webpath to display the new image instead of base64 seen as its alreday
     * loaded into memeory 
     * Mobile users- Display the new image by rewriting the 'file://' path to HTTP
     * Details: https://ionicframework.com/docs/building/webview#file-protocol
     */
    return {
      filepath : savedFile.uri,
      webviewPath : Capacitor.convertFileSrc(savedFile.uri),
    };
  }else{
    // Webusers- Use webpath to display the new image instead of badse64 since its 
    // already loaded to memory
  return {
    filepath: fileName,
    webviewPath: photo.webPath
  };
}
} 


private async readAsBase64(photo: Photo){
  //  hybrid will detect Cordova or Cap.

  if (this.platform.is('hybrid')){
    // Read file into base64 format
    const file = await Filesystem.readFile({
      path : photo.path!
    });

    //return await this.convertBlobToBase64(file.data) as string;
    return file.data; // Blob only available  on web, on native data is retunred as string
  }else {
  // Web users, Fetch the photo, read as blob, then convert to base 64 format
  const response = await fetch(photo.webPath!);
  const blob = await response.blob(); // blob=binary latrge object (image)

  return await this.convertBlobToBase64(blob) as string;
  }
}

private convertBlobToBase64 = (blob : Blob) => new Promise ((
  // func that takes a blob and returns a promsie for base64 image rep,
  // with consructor that takes 
  // passes to func to control the returned promise

  resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject; // if error, reject func is called and promise rejected
    reader.onload = () => {
      // clalback, if redare is succesful the resolve func is called with res of FileReader
      resolve(reader.result); // reader.res holds base64 rep of the blob
    };
    reader.readAsDataURL(blob); // convert blob to base64

  });

}// end class

