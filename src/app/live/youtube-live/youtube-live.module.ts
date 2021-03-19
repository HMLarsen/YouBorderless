import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { YoutubeLiveComponent } from './youtube-live.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [YoutubeLiveComponent],
	imports: [
		CommonModule,
		FormsModule,
		YouTubePlayerModule
	],
	exports: [YoutubeLiveComponent]
})
export class YoutubeLiveModule { }
