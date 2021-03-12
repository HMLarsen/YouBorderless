import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
	providedIn: 'root'
})
export class StreamingService {

	currentChunk = this.socket.fromEvent<any>('chunk-live');

	constructor(private socket: Socket) { }

	initLive(urlLive: string) {
		this.socket.emit('init-live', urlLive);
	}

	destroyLive() {
		this.socket.emit('destroy-live');
	}
}
