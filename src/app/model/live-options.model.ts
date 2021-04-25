import * as uuid from 'uuid';
import { TranscribeSupportedLanguage } from './transcribe-supported-language';
import { TranslationSupportedLanguage } from './translation-supported-language';

export class LiveOptions {

	id!: string;
	liveId!: string;
	liveLanguage!: TranscribeSupportedLanguage;
	liveToLanguage!: TranslationSupportedLanguage;
	punctuation!: boolean;
	profanityFilter!: boolean;
	fastMode!: boolean;

	static newInstance(liveId: string, liveLanguage: TranscribeSupportedLanguage,
		liveToLanguage: TranslationSupportedLanguage, punctuation: boolean,
		profanityFilter: boolean, fastMode: boolean) {
		const options = new LiveOptions();
		options.id = uuid.v4();
		options.liveId = liveId;
		options.liveLanguage = liveLanguage;
		options.liveToLanguage = liveToLanguage;
		options.punctuation = punctuation;
		options.profanityFilter = profanityFilter;
		options.fastMode = fastMode;
		return options;
	}
}