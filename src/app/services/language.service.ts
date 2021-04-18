import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../config/config.component';

import pt from '@angular/common/locales/pt';
import en from '@angular/common/locales/en';
import es from '@angular/common/locales/es';

@Injectable({
	providedIn: 'root'
})
export class LanguageService {

	languages: Language[] = [
		{ code: 'en', desc: 'English' },
		{ code: 'pt', desc: 'Português (Brasil)' },
		{ code: 'es', desc: 'Español' }
	];
	language!: Language;
	storageLanguageName = 'language';

	constructor(private translateService: TranslateService) {
		this.registerLocaleLanguages();

		// default language first
		const defaultLanguage = this.languages.find(language => language.code === translateService.getDefaultLang());
		if (defaultLanguage) {
			this.language = defaultLanguage;
		}
		// default browser language in second
		const defaultLanguageByBrowser = this.getSiteLanguageByBrowserLanguage();
		if (defaultLanguageByBrowser) {
			this.language = defaultLanguageByBrowser;
		}
		// search in localstorage
		const storageLanguage = localStorage.getItem(this.storageLanguageName);
		if (storageLanguage) {
			this.language = JSON.parse(storageLanguage);
		}
		this.setLanguage(this.language);
	}

	registerLocaleLanguages() {
		registerLocaleData(en);
		registerLocaleData(pt);
		registerLocaleData(es);
	}

	setLanguage(language: Language) {
		this.language = language;
		this.translateService.use(language.code);
		localStorage.setItem(this.storageLanguageName, JSON.stringify(language));
	}

	getBrowserLanguage() {
		return navigator.language || window.navigator.language;
	}

	getSiteLanguageByBrowserLanguage() {
		const browserLanguage = this.getBrowserLanguage();
		const prefix = browserLanguage.toString().split('-')[0];
		return this.languages.find(language => language.code === prefix);
	}

}
