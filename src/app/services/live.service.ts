import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LiveCaptions } from '../model/live-captions.model';
import { LiveOptions } from '../model/live-options.model';
import { TranscribeSupportedLanguage } from '../model/transcribe-supported-language';
import { TranslationSupportedLanguage } from '../model/translation-supported-language';
import { LanguageService } from './language.service';

@Injectable({
	providedIn: 'root'
})
export class LiveService {

	_liveCaptions = this.socket.fromEvent<LiveCaptions>('live-captions');
	liveError = this.socket.fromEvent<any>('live-error');

	private lastLiveOptions!: LiveOptions;

	constructor(
		private socket: Socket,
		private http: HttpClient,
		private languageService: LanguageService
	) { }

	initLive(liveOptions: LiveOptions, liveStartTime: number) {
		this.socket.emit('init-live', { liveOptions, liveStartTime });
	}

	stopLive(liveId: string) {
		this.socket.emit('stop-live', liveId);
	}

	getLiveError(currentError: string, liveId: string, live: any) {
		if (liveId !== live.id) {
			return currentError;
		}
		return live.error;
	}

	getLiveCaptions(liveId: string, liveCaptions: LiveCaptions) {
		if (liveId !== liveCaptions.id)	return;
		return liveCaptions;
	}

	getTranscribeSupportedLanguages(): Observable<TranscribeSupportedLanguage[]> {
		const url = environment.backEndUrl + '/supported-transcribe-languages/' + this.languageService.language.code;
		return this.http.get<TranscribeSupportedLanguage[]>(url);
	}

	getTranslationSupportedLanguages(): Observable<TranslationSupportedLanguage[]> {
		const url = environment.backEndUrl + '/supported-translation-languages/' + this.languageService.language.code;
		return this.http.get<TranslationSupportedLanguage[]>(url);
	}

	getLastLiveOptions(): LiveOptions {
		return this.lastLiveOptions;
	}

	setLastLiveOptions(liveOptions: LiveOptions) {
		this.lastLiveOptions = liveOptions;
	}

}
