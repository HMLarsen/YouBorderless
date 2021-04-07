export interface TranscribeSupportedLanguage {
	name: string;
	bcp: string;
	punctuation: boolean;
	diarization: boolean;
	boost: boolean;
	confidence: boolean;
	profanityFilter: boolean;
}