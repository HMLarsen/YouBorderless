import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { LiveService } from 'src/app/services/live.service';
import { YoutubeVideoStateChange } from 'src/app/model/youtube-video.constants';
import { ActivatedRoute } from '@angular/router';
import { YoutubeService } from 'src/app/services/youtube.service';
import { ModalService } from 'src/app/services/modal.service';
import { LiveOptions } from 'src/app/model/live-options.model';

let apiLoaded = false;

@Component({
	selector: 'app-youtube-live',
	templateUrl: './youtube-live.component.html',
	styleUrls: ['./youtube-live.component.css']
})
export class YoutubeLiveComponent implements OnInit, OnDestroy {

	videoId!: string;
	videoTitle!: string;
	videoIframe: any;
	videoState!: number;
	isLiving = false;

	text: any;
	_textSub!: Subscription;

	translate: any;
	_translateSub!: Subscription;

	error: any;
	_liveError!: Subscription;

	loading = true;
	loadingError = false;

	constructor(
		private route: ActivatedRoute,
		private liveService: LiveService,
		private modalService: ModalService,
		private youtubeService: YoutubeService
	) { }

	async ngOnInit() {
		// fullscreen event
		document.onfullscreenchange = () => {
			document.getElementById('main-video-section')?.classList.toggle('fullscreen');
		};

		this.videoId = this.route.snapshot.params['videoId'];
		let error;

		await this.youtubeService.getVideoToLive(this.videoId).toPromise()
			.then(() => {
				const lastLiveOptions = this.liveService.getLastLiveOptions();
				if (!lastLiveOptions) {
					this.openLiveOptionsModal();
				}
			}, err => {
				error = err;
				this.loadingError = true;
			})
			.finally(() => this.loading = false);

		if (error) {
			return;
		}
		if (!apiLoaded) {
			// This code loads the IFrame Player API code asynchronously, according to the instructions at
			// https://developers.google.com/youtube/iframe_api_reference#Getting_Started
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			document.body.appendChild(tag);
			apiLoaded = true;
		}
	}

	ngOnDestroy(): void {
		this.unSubscribeAll();
		this.stopLive();
	}

	openLiveOptionsModal() {
		this.modalService.openLiveOptionsModel(this.videoId);
	}

	getLiveOptions(): LiveOptions {
		return this.liveService.getLastLiveOptions();
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
		const liveOptions = this.liveService.getLastLiveOptions();
		this._textSub = this.liveService.currentText
			.subscribe(data => {
				if (this.videoState === YoutubeVideoStateChange.PLAYING) {
					this.text = this.liveService.getTextLive(this.text, liveOptions.id, data);
					// fix div scroll
					const captionsContainer = document.getElementById('captions-container');
					if (captionsContainer) {
						captionsContainer.scrollTop = captionsContainer.scrollHeight - captionsContainer.clientHeight;
					}
				}
			});
		this._translateSub = this.liveService.translatedText
			.subscribe(data => {
				if (this.videoState === YoutubeVideoStateChange.PLAYING) {
					this.translate = this.liveService.getTranslateLive(this.translate, liveOptions.id, data);
				}
			});
		this._liveError = this.liveService.liveError
			.subscribe(live => this.error = this.liveService.getLiveError(this.error, liveOptions.id, live));
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

		this.liveService.initLive(this.getLiveOptions());
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
		this.liveService.stopLive(this.getLiveOptions().id);
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
				this.initLive();
				break;

			case YoutubeVideoStateChange.PAUSED:
			case YoutubeVideoStateChange.ENDED:
				this.videoIframe.stopVideo();
				this.stopLive();
				this.exitFullScreen();
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

	enterFullScreen() {
		if (!document.fullscreenElement) {
			document.getElementById('player-content')?.requestFullscreen();
		}
	}

	exitFullScreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		}
	}

	isPlaying() {
		return this.videoState === YoutubeVideoStateChange.PLAYING;
	}

}
