import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class ErrorService {

	constructor(private _snackBar: MatSnackBar) { }

	doError(message: string) {
		this.openSnackBar(message);
	}

	private openSnackBar(message: string) {
		this._snackBar.open(message, undefined, {
			panelClass: 'main-snackbar',
			duration: 3000
		});
	}

}
