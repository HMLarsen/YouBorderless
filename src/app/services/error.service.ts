import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class ErrorService {

	defaultError = 'Ocorreu um erro, tente novamente mais tarde';
	permissionsError = 'Permissões insuficientes para processar a requisição';
	liveNotAvailable = 'Transmissão não disponível para reprodução';

	constructor(private _snackBar: MatSnackBar) { }

	doError(message?: string) {
		if (message) {
			this.openSnackBar(message);
			return;
		}
		this.openSnackBar(this.defaultError);
	}

	private openSnackBar(message: string) {
		this._snackBar.open(message, undefined, {
			panelClass: 'main-snackbar',
			duration: 3000
		});
	}

}
