export interface YoutubeSearchResult {
	kind: string;
	etag: string;
	nextPageToken: string;
	regionCode: string;
	pageInfo: PageInfo;
	items: Item[];
}

export interface Item {
	kind: ItemKind;
	etag: string;
	id: ID;
	snippet: Snippet;
}

export interface ID {
	kind: IDKind;
	videoId: string;
}

export enum IDKind {
	YoutubeVideo = "youtube#video",
}

export enum ItemKind {
	YoutubeSearchResult = "youtube#searchResult",
}

export interface Snippet {
	publishedAt: string;
	channelId: string;
	title: string;
	description: string;
	thumbnails: Thumbnails;
	channelTitle: string;
	liveBroadcastContent: LiveBroadcastContent;
	publishTime: string;
}

export enum LiveBroadcastContent {
	Live = "live",
}

export interface Thumbnails {
	default: Default;
	medium: Default;
	high: Default;
}

export interface Default {
	url: string;
	width: number;
	height: number;
}

export interface PageInfo {
	totalResults: number;
	resultsPerPage: number;
}
