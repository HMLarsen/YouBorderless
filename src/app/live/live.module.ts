import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule } from 'ngx-socket-io';

import { MaterialModule } from '../material/material.module';
import { ShareTranslateModule } from '../share-translate.module';
import { LiveOptionsModalComponent } from './live-options-modal/live-options-modal.component';
import { YoutubeLiveModule } from './youtube-live/youtube-live.module';

@NgModule({
	declarations: [
		LiveOptionsModalComponent
	],
	imports: [
		ShareTranslateModule,
		ReactiveFormsModule,
		HttpClientModule,
		SocketIoModule.forRoot({ url: '' }),
		MaterialModule
	],
	exports: [
		YoutubeLiveModule,
		LiveOptionsModalComponent
	]
})
export class LiveModule { }
