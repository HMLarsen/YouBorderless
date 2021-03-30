import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { LiveModule } from './live/live.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { YoutubeVideoCardComponent } from './youtube-video-card/youtube-video-card.component';
import { GoogleAuthComponent } from './google-auth/google-auth.component';
import { YoutubeSearchListComponent } from './youtube-search-list/youtube-search-list.component';


@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		HistoryComponent,
		SubscriptionsComponent,
		YoutubeVideoCardComponent,
		GoogleAuthComponent,
		YoutubeSearchListComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		LiveModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
