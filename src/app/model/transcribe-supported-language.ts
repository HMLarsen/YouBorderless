export interface TranscribeSupportedLanguage {
	name: string;
	bcp: string;
	models: Array<string>;
	punctuation: boolean;
	diarization: boolean;
	boost: boolean;
	confidence: boolean;
	profanity: boolean;
}