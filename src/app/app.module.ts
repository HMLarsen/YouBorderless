import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentComponent } from './document/document.component';
import { environment } from '../environments/environment';

const config: SocketIoConfig = {
	url: environment.functionsHostUrl,
	options: {
		withCredentials: false,
	}
};

@NgModule({
	declarations: [
		AppComponent,
		DocumentListComponent,
		DocumentComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		SocketIoModule.forRoot(config)
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
