import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { BackendService } from './backend.service';

@Injectable({
	providedIn: 'root'
})
export class SocketService {

	socketConfig: SocketIoConfig = {
		url: '',
		options: { withCredentials: false }
	};

	constructor(
		private backendService: BackendService,
		private socket: Socket
	) {
		this.configureSocket();
	}

	async configureSocket() {
		this.socket.disconnect();
		this.socketConfig.url = await this.backendService.getBackendUrl();
		this.socket = new Socket(this.socketConfig);
	}

	async emit(key: string, value: any) {
		if (this.socketConfig.url === '') await this.configureSocket();
		this.socket.emit(key, value);
	}

	async fromEvent(key: string) {
		if (this.socketConfig.url === '') await this.configureSocket();
		return this.socket.fromEvent<any>(key);
	}

}
