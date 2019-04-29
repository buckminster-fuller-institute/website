/**
 * sasson javascript core
 *
 */
(function($) {

  Drupal.sasson = {};

  /**
   * This script will watch files for changes and
   * automatically refresh the browser when a file is modified.
   */
  Drupal.sasson.watch = function(url, instant) {

    var dateModified, lastDateModified, init;

    var updateStyle = function(filename) {
      var headElm = $('head > link[href*="' + filename + '.css"]');
      if (headElm.length > 0) {
        // If it's in a <link> tag
        headElm.attr('href', headElm.attr('href').replace(filename + '.css?', filename + '.css?' + Math.random()));
      } else if ($("head > *:contains('" + filename + ".css')").length > 0) {
        // If it's in an @import rule
        headElm = $("head > *:contains('" + filename + ".css')");
        headElm.html(headElm.html().replace(filename + '.css?', filename + '.css?' + Math.random()));
      }
    };
    
    // Check every second if the timestamp was modified
    var check = function(dateModified) {
      if (init === true && lastDateModified !== dateModified) {
        var filename = url.split('index.html');
        filename = filename[filename.length - 1].split('.');
        var fileExt = filename[1];
        filename = filename[0];
        if (instant && fileExt === 'css') {
          // css file - update head
          updateStyle(filename);
        } else if (instant && (fileExt === 'scss' || fileExt === 'sass')) {
          // SASS/SCSS file - trigger sass compilation with an ajax call and update head
          $.ajax({
            url: "?recompile=true",
            success: function() {
              updateStyle(filename);
            }
          });
        } else {
          // Reload the page
          document.location.reload(true);
        }
      }
      init = true;
      lastDateModified = dateModified;
    };

    var watch = function(url) {
      $.ajax({
        url: url + '?' + Math.random(),
        type:"HEAD",
        error: function() {
          log(Drupal.t('There was an error watching @url', {'@url': url}));
          clearInterval(watchInterval);
        },
        success:function(res,code,xhr) {
          check(xhr.getResponseHeader("Last-Modified"));
        }
      });
    };
    
    var watchInterval = 0;
    watchInterval = window.setInterval(function() {
      watch(url);
    }, 1000);

  };

  Drupal.behaviors.sasson = {
    attach: function(context) {

      $('html').removeClass('no-js');

    }
  };

  Drupal.behaviors.showOverlay = {
    attach: function(context, settings) {

      $('body.with-overlay').once('overlay-image').each(function() {
        var body = $(this);
        var overlay = $('<div id="overlay-image"><img src="'+ Drupal.settings.sasson['overlay_url'] +'"/></div>');
        var overlayToggle = $('<div class="toggle-switch toggle-overlay off" ><div>' + Drupal.t('Overlay') + '</div></div>');
        body.append(overlay);
        body.append(overlayToggle);
        overlay.css({
          'opacity': Drupal.settings.sasson['overlay_opacity'],
          'display': 'none',
          'position': 'absolute',
          'z-index': 99,
          'text-align': 'center',
          'top': 0,
          'left': '50%',
          'cursor': 'move'
        });
        overlayToggle.css({
          'top': '90px'
        });
        overlayToggle.click(function() {
          $('body').toggleClass('show-overlay');
          overlay.fadeToggle();
          var pull = overlay.find('img').width() / -2 + "px";
          overlay.css("marginLeft", pull);
          $(this).toggleClass("off");
        });
        overlay.draggable();
      });

    }
  };

  Drupal.behaviors.showGrid = {
    attach: function(context, settings) {

      $('body.grid-background').once('grid').each(function() {
        var body = $(this);
        var gridToggle = $('<div class="toggle-switch toggle-grid" ><div>' + Drupal.t('Grid') + '</div></div>');
        body.addClass('grid-visible').append(gridToggle);
        $('#page').addClass('grid-background');
        gridToggle.click(function() {
          $('body').toggleClass('grid-visible grid-hidden');
          $(this).toggleClass("off");
        });
      });

    }
  };

})(jQuery);


// Console.log wrapper to avoid errors when firebug is not present
// usage: log('inside coolFunc',this,arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function() {
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if (this.console) {
    console.log(Array.prototype.slice.call(arguments));
  }
};
;
/* Google Analytics Tracking Code */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','http://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-34172866-1', 'auto');
  ga('require', 'displayfeatures');
  ga('send', 'pageview');
