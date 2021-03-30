import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { YoutubeLiveComponent } from './live/youtube-live/youtube-live.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'app' },
	{
		path: 'app', component: HomeComponent, children: [
			{ path: 'video/:videoId', component: YoutubeLiveComponent }
		]
	},
	{ path: 'history', component: HistoryComponent },
	{ path: 'subscriptions', component: SubscriptionsComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
