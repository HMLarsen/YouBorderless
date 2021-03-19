import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { Search } from '../model/search.model';
import { YoutubeService } from '../services/youtube.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	animations: [
		trigger(
			'inOutAnimation',
			[
				transition(
					':enter',
					[
						style({ height: 0, opacity: 0 }),
						animate('200ms ease-out',
							style({ height: 300, opacity: 1 }))
					]
				),
				transition(
					':leave',
					[
						style({ height: 300, opacity: 1 }),
						animate('200ms ease-in',
							style({ height: 0, opacity: 0 }))
					]
				)
			]
		)
	]
})
export class HomeComponent implements OnInit {

	searchForm!: FormGroup;
	lastSearch!: Search;
	loading = false;

	constructor(
		private formBuilder: FormBuilder,
		private youtubeService: YoutubeService
	) { }

	ngOnInit(): void {
		this.searchForm = this.formBuilder.group({
			search: [null, { disabled: true }, [Validators.required]]
		});
		this.updateSearchView();
	}

	async submit() {
		if (this.searchForm.invalid) {
			return;
		}
		this.loading = true;
		const value = this.searchForm.get('search')?.value;

		// if the user puts a video url from youtube
		const videoId = this.youtubeService.getVideoIdFromUrl(value);
		if (videoId) {
			await this.youtubeService.getVideoToLive(videoId)
				.then((data: any) => {
					this.loading = false;
					alert(data.videoDetails.isLive);
				}, error => {
					this.loading = false;
					if (error.status === 404) {
						this.youtubeService.openSnackBar('Vídeo não disponível para reprodução');
					}
					this.searchForm.get('search')?.setValue('');
					return;
				});
		}
		if (videoId) {
			return;
		}

		this.youtubeService
			.getLivesFromTerm(value, 30)
			.subscribe((response: any) => {
				const lastSearch = {
					search: value,
					videos: response.items
				};
				this.youtubeService.saveLastSearch(lastSearch);
				this.loading = false;
				this.lastSearch = {
					search: value,
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

	updateSearchView() {
		const lastSearch = this.youtubeService.getLastSearch();
		if (lastSearch) {
			this.lastSearch = lastSearch;
			this.searchForm.get('search')?.setValue(lastSearch.search);
		}
	}

}
