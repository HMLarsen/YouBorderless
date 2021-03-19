import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { environment } from 'src/environments/environment';
import { YoutubeLiveModule } from './youtube-live/youtube-live.module';

const socketConfig: SocketIoConfig = {
	url: environment.backEndUrl,
	options: { withCredentials: false }
};

@NgModule({
	imports: [
		SocketIoModule.forRoot(socketConfig),
		HttpClientModule
	],
	exports: [YoutubeLiveModule]
})
export class LiveModule { }
