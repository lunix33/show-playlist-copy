This utility copy a playlist file (m3u8) through ffmpeg

The playlist is converted as a unified mkv file.

*Note*: Only work on linux since the location of ffmpeg is detected through the `which` command.

# Install

1. Copy the repository.
2. With the command prompt move within the folder directory.
3. Run `npm install`.

# Usage

## Environement variable

`PL_DESTINATION` : The destination of the files.

## Arguments

* `playlist-copy.js [-d <destination>] -f <file path>`
* `playlist-copy.js [-d <destination>] -u <playlist path> -t <title> -s <season number> -e <episode number>`

`-d` | `--destination`: The destination of the files.

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

# File structure

The files created by the utility will be stored as followed.

`<PL_DESTINATION|destination>/<title>/Season <season>/<title> S<season>E<episode>.mkv`

