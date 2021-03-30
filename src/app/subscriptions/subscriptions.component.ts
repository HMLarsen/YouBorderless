import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from '../services/google-auth.service';

@Component({
	selector: 'app-subscriptions',
	templateUrl: './subscriptions.component.html',
	styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

	constructor(
		private googleAuthService: GoogleAuthService
	) { }

	ngOnInit(): void {
	}

	isLoading() {
		return !this.googleAuthService.getInstance();
	}

	isAuthenticated() {
		return this.googleAuthService.isAuthenticated();
	}

}
