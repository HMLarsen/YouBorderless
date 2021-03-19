import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class GoogleAuthService {

	private CLIENT_ID = '103633777851-77hf3l3cf9thf6vea90ljop2hj8hvtba.apps.googleusercontent.com';
	private gapiSetup = false;
	private authInstance: any;

	constructor() {
		this.initGoogleAuth();
	}

	async initGoogleAuth(): Promise<void> {
		if (this.gapiSetup) {
			return;
		}
		//  Create a new Promise where the resolve
		// function is the callback passed to gapi.load
		const pload = new Promise((resolve) => gapi.load('auth2', resolve));

		// When the first promise resolves, it means we have gapi
		// loaded and that we can call gapi.init
		return pload.then(async () => {
			await gapi.auth2
				.init({ client_id: this.CLIENT_ID })
				.then((auth: any) => {
					this.gapiSetup = true;
					this.authInstance = auth;
				});
		});
	}

	async authenticate(): Promise<gapi.auth2.GoogleUser> {
		await this.initGoogleAuth();
		return new Promise(async () => {
			await this.authInstance.signIn();
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
	}

	async getUser() {
		if (this.authInstance) {
			return this.authInstance.currentUser;
		}
	}

	async getInstance() {
		return this.authInstance;
	}
}
