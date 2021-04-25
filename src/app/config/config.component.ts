import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
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
		private title: Title,
		private translateService: TranslateService,
		private languageService: LanguageService,
		private themeService: ThemeService
	) { }

	ngOnInit(): void {
		this.setTitle();
		this.languages = this.languageService.languages;
		this.language = this.languages.find(language => language.code === this.languageService.language.code);
		this.isDarkTheme = this.themeService.isDarkTheme;
	}

	async setTitle() {
		const title = await this.translateService.get('settings').toPromise();
		this.title.setTitle(`${title} - YouBorderless`);
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
