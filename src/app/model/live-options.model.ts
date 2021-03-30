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

	static newInstance(liveId: string, liveLanguage: TranscribeSupportedLanguage,
		liveToLanguage: TranslationSupportedLanguage, punctuation: boolean, profanityFilter: boolean) {
		const options = new LiveOptions();
		options.id = uuid.v4();
		options.liveId = liveId;
		options.liveLanguage = liveLanguage;
		options.liveToLanguage = liveToLanguage;
		options.punctuation = punctuation;
		options.profanityFilter = profanityFilter;
		return options;
	}
}