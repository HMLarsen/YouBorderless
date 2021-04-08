import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { fadeAnimation } from '../animations';
import { Search } from '../model/search.model';
import { Video } from '../model/video.model';
import { ErrorService } from '../services/error.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { ModalService } from '../services/modal.service';
import { UtilsService } from '../services/utils.service';
import { YoutubeService } from '../services/youtube.service';

@Component({
	selector: 'app-youtube-search-list',
	templateUrl: './youtube-search-list.component.html',
	styleUrls: ['./youtube-search-list.component.css'],
	animations: [fadeAnimation]
})
export class YoutubeSearchListComponent implements OnInit {

	@Input()
	isSubscriptionsSearch?: boolean;

	searchForm!: FormGroup;
	loading = false;
	loadingError?: string;
	lastSearch: Search | undefined;
	searchPlaceholder!: Observable<string>;

	MAX_SEARCH_RESULTS = 30;
	SEARCH_FIELD_MAX_LENGTH = 100;

	constructor(
		private formBuilder: FormBuilder,
		private youtubeService: YoutubeService,
		private errorService: ErrorService,
		private modalService: ModalService,
		private googleAuthService: GoogleAuthService,
		private utilsService: UtilsService,
		private translateService: TranslateService
	) { }

	ngOnInit(): void {
		this.updateLabelSearch();

		this.searchForm = this.formBuilder.group({
			search: [{ value: null, disabled: this.loading }, [
				Validators.required,
				Validators.maxLength(this.SEARCH_FIELD_MAX_LENGTH),
				this.utilsService.noWhitespaceFormValidator
			]]
		});

		// update current view for the latest search and force change the value of search field
		this.updateSearchView(true);

		// if it's subscriptions user list, go on in search without form search
		if (this.isSubscriptionsSearch && !this.lastSearch) {
			this.search();
		}
	}

	updateLabelSearch() {
		if (this.isSubscriptionsSearch) {
			this.searchPlaceholder = this.translateService.get('search.subscriptionsPlaceholder');
			return;
		}
		this.searchPlaceholder = this.translateService.get('search.termPlaceholder');
	}

	submit() {
		if (this.searchForm.invalid) {
			return;
		}
		const value = this.searchForm.get('search')?.value?.trim();
		this.search(value);

		// blur in search field for mobile users
		if (this.utilsService.isTouchDevice() && document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
	}

	async search(searchValue?: string) {
		this.loading = true;
		this.loadingError = undefined;

		// if the user puts a video url from youtube
		if (searchValue) {
			const videoId = this.youtubeService.getVideoIdFromUrl(searchValue);
			if (videoId) {
				await this.youtubeService.getVideoToLive(videoId).toPromise()
					.then(() => this.modalService.openLiveOptionsModel(videoId), error => this.doError(error))
					.finally(() => this.loading = false);
				return;
			}
		}
		if (this.isSubscriptionsSearch) {
			this.searchSubscriptions(searchValue);
		} else if (!!searchValue) {
			this.searchFromTerm(searchValue);
		}
	}

	searchSubscriptions(searchValue?: string) {
		this.loading = true;
		this.youtubeService.getLivesFromSubscriptions(searchValue)
			.then((videos: Video[]) => {
				this.youtubeService.saveLastSubscriptionsSearch({ search: searchValue, videos });
				this.updateSearchView();
			}, error => this.doError(error))
			.finally(() => this.loading = false);
	}

	searchFromTerm(searchValue: string) {
		this.loading = true;
		this.youtubeService.getLivesFromTerm(searchValue, this.MAX_SEARCH_RESULTS)
			.then((videos: Video[]) => {
				this.youtubeService.saveLastSearch({ search: searchValue, videos });
				this.updateSearchView();
			}, error => this.doError(error))
			.finally(() => this.loading = false);
	}

	getVideos() {
		return this.lastSearch?.videos;
	}

	async doError(error: any) {
		this.lastSearch = undefined;
		const message = await this.youtubeService.translateError(error);

		// if subscriptions always error in page
		if (this.isSubscriptionsSearch) {
			this.loadingError = message;
		} else {
			// snack error if does not have last search yet
			if (!this.youtubeService.getLastSearch()) {
				this.errorService.doError(message);
				return;
			}
			this.loadingError = message;
		}
	}

	updateSearchView(updateSearchField?: boolean) {
		let search: Search | undefined;
		if (this.isSubscriptionsSearch) {
			search = this.youtubeService.getLastSubscriptionsSearch();
		} else {
			search = this.youtubeService.getLastSearch();
		}
		this.lastSearch = search;
		this.utilsService.scrollTop();
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

}
