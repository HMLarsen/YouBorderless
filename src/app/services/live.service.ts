import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LiveCaptions } from '../model/live-captions.model';
import { LiveOptions } from '../model/live-options.model';
import { TranscribeSupportedLanguage } from '../model/transcribe-supported-language';
import { TranslationSupportedLanguage } from '../model/translation-supported-language';
import { BackendService } from './backend.service';
import { LanguageService } from './language.service';
import { SocketService } from './socket.service';

@Injectable({
	providedIn: 'root'
})
export class LiveService {

	_liveCaptions = new Observable<LiveCaptions>();
	liveError = new Observable();

	private lastLiveOptions!: LiveOptions;

	constructor(
		private socketService: SocketService,
		private http: HttpClient,
		private languageService: LanguageService,
		private backendService: BackendService
	) { }

	async initLive(liveOptions: LiveOptions) {
		this._liveCaptions = await this.socketService.fromEvent('live-captions');
		this.liveError = await this.socketService.fromEvent('live-error');
		this.socketService.emit('init-live', liveOptions);
	}

	stopLive(liveId: string) {
		this.socketService.emit('stop-live', liveId);
	}

	getLiveError(currentError: string, liveId: string, live: any) {
		if (liveId !== live.id) {
			return currentError;
		}
		return live.error;
	}

	getLiveCaptions(liveId: string, liveCaptions: LiveCaptions) {
		if (liveId !== liveCaptions.id) return;
		return liveCaptions;
	}

	async getTranscribeSupportedLanguages() {
		const url = await this.backendService.getBackendUrl() + '/supported-transcribe-languages/' + this.languageService.language.code;
		return this.http.get<TranscribeSupportedLanguage[]>(url).toPromise();
	}

	async getTranslationSupportedLanguages() {
		const url = await this.backendService.getBackendUrl() + '/supported-translation-languages/' + this.languageService.language.code;
		return this.http.get<TranslationSupportedLanguage[]>(url).toPromise();
	}

	getLastLiveOptions(): LiveOptions {
		return this.lastLiveOptions;
	}

	setLastLiveOptions(liveOptions: LiveOptions) {
		this.lastLiveOptions = liveOptions;
	}

}
