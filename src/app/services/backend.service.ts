import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class BackendService {

	backEndUrlStorageName = 'backEndUrl';
	backEndUrl = '';

	constructor(private db: AngularFireDatabase) { }

	getBackendUrl(): Promise<string> {
		return new Promise((resolve, reject) => {
			if (!!this.backEndUrl) {
				resolve(this.backEndUrl);
				return;
			}
			if (!environment.production) {
				this.backEndUrl = 'http://192.168.100.66:3000';
				resolve(this.backEndUrl);
			} else {
				this.db.object<string>(this.backEndUrlStorageName).valueChanges()
					.subscribe(data => {
						this.backEndUrl = data!;
						resolve(this.backEndUrl);
					}, err => resolve(''));
			}
			return this.backEndUrl;
		});
	}
}
