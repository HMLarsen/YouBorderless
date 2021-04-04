import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleAuthService } from '../services/google-auth.service';
import { YoutubeService } from '../services/youtube.service';

const googleLogoURL = 'https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg';

@Component({
	selector: 'app-google-auth',
	templateUrl: './google-auth.component.html',
	styleUrls: ['./google-auth.component.css']
})
export class GoogleAuthComponent {

	constructor(
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
		private googleAuthService: GoogleAuthService,
		private youtubeService: YoutubeService
	) {
		this.matIconRegistry.addSvgIcon('logo', this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
	}

	authenticate() {
		this.googleAuthService.authenticate();
	}

	logout() {
		this.googleAuthService.logout();
		this.youtubeService.saveLastSubscriptionSearch(undefined);
	}

	getUserName() {
		const user = this.googleAuthService.getUser();
		if (user) {
			return user.get().getBasicProfile().getName();
		}
		return null;
	}

	getUserImgUrl() {
		const user = this.googleAuthService.getUser();
		if (user) {
			return user.get().getBasicProfile().getImageUrl();
		}
		return null;
	}

	isAuthenticated() {
		return this.googleAuthService.isAuthenticated();
	}

}
