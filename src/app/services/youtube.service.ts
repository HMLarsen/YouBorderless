import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Search } from '../model/search.model';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';

@Injectable({
	providedIn: 'root'
})
export class YoutubeService {

	lastSearch!: Search;
	lastSubscriptionSearch!: Search;

	constructor(
		private http: HttpClient,
		private errorService: ErrorService
	) { }

	doError(response: any) {
		const reason = response.error.error.errors[0].reason;
		let message;
		switch (reason) {
			case 'quotaExceeded':
				message = 'A cota de requisições foi excedida'
				break;

			default:
				message = 'Ocorreu um erro ao processar a requisição'
				break;
		}
		this.errorService.doError(message);
	}

	saveLastSearch(lastSearch: Search) {
		this.lastSearch = lastSearch;
	}

	getLastSearch() {
		return this.lastSearch;
	}

	saveLastSubscriptionSearch(lastSubscriptionSearch: Search) {
		this.lastSubscriptionSearch = lastSubscriptionSearch;
	}

	getLastSubscriptionSearch() {
		return this.lastSubscriptionSearch;
	}

	getLivesFromTerm(term: string, maxResults: number) {
		//return of(data);
		const url = 'https://www.googleapis.com/youtube/v3/search';
		return this.http.get(url, {
			params: {
				key: environment.youtubeApiKey,
				q: term,
				part: 'snippet',
				eventType: 'live',
				type: 'video',
				maxResults: maxResults.toString()
			}
		});
	}

	getLivesFromSubscriptions(maxResults: number) {
		//return of(data);
		return new Promise((resolve, reject) => {
			const request = gapi.client.youtube.subscriptions.list({
				mine: true,
				part: 'snippet',
				maxResults: maxResults
			});
			request.execute(response => resolve(response));
		});
	}

	getVideoToLive(videoId: string) {
		const url = environment.backEndUrl + '/live-info/' + videoId;
		return this.http.get(url).toPromise();
	}

	getVideoIdFromUrl(url: string) {
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		var match = url.match(regExp);
		return (match && match[7].length == 11) ? match[7] : false;
	}
}
