# About data sent by foobar_controlserver

Initial message upon connection looks like this:

Message 1:

```
999|Connected to foobar2000 Control Server v1.0.1|
999|Accepted client from 127.0.0.1|
999|There are currently 2/10 clients connected|
999|Type '?' or 'help' for command information|
```

Message 2 (and subsequent playback status messages):

```
113|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|?|Bronchitis (entire)|745|
```

If music is not playing when user connects, messages 1 and 2 will be merged.

Changes in volume look like this:

```
222|-1.58|
```
