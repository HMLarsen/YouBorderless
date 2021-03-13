import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { LiveOptions } from '../model/live-options.model';

@Injectable({
	providedIn: 'root'
})
export class LiveService {

	private currentLives: Set<string> = new Set();
	currentChunk = this.socket.fromEvent<any>('chunk-live');
	liveError = this.socket.fromEvent<any>('live-error');

	constructor(private socket: Socket) { }

	initLive(live: LiveOptions) {
		this.currentLives.add(live.id);
		this.socket.emit('init-live', live);
	}

	stopLive(liveId: string) {
		this.currentLives.delete(liveId);
		this.socket.emit('stop-live', liveId);
	}

	getChunkLive(currentChunk: any, liveId: string, live: any) {
		if (liveId !== live.id) {
			return currentChunk;
		}
		const enc = new TextDecoder();
		return enc.decode(live.chunk);
	}

	getLiveError(currentError: string, liveId: string, live: any) {
		if (liveId !== live.id) {
			return currentError;
		}
		return live.error;
	}
}
