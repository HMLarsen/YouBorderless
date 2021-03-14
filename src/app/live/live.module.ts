import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { environment } from 'src/environments/environment';
import { YoutubeModule } from '../youtube/youtube.module';

const socketConfig: SocketIoConfig = {
	url: environment.backEndUrl,
	options: {
		withCredentials: false,
	}
};

@NgModule({
	imports: [
		YoutubeModule,
		HttpClientModule,
		SocketIoModule.forRoot(socketConfig),
	],
	exports: [
		YoutubeModule
	]
})
export class LiveModule { }
