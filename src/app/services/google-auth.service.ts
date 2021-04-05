import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class GoogleAuthService {

	private gApiSetup = false;
	private authInstance!: gapi.auth2.GoogleAuth;

	constructor() {
		this.initGoogleAuth();
	}

	async initGoogleAuth(): Promise<void> {
		if (this.gApiSetup) {
			return;
		}
		// create a new Promise where the resolve
		// function is the callback passed to gapi.load
		var OAUTH2_SCOPES = [
			'https://www.googleapis.com/auth/youtube.readonly'
			// 'https://www.googleapis.com/auth/youtube.force-ssl',
			// 'https://www.googleapis.com/auth/youtube.readonly'
		];
		const pLoad = new Promise(resolve => {
			gapi.load('client', () => {
				gapi.client
					.init({
						apiKey: environment.youtubeApiKey,
						clientId: environment.googleAppClientId,
						scope: 'https://www.googleapis.com/auth/youtube'
					}).then(() => {
						gapi.client.load('youtube', 'v3').then(resolve);
					});
			});
		});

		// when the first promise resolves, it means we have gapi
		// loaded and that we can call gapi.init
		return pLoad.then(() => {
			this.gApiSetup = true;
			this.authInstance = gapi.auth2.getAuthInstance();
		});
	}

	async authenticate(): Promise<gapi.auth2.GoogleUser> {
		await this.initGoogleAuth();
		return new Promise(async () => {
			await this.authInstance.signIn()
				.catch(err => {
					if (err.error === 'popup_closed_by_user') return;
					console.error(err);
				});
		});
	}

	async logout(): Promise<gapi.auth2.GoogleUser> {
		await this.initGoogleAuth();
		return new Promise(async () => {
			await this.authInstance.signOut();
		});
	}

	isAuthenticated() {
		if (this.authInstance) {
			return this.authInstance.isSignedIn.get();
		}
		return false;
	}

	getUser() {
		if (this.authInstance) {
			return this.authInstance.currentUser;
		}
		return null;
	}

	getInstance() {
		return this.authInstance;
	}

}
