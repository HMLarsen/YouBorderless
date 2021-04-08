import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Search } from '../model/search.model';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { Video } from '../model/video.model';
import { UtilsService } from './utils.service';

@Injectable({
	providedIn: 'root'
})
export class YoutubeService {

	YOUTUBE_API_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
	lastSearch: Search | undefined;
	lastSubscriptionsSearch: Search | undefined;

	constructor(
		private http: HttpClient,
		private utilsService: UtilsService,
		private errorService: ErrorService
	) { }

	saveLastSearch(lastSearch: Search) {
		this.lastSearch = lastSearch;
	}

	getLastSearch() {
		return this.lastSearch;
	}

	saveLastSubscriptionsSearch(lastSubscriptionsSearch: Search | undefined) {
		this.lastSubscriptionsSearch = lastSubscriptionsSearch;
	}

	getLastSubscriptionsSearch() {
		return this.lastSubscriptionsSearch;
	}

	getLivesFromTerm(term: string, maxResults: number): Promise<Video[]> {
		return new Promise((res, rej) => {
			const url = environment.backEndUrl + '/search-lives';
			this.http.post<Video[]>(url, { term, maxResults })
				.subscribe((videos: Video[]) => {
					// refresh the last search even the compononent that calls this method is dead
					this.saveLastSearch({ search: term, videos })
					res(videos);
				}, err => {
					// error from too many requests
					// then let's use the youtube api authenticated from api key
					if (err.status === 429) {
						this.http.get(this.YOUTUBE_API_SEARCH_URL, {
							params: {
								key: environment.youtubeApiKey,
								q: term,
								part: 'snippet',
								eventType: 'live',
								type: 'video',
								maxResults: maxResults.toString()
							}
						}).subscribe((response: any) => {
							const videos: Video[] = [];
							response.items.forEach((item: any) => {
								videos.push({
									id: item.id.videoId,
									title: item.snippet.title,
									description: item.snippet.description,
									thumbnailUrl: item.snippet.thumbnails.high.url
								});
							});
							res(videos);
						}, err => rej(err));
					} else {
						rej(err);
					}
				});
		});
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
						gapi.client.youtube.subscriptions.list(request).execute(async (apiResponse: any) => {
							if (apiResponse.error) {
								reject(apiResponse.error);
								return;
							}
							const channelIds: string[] = [];
							const items = apiResponse.result.items;
							const nextPageToken = apiResponse.result.nextPageToken;
							items?.forEach((item: any) => {
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
									}, err => reject(err));
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
			getVideos([]).then(videos => {
				// refresh the last search even the compononent that calls this method is dead
				this.saveLastSubscriptionsSearch({ search: channelName, videos });
				resolve(videos);
			}, err => reject(err));
		});
	}

	getLiveVideoByChannels(channelsId: string[]) {
		const url = environment.backEndUrl + '/live-video-by-channels/';
		return this.http.post<Video[]>(url, { channelsId });
	}

	getVideoToLive(videoId: string) {
		const url = environment.backEndUrl + '/live-available/' + videoId;
		return this.http.get(url);
	}

	getVideoIdFromUrl(url: string) {
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		var match = url.match(regExp);
		return (match && match[7].length == 11) ? match[7] : false;
	}

	translateError(error: any) {
		if (error.status === 404) {
			return this.errorService.getBroadcastNotAvailableError();
		}
		if (error.code === 403 && error.message?.indexOf('insufficient authentication')) {
			return this.errorService.getPermissionError();
		}
		return this.errorService.getDefaultError();
	}

}
