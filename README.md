# Foobar2000 web UI

Foobar2000 web UI application consists of two parts:

- A Node.js server that controls Foobar2000 music player using [native CLI commands](http://wiki.hydrogenaudio.org/index.php?title=Foobar2000:Commandline_Guide) and [foo_controlserver component](https://code.google.com/p/foo-controlserver/) (a tcp/ip server for Foobar2000)

- A web application that allows the user to send basic Foobar2000 playback commands and adjust application volume level. Information about the track that is currently playing is also displayed and automatically updated when the track or playback status changes.

![ScreenShot](/doc/screenshot.png)

Multiple devices can connect to the server using the local network, and it's up to the user to block unwanted connections. By default the foobar plugin and server allow any connection from the network.


## Features

- supports all basic Foobar2000 controls
    - playback (play/pause/stop, next/prev and random track)
    - volume (mute, up/down)
- current track is displayed (along with artist/album information)
    - the track view is updated automatically when track changes
- notifications about server and Foobar2000 status
    - user is notified is the server disconnects
    - user is notified when Foobar2000 application is closed
        - user can start Foobar2000 from the UI
- extremely fast and reactive UI
    - no delay in controls
    - volume and track status are updated real-time

## Requirements

Requires Node.js version 6+ and Foobar2000 v1+. For older versions of Node (down to 0.10.23), see [this tag] (https://github.com/klemola/foobar2000-web-ui/tree/legacy_nodejs).
Foobar2000 component foo_controlserver is also required. Download the component [from Google code](https://code.google.com/p/foo-controlserver/downloads/list).

Since Foobar2000 is only available for Windows, other operating systems are not supported for the server. User is assumed to run the server on the machine that Foobar2000 runs on.

## Installation

- download [foo_controlserver](https://code.google.com/p/foo-controlserver/downloads/list) component and copy the .dll to "components" directory in Foobar2000 installation directory (restart foobar2000 if needed)
- clone this repository
- (optional) open config.js in an editor and make necessary changes
- navigate to the directory of this project using terminal (cmd.exe) or PowerShell
- run command `nmp install`

## Starting the server

- start Foobar2000
- run command `npm start` in terminal

## Running tests

- run command `npm test` in terminal

## Web application browser support

Web UI was tested on newest stable version of
- Google Chrome
- Firefox
- Internet Explorer
- Safari mobile

Generally speaking only recent versions of modern browsers are supported.

## Known issues

Foo_controlserver doesn't update track status if it's playing a track it can't "follow". This happens if the user queues tracks from media library and not from a playlist, or "cursor follows playback" option is not enabled in Foobar2000. Since this is a bug / missing feature in the component, I can't fix the issue.

I will add issues to the issue tracker for things that I'd like to improve or are not working yet.

## Planned features

- track history
- album art through a web service (Discogs, Last.fm)
- search music library and queue music / playlist
