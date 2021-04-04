import { Video } from './video.model';

export interface Search {
	search: string;
	videos: Array<Video>;
}