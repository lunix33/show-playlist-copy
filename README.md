The utility allow to to copy video files from URL, or unify video playlist file (m3u8) into one video file.

This utility follow a TV show schema and ensure good recognition from TVDB Agent of Plex and Emby (for more detail see the `File structure` section).

# Dependancies

* [Node.js](https://nodejs.org/)
* [FFMPEG](https://www.ffmpeg.org/)

# Install

1. Copy the repository.
2. With the command prompt move within the folder directory.
3. Run `npm install`.

# Usage

## Environement variable

`PL_DESTINATION` : The destination of the files.

`FFMPEG_PATH`    : Path to the FFMPEG executable.

## Arguments

* `playlist-copy.js [-c <concurrent instances>] -f <file path>`
* `playlist-copy.js -u <playlist path> -t <title> -s <season number> -e <episode number>`

`-d` | `--destination`: The destination of the files.

`-p` | `--program`    : The path to the ffmpeg executable.

`-c` | `--concurrent` : Number of concurrent copies. (default: 5)

`-f` | `--file`       : Input file path.

`-u` | `--url`        : The playlist file url/path.

`-t` | `--title`      : The title of the show. (ex: "Breaking Bad")

`-s` | `--season`     : The season number. (ex: 02)

`-e` | `--episode`    : The episode number. (ex: 06)

## Input file

```
[
	{
		"playlist_url": "https://.../BreakingBadS01E06.m3u8",
		"title": "Breaking Bad",
		"season": "01",
		"episode": "06"
	}, ...
]
```

### Chrome extension

In the `chrome_ext` can be found a google chome extension (`chrome.crx`) allowing to generate the utility input file.

The extension listen for media and playlist requests and expose them as potential stream to be added to the input file.

The extension also allow to fully input all the entries manually.

When all steams are in place, you can use the download button in the popup window or the list management page to save the list on the computer.

*NOTE*: Because of an error with the latest stable release of chrome, the crx file was not generated. Will wait for a future release. For the time being, load the extense as an unpacked extension (developer mode must be active in the extension menu).

## Note

The path to the FFMPEG executable try to be automatically determined with `where` (windows) or `command -v` (linux)

If FFMPEG is not part of your `PATH`, you can use the `FFMPEG_PATH` environnement variable or the `--program` argument.

# File structure

The files created by the utility will be stored as followed.

`<PL_DESTINATION|destination>/<title>/Season <season>/<title> S<season>E<episode>.mkv`

