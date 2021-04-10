import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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

	_captionsSub!: Subscription;
	captions: Caption[] = [];

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
		console.log('subscribe');
		this.captions = [];
		this._captionsSub = this.liveService._liveCaptions
			.subscribe(data => {
				const liveCaption = this.liveService.getLiveCaptions(this.liveOptions.id, data);
				if (!liveCaption) {
					return;
				}
				if (liveCaption.data.isFinal) {
					// if final create a new item in array... this controls old text showing in captions
					// control the size for long lengths
					if (this.captions.length === this.MAX_CAPTIONS_SIZE) {
						this.captions.splice(0, this.MAX_CAPTIONS_SIZE - this.MAX_CAPTIONS_LINE_SHOWING);
					}
					this.captions.push({ text: '' });
					console.log('final', this.captions.length);
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
					captionsContainer.scrollTop = captionsContainer.scrollHeight - captionsContainer.clientHeight;
				}
			});
	}

	unSubscribe() {
		if (this._captionsSub) {
			console.log('unsubscribe');
			this._captionsSub.unsubscribe();
		}
	}

}
