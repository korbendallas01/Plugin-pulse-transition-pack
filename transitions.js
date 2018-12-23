(function(P) {

	P.register_transition({

		koken_transition_pack_reveal: function(options) {

			var	self = this;

			this.on( 'transition', function(e) {

				var container	= self.context,
					vertical	= options.koken_transition_pack_direction && options.koken_transition_pack_direction === 'vertical' || false,
					half		= - ( vertical ? container.height() : container.width() ) / 2,
					c			= self.clone( e.current ),
					n			= self.clone( e.next ),
					wrap		= $('<div/>').css({
									width: '100%',
									height: '100%',
									position: 'absolute',
									top: 0,
									overflow: 'hidden'
								}),
					top			= $('<div/>').css({
										width: vertical ? '100%' : '50%',
										height: vertical ? '50%' : '100%',
										overflow: 'hidden',
										position: 'absolute',
										display: 'block'
									}).appendTo(wrap),
					bottom		= $( top[0].cloneNode(false) ).appendTo(wrap);


				if (vertical) {
					bottom.css({
						bottom: e.forward ? 0 : half
					});

					top.css({
						top: e.forward ? 0 : half
					});
				} else {
					bottom.css({
						top: 0,
						right: e.forward ? 0 : half
					});

					top.css({
						top: 0,
						left: e.forward ? 0 : half
					});
				}

				if (c) {

					var img = e.forward ? c.find('div.pulse-content-container') : n.find('div.pulse-content-container');
						imgB = $( img[0].cloneNode(true) );

					if (vertical) {
						imgB.css({
							top: parseInt( imgB.css('top'), 10 ) + half + 'px'
						});
					} else {
						imgB.css({
							left: parseInt( imgB.css('left'), 10 ) + half + 'px'
						});
					}

					top.append(img);
					bottom.append(imgB);

					self.append(wrap);

					window.setTimeout(function() {

						if (e.forward) {
							e.current.css({ opacity: 0 });
							e.next.css({ opacity: 1 });
						}

						var f = function() {
							wrap.remove();
							self.trigger('transitionEnd');
							e.current.css({ opacity: 0 });
							e.next.css({ opacity: 1 });
						};

						if (vertical) {
							top.animate({
								top: e.forward ? half : 0
							}, {
								duration: options.transition_duration,
								easing: options.transition_easing
							});

							bottom.animate({
								bottom: e.forward ? half : 0
							}, {
								duration: options.transition_duration,
								easing: options.transition_easing,
								complete: f
							});
						} else {
							top.animate({
								left: e.forward ? half : 0
							}, {
								duration: options.transition_duration,
								easing: options.transition_easing
							});

							bottom.animate({
								right: e.forward ? half : 0
							}, {
								duration: options.transition_duration,
								easing: options.transition_easing,
								complete: f
							});
						}

					}, 0);

				} else {

					e.next.animate({
						opacity: 1
					}, {
						duration: options.transition_duration,
						complete: function() {
							self.trigger('transitionEnd');
						}
					});

				}
			});

		},

		koken_transition_pack_zoom: function(options) {

			var self = this;

			this.on( 'transition', function(e) {

				var n		= self.clone( e.next ),
					c		= self.clone( e.current ),
					startN	= e.forward ? 0.75 : 1.25,
					endC	= e.forward ? 1.25 : 0.75,
					wrap	= $('<div/>').css({
									width: '100%',
									height: '100%',
									top: 0,
									left: 0,
									webkitTransformStyle: 'preserve-3d'
								});

				n.css({
					webkitTransform: 'translate3d(0,0,0) scale3d(' + startN + ', ' + startN + ', 0)',
					webkitTransformOrigin: '50% 50%',
					webkitTransition: 'all ' + options.transition_duration + 'ms'
				});

				wrap.append(n);

				if (c) {

					c.css({
						webkitTransform: 'translate3d(0,0,0) scale3d(1, 1, 0)',
						webkitTransformOrigin: '50% 50%',
						webkitTransition: 'all ' + options.transition_duration + 'ms'
					});

					wrap.append(c);

				}

				self.append(wrap);

				n.bind( 'webkitTransitionEnd', function() {
					e.next.css({
						opacity: 1
					});

					wrap.remove();

					self.trigger('transitionEnd');
				});

				window.setTimeout(function() {
					if (c) {

						e.current.css({ opacity: 0 });

						c.css({
							webkitTransform: 'translate3d(0,0,0) scale3d(' + endC + ', ' + endC + ', 0)',
							opacity: 0
						});
					}

					n.css({
						webkitTransform: 'translate3d(0,0,0) scale3d(1, 1, 0)',
						opacity: 1
					});
				}, 0);

			});

		},

		koken_transition_pack_cube: function(options) {

			var self = this,
				prefixes = ['Webkit', 'Moz', 'O', 'ms', ''],
				prefix = false;

			prefixes.forEach( function(p, i) {
				if ( p + 'Transform' in document.body.style ) {
					prefix = p;
					return false;
				}
			});

			// Not supported, fallback to default transition
			if (!prefix) return this;

			if (prefix.length) {
				prefix = '-' + prefix.toLowerCase() + '-';
			}

			this.on( 'transition', function(e) {

				var container	= self.context,
					ncopy		= self.clone( e.next ),
					ccopy		= self.clone( e.current ),
					containerW	= container.width();
					wrap		= $('<div/>').css({
										width: '100%',
										height: '100%',
										top: 0,
										left: 0,
										position: 'relative'
									});

				container.css(prefix + 'perspective', containerW);

				wrap.css(prefix + 'transform', 'translateZ(-' + (containerW/2) + 'px)');
				wrap.css(prefix + 'transition', prefix + 'transform ' + options.transition_duration + 'ms ' + options.transition_easing);
				wrap.css(prefix + 'transform-style', 'preserve-3d');

				if (ccopy) {
					wrap.append(ccopy);

					var ccss = {};
					ccss[prefix + 'transform'] = 'rotateY(0deg) translateZ(' + containerW / 2 + 'px)';
					ccss[prefix + 'backface-visibility'] = 'hidden';
					ccopy.css(ccss);
				}

				wrap.append(ncopy);

				var ncss = { opacity: 1 };
				ncss[prefix + 'transform'] = 'rotateY(' + (e.forward ? '' : '-') + '90deg) translateZ(' + (containerW / 2) + 'px)';
				ncss[prefix + 'backface-visibility'] = 'hidden';

				ncopy.css(ncss);

				self.append(wrap);

				requestAnimationFrame(function() {

					// Once transition ends, reset the dom back to how we found it
					wrap.bind( 'webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd transitionend', function() {
						e.next.css({
							opacity: 1
						});

						wrap.remove();

						self.trigger('transitionEnd');
					});

					// Need a reset here to make sure dom is redrawn first
					requestAnimationFrame(function() {

						if (e.current) {
							e.current.css({
								opacity: 0
							});
						}

						wrap.css(prefix + 'transform', 'translateZ(-' + (containerW / 2) + 'px) rotateY(' + ( e.forward ? '-' : '' ) + '90deg)');
					});
				});

			});

		},

		koken_transition_pack_flip: function(options) {

			var self = this,
				prefixes = ['Webkit', 'Moz', 'O', 'ms', ''],
				prefix = false;

			prefixes.forEach( function(p, i) {
				if ( p + 'Transform' in document.body.style ) {
					prefix = p;
					return false;
				}
			});

			// Not supported, fallback to default transition
			if (!prefix) return this;

			if (prefix.length) {
				prefix = '-' + prefix.toLowerCase() + '-';
			}

			this.on( 'transition', function(e) {

				var container	= self.context,
					ncopy		= self.clone( e.next ),
					ccopy		= self.clone( e.current ),
					wrap		= $('<div/>').css({
										width: '100%',
										height: '100%',
										top: 0,
										left: 0,
										position: 'relative'
									});

				container.css(prefix + 'perspective', container.width()*1.5);

				wrap.css(prefix + 'transform', 'translate3d(0,0,0)');
				wrap.css(prefix + 'transition', prefix + 'transform ' + options.transition_duration + 'ms ' + options.transition_easing);
				wrap.css(prefix + 'transform-style', 'preserve-3d');

				if (ccopy) {
					wrap.append(ccopy);

					var ccss = {};
					ccss[prefix + 'transform'] = 'translate3d(0,0,0) rotateY(0deg)';
					ccss[prefix + 'backface-visibility'] = 'hidden';
					ccopy.css(ccss);
				}

				wrap.append(ncopy);

				var ncss = { opacity: 1 };
				ncss[prefix + 'transform'] = 'translate3d(0,0,0) rotateY(180deg)';
				ncss[prefix + 'backface-visibility'] = 'hidden';

				ncopy.css(ncss);

				self.append(wrap);

				requestAnimationFrame(function() {
					// Once transition ends, reset the dom back to how we found it
					wrap.bind( 'webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd transitionend', function() {
						e.next.css({
							opacity: 1
						});

						wrap.remove();

						self.trigger('transitionEnd');
					});

					// Need a reset here to make sure dom is redrawn first
					requestAnimationFrame(function() {
						if (e.current) {
							e.current.css({
								opacity: 0
							});
						}

						wrap.css(prefix + 'transform', 'rotateY(' + ( e.forward ? '-' : '' ) + '180deg)');
					});
				});

			});

		},

		koken_transition_pack_flash: function(options) {

			var self = this;

			this.on( 'transition', function(e) {

				var overlay = $('<div />').css({
						background: '#fff',
						position: 'absolute',
						width: '100%',
						height: '100%'
					});

				self.append(overlay);

				if (e.current) {
					e.current.css({ opacity: 0 });
				}
				e.next.css({ opacity: 1 });

				overlay.animate({
					opacity: 0
				}, {
					duration: options.transition_duration,
					complete: function() {
						overlay.remove();
						self.trigger('transitionEnd');
					}
				});

			});

		}

	});

})(Pulse);