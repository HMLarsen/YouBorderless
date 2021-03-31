import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
	selector: 'app-pwa-install',
	templateUrl: './pwa-install.component.html',
	styleUrls: ['./pwa-install.component.css']
})
export class PwaInstallComponent {

	showAppInstallStorageKeyName = 'showAppInstall';

	constructor(
		private snackBarRef: MatSnackBarRef<PwaInstallComponent>,
		@Inject(MAT_SNACK_BAR_DATA) private data: any
	) { }

	install() {
		this.data.prompt();
		this.close();
	}

	close() {
		this.snackBarRef.dismiss();
		this.saveUserResponseInStorage();
	}

	saveUserResponseInStorage() {
		localStorage.setItem(this.showAppInstallStorageKeyName, 'true');
	}

}
