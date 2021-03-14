import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { YouTubePlayerModule } from '@angular/youtube-player';

import { YoutubeVideoComponent } from './youtube-video/youtube-video.component';

@NgModule({
	declarations: [
		YoutubeVideoComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		YouTubePlayerModule
	],
	exports: [
		YoutubeVideoComponent
	]
})
export class YoutubeModule { }
