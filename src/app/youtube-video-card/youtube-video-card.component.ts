import { Component, Input, OnInit } from '@angular/core';
import { LiveOptionsModalComponent } from '../live/live-options-modal/live-options-modal.component';
import { Item } from '../model/youtube-video.model';
import { ModalService } from '../services/modal.service';

@Component({
	selector: 'app-youtube-video-card',
	templateUrl: './youtube-video-card.component.html',
	styleUrls: ['./youtube-video-card.component.css']
})
export class YoutubeVideoCardComponent implements OnInit {

	@Input()
	video!: Item;

	constructor(private modalService: ModalService) { }

	ngOnInit(): void {
	}

	cardClick() {
		this.modalService.openLiveOptionsModel(this.video.id.videoId, this.video.snippet.title);
	}

}
