import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../config/config.component';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	language: Language | undefined;
	storageLanguageName = 'language';

	isDarkTheme = false;
	storageDarkThemeName = 'isDarkTheme';

	constructor(private translateService: TranslateService) {
		const storageLanguage = localStorage.getItem(this.storageLanguageName);
		if (storageLanguage) {
			this.language = JSON.parse(storageLanguage);
			if (this.language) this.setLanguage(this.language);
		}
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

	setLanguage(language: Language) {
		this.language = language;
		this.translateService.use(language.code);
		localStorage.setItem(this.storageLanguageName, JSON.stringify(language));
	}

	searchInNormalizedStrings(s1: string, s2: string) {
		function normalize(s: string) {
			return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		}
		return normalize(s1).indexOf(normalize(s2)) > -1;
	}

	scrollTop() {
		document.body.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
	}

	noWhitespaceFormValidator(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}

}
