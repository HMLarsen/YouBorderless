import { NgModule } from '@angular/core';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { environment } from 'src/environments/environment';
import { YoutubeModule } from '../youtube/youtube.module';

const socketConfig: SocketIoConfig = {
	url: environment.functionsHostUrl,
	options: {
		withCredentials: false,
	}
};

@NgModule({
	imports: [
		YoutubeModule,
		SocketIoModule.forRoot(socketConfig),
	],
	exports: [
		YoutubeModule
	]
})
export class LiveModule { }
