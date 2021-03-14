import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LiveOptions } from '../model/live-options.model';
import { TranscribeSupportedLanguage } from '../model/transcribe-supported-language';
import { TranslationSupportedLanguage } from '../model/translation-supported-language';

@Injectable({
	providedIn: 'root'
})
export class LiveService {

	private currentLives: Set<string> = new Set();
	currentText = this.socket.fromEvent<any>('text-live');
	translatedText = this.socket.fromEvent<any>('translate-live');
	liveError = this.socket.fromEvent<any>('live-error');

	constructor(
		private socket: Socket,
		private http: HttpClient
	) { }

	initLive(liveOptions: LiveOptions) {
		this.currentLives.add(liveOptions.id);
		this.socket.emit('init-live', liveOptions);
	}

	stopLive(liveId: string) {
		this.currentLives.delete(liveId);
		this.socket.emit('stop-live', liveId);
	}

	getLiveError(currentError: string, liveId: string, live: any) {
		if (liveId !== live.id) {
			return currentError;
		}
		return live.error;
	}

	getTextLive(currentText: any, liveId: string, live: any) {
		if (liveId !== live.id) {
			return currentText;
		}
		return live.text;
	}

	getTranslateLive(currentText: any, liveId: string, live: any) {
		if (liveId !== live.id) {
			return currentText;
		}
		return live.text;
	}

	getTranscribeSupportedLanguages(): Observable<TranscribeSupportedLanguage[]> {
		const url = environment.backEndUrl + '/supported-transcribe-languages';
		return this.http.get<TranscribeSupportedLanguage[]>(url);
	}

	getTranslationSupportedLanguages(): Observable<TranslationSupportedLanguage[]> {
		const url = environment.backEndUrl + '/supported-translation-languages';
		return this.http.get<TranslationSupportedLanguage[]>(url);
	}
}
