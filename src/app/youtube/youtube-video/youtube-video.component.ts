import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LiveService } from 'src/app/live/live.service';
import { LiveOptions } from 'src/app/model/live-options.model';
import { YoutubeVideoStateChange } from 'src/app/model/youtube-video.constants';

let apiLoaded = false;

@Component({
	selector: 'app-youtube-video',
	templateUrl: './youtube-video.component.html',
	styleUrls: ['./youtube-video.component.css']
})
export class YoutubeVideoComponent implements OnInit {

	//videoId = 'AZ3UMchnYVE';
	videoId = 'fgfbbC4cJ4M';
	videoState!: number;
	liveOptions!: LiveOptions;

	text: any;
	_textSub!: Subscription;

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
	}

	unSubscribeLive() {
		if (this._textSub) {
			this._textSub.unsubscribe();
		}
	}

	initLive() {
		this.error = null;
		this.text = null;
		this.subscribeLive();
		this.liveService.initLive(this.liveOptions);
	}

	stopLive() {
		this.error = null;
		this.text = null;
		this.unSubscribeLive();
		this.liveService.stopLive(this.liveOptions.id);
	}

	onReady(event: any) {
		const embedCode = event.target.getVideoEmbedCode();
		//event.target.playVideo();
		if (document.getElementById('embed-code')) {
			document.getElementById('embed-code')!.innerHTML = embedCode;
		}
		console.log('onReady', event);
	}

	prepareToSeek = false;
	onStateChange(event: any) {
		this.videoState = event.data;
		switch (this.videoState) {
			case YoutubeVideoStateChange.PLAYING:
				if (this.prepareToSeek) {
					event.target.seekTo(Number.MAX_SAFE_INTEGER, true);
					this.prepareToSeek = false;
				}
				this.initLive();
				break;

			case YoutubeVideoStateChange.PAUSED:
			case YoutubeVideoStateChange.ENDED:
				this.stopLive();
				//this.prepareToSeek = true;
				// verificar se stopar é melhor que dar o seek
				event.target.stopVideo();
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

}
