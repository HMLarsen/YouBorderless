import * as uuid from 'uuid';

export class LiveOptions {

	id!: string;
	liveUrl!: string;

	static newInstance(liveUrl: string) {
		const options = new LiveOptions();
		options.id = uuid.v4();
		options.liveUrl = liveUrl;
		return options;
	}
}