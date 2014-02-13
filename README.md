# Foobar2000 web UI

## What's this?

Foobar2000 web UI application consists of two parts:

- A Node.js server that controls Foobar2000 music player using [native CLI commands](http://wiki.hydrogenaudio.org/index.php?title=Foobar2000:Commandline_Guide) and [foo_controlserver component](https://code.google.com/p/foo-controlserver/) (a tcp/ip server for Foobar2000)

- A javascript-driven web application that allows the user to send basic Foobar2000 playback commands and adjust application volume level. Information about the track that is currently playing is also displayed and automatically updated when the track or playback status changes.

![ScreenShot](/doc/screenshot.png)

Multiple devices can connect to the server using the local network, and it's up to the user to block unwanted connections. By default the foobar plugin and server allow any connection from the network.

## Requirements

Requires Node.js version 0.10.23+ and Foobar2000 v1+.
Foobar2000 component foo_controlserver is also required. Download the component [from Google code](https://code.google.com/p/foo-controlserver/downloads/list).

Since Foobar2000 is only available for Windows, other operating systems are not supported for the server. User is assumed to run the server on the machine that Foobar2000 runs on.

## Installation

- install [Foobar2000](http://www.foobar2000.org/) player (though if you've read this far I think you might not need to)
- install [Node.js](http://nodejs.org/) (I recommend the Windows auto-installer)
- download [foo_controlserver](https://code.google.com/p/foo-controlserver/downloads/list) component and copy the .dll to "components" folder in Foobar2000 installation directory (restart foobar2000 if needed)
- download this repository and extract it somewhere
- open config.js in an editor and make necessary changes (if needed)
- navigate to the directory of this project using CMD or PowerShell (command line utility)
- run command `nmp install`

## Starting the server

- run command `npm start` or `node app.js`

## Extra information

### Web application browser support

Web UI was tested on newest stable version of 
- Google Chrome
- Firefox
- Internet Explorer
- Safari mobile (tested on iPad Mini Retina 2013)

Generally speaking only modern browsers (less than two years old) are supported.

Websocket connection (track information, volume) doesn't work on Internet Explorer 9 or older.

### Known issues

Foo_controlserver doesn't update track status if it's playing a track it can't "follow". This happens if the user queues tracks from media library and not from a playlist, or "cursor follows playback" option is not enabled in Foobar2000. Since this is a bug / missing feature in the component, I can't fix the issue.

I will add issues to the issue tracker for things that I'd like to improve or are not working yet.

### Planned features

- track history
- windows volume control
- album art through a web service (Discogs, Last.fm)
