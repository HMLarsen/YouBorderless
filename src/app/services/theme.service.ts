import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {

	isDarkTheme = false;
	storageDarkThemeName = 'isDarkTheme';

	constructor() {
		this.isDarkTheme = localStorage.getItem(this.storageDarkThemeName) === 'true';
		this.setDarkTheme(this.isDarkTheme);
	}

	setDarkTheme(darkTheme: boolean) {
		this.isDarkTheme = darkTheme;
		localStorage.setItem(this.storageDarkThemeName, this.isDarkTheme ? 'true' : 'false');
		if (this.isDarkTheme) {
			document.body.classList.add('dark-theme');
		} else {
			document.body.classList.remove('dark-theme');
		}
	}

}
