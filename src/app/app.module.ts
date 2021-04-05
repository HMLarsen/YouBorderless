import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { LiveModule } from './live/live.module';

import { AppComponent } from './app.component';
import { ConfigComponent } from './config/config.component';
import { HomeComponent } from './home/home.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { YoutubeVideoCardComponent } from './youtube-video-card/youtube-video-card.component';
import { GoogleAuthComponent } from './google-auth/google-auth.component';
import { YoutubeSearchListComponent } from './youtube-search-list/youtube-search-list.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PwaInstallComponent } from './pwa-install/pwa-install.component';
import { PwaService } from './services/pwa.service';
import { GoogleAuthService } from './services/google-auth.service';


@NgModule({
	declarations: [
		AppComponent,
		ConfigComponent,
		HomeComponent,
		SubscriptionsComponent,
		YoutubeVideoCardComponent,
		GoogleAuthComponent,
		YoutubeSearchListComponent,
		PwaInstallComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		LiveModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {

	// call the service constructors
	constructor(
		pwaService: PwaService,
		googleAuthService: GoogleAuthService
	) { }

}
