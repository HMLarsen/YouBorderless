import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { LiveOptions } from 'src/app/model/live-options.model';
import { TranscribeSupportedLanguage } from 'src/app/model/transcribe-supported-language';
import { TranslationSupportedLanguage } from 'src/app/model/translation-supported-language';
import { LanguageService } from 'src/app/services/language.service';
import { LiveService } from 'src/app/services/live.service';
import { UtilsService } from 'src/app/services/utils.service';

interface DialogData {
	videoId: string;
}

@Component({
	selector: 'app-live-options-modal',
	templateUrl: './live-options-modal.component.html',
	styleUrls: ['./live-options-modal.component.css']
})
export class LiveOptionsModalComponent implements OnInit {

	configForm!: FormGroup;
	loading = true;
	loadingError = false;

	// transcribe
	transcribeLanguages: TranscribeSupportedLanguage[] = [];
	filteredTranscribeLanguages: ReplaySubject<TranscribeSupportedLanguage[]> = new ReplaySubject(1);

	// translation
	translationLanguages: TranslationSupportedLanguage[] = [];
	filteredTranslationLanguages: ReplaySubject<TranslationSupportedLanguage[]> = new ReplaySubject(1);

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		private router: Router,
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<LiveOptionsModalComponent>,
		private liveService: LiveService,
		private utilsService: UtilsService,
		private languageService: LanguageService
	) { }

	ngOnInit(): void {
		this.configForm = this.formBuilder.group({
			liveLanguage: [null, [Validators.required]],
			liveLanguageFilter: [null],
			liveTranslation: [null, [Validators.required]],
			liveTranslationFilter: [null],
			profanityFilter: [{ value: null, disabled: true }],
			punctuation: [{ value: null, disabled: true }],
			fastMode: new FormControl(true)
		});

		// changes
		this.configForm.get('liveLanguage')?.valueChanges
			.subscribe(language => this.liveLanguageChanges(language));
		this.configForm.get('liveLanguageFilter')?.valueChanges
			.subscribe(() => this.filterLanguages('liveLanguageFilter', this.transcribeLanguages, this.filteredTranscribeLanguages));
		this.configForm.get('liveTranslationFilter')?.valueChanges
			.subscribe(() => this.filterLanguages('liveTranslationFilter', this.translationLanguages, this.filteredTranslationLanguages));

		// set last live options if has
		const lastLiveOptions = this.liveService.getLastLiveOptions();
		if (lastLiveOptions) {
			this.configForm.get('fastMode')?.setValue(lastLiveOptions.fastMode);
		}

		// transcribe languages
		const transcribePromise = this.liveService.getTranscribeSupportedLanguages()
			.then(languages => {
				this.transcribeLanguages = languages;
				this.filteredTranscribeLanguages.next(this.transcribeLanguages.slice());

				// set last live options if has
				if (lastLiveOptions && lastLiveOptions.liveLanguage) {
					const language = this.transcribeLanguages.find(language => language.bcp === lastLiveOptions.liveLanguage.bcp);
					this.configForm.get('liveLanguage')?.setValue(language);
					this.configForm.get('profanityFilter')?.setValue(lastLiveOptions.profanityFilter);
					this.configForm.get('punctuation')?.setValue(lastLiveOptions.punctuation);
				}
			});

		// translation languages
		const translatePromise = this.liveService.getTranslationSupportedLanguages()
			.then(languages => {
				this.translationLanguages = languages;
				this.filteredTranslationLanguages.next(this.translationLanguages.slice());

				// set last live options if has
				if (lastLiveOptions && lastLiveOptions.liveToLanguage) {
					const language = this.translationLanguages.find(language => language.code === lastLiveOptions.liveToLanguage.code);
					this.configForm.get('liveTranslation')?.setValue(language);
				} else {
					// set default site language
					const siteLanguage = this.languageService.language;
					const language = this.translationLanguages.find(language => language.code === siteLanguage.code);
					this.configForm.get('liveTranslation')?.setValue(language);
				}
			});
		Promise.all([transcribePromise, translatePromise])
			.catch(() => this.loadingError = true)
			.finally(() => this.loading = false);
	}

	protected filterLanguages(formKey: string, languages: any[], filteredLanguages: ReplaySubject<any[]>) {
		if (!languages) {
			return;
		}
		// get the search keyword
		let search = this.configForm.get(formKey)?.value;
		if (!search) {
			filteredLanguages.next(languages.slice());
			return;
		}
		// filter the languages
		filteredLanguages.next(languages.filter(language => this.utilsService.searchInNormalizedStrings(language.name, search)));
	}

	submit() {
		if (this.configForm.invalid) {
			return;
		}
		const language = this.configForm.get('liveLanguage')?.value;
		const translation = this.configForm.get('liveTranslation')?.value;
		const profanityFilter = this.configForm.get('profanityFilter')?.value;
		const punctuation = this.configForm.get('punctuation')?.value;
		const fastMode = this.configForm.get('fastMode')?.value;

		const liveOptions = LiveOptions.newInstance(this.data.videoId, language, translation, punctuation, profanityFilter, fastMode);
		this.liveService.setLastLiveOptions(liveOptions);

		this.router.navigate(['video/' + this.data.videoId]);
		this.dialogRef.close();
	}

	filteredTranscribeLanguagesTrackBy(index: number, language: TranscribeSupportedLanguage) {
		return language.bcp;
	}

	filteredTranslationLanguagesTrackBy(index: number, language: TranslationSupportedLanguage) {
		return language.code;
	}

	liveLanguageChanges(liveLanguage: TranscribeSupportedLanguage) {
		if (!liveLanguage) {
			return;
		}
		// punctuation
		const punctuationField = this.configForm.get('punctuation');
		if (liveLanguage.punctuation) {
			punctuationField?.enable();
		} else {
			punctuationField?.setValue(null);
			punctuationField?.disable();
		}
		// profanity filter
		const profanityFilterField = this.configForm.get('profanityFilter');
		if (liveLanguage.profanityFilter) {
			profanityFilterField?.enable();
		} else {
			profanityFilterField?.setValue(null);
			profanityFilterField?.disable();
		}
	}

}
