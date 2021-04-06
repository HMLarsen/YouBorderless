import { Video } from './video.model';

export interface Search {
	search: string | undefined;
	videos: Array<Video>;
}