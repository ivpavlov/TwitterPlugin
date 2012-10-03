## INSTALL

```html
<script type="text/javascript" src="TwitterPlugin.1.2.js"></script>
```
or
```html
<script type="text/javascript" src="TwitterPlugin.1.2.min.js"></script>
```

## SETUP

```javascript
$('.selector').twitterPlugin([options]);
```

## PLUGIN OPTIONS (defaults)

```javascript
twitter: 'twitter', // twitter ID
 
hashTag: '#twitter', // "hashtag"
 
twitForm: true, // enable\disable twit send form
 
height: '', // plugin height (default: auto)
 
cache: true, // AJAX JSON cache (default: cached)
 
count: 5, // max elements in feed
 
maxElements: 10, // max elements for twitter filter
 
excludeReplies: true, // exclude replies (default: excluded)
 
title: '<span style="font-size:110%;text-transform:uppercase;color:#333;">Твиттер</span>', // plugin html header 
 
twitsFeed: true, // enable\disable twit, mentions & hashtags
mentionsFeed: true,
hashesFeed: true,
 
twitsRefresh: false, // feeds refresh time in milliseconds (default: disabled); important: api.twitter.com allow only 150 request per hour for twits.
mentionsRefresh: false,
hashesRefresh: false, 
 
buttonSend: 'twit' // send button value in twit form
```

## EXAMPLES

Simple plugin setup:

```javascript
$('.selector').twitterPlugin({
	twitter: 'twitter',
	hashTag: '#twitter',
	maxElements: 40,
	count: 5, 
	twitsRefresh: 300000 
});
```

Setup plugin as real-time chat based on hashtags:

```javascript
$('.selector').twitterPlugin({
	twitter: 'twitter',
	hashTag: '#twitter',
	twitsFeed: false, 
	mentionsFeed: false, 
	hashesRefresh: 10000, 
	count: 30, 
	maxElements: 100, 
	height: '250px' 
});
```
