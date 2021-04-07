import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UtilsService } from '../services/utils.service';

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

	language: Language | undefined;
	languages: Language[] = [
		{ code: 'pt', desc: 'Português (Brasil)' },
		{ code: 'en', desc: 'English' },
		{ code: 'fr', desc: 'Français' }
	];
	isDarkTheme = false;

	constructor(private utilsService: UtilsService) { }

	ngOnInit(): void {
		const storageLanguage = this.utilsService.language;
		if (storageLanguage) {
			this.language = this.languages.find(language => language.code === storageLanguage.code);
		}
		this.isDarkTheme = this.utilsService.isDarkTheme;
	}

	onChangeLanguage(event: MatSelectChange) {
		this.language = event.value;
		this.utilsService.setLanguage(event.value);
	}

	onChangeDarkTheme(event: MatSlideToggleChange) {
		this.utilsService.setDarkTheme(event.checked);
	}

	languagesTrackBy(index: number, language: Language) {
		return language.code;
	}

}
