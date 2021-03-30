export interface LiveCaptions {
	id: string,
	data: {
		time: number,
		text: string,
		isFinal: boolean
	}
}