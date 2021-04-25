import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAuthService } from '../services/google-auth.service';

@Component({
	selector: 'app-subscriptions',
	templateUrl: './subscriptions.component.html',
	styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

	loading = true;
	error = false;

	constructor(
		private googleAuthService: GoogleAuthService,
		private title: Title,
		private translateService: TranslateService
	) { }

	ngOnInit(): void {
		this.setTitle();
		this.googleAuthService.getInstance()
			.catch(error => this.error = error)
			.finally(() => this.loading = false);
	}

	async setTitle() {
		const title = await this.translateService.get('subscriptions').toPromise();
		this.title.setTitle(`${title} - YouBorderless`);
	}

	isAuthenticated() {
		return this.googleAuthService.isAuthenticated();
	}

}