;
/*! word-and-character-counter.js
 v2.4 (c) Wilkins Fernandez
 MIT License
 */(function($){$.fn.extend({counter:function(options){var defaults={type:'char',count:'down',goal:140,text:true,target:false,append:true,translation:'',msg:''};var $countObj='',countIndex='',noLimit=false,options=$.extend({},defaults,options);var methods={init:function($obj){var objID=$obj.attr('id'),counterID=objID+'_count';methods.isLimitless();var counterDiv=$('<div/>').attr('id',objID+'_counter').html("<span id="+counterID+"/> "+methods.setMsg());if(!options.target||!$(options.target).length){options.append?counterDiv.insertAfter($obj):counterDiv.insertBefore($obj)}else{options.append?$(options.target).append(counterDiv):$(options.target).prepend(counterDiv)}$countObj=$('#'+counterID);methods.bind($obj)},bind:function($obj){$obj.bind("keypress.counter keydown.counter keyup.counter blur.counter focus.counter change.counter paste.counter",methods.updateCounter);$obj.bind("keydown.counter",methods.doStopTyping);$obj.trigger('keydown')},isLimitless:function(){if(options.goal==='sky'){options.count='up';noLimit=true;return noLimit}},setMsg:function(){if(options.msg!==''){return options.msg}if(options.text===false){return''}if(noLimit){if(options.msg!==''){return options.msg}else{return''}}this.text=options.translation||"character word left max";this.text=this.text.split(' ');this.chars="s ( )".split(' ');this.msg=null;switch(options.type){case"char":if(options.count===defaults.count&&options.text){this.msg=this.text[0]+this.chars[1]+this.chars[0]+this.chars[2]+" "+this.text[2]}else if(options.count==="up"&&options.text){this.msg=this.text[0]+this.chars[0]+" "+this.chars[1]+options.goal+" "+this.text[3]+this.chars[2]}break;case"word":if(options.count===defaults.count&&options.text){this.msg=this.text[1]+this.chars[1]+this.chars[0]+this.chars[2]+" "+this.text[2]}else if(options.count==="up"&&options.text){this.msg=this.text[1]+this.chars[1]+this.chars[0]+this.chars[2]+" "+this.chars[1]+options.goal+" "+this.text[3]+this.chars[2]}break;default:}return this.msg},getWords:function(val){if(val!==""){return $.trim(val).replace(/\s+/g," ").split(" ").length}else{return 0}},updateCounter:function(e){var $this=$(this);if(countIndex<0||countIndex>options.goal){methods.passedGoal($this)}if(options.type===defaults.type){if(options.count===defaults.count){countIndex=options.goal-$this.val().length;if(countIndex<=0){$countObj.text('0')}else{$countObj.text(countIndex)}}else if(options.count==='up'){countIndex=$this.val().length;$countObj.text(countIndex)}}else if(options.type==='word'){if(options.count===defaults.count){countIndex=methods.getWords($this.val());if(countIndex<=options.goal){countIndex=options.goal-countIndex;$countObj.text(countIndex)}else{$countObj.text('0')}}else if(options.count==='up'){countIndex=methods.getWords($this.val());$countObj.text(countIndex)}}return},doStopTyping:function(e){var keys=[46,8,9,35,36,37,38,39,40,32];if(methods.isGoalReached(e)){if(e.keyCode!==keys[0]&&e.keyCode!==keys[1]&&e.keyCode!==keys[2]&&e.keyCode!==keys[3]&&e.keyCode!==keys[4]&&e.keyCode!==keys[5]&&e.keyCode!==keys[6]&&e.keyCode!==keys[7]&&e.keyCode!==keys[8]){if(options.type===defaults.type){return false}else if(e.keyCode!==keys[9]&&e.keyCode!==keys[1]&&options.type!=defaults.type){return true}else{return false}}}},isGoalReached:function(e,_goal){if(noLimit){return false}if(options.count===defaults.count){_goal=0;return(countIndex<=_goal)?true:false}else{_goal=options.goal;return(countIndex>=_goal)?true:false}},wordStrip:function(numOfWords,text){var wordCount=text.replace(/\s+/g,' ').split(' ').length;text=$.trim(text);if(numOfWords<=0||numOfWords===wordCount){return text}else{text=$.trim(text).split(' ');text.splice(numOfWords,wordCount,'');return $.trim(text.join(' '))}},passedGoal:function($obj){var userInput=$obj.val();if(options.type==='word'){$obj.val(methods.wordStrip(options.goal,userInput))}if(options.type==='char'){$obj.val(userInput.substring(0,options.goal))}if(options.type==='down'){$countObj.val('0')}if(options.type==='up'){$countObj.val(options.goal)}}};return this.each(function(){methods.init($(this))})}})})(jQuery);;
