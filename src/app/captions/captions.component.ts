import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { first } from "rxjs/operators";
import { wordAnimation } from '../animations';
import { LiveCaptions } from '../model/live-captions.model';
import { LiveOptions } from '../model/live-options.model';
import { LiveService } from '../services/live.service';

interface Caption {
	text: string;
}

@Component({
	selector: 'app-captions',
	templateUrl: './captions.component.html',
	styleUrls: ['./captions.component.css'],
	animations: [wordAnimation]
})
export class CaptionsComponent implements OnInit, OnDestroy {

	@Input() boundaryElement!: string;

	@Input() liveOptions!: LiveOptions;

	@Input() startLiveEvent!: Observable<void>;

	@Input() stopLiveEvent!: Observable<void>;

	@Input() videoIframe: any;

	// captions from server
	_liveCaptions: Subscription | undefined;
	liveCaptions: LiveCaptions[] = [];

	_videoTimer: Subscription | undefined;
	videoTimer!: number;

	// captions showing
	_captionsTimer: Subscription | undefined;
	captions: Caption[] = [];

	MAX_CAPTIONS_SIZE = 10;
	MAX_CAPTIONS_LINE_SHOWING = 6;

	constructor(private liveService: LiveService) { }

	ngOnInit(): void {
		this.startLiveEvent.subscribe(() => this.startLive());
		this.stopLiveEvent.subscribe(() => this.stopLive());
	}

	ngOnDestroy(): void {
		this.stopLive();
	}

	startLive() {
		this.liveCaptions = [];
		this.captions = [];
		this.startVideoTimer();

		this._liveCaptions = this.liveService._liveCaptions
			.pipe(first())
			.subscribe(() => this.startCaptionsTimer());
		this._liveCaptions = this.liveService._liveCaptions
			.subscribe(data => {
				const liveCaption = this.liveService.getLiveCaptions(this.liveOptions.id, data);
				if (!liveCaption) return;
				this.liveCaptions.push(liveCaption);
			});
	}

	stopLive() {
		this.stopCaptionsTimer();
		this.stopVideoTimer();
		this._liveCaptions?.unsubscribe();
		this._liveCaptions = undefined;
	}

	startCaptionsTimer() {
		this.stopCaptionsTimer();
		const timerInterval = 100;
		let currentTime = this.videoTimer + 10000;
		this._captionsTimer = interval(timerInterval)
			.subscribe(() => {
				currentTime += timerInterval;
				if (this.liveCaptions.length <= 0) return;
				let liveCaption: LiveCaptions | undefined = this.liveCaptions[0];
				const captionTime = liveCaption.data.time;
				console.log(currentTime, captionTime, this.liveCaptions.length);
				if (currentTime < captionTime) return;
				liveCaption = this.liveCaptions.shift();
				this.doCaption(liveCaption!);
			});
	}

	stopCaptionsTimer() {
		this._captionsTimer?.unsubscribe();
		this._captionsTimer = undefined;
	}

	startVideoTimer() {
		const timerInterval = 100;
		this.videoTimer = 0;
		this._videoTimer = interval(timerInterval).subscribe(() => this.videoTimer -= timerInterval);
	}

	stopVideoTimer() {
		this._videoTimer?.unsubscribe();
		this._videoTimer = undefined;
	}

	doCaption(liveCaption: LiveCaptions) {
		if (this.captions.length <= 0) {
			this.captions.push({ text: liveCaption.data.text });
		}
		this.captions[this.captions.length - 1].text = liveCaption.data.text;
		if (liveCaption.data.isFinal) {
			// if final create a new item in array... this controls old text showing in captions
			// control the size for long lengths
			if (this.captions.length === this.MAX_CAPTIONS_SIZE) {
				this.captions.splice(0, this.MAX_CAPTIONS_SIZE - this.MAX_CAPTIONS_LINE_SHOWING);
			}
			this.captions.push({ text: '' });
		}
		// fix div scroll
		const captionsContainer = document.getElementById('captions-container');
		if (captionsContainer) {
			setTimeout(() => {
				captionsContainer.scrollTop = captionsContainer.scrollHeight - captionsContainer.clientHeight;
			}, 100);
		}
	}

}
