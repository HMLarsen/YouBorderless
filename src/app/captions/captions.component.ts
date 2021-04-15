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

	@Input()
	boundaryElement!: string;

	@Input()
	liveOptions!: LiveOptions;

	@Input()
	initLiveEvent!: Observable<void>;

	@Input()
	stopLiveEvent!: Observable<void>;

	_captionsSub!: Subscription | undefined;
	dataCaptions: LiveCaptions[] = [];
	captions: Caption[] = [];

	_videoTimer!: Subscription | undefined;
	_captionsTimer!: Subscription | undefined;
	videoTimer = 0;

	MAX_CAPTIONS_SIZE = 10;
	MAX_CAPTIONS_LINE_SHOWING = 6;

	constructor(private liveService: LiveService) { }

	ngOnInit(): void {
		this.initLiveEvent.subscribe(() => this.subscribe());
		this.stopLiveEvent.subscribe(() => this.unSubscribe());
	}

	ngOnDestroy(): void {
		this.unSubscribe();
	}

	subscribe() {
		this.dataCaptions = [];
		this.captions = [];

		this.videoTimer = 0;
		this.startVideoTimer();

		this._captionsSub = this.liveService._liveCaptions
			.pipe(first())
			.subscribe(() => {
				this.stopVideoTimer();
				this.startTimer(0);
			});
		this._captionsSub = this.liveService._liveCaptions
			.subscribe(data => {
				const liveCaption = this.liveService.getLiveCaptions(this.liveOptions.id, data);
				if (!liveCaption) {
					return;
				}
				this.dataCaptions.push(liveCaption);
			});
	}

	unSubscribe() {
		this.stopVideoTimer();
		this.stopTimer();
		this._captionsSub?.unsubscribe();
		this._captionsSub = undefined;
	}

	startVideoTimer() {
		const timerInterval = 100;
		this._videoTimer = interval(timerInterval)
			.subscribe(() => this.videoTimer += timerInterval);
	}

	stopVideoTimer() {
		this._videoTimer?.unsubscribe();
		this._videoTimer = undefined;
	}

	startTimer(currentTime: number) {
		const timerInterval = 100;
		this._captionsTimer = interval(timerInterval)
			.subscribe(() => {
				currentTime += timerInterval;
				if (this.dataCaptions.length <= 0) return;
				let liveCaption: LiveCaptions | undefined = this.dataCaptions[0];
				const captionTime = liveCaption.data.time;
				console.log(currentTime, captionTime);
				if (currentTime < captionTime) return;
				liveCaption = this.dataCaptions.shift();
				this.doCaption(liveCaption!);
			});
	}

	stopTimer() {
		this._captionsTimer?.unsubscribe();
		this._captionsTimer = undefined;
	}

	doCaption(liveCaption: LiveCaptions) {
		if (liveCaption.data.isFinal) {
			// if final create a new item in array... this controls old text showing in captions
			// control the size for long lengths
			if (this.captions.length === this.MAX_CAPTIONS_SIZE) {
				this.captions.splice(0, this.MAX_CAPTIONS_SIZE - this.MAX_CAPTIONS_LINE_SHOWING);
			}
			this.captions.push({ text: liveCaption.data.text });
			console.log('final');
		} else {
			// if not final, get the last item and replace its caption
			if (this.captions.length <= 0) {
				this.captions.push({ text: liveCaption.data.text });
			}
			this.captions[this.captions.length - 1].text = liveCaption.data.text;
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
