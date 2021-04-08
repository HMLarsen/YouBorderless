import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
	providedIn: 'root'
})
export class ErrorService {

	constructor(
		private _snackBar: MatSnackBar,
		private translateService: TranslateService
	) { }

	doError(message?: string) {
		this.openSnackBar(message);
	}

	private async openSnackBar(message?: string) {
		if (!message) {
			message = await this.getDefaultError();
		}
		this._snackBar.open(message!, undefined, {
			panelClass: 'main-snackbar',
			duration: 3000
		});
	}

	getDefaultError() {
		return this.translateService.get('error.default').toPromise();
	}

	getPermissionError() {
		return this.translateService.get('error.permission').toPromise();
	}

	getBroadcastNotAvailableError() {
		return this.translateService.get('error.broadcastNotAvailable').toPromise();
	}

}
