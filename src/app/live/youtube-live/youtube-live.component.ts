import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { LiveService } from 'src/app/services/live.service';
import { YoutubeVideoStateChange } from 'src/app/model/youtube-video.constants';
import { ActivatedRoute } from '@angular/router';
import { YoutubeService } from 'src/app/services/youtube.service';
import { ModalService } from 'src/app/services/modal.service';
import { LiveOptions } from 'src/app/model/live-options.model';
import { MatTooltip } from '@angular/material/tooltip';
import { TutorialService } from 'src/app/services/tutorial.service';
import { UtilsService } from 'src/app/services/utils.service';

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

	startLiveSubject: Subject<void> = new Subject<void>();
	stopLiveSubject: Subject<void> = new Subject<void>();
	backwardCaptionsEvent: Subject<void> = new Subject<void>();
	forwardCaptionsEvent: Subject<void> = new Subject<void>();

	error: any;
	_liveError!: Subscription;

	loading = true;
	loadingError = false;

	showTour = true;
	endedTour = false;

	destroyed = false;

	constructor(
		private route: ActivatedRoute,
		private liveService: LiveService,
		private modalService: ModalService,
		private youtubeService: YoutubeService,
		private tutorialService: TutorialService,
		private utilsService: UtilsService
	) { }

	async ngOnInit() {
		this.showTour = this.tutorialService.isShowLiveTutorial();
		if (!this.showTour) this.endedTour = true;

		// fullscreen event
		document.onfullscreenchange = () => {
			document.getElementById('main-video-section')?.classList.toggle('fullscreen');
		};

		this.videoId = this.route.snapshot.params['videoId'];
		let error;

		await this.youtubeService.getVideoToLive(this.videoId).toPromise()
			.then(() => {
				const lastLiveOptions = this.liveService.getLastLiveOptions();
				if (!lastLiveOptions && !this.destroyed) {
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
		this.destroyed = true;
		this.stopLive();
	}

	openLiveOptionsModal(restart?: boolean) {
		const oldOptions = this.getLiveOptions();
		this.modalService.openLiveOptionsModel(this.videoId)
			.afterClosed().subscribe(() => {
				if (!restart) return;
				const newOptions = this.getLiveOptions();
				if (oldOptions.id === newOptions.id) return;
				if (this.isLiving) {
					this.stopLive(oldOptions.id);
					this.initLive();
				} else {
					if (this.videoIframe) this.videoIframe.playVideo();
				}
			});
	}

	getLiveOptions(): LiveOptions {
		return this.liveService.getLastLiveOptions();
	}

	initLive() {
		if (this.isLiving) {
			return;
		}
		this.isLiving = true;
		if (this.videoState !== YoutubeVideoStateChange.PLAYING) {
			this.videoIframe.playVideo();
		}
		this.error = null;
		this.liveService.initLive(this.getLiveOptions());
		this.startLiveSubject.next();
	}

	stopLive(id?: string) {
		if (!this.isLiving) {
			return;
		}
		this.isLiving = false;
		this.stopLiveSubject.next();
		this.liveService.stopLive(id || this.getLiveOptions().id);
	}

	restartLive() {
		this.stopLive();
		this.initLive();
	}

	onReady(event: any) {
		this.videoIframe = event.target;
		const embedCode = event.target.getVideoEmbedCode();
		if (this.endedTour) this.videoIframe.playVideo();
		if (document.getElementById('embed-code')) {
			document.getElementById('embed-code')!.innerHTML = embedCode;
		}
	}

	onVideoStateChange(event: any) {
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
	}

	onVideoError() {
		this.stopLive();
	}

	enterFullScreen() {
		if (!document.fullscreenElement) {
			document.getElementById('player-content')?.requestFullscreen();
			this.utilsService.makeLandscape();
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

	backwardCaptions(tooltip: MatTooltip) {
		this.backwardCaptionsEvent.next();
		tooltip.disabled = false;
		tooltip.hide();
		tooltip.show();
		setTimeout(() => tooltip.disabled = true, 3000);
	}

	forwardCaptions(tooltip: MatTooltip) {
		this.forwardCaptionsEvent.next();
		tooltip.disabled = false;
		tooltip.hide();
		tooltip.show();
		setTimeout(() => tooltip.disabled = true, 3000);
	}

	tour() {
		if (!this.showTour) return;
		this.showTour = false;
		setTimeout(() => {
			this.tutorialService.initLiveTour();
			this.tutorialService.tourService.end$.subscribe(() => {
				this.endedTour = true;
				if (this.videoIframe) this.videoIframe.playVideo();
			});
		}, 1000);
	}

}
