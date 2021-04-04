import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { PwaInstallComponent } from '../pwa-install/pwa-install.component';

@Injectable({
	providedIn: 'root'
})
export class PwaService {

	promptEvent: any;
	showAppInstallStorageKeyName = 'showAppInstall';

	constructor(
		private swUpdate: SwUpdate,
		private snackBar: MatSnackBar
	) {
		this.swUpdate.available.subscribe(() => window.location.reload());
		window.addEventListener('beforeinstallprompt', event => {
			event.preventDefault();
			this.promptEvent = event;
			if (this.isAbleToShowAppInstall()) {
				this.openInstallComponent();
			}
		});
	}

	isAbleToShowAppInstall() {
		return !localStorage.getItem(this.showAppInstallStorageKeyName);
	}

	openInstallComponent() {
		this.snackBar.openFromComponent(PwaInstallComponent, {
			data: {
				event: this.promptEvent,
				showAppInstallStorageKeyName: this.showAppInstallStorageKeyName
			},
			panelClass: 'main-snackbar'
		});
	}

}
