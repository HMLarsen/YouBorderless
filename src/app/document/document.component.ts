import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { Document } from '../document';
import { DocumentService } from '../document.service';

@Component({
	selector: 'app-document',
	templateUrl: './document.component.html',
	styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit, OnDestroy {
	document: Document = new Document;
	private _docSub: Subscription = new Subscription;

	constructor(private documentService: DocumentService) { }

	ngOnInit() {
		this._docSub = this.documentService.currentDocument.pipe(
			startWith({ id: '', doc: 'Select an existing document or create a new one to get started' })
		).subscribe(document => this.document = document);
	}

	ngOnDestroy() {
		this._docSub.unsubscribe();
	}

	editDoc() {
		this.documentService.editDocument(this.document);
	}
}