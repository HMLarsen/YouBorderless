import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { YoutubeLiveComponent } from './youtube-live.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShareTranslateModule } from 'src/app/share-translate.module';
import { CaptionsComponent } from 'src/app/captions/captions.component';

@NgModule({
	declarations: [
		YoutubeLiveComponent,
		CaptionsComponent
	],
	imports: [
		CommonModule,
		ShareTranslateModule,
		FormsModule,
		FlexLayoutModule,
		YouTubePlayerModule,
		MaterialModule
	],
	exports: [YoutubeLiveComponent]
})
export class YoutubeLiveModule { }
