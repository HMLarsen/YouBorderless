import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { PwaInstallComponent } from '../pwa-install/pwa-install.component';

@Injectable({
	providedIn: 'root'
})
export class PwaService {

	promptEvent: any;
	showAppInstallStorageKeyName = 'showAppInstall';
	installComponentSnackElement: MatSnackBarRef<PwaInstallComponent> | undefined;

	constructor(private snackBar: MatSnackBar) {
		// update available event
		// this.swUpdate.available.subscribe(() => window.location.reload());
		window.addEventListener('beforeinstallprompt', event => {
			event.preventDefault(); // to chrome not show the default navbar for installation
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
		this.installComponentSnackElement = this.snackBar.openFromComponent(PwaInstallComponent, {
			data: {
				event: this.promptEvent,
				showAppInstallStorageKeyName: this.showAppInstallStorageKeyName
			},
			panelClass: 'main-snackbar'
		});
		this.installComponentSnackElement.afterDismissed().subscribe(() => this.installComponentSnackElement = undefined);
	}

	closeInstallComponent() {
		this.installComponentSnackElement?.dismiss();
	}

}
