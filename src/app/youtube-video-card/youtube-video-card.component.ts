import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../model/youtube-video.model';

@Component({
	selector: 'app-youtube-video-card',
	templateUrl: './youtube-video-card.component.html',
	styleUrls: ['./youtube-video-card.component.css']
})
export class YoutubeVideoCardComponent implements OnInit {

	@Input()
	video!: Item;

	constructor() { }

	ngOnInit(): void {
	}

}
