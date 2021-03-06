import { Component, Input } from '@angular/core';
import { Video } from '../model/video.model';
import { LanguageService } from '../services/language.service';
import { ModalService } from '../services/modal.service';

@Component({
	selector: 'app-youtube-video-card',
	templateUrl: './youtube-video-card.component.html',
	styleUrls: ['./youtube-video-card.component.css']
})
export class YoutubeVideoCardComponent {

	@Input()
	video!: Video;

	constructor(
		private modalService: ModalService,
		private languageService: LanguageService
	) { }

	cardClick() {
		this.modalService.openLiveOptionsModel(this.video.id);
	}

	getLocaleLanguage() {
		return this.languageService.language.code;
	}

}
