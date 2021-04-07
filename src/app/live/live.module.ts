import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { environment } from 'src/environments/environment';
import { MaterialModule } from '../material/material.module';
import { ShareTranslateModule } from '../share-translate.module';
import { LiveOptionsModalComponent } from './live-options-modal/live-options-modal.component';
import { YoutubeLiveModule } from './youtube-live/youtube-live.module';

const socketConfig: SocketIoConfig = {
	url: environment.backEndUrl,
	options: { withCredentials: false }
};

@NgModule({
	declarations: [
		LiveOptionsModalComponent
	],
	imports: [
		ShareTranslateModule,
		ReactiveFormsModule,
		SocketIoModule.forRoot(socketConfig),
		HttpClientModule,
		MaterialModule
	],
	exports: [
		YoutubeLiveModule,
		LiveOptionsModalComponent
	]
})
export class LiveModule { }
