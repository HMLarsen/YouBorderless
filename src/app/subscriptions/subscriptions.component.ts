import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from '../services/google-auth.service';

@Component({
	selector: 'app-subscriptions',
	templateUrl: './subscriptions.component.html',
	styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

	loading = true;
	error = false;

	constructor(private googleAuthService: GoogleAuthService) { }

	ngOnInit(): void {
		this.googleAuthService.getInstance()
			.catch(error => this.error = error)
			.finally(() => this.loading = false);
	}

	isAuthenticated() {
		return this.googleAuthService.isAuthenticated();
	}

}
