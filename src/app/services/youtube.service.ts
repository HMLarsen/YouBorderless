import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Search } from '../model/search.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import data from '../services/youtube-mock-data.json';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class YoutubeService {

	//apiKey = 'AIzaSyDb4uG9fN6fPe6M0kI5A87EL5XNhHWSqTM'; // youborderless
	apiKey = 'AIzaSyCs7vpVckVbSu9mUcJ_mbunh7WP7v4VyBs'; // huguera
	lastSearch!: Search;

	constructor(
		private http: HttpClient,
		private _snackBar: MatSnackBar
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
		this.openSnackBar(message);
	}

	openSnackBar(message: string) {
		this._snackBar.open(message, undefined, {
			panelClass: 'custom-snackbar',
			duration: 3000
		});
	}

	saveLastSearch(lastSearch: Search) {
		this.lastSearch = lastSearch;
	}

	getLastSearch() {
		return this.lastSearch;
	}

	getLivesFromTerm(term: string, maxResults: number) {
		return of(data);
		let url = 'https://www.googleapis.com/youtube/v3/search';
		return this.http.get(url, {
			params: {
				key: this.apiKey,
				q: term,
				part: 'snippet',
				eventType: 'live',
				type: 'video',
				maxResults: maxResults.toString()
			}
		});
	}

	getVideoToLive(videoId: string) {
		const url = environment.backEndUrl + '/video-to-live/' + videoId;
		return this.http.get(url).toPromise();
	}

	getVideoIdFromUrl(url: string) {
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		var match = url.match(regExp);
		return (match && match[7].length == 11) ? match[7] : false;
	}
}
