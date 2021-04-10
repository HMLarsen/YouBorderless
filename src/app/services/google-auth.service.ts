import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';

@Injectable({
	providedIn: 'root'
})
export class GoogleAuthService {

	private gApiSetup = false;
	private authInstance!: gapi.auth2.GoogleAuth;
	private error!: string;

	constructor(private errorService: ErrorService) {
		this.initGoogleAuth();
	}

	async initGoogleAuth(): Promise<void> {
		if (this.gApiSetup) {
			return;
		}
		// create a new Promise where the resolve
		// function is the callback passed to gapi.load
		const pLoad = new Promise((resolve, reject) => {
			gapi.load('client', () => {
				gapi.client.init({
					apiKey: environment.youtubeApiKey,
					clientId: environment.googleAppClientId,
					scope: 'https://www.googleapis.com/auth/youtube.readonly'
				}).then(() => {
					gapi.client.load('youtube', 'v3').then(resolve);
				}, err => reject(err));
			});
		});

		// when the first promise resolves, it means we have gapi
		// loaded and that we can call gapi.init
		return pLoad.then(() => {
			this.gApiSetup = true;
			this.authInstance = gapi.auth2.getAuthInstance();
		}, async err => {
			console.error(err);
			this.error = await this.translateError(err);
		});
	}

	getInstance(): Promise<gapi.auth2.GoogleAuth> {
		return new Promise(async (resolve, reject) => {
			await this.initGoogleAuth();
			this.error ? reject(this.error) : resolve(this.authInstance);
		});
	}

	translateError(err: any) {
		if (err.details.indexOf('Cookies are not enabled in current environment') >= 0) {
			return this.errorService.getCookiesDisabledError();
		}
		return this.errorService.getDefaultError();
	}

	async authenticate() {
		await this.initGoogleAuth();
		this.authInstance.signIn()
			.then(response => {
				// if success reload the page because render scopes problems in html
				if (response.isSignedIn()) {
					window.location.reload();
				}
			}, err => {
				if (err.error === 'popup_closed_by_user') return;
				console.error(err);
			});
	}

	async logout() {
		await this.initGoogleAuth();
		this.authInstance.signOut();
		// if success reload the page because render scopes problems in html
		window.location.reload();
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

}
