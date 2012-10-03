/**
 * @author info@ivpavlov.ru
 */
(function($) {
	var defaults = {
		twitter: 'twitter', // twitter accaunt id
		hashTag: '#twitter', // twitter hash tag for hash feed and twit text
		twitForm: true, // show twit send form
		count: 5, // max elements in feeds blocks
		maxElements: 10, // max elements for twitter api filter, max = 100
		height: '', // css height of plugin block
		cache: true, // JSON request cashed by default
		
		twitsFeed: true, // enable\disable twits, mentions and hash feed blocks and buttons
		mentionsFeed: true,
		hashesFeed: true,
		
		twitsRefresh: false, // feeds refresh time in milliseconds
		mentionsRefresh: false,
		hashesRefresh: false,
		
		excludeReplies: true, // excluding replay twits from twitter feed
		title: '<span style="font-size:110%;text-transform:uppercase;color:#333;">Twitter</span>', // plugin title
		buttonSend: 'twit' // send button value
	};
 
	$.fn.twitterPlugin = function(params){
		var options = $.extend({}, defaults, options, params),
			_THIS_ = this,
			// buttons styles
			buttonStyle = 'border-top:1px solid #ffffff;background:#dfdfdf;background:-webkit-gradient(linear, left top, left bottom, from(#ededed), to(#dfdfdf));background:-webkit-linear-gradient(top, #ededed, #dfdfdf);background:-moz-linear-gradient(top, #ededed, #dfdfdf);background:-ms-linear-gradient(top, #ededed, #dfdfdf);background:-o-linear-gradient(top, #ededed, #dfdfdf);padding:3px 9px;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;-webkit-box-shadow:rgba(0,0,0,.5) 0 1px 3px;-moz-box-shadow:rgba(0,0,0,.5) 0 1px 3px;box-shadow:rgba(0,0,0,.5) 0 1px 3px;text-shadow:rgba(0,0,0,.5) 0 1px 0;color:#777777;font-size:12px;font-weight:bold;font-family:arial;text-decoration:none;vertical-align:middle;text-shadow:1px 1px 0px #ffffff;padding:3px 7px;float:right;margin:0 10px 10px 0;outline:none;',
			buttonsHTML = '',
			sendTwitForm = '',
			feedsHTML = '',
			buttonsCount = 0;
		
		// cache ajax response (cache default)
		if (!options.cache) $.ajaxSetup({cache: false});
			
		// buttons and feeds HTML, and event listeners for feeds blocks
		if (options.twitsFeed) {
			buttonsHTML += '<a href="#" title="Twits feed" class="twitterTwitsButton buttons" style="' + buttonStyle + 'float:left;">' + options.twitter + '</a>';
			feedsHTML += '<div class="twitterTwits" style="display:none;"></div>';
			buttonsCount++;
		}
		
		if (options.mentionsFeed) {
			buttonsHTML += '<a href="#" title="Mentions feed" class="twitterMentionButton buttons" style="' + buttonStyle + 'float:left;">@</a>';
			feedsHTML += '<div class="twitterMention" style="display:none;"></div>';
			buttonsCount++;
		}
		
		if (options.hashesFeed) {
			buttonsHTML += '<a href="#" title="Hash tags feed" class="twitterHashButton buttons" style="' + buttonStyle + 'float:left;padding:3px 9px;">#</a>';
			feedsHTML += '<div class="twitterHash" style="display:none;"></div>';
			buttonsCount++;
		}
		
		// clear feeds buttons if only one
		if (buttonsCount < 2) buttonsHTML = '';
		
		// show\hide button for send twit form
		if (options.twitForm) {
			buttonsHTML += '<a href="#" class="twitterSendButton buttons" style="' + buttonStyle + 'float:right;">' + options.buttonSend + '</a>';
			sendTwitForm = '\
				<div class="twitterSubmit" style="width:285px;display:none;float:right;overflow:visible;background:#F3F3F3;border:1px #e4e4e4 solid;margin-bottom:10px;clear:both;">\
					<div id="twitterLogo" style="width:65px;height:65px;padding:5px 0 5px 5px;float:left;">\
						<img width="65" height="65" alt="twitter" style="border:1px #e4e4e4 solid;" src="https://twitter.com/images/resources/twitter-bird-blue-on-white.png" />\
					</div>\
					<textarea id="twitterMessage" style="border:1px #e4e4e4 solid;margin:5px 0 5px 7px;padding:3px;font-size:110%;color:#666;width:195px;height:90px;resize:none;">' + options.hashTag + ' </textarea>\
					<a href="#" class="twitterSbmtBtn buttons" style="' + buttonStyle + '">' + options.buttonSend + '</a>\
					<div id="twitterLetters" style="' + buttonStyle + 'float:right;margin-right:10px;">' + (options.hashTag.length + 1) + '</div>\
				</div>';
		}
		
		// insert plugin html and styles
		$(_THIS_).css({'overflow': 'hidden', 'display': 'block'}).append('\
			<p class="twitterTitle" style="display:block;margin:10px 0;">' + options.title + '</p>\
			<div class="twitterButtons" style="margin-left:10px;">' 
			+ buttonsHTML + 
			'</div>'
			+ sendTwitForm +
			'<div class="twitterFeeds" style="clear:both;padding:5px 10px 0 0;">'
			+ feedsHTML +	
			'</div>').children('.twitterFeeds').children('div:first-child').css({'display': 'block'});
		$('.twitterButtons a:first-child', _THIS_).not('.twitterSendButton').css({'color': '#222'});
		
		
		// set css height of feeds pages if height option declared
		if (options.height != '') $('.twitterFeeds', _THIS_).css({'height': options.height, 'overflow': 'auto'});
		
		// get contents in refresh interval if refresh option declared
		if (options.twitsFeed) {
			if (options.twitsRefresh) setInterval(getTwitsContent, options.twitsRefresh);
			getTwitsContent();	
		}
		
		if (options.mentionsFeed) {
			if (options.mentionsRefresh) setInterval(getMentionsContent, options.mentionsRefresh);
			getMentionsContent();						
		}
		
		if (options.hashesFeed) {
			if (options.hashesRefresh) setInterval(getHashesContent, options.hashesRefresh);
			getHashesContent();	
		}

		

		// plugin events handlers 
		
		// switching twitter\mention\hashtag feeds
		if(options.twitsFeed) {
			$('.twitterTwitsButton', _THIS_).click( function() {
				$('.twitterFeeds div', _THIS_).stop(true, true);
				$('.twitterMention , .twitterHash', _THIS_).slideUp(500, function(){
					$('.twitterTwits', _THIS_).slideDown(500);
				});
				toggleBtnColors(this);
				return false;
			});
		}
		
		if(options.mentionsFeed) {
			$('.twitterMentionButton', _THIS_).click( function() {
				$('.twitterFeeds div', _THIS_).stop(true, true);
				$('.twitterTwits, .twitterHash', _THIS_).slideUp(500, function(){
					$('.twitterMention', _THIS_).slideDown(500);
				});
				toggleBtnColors(this);
				return false;
			});
		}
		
		if(options.hashesFeed) {
			$('.twitterHashButton', _THIS_).click( function() {
				$('.twitterFeeds div', _THIS_).stop(true, true);
				$('.twitterMention , .twitterTwits', _THIS_).slideUp(500, function(){
					$('.twitterHash', _THIS_).slideDown(500);
				});
				toggleBtnColors(this);
				return false;
			});
		}
		
		// change buttons opacity on hover
		if (!($.browser.msie && $.browser.version.slice(0,1) > 7))
			$('.buttons', _THIS_).hover(
				function() {
					$(this).stop(true, true).animate({'opacity': '0.75'}, 0);
				},
				function() {
					$(this).stop(true, true).animate({'opacity': '1'}, 0);
			});

		// show\hide twit send dialog
		$('.twitterSendButton', _THIS_).click( function() {
			$('.twitterSubmit', _THIS_).stop(true, true).slideToggle(300);
			return false;
		});
		
		// twit submit
		$('.twitterSbmtBtn', _THIS_).click( function() {
			var message = $('#twitterMessage', _THIS_).val();
			if (message != '') {
				$('.twitterSubmit', _THIS_).stop(true, true).hide();
				message = encodeURIComponent(message).replace("%20","+");
				window.open("http://twitter.com/?status=" + message); 
			}
			return false;
		});
		
		// count the number of letters in twit message on key up, max letters - 140
		$('#twitterMessage', _THIS_).keyup(function(event) {
			var max = 140,
				message = $('#twitterMessage', _THIS_),
				twitterLetters = $('#twitterLetters', _THIS_);
				
			if (message.val().length >= max) {
				$(twitterLetters).css({'color': 'red'});
				message.val(message.val().substr(0, max));
				event.preventDefault();
			}
			else {
				$(twitterLetters).css({'color': ''})
			}
			$(twitterLetters).text(message.val().length);
			return;
		});

		
		
		// plugin functions 
		
		// parse data & make template from JSON content
		function parseData(data) {
			// template for each twit element
			var template = '\
					<div class="twitterBlock" style="zoom:1;clear:both;border-bottom:1px #ccc dotted;margin-bottom:10px;padding-bottom:10px;overflow:auto;">\
						<div class="twitImage" style="height:48px;border:1px #ddd solid;padding:5px;float:left;margin-right:10px;">\
							<a href="%url%" target="_blank"><img src="%img%" alt="%title%" width="48" height="48" /></a>\
						</div>\
						<div class="twitTitle" style="margin-bottom:3px;">\
						<a href="%url%" target="_blank">%title%</a>\
						<div class="twitTimeAgo" style="font-size:small;color:#999;float:right;padding-top:2px;">%time%</div>\
					</div>\
					<div class="twitText" style="overflow:hidden;font-size:90%;">%text%</div>\
				</div>',
				retTemplate = '',
				dataArray = (data.results === undefined) ? data : data.results;
				
			$.each(dataArray, function(i, post)	{
				var user = (post.user !== undefined) ? post.user.screen_name : post.from_user,
					url = 'https://twitter.com/' + user,
					text = (post.text !== undefined) ? post.text : post.text,
					image = (post.user !== undefined) ? post.user.profile_image_url : post.profile_image_url,
					time = (post.user !== undefined) ? timeAgo(GetDateTime(post.created_at, true)) : timeAgo(GetDateTime(post.created_at, false)),
					curTemplate = template;
					
				text = ' ' + text.replace(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, '<a href="$1" target="_blank">$1</a>');				
				curTemplate = curTemplate.replace(/%title%/gi, user);
				curTemplate = curTemplate.replace(/%img%/gi, image);
				curTemplate = curTemplate.replace(/%text%/gi, text);
				curTemplate = curTemplate.replace(/%url%/gi, url);
				curTemplate = curTemplate.replace(/%time%/gi, time);
				retTemplate+=curTemplate;

				if (i == (options.count - 1)) return false;
			});
			return retTemplate;
		}
		
		// get twits JSON content
		function getTwitsContent() {
			var exqlRep = (options.excludeReplies) ? '&exclude_replies=true' : '';
			$.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + options.twitter + exqlRep + '&count=' + options.maxElements + '&callback=?', function(data) {
				$('.twitterTwits', _THIS_).html(parseData(data));
			});
		}
		
		// get mentions JSON content
		function getMentionsContent() {
			$.getJSON('http://search.twitter.com/search.json?&q=@' + options.twitter + '&rpp=' + options.maxElements + '&page=1&callback=?', function(data) {
				$('.twitterMention', _THIS_).html(parseData(data));
			});
		}
		
		// get hash tags JSON content
		function getHashesContent() {
			$.getJSON('http://search.twitter.com/search.json?q=' + encodeURIComponent(options.hashTag).replace("%20","+") + '&rpp=' + options.maxElements + '&page=1&callback=?', function(data) {
				$('.twitterHash', _THIS_).html(parseData(data));
			});
		}
		
		// convert time to "timeAgo" 
		function timeAgo(date) {
			var difference = ((new Date()).getTime() - date.getTime()) / 1000,
				periods = [[
					['second', 'seconds', 'seconds'],
					['minute', 'minutes', 'minutes'],
					['hour', 'hours', 'hours'],
					['day', 'days', 'days'],
					['week', 'weeks', 'weeks'],
					['month', 'months', 'months'],
					['year', 'years', 'years']
				], ' ago'],
				lengths = [60, 60, 24, 7, 4.35, 12, 10];
				
			for(var i = 0; difference >= lengths[i]; i++) {
				difference = difference / lengths[i];
			}
			
			difference = Math.round(difference);
			var cases = [2, 0, 1, 1, 1, 2];
			var text = periods[0][i][(difference % 100 > 4 && difference % 100 < 20)? 2: cases[Math.min(difference % 10, 5)]];
			return difference + ' ' + text + periods[1];
		}
		
		// convert time
		function GetDateTime(strDate, dFormat) {
			if($.browser.msie && dFormat)	{
				var arDate = strDate.split(" ");
				return new Date(arDate[0]+", "+arDate[2]+" "+arDate[1]+" "+arDate[5]+" "+arDate[3]+" "+arDate[4]);
			}
			else return new Date(strDate);
		}
		
		// toggle button colors on click
		function toggleBtnColors(el) {
			$('.twitterButtons a', _THIS_).css({'color':'#777'});
			$(el).css({'color':'#222'});
		}
		
		return this;
	};
})(jQuery);