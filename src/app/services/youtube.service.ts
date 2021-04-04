import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Search } from '../model/search.model';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { Observable } from 'rxjs';
import { Video } from '../model/video.model';
import { UtilsService } from './utils.service';

@Injectable({
	providedIn: 'root'
})
export class YoutubeService {

	lastSearch!: Search;
	lastSubscriptionSearch: Search | undefined;

	constructor(
		private http: HttpClient,
		private utilsService: UtilsService
	) { }

	saveLastSearch(lastSearch: Search) {
		this.lastSearch = lastSearch;
	}

	getLastSearch() {
		return this.lastSearch;
	}

	saveLastSubscriptionSearch(lastSubscriptionSearch: Search | undefined) {
		this.lastSubscriptionSearch = lastSubscriptionSearch;
	}

	getLastSubscriptionSearch() {
		return this.lastSubscriptionSearch;
	}

	getLivesFromTerm(term: string, maxResults: number): Promise<Video[]> {
		const url = environment.backEndUrl + '/search-lives';
		return this.http.post<Video[]>(url, { term, maxResults }).toPromise();
	}

	getLivesFromSubscriptions(channelName?: string): Promise<Video[]> {
		return new Promise((resolve, reject) => {
			const thiz = this;
			const maxResults = 50; // api limit

			// recursive function for pagination
			function getVideos(currentVideos: Video[], pageToken?: string): Promise<Video[]> {
				return new Promise((resolve, reject) => {
					try {
						const request: any = {
							part: 'snippet',
							mine: true,
							maxResults: maxResults,
							order: 'alphabetical' // if another ordenation the pages does not make sense
						};
						if (pageToken) {
							request.pageToken = pageToken;
						}
						gapi.client.youtube.subscriptions.list(request).execute(async apiResponse => {
							const channelIds: string[] = [];
							const items = apiResponse.result.items;
							const nextPageToken = apiResponse.result.nextPageToken;
							items?.forEach(item => {
								const channelId = item.snippet?.resourceId?.channelId;
								const channelTitle = item.snippet?.title;
								if (channelId && (!channelName || thiz.utilsService.searchInNormalizedStrings(channelTitle!, channelName))) {
									channelIds.push(channelId);
								}
							});
							if (channelIds.length > 0) {
								await thiz.getLiveVideoByChannels(channelIds).toPromise()
									.then(async (serverResponse: Video[]) => {
										currentVideos.push.apply(currentVideos, serverResponse);
									}).catch(err => reject(err));
							}
							if (nextPageToken) {
								await getVideos(currentVideos, nextPageToken);
							}
							resolve(currentVideos);
						});
					} catch (err) {
						reject(err);
					}
				});
			}
			getVideos([]).then(videos => resolve(videos)).catch(err => reject(err));
		});
	}

	getLiveVideoByChannels(channelsId: string[]): Observable<Video[]> {
		const url = environment.backEndUrl + '/live-video-by-channels/';
		return this.http.post<Video[]>(url, { channelsId });
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
