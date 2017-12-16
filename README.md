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

## Note

The path to the FFMPEG executable try to be automatically determined with `where` (windows) or `command -v` (linux)

If FFMPEG is not part of your `PATH`, you can use the `FFMPEG_PATH` environnement variable or the `--program` argument.

# File structure

The files created by the utility will be stored as followed.

`<PL_DESTINATION|destination>/<title>/Season <season>/<title> S<season>E<episode>.mkv`

