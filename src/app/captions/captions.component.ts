import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { first } from "rxjs/operators";
import { LiveCaptions } from '../model/live-captions.model';
import { LiveOptions } from '../model/live-options.model';
import { LiveService } from '../services/live.service';

interface Caption {
	text: string;
}

@Component({
	selector: 'app-captions',
	templateUrl: './captions.component.html',
	styleUrls: ['./captions.component.css']
})
export class CaptionsComponent implements OnInit, OnDestroy {

	@Input() boundaryElement!: string;

	@Input() liveOptions!: LiveOptions;

	@Input() startLiveEvent!: Observable<void>;

	@Input() stopLiveEvent!: Observable<void>;

	@Input() backwardCaptionsEvent!: Observable<void>;

	@Input() forwardCaptionsEvent!: Observable<void>;

	@Input() videoIframe: any;

	// captions from server
	_liveCaptions: Subscription | undefined;
	liveCaptions: LiveCaptions[] = [];

	// captions showing
	_captionsTimer: Subscription | undefined;
	captions: Caption[] = [];
	currentCaptionsTime!: number;

	MAX_CAPTIONS_SIZE = 10;
	MAX_CAPTIONS_LINE_SHOWING = 6;

	constructor(private liveService: LiveService) { }

	ngOnInit(): void {
		this.startLiveEvent.subscribe(() => this.startLive());
		this.stopLiveEvent.subscribe(() => this.stopLive());
		this.backwardCaptionsEvent.subscribe(() => this.changeCaptionsTime(false));
		this.forwardCaptionsEvent.subscribe(() => this.changeCaptionsTime(true));

		screen.orientation.onchange = () => {
			// when change the orientation fix top of captions
			document.getElementById('captions-container')?.style.setProperty('top', '20vh');
			this.fixCaptionsScroll();
		};
	}

	ngOnDestroy(): void {
		this.stopLive();
	}

	startLive() {
		this.liveCaptions = [];
		this.captions = [];

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
		this._liveCaptions?.unsubscribe();
		this._liveCaptions = undefined;
	}

	startCaptionsTimer() {
		this.stopCaptionsTimer();
		const timerInterval = 100;
		this.currentCaptionsTime = 0;
		this._captionsTimer = interval(timerInterval)
			.subscribe(() => {
				this.currentCaptionsTime += timerInterval;
				if (this.liveCaptions.length <= 0) return;
				let liveCaption: LiveCaptions | undefined = this.liveCaptions[0];
				const captionTime = liveCaption.data.time;
				console.log('tempo real: ' + this.currentCaptionsTime, '| tempo da legenda: ' + captionTime, '| legendas disponíveis: ' + this.liveCaptions.length);
				if (this.currentCaptionsTime < captionTime) return;
				liveCaption = this.liveCaptions.shift();
				this.doCaption(liveCaption!);
			});
	}

	stopCaptionsTimer() {
		this._captionsTimer?.unsubscribe();
		this._captionsTimer = undefined;
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
		this.fixCaptionsScroll();
	}

	changeCaptionsTime(forward: boolean) {
		if (this.currentCaptionsTime) {
			const time = 1000;
			if (forward) this.currentCaptionsTime += time;
			if (!forward) this.currentCaptionsTime -= time;
		}
	}

	fixCaptionsScroll() {
		// fix div scroll
		const captionsContainer = document.getElementById('captions-container');
		if (captionsContainer) {
			setTimeout(() => {
				captionsContainer.scrollTop = captionsContainer.scrollHeight - captionsContainer.clientHeight;
			}, 100);
		}
	}

}