/*
 * ##### Sasson - advanced drupal theming. #####
 *
 * SITENAME scripts.
 *
 */

(function($) {
  
  // DUPLICATE AND UNCOMMENT
  // Drupal.behaviors.behaviorName = {
  //   attach: function (context, settings) {
  //     // Do some magic...
  //   }
  // };

	Drupal.behaviors.behaviorName = {
		attach: function (context, settings) { 

			$('div#edit-commerce-payment-payment-method div.form-item-commerce-payment-payment-method').replaceWith('<img src="https://www.bfi.org/sites/all/themes/bfi/images/visa_mc_amex_disc_239x40.gif" border="0" />');
			$('form#commerce-cart-add-to-cart-form-1').append('<div class="contrib-alt">I would like to<br /><a href="http://bfi.org/membership">become a member</a>.</div>');
			$('form#commerce-cart-add-to-cart-form-4').append('<div class="contrib-alt">I would like to <a href="http://bfi.org/donate">make a donation</a>.</div>');

			$('body.page-node-93 #block-views-bfc-landing-page-block td:not(:has(div))').css('background-color', 'transparent');
			$('body.node-type-newsletter .view-bfi-trimtab-sections td:not(:has(div))').css('background-color', 'transparent');

			$('#edit-field-application-questions-und-0-field-project-app-strategy-und-0-value')
				.counter({ type: 'word', goal: 50, append: false,
					target: '#count-field-project-app-strategy'
				});

			$('#edit-field-application-questions-und-0-field-project-app-context-und-0-value')
				.counter({ type: 'word', goal: 200, append: false,
					target: '#count-field-project-app-context'
				});

			$('#edit-field-application-questions-und-0-field-project-app-3w-und-0-value')
				.counter({ type: 'word', goal: 200, append: false,
					target: '#count-field-project-app-3w'
				});

			$('#edit-field-application-questions-und-0-field-project-app-impact-und-0-value')
				.counter({ type: 'word', goal: 200, append: false,
					target: '#count-field-project-app-impact'
				});

			$('#edit-field-application-questions-und-0-field-project-app-impact-long-und-0-value')
				.counter({ type: 'word', goal: 200, append: false,
					target: '#count-field-project-app-impact-long'
				});

			$('#edit-field-application-questions-und-0-field-project-app-history-und-0-value')
				.counter({ type: 'word', goal: 200, append: false,
					target: '#count-field-project-app-history'
				});

			$('#edit-field-application-questions-und-0-field-project-app-planning-und-0-value')
				.counter({ type: 'word', goal: 200, append: false,
					target: '#count-field-project-app-planning'
				});

			$('#edit-field-application-questions-und-0-field-project-app-community-und-0-value')
				.counter({ type: 'word', goal: 200, append: false,
					target: '#count-field-project-app-community'
				});

			$('#edit-field-application-questions-und-0-field-project-app-team-und-0-value')
				.counter({ type: 'word', goal: 200, append: false,
					target: '#count-field-project-app-team'
				});

			// From http://css-tricks.com/scrollfollow-sidebar/
			var $sidebar = $("#block-views-bfc-project-review-form-2-block");
			if ($sidebar.length) {
				var $window    = $(window),
					offset     = $sidebar.offset(),
					topPadding = 70;

				$window.scroll(function() {
					if ($window.scrollTop() > offset.top) {
						$sidebar.stop().animate({ marginTop: $window.scrollTop() - offset.top + topPadding }, 240);
					} else {
						$sidebar.stop().animate({ marginTop: 0 }, 240);
					}
				});
			}
		}
	};

})(jQuery);
;
