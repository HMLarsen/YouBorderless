import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../config/config.component';

@Injectable({
	providedIn: 'root'
})
export class LanguageService {

	languages: Language[] = [
		{ code: 'pt', desc: 'Português (Brasil)' },
		{ code: 'en', desc: 'English' },
		{ code: 'es', desc: 'Español' }
	];
	language!: Language;
	storageLanguageName = 'language';

	constructor(private translateService: TranslateService) {
		// default language first
		const defaultLanguage = this.languages.find(language => language.code === translateService.getDefaultLang());
		if (defaultLanguage) {
			this.language = defaultLanguage;
		}
		// search in localstorage
		const storageLanguage = localStorage.getItem(this.storageLanguageName);
		if (storageLanguage) {
			this.language = JSON.parse(storageLanguage);
		}
		this.setLanguage(this.language)
	}

	setLanguage(language: Language) {
		this.language = language;
		this.translateService.use(language.code);
		localStorage.setItem(this.storageLanguageName, JSON.stringify(language));
	}

}
