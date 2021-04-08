import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { LanguageService } from '../services/language.service';
import { ThemeService } from '../services/theme.service';

export interface Language {
	code: string;
	desc: string;
}

@Component({
	selector: 'app-config',
	templateUrl: './config.component.html',
	styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

	languages: Language[] | undefined;
	language: Language | undefined;
	isDarkTheme = false;

	constructor(
		private languageService: LanguageService,
		private themeService: ThemeService
	) { }

	ngOnInit(): void {
		this.languages = this.languageService.languages;
		this.language = this.languages.find(language => language.code === this.languageService.language.code);
		this.isDarkTheme = this.themeService.isDarkTheme;
	}

	onChangeLanguage(event: MatSelectChange) {
		this.languageService.setLanguage(event.value);
	}

	onChangeDarkTheme(event: MatSlideToggleChange) {
		this.themeService.setDarkTheme(event.checked);
	}

	languagesTrackBy(index: number, language: Language) {
		return language.code;
	}

}
