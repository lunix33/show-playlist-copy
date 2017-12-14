#!/usr/bin/env node

const process = require('process');
const subprocess = require('child_process');
const argv = require('minimist')(process.argv.splice(2));

const ffmpeg_path = subprocess.execSync('which ffmpeg').toString().slice(0, -1);
const base_path =  argv.d || argv.destination || process.env.PL_DESTINATION || './';
const concurrent = 5;

let entries = [], current = 0;

(function main(argv) {
	if (argv.help || argv.h) {
		console.log(`
 Usages:
	(...) --help

	(...) [--destination <destination path>] 
	       --file <file path>

	(...) [--destination <destination path>] 
	       --url <playlist url> 
	       --title <title> 
	       --season <season number> 
	       --episode <episode number>

 --help        | -h : Display this help menu.
 --destination | -d : Created files destination.
 --file        | -f : The path to the input file.
 --url         | -u : The url of the file playlist file.
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

	const path = `${base_path}/${title}/Season ${season}/`
	const filename = `${title} S${season}E${episode}.mkv`;
	const full = `${path}${filename}`;

	// Create the folder
	subprocess.execSync(`mkdir -p "${path}"`);
	// Start copy process.
	const process = subprocess.spawn(ffmpeg_path, [
		'-i', playlist_url,
		'-c', 'copy',
		full
	]);

	// Action on output message.
	process.stdout.on('data', (data) => {
		console.log(`[${id}: out] ${data}`);
	});

	// Action on error message.
	process.stderr.on('data', (data) => {
		console.log(`[${id}: err] ${data}`);
	});
	
	// Action when process is closing.
	process.on('close', (code) => {
		console.log(`[${id}: ifo] ${title} S${season}E${episode} done.`);
		setTimeout(next);
	});

	process.on('error', (e) => {
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

