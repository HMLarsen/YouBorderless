export interface Video {
	id: string,
	title: string,
	description: string;
	thumbnailUrl: string;
	channel?: Channel;
	views?: number;
}

export interface Channel {
	name: string;
	avatarUrl: string;
}