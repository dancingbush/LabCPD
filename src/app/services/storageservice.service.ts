import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';


// https://github.com/ionic-team/ionic-storage

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  // Add a get method for local storage
  public async get(key: string): Promise<any | null> {
    return this._storage?.get(key);
  }
}