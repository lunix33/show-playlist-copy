#!/usr/bin/env node

const subprocess = require('child_process');
const path = require('path');
const argv = require('minimist')(process.argv.splice(2));

/*
 * Find FFMPEG location.
 * Order:
 * 	1. p or program argument.
 * 	2. FFMPEG_PATH environnement variable.
 * 	3. through system specific location command (`where` for windows, and `command -v` for unix).
 */
let ffmpeg_path = argv.p || argv.program ||
	                process.env.FFMPEG_PATH;
try {
	if (/^win/.test(process.platform)) {
		ffmpeg_path = ffmpeg_path || subprocess.execSync('where ffmpeg').toString().slice(0, -2);
	} else {
		ffmpeg_path = ffmpeg_path || subprocess.execSync('command -v ffmpeg').toString().slice(0, -1);
	}
} catch (e) {
	console.log('Unable to find FFMPEG in $PATH.');
	process.exit(1);
}

const base_path =  argv.d || argv.destination || process.env.PL_DESTINATION || './';
const concurrent = argv.c || argv.concurrent || 5;

let entries = [], current = 0;

(function main(argv) {
	if (argv.help || argv.h) {
		console.log(`
 Usages:
	(...) --help

	(...) [--destination <destination path>]
	      [--program <ffmpeg location>]
	      [--concurrent <concurrent instances>]
	       --file <file path>

	(...) [--destination <destination path>]
	      [--program <ffmpeg location>]
	       --url <playlist url> 
	       --title <title> 
	       --season <season number> 
	       --episode <episode number>

 --help        | -h : Display this help menu.
 --destination | -d : Created files destination.
 --program     | -p : The ffmpeg location.
 --concurrent  | -c : Concurrent copies.
 --file        | -f : The path to the input file.
 --url         | -u : The url of the input file (m3u8 or video file).
 --title       | -t : The title of the show.
 --season      | -s : The season number (ex: 01).
 --episode     | -e : The episode number (ex: 06).
 `);
	} else if (argv.file || argv.f) {
		entries = require(argv.file || argv.f);
		for (let i = 0; i < concurrent; i++) {
			next();
		}
	} else {
		const playlist_url = (argv.url || argv.u);
		const title = (argv.title || argv.t);
		const season = (argv.season || argv.s);
		const episode = (argv.episode || argv.e);
		
		run(
			0,
			playlist_url,
			title,
			season,
			episode);
	}
})(argv);

/**
 * Run an entry.
 */
function run(id, playlist_url, title, season, episode) {
	season = pad(season);
	episode = pad(episode);

	const file_path = path.join(base_path, title, `Season ${season}`);
	const filename = `${title} S${season}E${episode}.mkv`;
	const full = path.join(file_path, filename);

	// Create the folder
	if (/^win/.test(process.platform)) {
		try {
			subprocess.execSync(`mkdir "${file_path}"`);
		} catch (e) { /* Ignore error */ }
	} else
		subprocess.execSync(`mkdir -p "${file_path}"`);
	
	// Start copy process.
	const ffmpeg_process = subprocess.spawn(ffmpeg_path, [
		'-i', playlist_url,
		'-c', 'copy',
		full
	]);

	// Action on output message.
	ffmpeg_process.stdout.on('data', (data) => {
		console.log(`[${id}: out] ${data}`);
	});

	// Action on error message.
	ffmpeg_process.stderr.on('data', (data) => {
		console.log(`[${id}: err] ${data}`);
	});
	
	// Action when process is closing.
	ffmpeg_process.on('close', (code) => {
		console.log(`[${id}: ifo] ${title} S${season}E${episode} done.`);
		setTimeout(next);
	});

	ffmpeg_process.on('error', (e) => {
		console.log(e);
	});
}

/**
 * Run next entry.
 */
function next() {
	const entry = entries.pop();
	if (entry) {
		run(
			++current,
			entry.playlist_url,
			entry.title,
			entry.season,
			entry.episode);
	}
}

function pad(num) {
	if (num.toString().length == 1) {
		return `0${num}`;
	}
	return num;
}

