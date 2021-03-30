import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../animations';
import { Search } from '../model/search.model';
import { ErrorService } from '../services/error.service';
import { ModalService } from '../services/modal.service';
import { YoutubeService } from '../services/youtube.service';

@Component({
	selector: 'app-youtube-search-list',
	templateUrl: './youtube-search-list.component.html',
	styleUrls: ['./youtube-search-list.component.css'],
	animations: [Animations.inOutAnimation]
})
export class YoutubeSearchListComponent implements OnInit {

	@Input()
	isSubscriptionsSearch!: boolean;
	lastSubscriptionSearch!: Search;

	searchForm!: FormGroup;
	loading = false;
	lastSearch!: Search;

	constructor(
		private formBuilder: FormBuilder,
		private youtubeService: YoutubeService,
		private errroService: ErrorService,
		private modalService: ModalService) { }

	ngOnInit(): void {
		this.searchForm = this.formBuilder.group({
			search: [{ value: null, disabled: this.loading }, [Validators.required]]
		});

		// if it's subscriptions user list, go on in search without form search
		if (this.isSubscriptionsSearch) {
			this.searchSubscriptions('');
		}
	}

	getLabelSearch() {
		let result = 'Pesquisar';
		if (!this.isSubscriptionsSearch) {
			result += ' (termo ou link da transmissão)';
		}
		return result;
	}

	searchSubscriptions(searchValue: string) {
		this.youtubeService
			.getLivesFromSubscriptions(10)
			.then((response: any) => {
				const lastSearch = {
					search: searchValue,
					videos: response.items
				};
				this.youtubeService.saveLastSubscriptionSearch(lastSearch);
				this.loading = false;
				this.lastSubscriptionSearch = {
					search: searchValue,
					videos: undefined
				};
				setTimeout(() => {
					this.updateSearchView();
				}, 500);
			}, error => {
				this.loading = false;
				this.youtubeService.doError(error);
			});
	}

	async defaultSearch(searchValue: string) {
		// if the user puts a video url from youtube
		const videoId = this.youtubeService.getVideoIdFromUrl(searchValue);
		if (videoId) {
			await this.youtubeService.getVideoToLive(videoId)
				.then((data: any) => {
					this.loading = false;
					const videoId = data.videoDetails.videoId;
					const videoTitle = data.videoDetails.title;
					this.modalService.openLiveOptionsModel(videoId, videoTitle);
				}, error => {
					this.loading = false;
					if (error.status === 404) {
						this.errroService.doError('Vídeo não disponível para reprodução');
					}
					this.searchForm.get('search')?.setValue('');
					return;
				});
		}
		if (videoId) {
			return;
		}

		this.youtubeService
			.getLivesFromTerm(searchValue, 10)
			.subscribe((response: any) => {
				const lastSearch = {
					search: searchValue,
					videos: response.items
				};
				this.youtubeService.saveLastSearch(lastSearch);
				this.loading = false;
				this.lastSearch = {
					search: searchValue,
					videos: undefined
				};
				setTimeout(() => {
					this.updateSearchView();
				}, 500);
			}, error => {
				this.loading = false;
				this.youtubeService.doError(error);
			});
	}

	async submit() {
		if (this.searchForm.invalid) {
			return;
		}
		this.loading = true;
		const value = this.searchForm.get('search')?.value;

		if (this.isSubscriptionsSearch) {
			this.searchSubscriptions(value);
		} else {
			this.defaultSearch(value);
		}
	}

	getVideos() {
		if (this.isSubscriptionsSearch) {
			return this.lastSubscriptionSearch?.videos;
		}
		return this.lastSearch?.videos;
	}

	updateSearchView() {
		let search;
		if (this.isSubscriptionsSearch) {
			search = this.youtubeService.getLastSubscriptionSearch();
			this.lastSubscriptionSearch = search;
		} else {
			search = this.youtubeService.getLastSearch();
			this.lastSearch = search;
		}
		if (search) {
			this.searchForm.get('search')?.setValue(search.search);
		}
	}

}
