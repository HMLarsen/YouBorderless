var express = require('express');
const chalk = require('chalk');
const { Writable } = require('stream');
const fs = require('fs');
const ytdl = require('ytdl-core');
const speech = require('@google-cloud/speech').v1p1beta1;

const client = new speech.SpeechClient();

const options = {
	encoding: 'MP3',
	sampleRateHertz: 44000,
	languageCode: 'ja-JP',
	streamingLimit: 290000,
	//enableAutomaticPunctuation: true,
	useEnhanced: true
};

const config = {
	encoding: options.encoding,
	sampleRateHertz: options.sampleRateHertz,
	languageCode: options.languageCode,
};

const request = {
	config,
	interimResults: true,
};

let recognizeStream = null;
let restartCounter = 0;
let audioInput = [];
let lastAudioInput = [];
let resultEndTime = 0;
let isFinalEndTime = 0;
let finalRequestEndTime = 0;
let newStream = true;
let bridgingOffset = 0;
let lastTranscriptWasFinal = false;

function startStream() {
	// Clear current audioInput
	audioInput = [];
	// Initiate (Reinitiate) a recognize stream
	recognizeStream = client
		.streamingRecognize(request)
		.on('error', err => {
			if (err.code === 11) {
				// restartStream();
			} else {
				console.error('API request error ' + err);
			}
		})
		.on('data', speechCallback);

	// Restart stream when streamingLimit expires
	setTimeout(restartStream, options.streamingLimit);
}

const speechCallback = stream => {
	// Convert API result end time from seconds + nanoseconds to milliseconds
	resultEndTime =
		stream.results[0].resultEndTime.seconds * 1000 +
		Math.round(stream.results[0].resultEndTime.nanos / 1000000);

	// Calculate correct time based on offset from audio sent twice
	const correctedTime = resultEndTime - bridgingOffset + options.streamingLimit * restartCounter;

	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	let stdoutText = '';
	if (stream.results[0] && stream.results[0].alternatives[0]) {
		stdoutText = correctedTime + ': ' + stream.results[0].alternatives[0].transcript;
	}

	for (const s of sockets) {
		s.emit('data', { data: stdoutText });
	}

	if (stream.results[0].isFinal) {
		process.stdout.write(chalk.green(`${stdoutText}\n`));
		isFinalEndTime = resultEndTime;
		lastTranscriptWasFinal = true;
	} else {
		// Make sure transcript does not exceed console character length
		if (stdoutText.length > process.stdout.columns) {
			stdoutText = stdoutText.substring(0, process.stdout.columns - 4) + '...';
		}
		process.stdout.write(chalk.red(`${stdoutText}`));
		lastTranscriptWasFinal = false;
	}
};

const audioInputStreamTransform = new Writable({
	write(chunk, encoding, next) {
		if (newStream && lastAudioInput.length !== 0) {
			// Approximate math to calculate time of chunks
			const chunkTime = options.streamingLimit / lastAudioInput.length;
			if (chunkTime !== 0) {
				if (bridgingOffset < 0) {
					bridgingOffset = 0;
				}
				if (bridgingOffset > finalRequestEndTime) {
					bridgingOffset = finalRequestEndTime;
				}
				const chunksFromMS = Math.floor(
					(finalRequestEndTime - bridgingOffset) / chunkTime
				);
				bridgingOffset = Math.floor(
					(lastAudioInput.length - chunksFromMS) * chunkTime
				);

				for (let i = chunksFromMS; i < lastAudioInput.length; i++) {
					recognizeStream.write(lastAudioInput[i]);
					process.stdout.write('cima ');
				}
			}
			newStream = false;
		}

		audioInput.push(chunk);

		if (recognizeStream) {
			recognizeStream.write(chunk);
			process.stdout.write('baixo ');
		}

		next();
	},

	final() {
		if (recognizeStream) {
			recognizeStream.end();
		}
	},
});

function restartStream() {
	if (recognizeStream) {
		recognizeStream.removeListener('data', speechCallback);
		recognizeStream = null;
	}
	if (resultEndTime > 0) {
		finalRequestEndTime = isFinalEndTime;
	}
	resultEndTime = 0;

	lastAudioInput = [];
	lastAudioInput = audioInput;

	restartCounter++;

	if (!lastTranscriptWasFinal) {
		process.stdout.write('\n');
	}
	process.stdout.write(
		chalk.yellow(`${options.streamingLimit * restartCounter}: RESTARTING REQUEST\n`)
	);

	newStream = true;
	startStream();
}

console.log('=========================================================================================================');

startStream();

// ##### socket
const app = express();
const server = require('http').createServer(app);
io = require('socket.io')(server);
let sockets = new Set();

app.use(express.static(__dirname + '/dist'));

io.on('connection', socket => {

	sockets.add(socket);
	console.log(`Socket ${socket.id} added`);

	let ytdlConfig = {
		format: 'audioonly',
		quality: 'highestaudio',
		dlChunkSize: 10,
		liveBuffer: 2000,
		highWaterMark: 512
	};

	ytdl('https://youtu.be/yF2va6QbnOs', ytdlConfig)
		//ytdl('https://www.youtube.com/watch?v=EH1ml65d-1E', ytdlConfig) // english
		.pipe(audioInputStreamTransform);

	socket.on('clientdata', data => {
		console.log(data);
	});

	socket.on('disconnect', () => {
		console.log(`Deleting socket: ${socket.id}`);
		sockets.delete(socket);
		console.log(`Remaining sockets: ${sockets.size}`);
	});

});

server.listen(8080);
