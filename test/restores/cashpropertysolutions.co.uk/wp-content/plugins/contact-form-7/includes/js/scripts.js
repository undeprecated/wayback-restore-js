(function($) {

	if (typeof _wpcf7 == &apos;undefined&apos; || _wpcf7 === null)
		_wpcf7 = {};

	_wpcf7 = $.extend({ cached: 0 }, _wpcf7);

	$(function() {
		_wpcf7.supportHtml5 = $.wpcf7SupportHtml5();
		$(&apos;div.wpcf7 &gt; form&apos;).wpcf7InitForm();
	});

	$.fn.wpcf7InitForm = function() {
		this.ajaxForm({
			beforeSubmit: function(arr, $form, options) {
				$form.wpcf7ClearResponseOutput();
				$form.find(&apos;[aria-invalid]&apos;).attr(&apos;aria-invalid&apos;, &apos;false&apos;);
				$form.find(&apos;img.ajax-loader&apos;).css({ visibility: &apos;visible&apos; });
				return true;
			},
			beforeSerialize: function($form, options) {
				$form.find(&apos;[placeholder].placeheld&apos;).each(function(i, n) {
					$(n).val(&apos;&apos;);
				});
				return true;
			},
			data: { &apos;_wpcf7_is_ajax_call&apos;: 1 },
			dataType: &apos;json&apos;,
			success: $.wpcf7AjaxSuccess,
			error: function(xhr, status, error, $form) {
				var e = $(&apos;<div class="ajax-error"></div>&apos;).text(error.message);
				$form.after(e);
			}
		});

		if (_wpcf7.cached)
			this.wpcf7OnloadRefill();

		this.wpcf7ToggleSubmit();

		this.find(&apos;.wpcf7-submit&apos;).wpcf7AjaxLoader();

		this.find(&apos;.wpcf7-acceptance&apos;).click(function() {
			$(this).closest(&apos;form&apos;).wpcf7ToggleSubmit();
		});

		this.find(&apos;.wpcf7-exclusive-checkbox&apos;).wpcf7ExclusiveCheckbox();

		this.find(&apos;.wpcf7-list-item.has-free-text&apos;).wpcf7ToggleCheckboxFreetext();

		this.find(&apos;[placeholder]&apos;).wpcf7Placeholder();

		if (_wpcf7.jqueryUi &amp;&amp; ! _wpcf7.supportHtml5.date) {
			this.find(&apos;input.wpcf7-date[type=&quot;date&quot;]&apos;).each(function() {
				$(this).datepicker({
					dateFormat: &apos;yy-mm-dd&apos;,
					minDate: new Date($(this).attr(&apos;min&apos;)),
					maxDate: new Date($(this).attr(&apos;max&apos;))
				});
			});
		}

		if (_wpcf7.jqueryUi &amp;&amp; ! _wpcf7.supportHtml5.number) {
			this.find(&apos;input.wpcf7-number[type=&quot;number&quot;]&apos;).each(function() {
				$(this).spinner({
					min: $(this).attr(&apos;min&apos;),
					max: $(this).attr(&apos;max&apos;),
					step: $(this).attr(&apos;step&apos;)
				});
			});
		}

		this.find(&apos;.wpcf7-character-count&apos;).wpcf7CharacterCount();

		this.find(&apos;.wpcf7-validates-as-url&apos;).change(function() {
			$(this).wpcf7NormalizeUrl();
		});
	};

	$.wpcf7AjaxSuccess = function(data, status, xhr, $form) {
		if (! $.isPlainObject(data) || $.isEmptyObject(data))
			return;

		var $responseOutput = $form.find(&apos;div.wpcf7-response-output&apos;);

		$form.wpcf7ClearResponseOutput();

		$form.find(&apos;.wpcf7-form-control&apos;).removeClass(&apos;wpcf7-not-valid&apos;);
		$form.removeClass(&apos;invalid spam sent failed&apos;);

		if (data.captcha)
			$form.wpcf7RefillCaptcha(data.captcha);

		if (data.quiz)
			$form.wpcf7RefillQuiz(data.quiz);

		if (data.invalids) {
			$.each(data.invalids, function(i, n) {
				$form.find(n.into).wpcf7NotValidTip(n.message);
				$form.find(n.into).find(&apos;.wpcf7-form-control&apos;).addClass(&apos;wpcf7-not-valid&apos;);
				$form.find(n.into).find(&apos;[aria-invalid]&apos;).attr(&apos;aria-invalid&apos;, &apos;true&apos;);
			});

			$responseOutput.addClass(&apos;wpcf7-validation-errors&apos;);
			$form.addClass(&apos;invalid&apos;);

			$(data.into).trigger(&apos;invalid.wpcf7&apos;);

		} else if (1 == data.spam) {
			$responseOutput.addClass(&apos;wpcf7-spam-blocked&apos;);
			$form.addClass(&apos;spam&apos;);

			$(data.into).trigger(&apos;spam.wpcf7&apos;);

		} else if (1 == data.mailSent) {
			$responseOutput.addClass(&apos;wpcf7-mail-sent-ok&apos;);
			$form.addClass(&apos;sent&apos;);

			if (data.onSentOk)
				$.each(data.onSentOk, function(i, n) { eval(n) });

			$(data.into).trigger(&apos;mailsent.wpcf7&apos;);

		} else {
			$responseOutput.addClass(&apos;wpcf7-mail-sent-ng&apos;);
			$form.addClass(&apos;failed&apos;);

			$(data.into).trigger(&apos;mailfailed.wpcf7&apos;);
		}

		if (data.onSubmit)
			$.each(data.onSubmit, function(i, n) { eval(n) });

		$(data.into).trigger(&apos;submit.wpcf7&apos;);

		if (1 == data.mailSent)
			$form.resetForm();

		$form.find(&apos;[placeholder].placeheld&apos;).each(function(i, n) {
			$(n).val($(n).attr(&apos;placeholder&apos;));
		});

		$responseOutput.append(data.message).slideDown(&apos;fast&apos;);
		$responseOutput.attr(&apos;role&apos;, &apos;alert&apos;);

		$.wpcf7UpdateScreenReaderResponse($form, data);
	};

	$.fn.wpcf7ExclusiveCheckbox = function() {
		return this.find(&apos;input:checkbox&apos;).click(function() {
			$(this).closest(&apos;.wpcf7-checkbox&apos;).find(&apos;input:checkbox&apos;).not(this).removeAttr(&apos;checked&apos;);
		});
	};

	$.fn.wpcf7Placeholder = function() {
		if (_wpcf7.supportHtml5.placeholder)
			return this;

		return this.each(function() {
			$(this).val($(this).attr(&apos;placeholder&apos;));
			$(this).addClass(&apos;placeheld&apos;);

			$(this).focus(function() {
				if ($(this).hasClass(&apos;placeheld&apos;))
					$(this).val(&apos;&apos;).removeClass(&apos;placeheld&apos;);
			});

			$(this).blur(function() {
				if (&apos;&apos; == $(this).val()) {
					$(this).val($(this).attr(&apos;placeholder&apos;));
					$(this).addClass(&apos;placeheld&apos;);
				}
			});
		});
	};

	$.fn.wpcf7AjaxLoader = function() {
		return this.each(function() {
			var loader = $(&apos;<img class="ajax-loader">&apos;)
				.attr({ src: _wpcf7.loaderUrl, alt: _wpcf7.sending })
				.css(&apos;visibility&apos;, &apos;hidden&apos;);

			$(this).after(loader);
		});
	};

	$.fn.wpcf7ToggleSubmit = function() {
		return this.each(function() {
			var form = $(this);
			if (this.tagName.toLowerCase() != &apos;form&apos;)
				form = $(this).find(&apos;form&apos;).first();

			if (form.hasClass(&apos;wpcf7-acceptance-as-validation&apos;))
				return;

			var submit = form.find(&apos;input:submit&apos;);
			if (! submit.length) return;

			var acceptances = form.find(&apos;input:checkbox.wpcf7-acceptance&apos;);
			if (! acceptances.length) return;

			submit.removeAttr(&apos;disabled&apos;);
			acceptances.each(function(i, n) {
				n = $(n);
				if (n.hasClass(&apos;wpcf7-invert&apos;) &amp;&amp; n.is(&apos;:checked&apos;)
				|| ! n.hasClass(&apos;wpcf7-invert&apos;) &amp;&amp; ! n.is(&apos;:checked&apos;))
					submit.attr(&apos;disabled&apos;, &apos;disabled&apos;);
			});
		});
	};

	$.fn.wpcf7ToggleCheckboxFreetext = function() {
		return this.each(function() {
			var $wrap = $(this).closest(&apos;.wpcf7-form-control&apos;);

			if ($(this).find(&apos;:checkbox, :radio&apos;).is(&apos;:checked&apos;)) {
				$(this).find(&apos;:input.wpcf7-free-text&apos;).prop(&apos;disabled&apos;, false);
			} else {
				$(this).find(&apos;:input.wpcf7-free-text&apos;).prop(&apos;disabled&apos;, true);
			}

			$wrap.find(&apos;:checkbox, :radio&apos;).change(function() {
				var $cb = $(&apos;.has-free-text&apos;, $wrap).find(&apos;:checkbox, :radio&apos;);
				var $freetext = $(&apos;:input.wpcf7-free-text&apos;, $wrap);

				if ($cb.is(&apos;:checked&apos;)) {
					$freetext.prop(&apos;disabled&apos;, false).focus();
				} else {
					$freetext.prop(&apos;disabled&apos;, true);
				}
			});
		});
	};

	$.fn.wpcf7CharacterCount = function() {
		return this.each(function() {
			var $count = $(this);
			var name = $count.attr(&apos;data-target-name&apos;);
			var down = $count.hasClass(&apos;down&apos;);
			var starting = parseInt($count.attr(&apos;data-starting-value&apos;), 10);
			var maximum = parseInt($count.attr(&apos;data-maximum-value&apos;), 10);
			var minimum = parseInt($count.attr(&apos;data-minimum-value&apos;), 10);

			var updateCount = function($target) {
				var length = $target.val().length;
				var count = down ? starting - length : length;
				$count.attr(&apos;data-current-value&apos;, count);
				$count.text(count);

				if (maximum &amp;&amp; maximum &lt; length) {
					$count.addClass(&apos;too-long&apos;);
				} else {
					$count.removeClass(&apos;too-long&apos;);
				}

				if (minimum &amp;&amp; length &lt; minimum) {
					$count.addClass(&apos;too-short&apos;);
				} else {
					$count.removeClass(&apos;too-short&apos;);
				}
			};

			$count.closest(&apos;form&apos;).find(&apos;:input[name=&quot;&apos; + name + &apos;&quot;]&apos;).each(function() {
				updateCount($(this));

				$(this).keyup(function() {
					updateCount($(this));
				});
			});
		});
	};

	$.fn.wpcf7NormalizeUrl = function() {
		return this.each(function() {
			var val = $.trim($(this).val());

			if (! val.match(/^[a-z][a-z0-9.+-]*:/i)) { // check the scheme part
				val = val.replace(/^\/+/, &apos;&apos;);
				val = &apos;http://&apos; + val;
			}

			$(this).val(val);
		});
	};

	$.fn.wpcf7NotValidTip = function(message) {
		return this.each(function() {
			var $into = $(this);

			$into.find(&apos;span.wpcf7-not-valid-tip&apos;).remove();
			$into.append(&apos;<span role="alert" class="wpcf7-not-valid-tip">&apos; + message + &apos;</span>&apos;);

			if ($into.is(&apos;.use-floating-validation-tip *&apos;)) {
				$(&apos;.wpcf7-not-valid-tip&apos;, $into).mouseover(function() {
					$(this).wpcf7FadeOut();
				});

				$(&apos;:input&apos;, $into).focus(function() {
					$(&apos;.wpcf7-not-valid-tip&apos;, $into).not(&apos;:hidden&apos;).wpcf7FadeOut();
				});
			}
		});
	};

	$.fn.wpcf7FadeOut = function() {
		return this.each(function() {
			$(this).animate({
				opacity: 0
			}, &apos;fast&apos;, function() {
				$(this).css({&apos;z-index&apos;: -100});
			});
		});
	};

	$.fn.wpcf7OnloadRefill = function() {
		return this.each(function() {
			var url = $(this).attr(&apos;action&apos;);
			if (0 &lt; url.indexOf(&apos;#&apos;))
				url = url.substr(0, url.indexOf(&apos;#&apos;));

			var id = $(this).find(&apos;input[name=&quot;_wpcf7&quot;]&apos;).val();
			var unitTag = $(this).find(&apos;input[name=&quot;_wpcf7_unit_tag&quot;]&apos;).val();

			$.getJSON(url,
				{ _wpcf7_is_ajax_call: 1, _wpcf7: id, _wpcf7_request_ver: $.now() },
				function(data) {
					if (data &amp;&amp; data.captcha)
						$(&apos;#&apos; + unitTag).wpcf7RefillCaptcha(data.captcha);

					if (data &amp;&amp; data.quiz)
						$(&apos;#&apos; + unitTag).wpcf7RefillQuiz(data.quiz);
				}
			);
		});
	};

	$.fn.wpcf7RefillCaptcha = function(captcha) {
		return this.each(function() {
			var form = $(this);

			$.each(captcha, function(i, n) {
				form.find(&apos;:input[name=&quot;&apos; + i + &apos;&quot;]&apos;).clearFields();
				form.find(&apos;img.wpcf7-captcha-&apos; + i).attr(&apos;src&apos;, n);
				var match = /([0-9]+)\.(png|gif|jpeg)$/.exec(n);
				form.find(&apos;input:hidden[name=&quot;_wpcf7_captcha_challenge_&apos; + i + &apos;&quot;]&apos;).attr(&apos;value&apos;, match[1]);
			});
		});
	};

	$.fn.wpcf7RefillQuiz = function(quiz) {
		return this.each(function() {
			var form = $(this);

			$.each(quiz, function(i, n) {
				form.find(&apos;:input[name=&quot;&apos; + i + &apos;&quot;]&apos;).clearFields();
				form.find(&apos;:input[name=&quot;&apos; + i + &apos;&quot;]&apos;).siblings(&apos;span.wpcf7-quiz-label&apos;).text(n[0]);
				form.find(&apos;input:hidden[name=&quot;_wpcf7_quiz_answer_&apos; + i + &apos;&quot;]&apos;).attr(&apos;value&apos;, n[1]);
			});
		});
	};

	$.fn.wpcf7ClearResponseOutput = function() {
		return this.each(function() {
			$(this).find(&apos;div.wpcf7-response-output&apos;).hide().empty().removeClass(&apos;wpcf7-mail-sent-ok wpcf7-mail-sent-ng wpcf7-validation-errors wpcf7-spam-blocked&apos;).removeAttr(&apos;role&apos;);
			$(this).find(&apos;span.wpcf7-not-valid-tip&apos;).remove();
			$(this).find(&apos;img.ajax-loader&apos;).css({ visibility: &apos;hidden&apos; });
		});
	};

	$.wpcf7UpdateScreenReaderResponse = function($form, data) {
		$(&apos;.wpcf7 .screen-reader-response&apos;).html(&apos;&apos;).attr(&apos;role&apos;, &apos;&apos;);

		if (data.message) {
			var $response = $form.siblings(&apos;.screen-reader-response&apos;).first();
			$response.append(data.message);

			if (data.invalids) {
				var $invalids = $(&apos;<ul></ul>&apos;);

				$.each(data.invalids, function(i, n) {
					if (n.idref) {
						var $li = $(&apos;<li></li>&apos;).append($(&apos;<a></a>&apos;).attr(&apos;href&apos;, &apos;#&apos; + n.idref).append(n.message));
					} else {
						var $li = $(&apos;<li></li>&apos;).append(n.message);
					}

					$invalids.append($li);
				});

				$response.append($invalids);
			}

			$response.attr(&apos;role&apos;, &apos;alert&apos;).focus();
		}
	};

	$.wpcf7SupportHtml5 = function() {
		var features = {};
		var input = document.createElement(&apos;input&apos;);

		features.placeholder = &apos;placeholder&apos; in input;

		var inputTypes = [&apos;email&apos;, &apos;url&apos;, &apos;tel&apos;, &apos;number&apos;, &apos;range&apos;, &apos;date&apos;];

		$.each(inputTypes, function(index, value) {
			input.setAttribute(&apos;type&apos;, value);
			features[value] = input.type !== &apos;text&apos;;
		});

		return features;
	};

})(jQuery);