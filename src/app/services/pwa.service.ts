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
			this.promptEvent = event;
			if (this.ableToShowAppInstall()) {
				this.openInstallComponent();
			}
		});
	}

	ableToShowAppInstall() {
		return !localStorage.getItem(this.showAppInstallStorageKeyName);
	}

	openInstallComponent() {
		this.snackBar.openFromComponent(PwaInstallComponent, {
			data: this.promptEvent,
			panelClass: 'main-snackbar'
		});
	}

}
