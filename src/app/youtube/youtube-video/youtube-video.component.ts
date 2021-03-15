import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LiveService } from 'src/app/live/live.service';
import { LiveOptions } from 'src/app/model/live-options.model';
import { TranscribeSupportedLanguage } from 'src/app/model/transcribe-supported-language';
import { TranslationSupportedLanguage } from 'src/app/model/translation-supported-language';
import { YoutubeVideoStateChange } from 'src/app/model/youtube-video.constants';

let apiLoaded = false;

@Component({
	selector: 'app-youtube-video',
	templateUrl: './youtube-video.component.html',
	styleUrls: ['./youtube-video.component.css']
})
export class YoutubeVideoComponent implements OnInit {

	videoId = 'fgfbbC4cJ4M'; // english
	videoIframe: any;
	videoState!: number;
	isLiving = false;
	liveOptions!: LiveOptions;
	livePunctuation = false;
	liveProfanityFilter = false;

	transcribeLanguage!: TranscribeSupportedLanguage;
	transcribeLanguages: TranscribeSupportedLanguage[] = [];

	translationLanguage!: TranslationSupportedLanguage;
	translationLanguages: TranslationSupportedLanguage[] = [];

	text: any;
	_textSub!: Subscription;

	translate: any;
	_translateSub!: Subscription;

	error: any;
	_liveError!: Subscription;

	constructor(private liveService: LiveService) { }

	ngOnInit(): void {
		if (!apiLoaded) {
			// This code loads the IFrame Player API code asynchronously, according to the instructions at
			// https://developers.google.com/youtube/iframe_api_reference#Getting_Started
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			document.body.appendChild(tag);
			apiLoaded = true;
		}
		this.liveOptions = LiveOptions.newInstance(this.videoId);

		// languages
		this.liveService.getTranscribeSupportedLanguages()
			.subscribe(languages => this.transcribeLanguages = languages);
		this.liveService.getTranslationSupportedLanguages()
			.subscribe(languages => this.translationLanguages = languages);

		this._liveError = this.liveService.liveError
			.subscribe(live => this.error = this.liveService.getLiveError(this.error, this.liveOptions.id, live));
	}

	ngOnDestroy(): void {
		this.unSubscribeAll();
		this.stopLive();
	}

	unSubscribeAll() {
		if (this._textSub) {
			this._textSub.unsubscribe();
		}
		if (this._liveError) {
			this._liveError.unsubscribe();
		}
	}

	subscribeLive() {
		this._textSub = this.liveService.currentText
			.subscribe(live => {
				if (this.videoState === YoutubeVideoStateChange.PLAYING) {
					this.text = this.liveService.getTextLive(this.text, this.liveOptions.id, live);
				}
			});
		this._translateSub = this.liveService.translatedText
			.subscribe(live => {
				if (this.videoState === YoutubeVideoStateChange.PLAYING) {
					this.translate = this.liveService.getTranslateLive(this.translate, this.liveOptions.id, live);
				}
			});
	}

	unSubscribeLive() {
		if (this._textSub) {
			this._textSub.unsubscribe();
		}
	}

	initLive() {
		this.isLiving = true;
		if (this.videoIframe.videoState !== YoutubeVideoStateChange.PLAYING) {
			this.videoIframe.playVideo();
		}
		this.error = null;
		this.text = null;
		this.translate = null;
		this.subscribeLive();

		this.liveOptions.liveLanguage = { ...this.transcribeLanguage };
		this.liveOptions.liveToLanguage = { ...this.translationLanguage };
		this.liveOptions.liveLanguage.profanity = this.liveProfanityFilter;
		this.liveOptions.liveLanguage.punctuation = this.livePunctuation;

		this.liveService.initLive(this.liveOptions);
	}

	stopLive() {
		if (!this.isLiving) {
			return;
		}
		this.isLiving = false;
		// verificar se stopar é melhor que dar o seek
		if (this.videoState === YoutubeVideoStateChange.PLAYING) {
			this.videoIframe.stopVideo();
		}
		this.unSubscribeLive();
		this.liveService.stopLive(this.liveOptions.id);
	}

	restartLive() {
		this.stopLive();
		this.initLive();
	}

	onReady(event: any) {
		this.videoIframe = event.target;
		const embedCode = event.target.getVideoEmbedCode();
		// videoIframe.playVideo();
		if (document.getElementById('embed-code')) {
			document.getElementById('embed-code')!.innerHTML = embedCode;
		}
		console.log('onReady', event);
	}

	onStateChange(event: any) {
		this.videoState = event.data;
		switch (this.videoState) {
			case YoutubeVideoStateChange.PLAYING:
				//this.initLive();
				break;

			case YoutubeVideoStateChange.PAUSED:
			case YoutubeVideoStateChange.ENDED:
				this.videoIframe.stopVideo();
				this.stopLive();
				break;

			default:
				break;
		}
		console.log('onStateChange', event.data);
	}

	onError() {
		console.log('onError');
	}

	onApiChange() {
		console.log('onApiChange');
	}

	onPlaybackQualityChange() {
		console.log('onPlaybackQualityChange');
	}

	onPlaybackRateChange() {
		console.log('onPlaybackRateChange');
	}

	transcribeLanguagesTrackBy(index: number, language: TranscribeSupportedLanguage) {
		return language.bcp;
	}

	translationLanguagesTrackBy(index: number, language: TranslationSupportedLanguage) {
		return language.code;
	}

	onChangeVideo() {
		this.liveOptions.liveId = this.videoId;
	}

}
