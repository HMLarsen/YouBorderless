import * as uuid from 'uuid';
import { TranscribeSupportedLanguage } from './transcribe-supported-language';
import { TranslationSupportedLanguage } from './translation-supported-language';

export class LiveOptions {

	id!: string;
	liveId!: string;
	liveLanguage!: TranscribeSupportedLanguage;
	liveToLanguage!: TranslationSupportedLanguage;

	static newInstance(liveId: string) {
		const options = new LiveOptions();
		options.id = uuid.v4();
		options.liveId = liveId;
		return options;
	}
}