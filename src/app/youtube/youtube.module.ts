import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { YouTubePlayerModule } from '@angular/youtube-player';

import { HttpClientModule } from '@angular/common/http';
import { YoutubeVideoComponent } from './youtube-video/youtube-video.component';

@NgModule({
	declarations: [
		YoutubeVideoComponent
	],
	imports: [
		FormsModule,
		HttpClientModule,
		YouTubePlayerModule
	],
	exports: [
		YoutubeVideoComponent
	]
})
export class YoutubeModule { }
