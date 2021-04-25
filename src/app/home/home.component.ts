import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { YoutubeService } from '../services/youtube.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	videoId = '';

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private title: Title,
		private translateService: TranslateService,
		private youtubeService: YoutubeService
	) { }

	ngOnInit(): void {
		this.setTitle();
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.videoId = this.activatedRoute.firstChild?.snapshot.params['videoId'];
	}

	async setTitle() {
		if (this.router.url.includes('/video/')) return;
		const title = await this.translateService.get('home').toPromise();
		this.title.setTitle(`${title} - YouBorderless`);
	}

	getLastSearch() {
		return this.youtubeService.getLastSearch();
	}

}
