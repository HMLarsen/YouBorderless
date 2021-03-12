import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { StreamingService } from './streaming.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	title = 'YouBorderless-Front-End';
	chunk: any;
	urlLive: any;
	_chunkSub: Subscription = new Subscription;

	constructor(private streamingService: StreamingService) { }

	ngOnInit() {
		this._chunkSub = this.streamingService.currentChunk
			.subscribe(chunk => {
				var enc = new TextDecoder();
				this.chunk = enc.decode(chunk);
			});
	}

	ngOnDestroy() {
		this._chunkSub.unsubscribe();
	}

	initLive() {
		this.streamingService.initLive(this.urlLive);
	}

	destroyLive() {
		this.streamingService.destroyLive();
	}
}
