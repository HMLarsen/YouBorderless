import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../animations';
import { Search } from '../model/search.model';
import { Video } from '../model/video.model';
import { ErrorService } from '../services/error.service';
import { GoogleAuthService } from '../services/google-auth.service';
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
	isSubscriptionsSearch?: boolean;

	searchForm!: FormGroup;
	loading = false;
	loadingError?: string;
	lastSearch: Search | undefined;
	MAX_SEARCH_RESULTS = 30;

	constructor(
		private formBuilder: FormBuilder,
		private youtubeService: YoutubeService,
		private errorService: ErrorService,
		private modalService: ModalService,
		private googleAuthService: GoogleAuthService
	) { }

	ngOnInit(): void {
		this.searchForm = this.formBuilder.group({
			search: [{ value: null, disabled: this.loading }, [Validators.required]]
		});

		// update current view for the latest search and force change the value of search field
		this.updateSearchView(true);

		// if it's subscriptions user list, go on in search without form search
		if (this.isSubscriptionsSearch && !this.lastSearch) {
			this.search();
		}
	}

	submit() {
		if (this.searchForm.invalid) {
			return;
		}
		const value = this.searchForm.get('search')?.value;
		this.search(value);
	}

	async search(searchValue?: string) {
		this.loading = true;
		this.loadingError = undefined;

		// if the user puts a video url from youtube
		if (searchValue) {
			const videoId = this.youtubeService.getVideoIdFromUrl(searchValue);
			if (videoId) {
				let error;
				await this.youtubeService.getVideoToLive(videoId).toPromise()
					.then((data: any) => {
						const videoId = data.videoDetails.videoId;
						this.modalService.openLiveOptionsModel(videoId);
					}, err => {
						this.searchForm.get('search')?.setValue('');
						const message = this.youtubeService.translateError(err);
						this.errorService.doError(message);
						error = err;
					})
					.finally(() => this.loading = false);
				if (error) {
					return;
				}
			}
		}
		if (this.isSubscriptionsSearch) {
			this.searchSubscriptions(searchValue);
		} else if (!!searchValue) {
			this.searchFromTerm(searchValue);
		}
	}

	searchSubscriptions(searchValue?: string) {
		this.youtubeService.getLivesFromSubscriptions(searchValue)
			.then((videos: Video[]) => {
				this.youtubeService.saveLastSubscriptionsSearch({ search: searchValue, videos });
				this.updateSearchView();
			}, error => {
				this.lastSearch = undefined;
				const message = this.youtubeService.translateError(error);
				// snack error if does not have last search yet
				if (!this.youtubeService.getLastSearch()) {
					this.errorService.doError(message);
					return;
				}
				this.loadingError = message;
			})
			.finally(() => this.loading = false);
	}

	searchFromTerm(searchValue: string) {
		this.youtubeService.getLivesFromTerm(searchValue, this.MAX_SEARCH_RESULTS)
			.then((videos: Video[]) => {
				this.youtubeService.saveLastSearch({ search: searchValue, videos });
				this.updateSearchView();
			}, error => {
				this.lastSearch = undefined;
				const message = this.youtubeService.translateError(error);
				// snack error if does not have last search yet
				if (!this.youtubeService.getLastSearch()) {
					this.errorService.doError(message);
					return;
				}
				this.loadingError = message;
			})
			.finally(() => this.loading = false);
	}

	getVideos() {
		return this.lastSearch?.videos;
	}

	updateSearchView(updateSearchField?: boolean) {
		let search: Search | undefined;
		if (this.isSubscriptionsSearch) {
			search = this.youtubeService.getLastSubscriptionsSearch();
		} else {
			search = this.youtubeService.getLastSearch();
		}
		this.lastSearch = search;
		if (updateSearchField && search) {
			this.searchForm.get('search')?.setValue(search.search);
		}
	}

	isAuthenticated() {
		return this.googleAuthService.isAuthenticated();
	}

	clearSearch() {
		this.searchForm.get('search')?.setValue('');
		if (this.isSubscriptionsSearch) {
			this.searchSubscriptions();
		}
	}

	videosTrackBy(index: number, video: Video) {
		return video.id;
	}

	getLabelSearch() {
		let result = 'Pesquisar (termo ou URL da transmissão)';
		if (this.isSubscriptionsSearch) {
			result = 'Pesquisar (nome do canal ou URL da transmissão)';
		}
		return result;
	}

}
