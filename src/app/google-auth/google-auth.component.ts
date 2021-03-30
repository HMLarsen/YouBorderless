import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleAuthService } from '../services/google-auth.service';

const googleLogoURL = 'https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg';

@Component({
	selector: 'app-google-auth',
	templateUrl: './google-auth.component.html',
	styleUrls: ['./google-auth.component.css']
})
export class GoogleAuthComponent implements OnInit {

	constructor(
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
		private googleAuthService: GoogleAuthService
	) {
		this.matIconRegistry.addSvgIcon('logo', this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
	}

	ngOnInit(): void {
	}

	authenticate() {
		this.googleAuthService.authenticate();
	}

	logout() {
		this.googleAuthService.logout();
	}

	getUser() {
		return this.googleAuthService.getUser();
	}

	isAuthenticated() {
		return this.googleAuthService.isAuthenticated();
	}

}
