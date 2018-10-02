/* Modernizr 2.8.3 (Custom Build) | Build: http://modernizr.com/download/#-shiv-cssclasses-teststyles-testprop-testallprops-prefixes-domprefixes-load */

;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+&quot;;&quot;)+(b||&quot;&quot;))}function B(a,b){return typeof a===b}function C(a,b){return!!~(&quot;&quot;+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,&quot;-&quot;)&amp;&amp;j[e]!==c)return b==&quot;pfx&quot;?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,&quot;function&quot;)?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+&quot; &quot;+o.join(d+&quot; &quot;)+d).split(&quot; &quot;);return B(b,&quot;string&quot;)||B(b,&quot;undefined&quot;)?D(e,b):(e=(a+&quot; &quot;+p.join(d+&quot; &quot;)+d).split(&quot; &quot;),E(e,b,c))}var d=&quot;2.8.3&quot;,e={},f=!0,g=b.documentElement,h=&quot;modernizr&quot;,i=b.createElement(h),j=i.style,k,l={}.toString,m=&quot; -webkit- -moz- -o- -ms- &quot;.split(&quot; &quot;),n=&quot;Webkit Moz O ms&quot;,o=n.split(&quot; &quot;),p=n.toLowerCase().split(&quot; &quot;),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement(&quot;div&quot;),m=b.body,n=m||b.createElement(&quot;body&quot;);if(parseInt(d,10))while(d--)j=b.createElement(&quot;div&quot;),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=[&quot;&#xAD;&quot;,&apos;<style id="s&apos;,h,&apos;">',a,"</style>&quot;].join(&quot;&quot;),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background=&quot;&quot;,n.style.overflow=&quot;hidden&quot;,k=g.style.overflow,g.style.overflow=&quot;hidden&quot;,g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,&quot;undefined&quot;)&amp;&amp;!B(x.call,&quot;undefined&quot;)?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&amp;&amp;B(a.constructor.prototype[b],&quot;undefined&quot;)},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!=&quot;function&quot;)throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e});for(var G in q)y(q,G)&amp;&amp;(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?&quot;&quot;:&quot;no-&quot;)+v));return e.addTest=function(a,b){if(typeof a==&quot;object&quot;)for(var d in a)y(a,d)&amp;&amp;e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b==&quot;function&quot;?b():b,typeof f!=&quot;undefined&quot;&amp;&amp;f&amp;&amp;(g.className+=&quot; &quot;+(b?&quot;&quot;:&quot;no-&quot;)+a),e[a]=b}return e},z(&quot;&quot;),i=k=null,function(a,b){function l(a,b){var c=a.createElement(&quot;p&quot;),d=a.getElementsByTagName(&quot;head&quot;)[0]||a.documentElement;return c.innerHTML=&quot;x<style>"+b+"</style>&quot;,d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a==&quot;string&quot;?a.split(&quot; &quot;):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&amp;&amp;!e.test(a)&amp;&amp;!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createelement(f[e]);return d}function="" q(a,b){b.cache||(b.cache="{},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return" s.shivmethods?o(c,a,b):b.createelem(c)},a.createdocumentfragment="Function(&quot;h,f&quot;,&quot;return" function(){var="" n="f.cloneNode(),c=n.createElement;h.shivMethods&amp;&amp;(&quot;+m().join().replace(/[\w\-]+/g,function(a){return" b.createelem(a),b.frag.createelement(a),'c("'+a+'")'})+");return="" n}")(s,b.frag)}function="" r(a){a||(a="b);var" c="n(a);return" s.shivcss&&!g&&!c.hascss&&(c.hascss="!!l(a,&quot;article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}&quot;)),k||q(a,c),a}var" ,d="a.html5||{},e=/^&lt;|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h=&quot;_html5shiv&quot;,i=0,j={},k;(function(){try{var" a="b.createElement(&quot;a&quot;);a.innerHTML=&quot;&lt;xyz">&quot;,g=&quot;hidden&quot;in a,k=a.childNodes.length==1||function(){b.createElement(&quot;a&quot;);var a=b.createDocumentFragment();return typeof a.cloneNode==&quot;undefined&quot;||typeof a.createDocumentFragment==&quot;undefined&quot;||typeof a.createElement==&quot;undefined&quot;}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||&quot;abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video&quot;,version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:&quot;default&quot;,shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,&quot;$1$2&quot;)+(f?&quot; js &quot;+t.join(&quot; &quot;):&quot;&quot;),e}(this,this.document),function(a,b,c){function d(a){return&quot;[object Function]&quot;==o.call(a)}function e(a){return&quot;string&quot;==typeof a}function f(){}function g(a){return!a||&quot;loaded&quot;==a||&quot;complete&quot;==a||&quot;uninitialized&quot;==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){(&quot;c&quot;==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&amp;&amp;g(l.readyState)&amp;&amp;(u.r=o=1,!q&amp;&amp;h(),l.onload=l.onreadystatechange=null,b)){&quot;img&quot;!=a&amp;&amp;m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&amp;&amp;y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&amp;&amp;(r=1,y[c]=[]),&quot;object&quot;==a?l.data=c:(l.src=c,l.type=a),l.width=l.height=&quot;0&quot;,l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),&quot;img&quot;!=a&amp;&amp;(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||&quot;j&quot;,e(a)?i(&quot;c&quot;==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&amp;&amp;h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName(&quot;script&quot;)[0],o={}.toString,p=[],q=0,r=&quot;MozAppearance&quot;in l.style,s=r&amp;&amp;!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&amp;&amp;&quot;[object Opera]&quot;==o.call(a.opera),l=!!b.attachEvent&amp;&amp;!l,u=r?&quot;object&quot;:l?&quot;script&quot;:&quot;img&quot;,v=l?&quot;script&quot;:u,w=Array.isArray||function(a){return&quot;[object Array]&quot;==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&amp;&amp;(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split(&quot;!&quot;),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return 2012="" c}function="" g(a,e,f,g,h){var="" i="b(a),j=i.autoCallback;i.url.split(&quot;.&quot;).pop().split(&quot;?&quot;).shift(),i.bypass||(e&amp;&amp;(e=d(e)?e:e[a]||e[g]||e[a.split(&quot;/&quot;).pop().split(&quot;?&quot;)[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&amp;&amp;&quot;css&quot;==i.url.split(&quot;.&quot;).pop().split(&quot;?&quot;).shift()?&quot;c&quot;:c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&amp;&amp;f.load(function(){k(),e&amp;&amp;e(i.origUrl,h,g),j&amp;&amp;j(i.origUrl,h,g),y[i.url]=2})))}function" h(a,b){function="" c(a,c){if(a){if(e(a))c||(j="function(){var" a="[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else" if(object(a)="==a)for(n" in="" m="function(){var" b="0,c;for(c" a)a.hasownproperty(c)&&b++;return="" b}(),a)a.hasownproperty(n)&&(!c&&!--m&&(d(j)?j="function(){var" function(){var="" h="!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&amp;&amp;c(i)}var" i,j,l="this.yepnope.loader;if(e(a))g(a,0,l,0);else" if(w(a))for(i="0;i&lt;a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&amp;&amp;h(j,l);else" object(a)="==a&amp;&amp;h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&amp;&amp;b.addEventListener&amp;&amp;(b.readyState=&quot;loading&quot;,b.addEventListener(&quot;DOMContentLoaded&quot;,A=function(){b.removeEventListener(&quot;DOMContentLoaded&quot;,A,0),b.readyState=&quot;complete&quot;},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var" k="b.createElement(&quot;script&quot;),l,o,e=e||B.errorTimeout;k.src=a;for(o" d)k.setattribute(o,d[o]);c="j?h:c||f,k.onreadystatechange=k.onload=function(){!l&amp;&amp;g(k.readyState)&amp;&amp;(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var" e="b.createElement(&quot;link&quot;),j,c=i?h:c||f;e.href=a,e.rel=&quot;stylesheet&quot;,e.type=&quot;text/css&quot;;for(j" d)e.setattribute(j,d[j]);g||(n.parentnode.insertbefore(e,n),m(c,0))}}(this,document),modernizr.load="function(){yepnope.apply(window,[].slice.call(arguments,0))};" jquery(document).ready(function($){="" *****="" jquery="" flexslider="" v2.1="" -="" copyright="" woothemes="" contributing="" author:="" tyler="" smith="" ;(function(d){d.flexslider="function(i,k){var" window||window.documenttouch&&document="" instanceof="" documenttouch,t="p?&quot;touchend&quot;:&quot;click&quot;,l=&quot;vertical&quot;===c.direction,m=c.reverse,h=0&lt;c.itemWidth,r=&quot;fade&quot;===c.animation,s=&quot;&quot;!==c.asNavFor,f={};d.data(i,&quot;flexslider&quot;,a);f={init:function(){a.animating=!1;a.currentSlide=c.startAt;a.animatingTo=a.currentSlide;a.atEnd=0===a.currentSlide||a.currentSlide===a.last;a.containerSelector=c.selector.substr(0," c.selector.search("="" "));a.slides="d(c.selector,a);a.container=d(a.containerSelector,a);a.count=a.slides.length;a.syncExists=0&lt;d(c.sync).length;&quot;slide&quot;===c.animation&amp;&amp;(c.animation=&quot;swing&quot;);a.prop=l?&quot;top&quot;:&quot;marginLeft&quot;;a.args={};a.manualPause=!1;var" n="[&quot;perspectiveProperty&quot;,&quot;WebkitPerspective&quot;,&quot;MozPerspective&quot;,&quot;OPerspective&quot;,&quot;msPerspective&quot;],e;for(e" n)if(void="" 0!="=g.style[n[e]]){a.pfx=n[e].replace(&quot;Perspective&quot;,&quot;&quot;).toLowerCase();" a.prop="-" +a.pfx+"-transform";g="!0;break" a}g="!1}b.transitions=g;&quot;&quot;!==c.controlsContainer&amp;&amp;(a.controlsContainer=0&lt;d(c.controlsContainer).length&amp;&amp;d(c.controlsContainer));&quot;&quot;!==c.manualControls&amp;&amp;(a.manualControls=0&lt;d(c.manualControls).length&amp;&amp;d(c.manualControls));c.randomize&amp;&amp;(a.slides.sort(function(){return" math.round(math.random())-0.5}),a.container.empty().append(a.slides));a.domath();s&&f.asnav.setup();a.setup("init");c.controlnav&&f.controlnav.setup();c.directionnav&&f.directionnav.setup();c.keyboard&&="" (1="==d(a.containerSelector).length||c.multipleKeyboard)&amp;&amp;d(document).bind(&quot;keyup&quot;,function(b){b=b.keyCode;if(!a.animating&amp;&amp;(39===b||37===b))b=39===b?a.getTarget(&quot;next&quot;):37===b?a.getTarget(&quot;prev&quot;):!1,a.flexAnimate(b,c.pauseOnAction)});c.mousewheel&amp;&amp;a.bind(&quot;mousewheel&quot;,function(b,g){b.preventDefault();var" d="0">g?a.getTarget(&quot;next&quot;):a.getTarget(&quot;prev&quot;);a.flexAnimate(d,c.pauseOnAction)});c.pausePlay&amp;&amp;f.pausePlay.setup();c.slideshow&amp;&amp;(c.pauseOnHover&amp;&amp;a.hover(function(){!a.manualPlay&amp;&amp;!a.manualPause&amp;&amp;a.pause()},
	function(){!a.manualPause&amp;&amp;!a.manualPlay&amp;&amp;a.play()}),0<c.initdelay?settimeout(a.play,c.initdelay):a.play());p&&c.touch&&f.touch();(!r||r&&c.smoothheight)&&d(window).bind("resize focus",f.resize);settimeout(function(){c.start(a)},200)},asnav:{setup:function(){a.asnav="!0;a.animatingTo=Math.floor(a.currentSlide/a.move);a.currentItem=a.currentSlide;a.slides.removeClass(e+&quot;active-slide&quot;).eq(a.currentItem).addClass(e+&quot;active-slide&quot;);a.slides.click(function(b){b.preventDefault();var" b="d(this),g=b.index();" !d(c.asnavfor).data("flexslider").animating&&!b.hasclass("active")&&(a.direction="a.currentItem&lt;g?&quot;next&quot;:&quot;prev&quot;,a.flexAnimate(g,c.pauseOnAction,!1,!0,!0))})}},controlNav:{setup:function(){a.manualControls?f.controlNav.setupManual():f.controlNav.setupPaging()},setupPaging:function(){var" class="&apos;+e+" control-nav="" "+e+("thumbnails"="==c.controlNav?&quot;control-thumbs&quot;:&quot;control-paging&quot;)+&apos;&quot;">&apos;);if(1<a.pagingcount)for(var n="0;n&lt;a.pagingCount;n++)g=&quot;thumbnails&quot;===c.controlNav?" '<img="" src="&apos;+a.slides.eq(n).attr(" data-thumb")+'"="">&apos;:&quot;<a>&quot;+b+&quot;</a>&quot;,a.controlNavScaffold.append(&quot;<li>&quot;+g+&quot;</li>&quot;),b++;a.controlsContainer?d(a.controlsContainer).append(a.controlNavScaffold):a.append(a.controlNavScaffold);f.controlNav.set();f.controlNav.active();a.controlNavScaffold.delegate(&quot;a, img&quot;,t,function(b){b.preventDefault();var b=d(this),g=a.controlNav.index(b);b.hasClass(e+&quot;active&quot;)||(a.direction=g&gt;a.currentSlide?&quot;next&quot;:&quot;prev&quot;,a.flexAnimate(g,c.pauseOnAction))});p&amp;&amp;a.controlNavScaffold.delegate(&quot;a&quot;,
	&quot;click touchstart&quot;,function(a){a.preventDefault()})},setupManual:function(){a.controlNav=a.manualControls;f.controlNav.active();a.controlNav.live(t,function(b){b.preventDefault();var b=d(this),g=a.controlNav.index(b);b.hasClass(e+&quot;active&quot;)||(g&gt;a.currentSlide?a.direction=&quot;next&quot;:a.direction=&quot;prev&quot;,a.flexAnimate(g,c.pauseOnAction))});p&amp;&amp;a.controlNav.live(&quot;click touchstart&quot;,function(a){a.preventDefault()})},set:function(){a.controlNav=d(&quot;.&quot;+e+&quot;control-nav li &quot;+(&quot;thumbnails&quot;===c.controlNav?&quot;img&quot;:&quot;a&quot;),
	a.controlsContainer?a.controlsContainer:a)},active:function(){a.controlNav.removeClass(e+&quot;active&quot;).eq(a.animatingTo).addClass(e+&quot;active&quot;)},update:function(b,c){1<a.pagingcount&&"add"===b?a.controlnavscaffold.append(d("<li><a>&quot;+a.count+&quot;</a>&quot;)):1===a.pagingCount?a.controlNavScaffold.find(&quot;li&quot;).remove():a.controlNav.eq(c).closest(&quot;li&quot;).remove();f.controlNav.set();1<a.pagingcount&&a.pagingcount!==a.controlnav.length?a.update(c,b):f.controlnav.active()}},directionnav:{setup:function(){var b="d(&apos;&lt;ul" class="&apos;+
	e+&apos;direction-nav"><li><a class="&apos;+e+&apos;prev" href="#">&apos;+c.prevText+&apos;</a></li><li><a class="&apos;+e+&apos;next" href="#">&apos;+c.nextText+&quot;</a></li>&quot;);a.controlsContainer?(d(a.controlsContainer).append(b),a.directionNav=d(&quot;.&quot;+e+&quot;direction-nav li a&quot;,a.controlsContainer)):(a.append(b),a.directionNav=d(&quot;.&quot;+e+&quot;direction-nav li a&quot;,a));f.directionNav.update();a.directionNav.bind(t,function(b){b.preventDefault();b=d(this).hasClass(e+&quot;next&quot;)?a.getTarget(&quot;next&quot;):a.getTarget(&quot;prev&quot;);a.flexAnimate(b,c.pauseOnAction)});
	p&amp;&amp;a.directionNav.bind(&quot;click touchstart&quot;,function(a){a.preventDefault()})},update:function(){var b=e+&quot;disabled&quot;;1===a.pagingCount?a.directionNav.addClass(b):c.animationLoop?a.directionNav.removeClass(b):0===a.animatingTo?a.directionNav.removeClass(b).filter(&quot;.&quot;+e+&quot;prev&quot;).addClass(b):a.animatingTo===a.last?a.directionNav.removeClass(b).filter(&quot;.&quot;+e+&quot;next&quot;).addClass(b):a.directionNav.removeClass(b)}},pausePlay:{setup:function(){var b=d(&apos;<div class="&apos;+e+&apos;pauseplay"><a></a></div>&apos;);a.controlsContainer?
	(a.controlsContainer.append(b),a.pausePlay=d(&quot;.&quot;+e+&quot;pauseplay a&quot;,a.controlsContainer)):(a.append(b),a.pausePlay=d(&quot;.&quot;+e+&quot;pauseplay a&quot;,a));f.pausePlay.update(c.slideshow?e+&quot;pause&quot;:e+&quot;play&quot;);a.pausePlay.bind(t,function(b){b.preventDefault();d(this).hasClass(e+&quot;pause&quot;)?(a.manualPause=!0,a.manualPlay=!1,a.pause()):(a.manualPause=!1,a.manualPlay=!0,a.play())});p&amp;&amp;a.pausePlay.bind(&quot;click touchstart&quot;,function(a){a.preventDefault()})},update:function(b){&quot;play&quot;===b?a.pausePlay.removeClass(e+&quot;pause&quot;).addClass(e+
	&quot;play&quot;).text(c.playText):a.pausePlay.removeClass(e+&quot;play&quot;).addClass(e+&quot;pause&quot;).text(c.pauseText)}},touch:function(){function b(b){j=l?d-b.touches[0].pageY:d-b.touches[0].pageX;p=l?Math.abs(j)<math.abs(b.touches[0].pagex-e):math.abs(j)<math.abs(b.touches[0].pagey-e);if(!p||500<number(new date)-k)b.preventdefault(),!r&&a.transitions&&(c.animationloop||(j="" =0="==a.currentSlide&amp;&amp;0">j||a.currentSlide===a.last&amp;&amp;0<j?math.abs(j) q+2:1),a.setprops(f+j,"settouch"))}function="" g(){i.removeeventlistener("touchmove",="" b,!1);if(a.animatingto="==a.currentSlide&amp;&amp;!p&amp;&amp;null!==j){var" h="m?-j:j,l=0&lt;h?a.getTarget(&quot;next&quot;):a.getTarget(&quot;prev&quot;);a.canAdvance(l)&amp;&amp;(550">Number(new Date)-k&amp;&amp;50<math.abs(h)||math.abs(h)>q/2)?a.flexAnimate(l,c.pauseOnAction):r||a.flexAnimate(a.currentSlide,c.pauseOnAction,!0)}i.removeEventListener(&quot;touchend&quot;,g,!1);f=j=e=d=null}var d,e,f,q,j,k,p=!1;i.addEventListener(&quot;touchstart&quot;,function(j){a.animating?j.preventDefault():1===j.touches.length&amp;&amp;(a.pause(),q=l?a.h:a.w,k=Number(new Date),f=h&amp;&amp;m&amp;&amp;a.animatingTo===
	a.last?0:h&amp;&amp;m?a.limit-(a.itemW+c.itemMargin)*a.move*a.animatingTo:h&amp;&amp;a.currentSlide===a.last?a.limit:h?(a.itemW+c.itemMargin)*a.move*a.currentSlide:m?(a.last-a.currentSlide+a.cloneOffset)*q:(a.currentSlide+a.cloneOffset)*q,d=l?j.touches[0].pageY:j.touches[0].pageX,e=l?j.touches[0].pageX:j.touches[0].pageY,i.addEventListener(&quot;touchmove&quot;,b,!1),i.addEventListener(&quot;touchend&quot;,g,!1))},!1)},resize:function(){!a.animating&amp;&amp;a.is(&quot;:visible&quot;)&amp;&amp;(h||a.doMath(),r?f.smoothHeight():h?(a.slides.width(a.computedW),
	a.update(a.pagingCount),a.setProps()):l?(a.viewport.height(a.h),a.setProps(a.h,&quot;setTotal&quot;)):(c.smoothHeight&amp;&amp;f.smoothHeight(),a.newSlides.width(a.computedW),a.setProps(a.computedW,&quot;setTotal&quot;)))},smoothHeight:function(b){if(!l||r){var c=r?a:a.viewport;b?c.animate({height:a.slides.eq(a.animatingTo).height()},b):c.height(a.slides.eq(a.animatingTo).height())}},sync:function(b){var g=d(c.sync).data(&quot;flexslider&quot;),e=a.animatingTo;switch(b){case &quot;animate&quot;:g.flexAnimate(e,c.pauseOnAction,!1,!0);break;case &quot;play&quot;:!g.playing&amp;&amp;
	!g.asNav&amp;&amp;g.play();break;case &quot;pause&quot;:g.pause()}}};a.flexAnimate=function(b,g,n,i,k){s&amp;&amp;1===a.pagingCount&amp;&amp;(a.direction=a.currentItem<b?"next":"prev");if(!a.animating&&(a.canadvance(b,k)||n)&&a.is(":visible")){if(s&&i)if(n=d(c.asnavfor).data("flexslider"),a.atend=0===b||b===a.count-1,n.flexanimate(b,!0,!1,!0,k),a.direction=a.currentitem<b?"next":"prev",n.direction=a.direction,math.ceil((b+1) a.visible)-1!="=a.currentSlide&amp;&amp;0!==b)a.currentItem=b,a.slides.removeClass(e+&quot;active-slide&quot;).eq(b).addClass(e+" "active-slide"),b="Math.floor(b/a.visible);else" return="" a.currentitem="b,a.slides.removeClass(e+&quot;active-slide&quot;).eq(b).addClass(e+&quot;active-slide&quot;),!1;a.animating=!0;a.animatingTo=b;c.before(a);g&amp;&amp;a.pause();a.syncExists&amp;&amp;!k&amp;&amp;f.sync(&quot;animate&quot;);c.controlNav&amp;&amp;f.controlNav.active();h||a.slides.removeClass(e+&quot;active-slide&quot;).eq(b).addClass(e+&quot;active-slide&quot;);a.atEnd=0===b||b===a.last;c.directionNav&amp;&amp;f.directionNav.update();b===a.last&amp;&amp;(c.end(a),c.animationLoop||a.pause());if(r)p?(a.slides.eq(a.currentSlide).css({opacity:0," zindex:1}),a.slides.eq(b).css({opacity:1,zindex:2}),a.slides.unbind("webkittransitionend="" transitionend"),a.slides.eq(a.currentslide).bind("webkittransitionend="" transitionend",function(){c.after(a)}),a.animating="!1,a.currentSlide=a.animatingTo):(a.slides.eq(a.currentSlide).fadeOut(c.animationSpeed,c.easing),a.slides.eq(b).fadeIn(c.animationSpeed,c.easing,a.wrapup));else{var" q="l?a.slides.filter(&quot;:first&quot;).height():a.computedW;h?(b=c.itemWidth">a.w?2*c.itemMargin:c.itemMargin,b=(a.itemW+b)*a.move*a.animatingTo,
	b=b&gt;a.limit&amp;&amp;1!==a.visible?a.limit:b):b=0===a.currentSlide&amp;&amp;b===a.count-1&amp;&amp;c.animationLoop&amp;&amp;&quot;next&quot;!==a.direction?m?(a.count+a.cloneOffset)*q:0:a.currentSlide===a.last&amp;&amp;0===b&amp;&amp;c.animationLoop&amp;&amp;&quot;prev&quot;!==a.direction?m?0:(a.count+1)*q:m?(a.count-1-b+a.cloneOffset)*q:(b+a.cloneOffset)*q;a.setProps(b,&quot;&quot;,c.animationSpeed);if(a.transitions){if(!c.animationLoop||!a.atEnd)a.animating=!1,a.currentSlide=a.animatingTo;a.container.unbind(&quot;webkitTransitionEnd transitionend&quot;);a.container.bind(&quot;webkitTransitionEnd transitionend&quot;,
	function(){a.wrapup(q)})}else a.container.animate(a.args,c.animationSpeed,c.easing,function(){a.wrapup(q)})}c.smoothHeight&amp;&amp;f.smoothHeight(c.animationSpeed)}};a.wrapup=function(b){!r&amp;&amp;!h&amp;&amp;(0===a.currentSlide&amp;&amp;a.animatingTo===a.last&amp;&amp;c.animationLoop?a.setProps(b,&quot;jumpEnd&quot;):a.currentSlide===a.last&amp;&amp;(0===a.animatingTo&amp;&amp;c.animationLoop)&amp;&amp;a.setProps(b,&quot;jumpStart&quot;));a.animating=!1;a.currentSlide=a.animatingTo;c.after(a)};a.animateSlides=function(){a.animating||a.flexAnimate(a.getTarget(&quot;next&quot;))};a.pause=
	function(){clearInterval(a.animatedSlides);a.playing=!1;c.pausePlay&amp;&amp;f.pausePlay.update(&quot;play&quot;);a.syncExists&amp;&amp;f.sync(&quot;pause&quot;)};a.play=function(){a.animatedSlides=setInterval(a.animateSlides,c.slideshowSpeed);a.playing=!0;c.pausePlay&amp;&amp;f.pausePlay.update(&quot;pause&quot;);a.syncExists&amp;&amp;f.sync(&quot;play&quot;)};a.canAdvance=function(b,g){var d=s?a.pagingCount-1:a.last;return g?!0:s&amp;&amp;a.currentItem===a.count-1&amp;&amp;0===b&amp;&amp;&quot;prev&quot;===a.direction?!0:s&amp;&amp;0===a.currentItem&amp;&amp;b===a.pagingCount-1&amp;&amp;&quot;next&quot;!==a.direction?!1:b===a.currentSlide&amp;&amp;
	!s?!1:c.animationLoop?!0:a.atEnd&amp;&amp;0===a.currentSlide&amp;&amp;b===d&amp;&amp;&quot;next&quot;!==a.direction?!1:a.atEnd&amp;&amp;a.currentSlide===d&amp;&amp;0===b&amp;&amp;&quot;next&quot;===a.direction?!1:!0};a.getTarget=function(b){a.direction=b;return&quot;next&quot;===b?a.currentSlide===a.last?0:a.currentSlide+1:0===a.currentSlide?a.last:a.currentSlide-1};a.setProps=function(b,g,d){var e,f=b?b:(a.itemW+c.itemMargin)*a.move*a.animatingTo;e=-1*function(){if(h)return&quot;setTouch&quot;===g?b:m&amp;&amp;a.animatingTo===a.last?0:m?a.limit-(a.itemW+c.itemMargin)*a.move*a.animatingTo:a.animatingTo===
	a.last?a.limit:f;switch(g){case &quot;setTotal&quot;:return m?(a.count-1-a.currentSlide+a.cloneOffset)*b:(a.currentSlide+a.cloneOffset)*b;case &quot;setTouch&quot;:return b;case &quot;jumpEnd&quot;:return m?b:a.count*b;case &quot;jumpStart&quot;:return m?a.count*b:b;default:return b}}()+&quot;px&quot;;a.transitions&amp;&amp;(e=l?&quot;translate3d(0,&quot;+e+&quot;,0)&quot;:&quot;translate3d(&quot;+e+&quot;,0,0)&quot;,d=void 0!==d?d/1E3+&quot;s&quot;:&quot;0s&quot;,a.container.css(&quot;-&quot;+a.pfx+&quot;-transition-duration&quot;,d));a.args[a.prop]=e;(a.transitions||void 0===d)&amp;&amp;a.container.css(a.args)};a.setup=function(b){if(r)a.slides.css({width:&quot;100%&quot;,
	&quot;float&quot;:&quot;left&quot;,marginRight:&quot;-100%&quot;,position:&quot;relative&quot;}),&quot;init&quot;===b&amp;&amp;(p?a.slides.css({opacity:0,display:&quot;block&quot;,webkitTransition:&quot;opacity &quot;+c.animationSpeed/1E3+&quot;s ease&quot;,zIndex:1}).eq(a.currentSlide).css({opacity:1,zIndex:2}):a.slides.eq(a.currentSlide).fadeIn(c.animationSpeed,c.easing)),c.smoothHeight&amp;&amp;f.smoothHeight();else{var g,n;&quot;init&quot;===b&amp;&amp;(a.viewport=d(&apos;<div class="&apos;+e+&apos;viewport"></div>&apos;).css({overflow:&quot;hidden&quot;,position:&quot;relative&quot;}).appendTo(a).append(a.container),a.cloneCount=0,a.cloneOffset=
	0,m&amp;&amp;(n=d.makeArray(a.slides).reverse(),a.slides=d(n),a.container.empty().append(a.slides)));c.animationLoop&amp;&amp;!h&amp;&amp;(a.cloneCount=2,a.cloneOffset=1,&quot;init&quot;!==b&amp;&amp;a.container.find(&quot;.clone&quot;).remove(),a.container.append(a.slides.first().clone().addClass(&quot;clone&quot;)).prepend(a.slides.last().clone().addClass(&quot;clone&quot;)));a.newSlides=d(c.selector,a);g=m?a.count-1-a.currentSlide+a.cloneOffset:a.currentSlide+a.cloneOffset;l&amp;&amp;!h?(a.container.height(200*(a.count+a.cloneCount)+&quot;%&quot;).css(&quot;position&quot;,&quot;absolute&quot;).width(&quot;100%&quot;),
	setTimeout(function(){a.newSlides.css({display:&quot;block&quot;});a.doMath();a.viewport.height(a.h);a.setProps(g*a.h,&quot;init&quot;)},&quot;init&quot;===b?100:0)):(a.container.width(200*(a.count+a.cloneCount)+&quot;%&quot;),a.setProps(g*a.computedW,&quot;init&quot;),setTimeout(function(){a.doMath();a.newSlides.css({width:a.computedW,&quot;float&quot;:&quot;left&quot;,display:&quot;block&quot;});c.smoothHeight&amp;&amp;f.smoothHeight()},&quot;init&quot;===b?100:0))}h||a.slides.removeClass(e+&quot;active-slide&quot;).eq(a.currentSlide).addClass(e+&quot;active-slide&quot;)};a.doMath=function(){var b=a.slides.first(),
	d=c.itemMargin,e=c.minItems,f=c.maxItems;a.w=a.width();a.h=b.height();a.boxPadding=b.outerWidth()-b.width();h?(a.itemT=c.itemWidth+d,a.minW=e?e*a.itemT:a.w,a.maxW=f?f*a.itemT:a.w,a.itemW=a.minW&gt;a.w?(a.w-d*e)/e:a.maxW<a.w?(a.w-d*f) f:c.itemwidth="">a.w?a.w:c.itemWidth,a.visible=Math.floor(a.w/(a.itemW+d)),a.move=0<c.move&&c.move<a.visible?c.move:a.visible,a.pagingcount=math.ceil((a.count-a.visible) a.move+1),a.last="a.pagingCount-1,a.limit=1===a.pagingCount?0:c.itemWidth">a.w?(a.itemW+2*d)*a.count-a.w-
	d:(a.itemW+d)*a.count-a.w-d):(a.itemW=a.w,a.pagingCount=a.count,a.last=a.count-1);a.computedW=a.itemW-a.boxPadding};a.update=function(b,d){a.doMath();h||(b<a.currentslide?a.currentslide+=1:b<=a.currentslide&&0!==b&&(a.currentslide-=1),a.animatingto=a.currentslide);if(c.controlnav&&!a.manualcontrols)if("add"===d&&!h||a.pagingcount>a.controlNav.length)f.controlNav.update(&quot;add&quot;);else if(&quot;remove&quot;===d&amp;&amp;!h||a.pagingCount<a.controlnav.length)h&&a.currentslide>a.last&amp;&amp;(a.currentSlide-=1,a.animatingTo-=1),
	f.controlNav.update(&quot;remove&quot;,a.last);c.directionNav&amp;&amp;f.directionNav.update()};a.addSlide=function(b,e){var f=d(b);a.count+=1;a.last=a.count-1;l&amp;&amp;m?void 0!==e?a.slides.eq(a.count-e).after(f):a.container.prepend(f):void 0!==e?a.slides.eq(e).before(f):a.container.append(f);a.update(e,&quot;add&quot;);a.slides=d(c.selector+&quot;:not(.clone)&quot;,a);a.setup();c.added(a)};a.removeSlide=function(b){var e=isNaN(b)?a.slides.index(d(b)):b;a.count-=1;a.last=a.count-1;isNaN(b)?d(b,a.slides).remove():l&amp;&amp;m?a.slides.eq(a.last).remove():
	a.slides.eq(b).remove();a.doMath();a.update(e,&quot;remove&quot;);a.slides=d(c.selector+&quot;:not(.clone)&quot;,a);a.setup();c.removed(a)};f.init()};d.flexslider.defaults={namespace:&quot;flex-&quot;,selector:&quot;.slides &gt; li&quot;,animation:&quot;fade&quot;,easing:&quot;swing&quot;,direction:&quot;horizontal&quot;,reverse:!1,animationLoop:!0,smoothHeight:!1,startAt:0,slideshow:!0,slideshowSpeed:7E3,animationSpeed:600,initDelay:0,randomize:!1,pauseOnAction:!0,pauseOnHover:!1,useCSS:!0,touch:!0,video:!1,controlNav:!0,directionNav:!0,prevText:&quot;Previous&quot;,nextText:&quot;Next&quot;,
	keyboard:!0,multipleKeyboard:!1,mousewheel:!1,pausePlay:!1,pauseText:&quot;Pause&quot;,playText:&quot;Play&quot;,controlsContainer:&quot;&quot;,manualControls:&quot;&quot;,sync:&quot;&quot;,asNavFor:&quot;&quot;,itemWidth:0,itemMargin:0,minItems:0,maxItems:0,move:0,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){}};d.fn.flexslider=function(i){void 0===i&amp;&amp;(i={});if(&quot;object&quot;===typeof i)return this.each(function(){var a=d(this),c=a.find(i.selector?i.selector:&quot;.slides &gt; li&quot;);1===c.length?(c.fadeIn(400),
	i.start&amp;&amp;i.start(a)):void 0==a.data(&quot;flexslider&quot;)&amp;&amp;new d.flexslider(this,i)});var k=d(this).data(&quot;flexslider&quot;);switch(i){case &quot;play&quot;:k.play();break;case &quot;pause&quot;:k.pause();break;case &quot;next&quot;:k.flexAnimate(k.getTarget(&quot;next&quot;),!0);break;case &quot;prev&quot;:case &quot;previous&quot;:k.flexAnimate(k.getTarget(&quot;prev&quot;),!0);break;default:&quot;number&quot;===typeof i&amp;&amp;k.flexAnimate(i,!0)}}})(jQuery);

	$(&apos;#slider&apos;).flexslider({
		animation: &quot;fade&quot;,
		controlNav: true,
		directionNav: false,
	});

	/* SlickNav Responsive Mobile Menu v1.0.0 */

	;(function(e,t,n){function o(t,n){this.element=t;this.settings=e.extend({},r,n);this._defaults=r;this._name=i;this.init()}var r={label:&quot;MENU&quot;,duplicate:true,duration:200,easingOpen:&quot;swing&quot;,easingClose:&quot;swing&quot;,closedSymbol:&quot;&#x25BA;&quot;,openedSymbol:&quot;&#x25BC;&quot;,prependTo:&quot;body&quot;,parentTag:&quot;a&quot;,closeOnClick:false,allowParentLinks:false,init:function(){},open:function(){},close:function(){}},i=&quot;slicknav&quot;,s=&quot;slicknav&quot;;o.prototype.init=function(){var n=this;var r=e(this.element);var i=this.settings;if(i.duplicate){n.mobileNav=r.clone();n.mobileNav.removeAttr(&quot;id&quot;);n.mobileNav.find(&quot;*&quot;).each(function(t,n){e(n).removeAttr(&quot;id&quot;)})}else n.mobileNav=r;var o=s+&quot;_icon&quot;;if(i.label==&quot;&quot;){o+=&quot; &quot;+s+&quot;_no-text&quot;}if(i.parentTag==&quot;a&quot;){i.parentTag=&apos;a href=&quot;#&quot;&apos;}n.mobileNav.attr(&quot;class&quot;,s+&quot;_nav&quot;);var u=e(&apos;<div class="&apos;+s+&apos;_menu"></div>&apos;);n.btn=e(&quot;<"+i.parenttag+' aria-haspopup="true" tabindex="0" class="&apos;+s+" _btn="" "+s+'_collapsed"=""><span class="&apos;+s+&apos;_menutxt">&apos;+i.label+&apos;</span><span class="&apos;+o+&apos;"><span class="&apos;+s+&apos;_icon-bar"></span><span class="&apos;+s+&apos;_icon-bar"></span><span class="&apos;+s+&apos;_icon-bar"></span></span>&apos;);e(u).append(n.btn);e(i.prependTo).prepend(u);u.append(n.mobileNav);var a=n.mobileNav.find(&quot;li&quot;);e(a).each(function(){var t=e(this);data={};data.children=t.children(&quot;ul&quot;).attr(&quot;role&quot;,&quot;menu&quot;);t.data(&quot;menu&quot;,data);if(data.children.length&gt;0){var r=t.contents();var o=[];e(r).each(function(){if(!e(this).is(&quot;ul&quot;)){o.push(this)}else{return false}});var u=e(o).wrapAll(&quot;<"+i.parenttag+' role="menuitem" aria-haspopup="true" tabindex="-1" class="&apos;+s+&apos;_item">&apos;).parent();t.addClass(s+&quot;_collapsed&quot;);t.addClass(s+&quot;_parent&quot;);e(o).last().after(&apos;<span class="&apos;+s+&apos;_arrow">&apos;+i.closedSymbol+&quot;</span>&quot;)}else if(t.children().length==0){t.addClass(s+&quot;_txtnode&quot;)}t.children(&quot;a&quot;).attr(&quot;role&quot;,&quot;menuitem&quot;).click(function(t){if(i.closeOnClick&amp;&amp;!e(t.target).parent().closest(&quot;li&quot;).hasClass(s+&quot;_parent&quot;))e(n.btn).click()});if(i.closeOnClick&amp;&amp;i.allowParentLinks){t.children(&quot;a&quot;).children(&quot;a&quot;).click(function(t){e(n.btn).click()})}});e(a).each(function(){var t=e(this).data(&quot;menu&quot;);n._visibilityToggle(t.children,false,null,true)});n._visibilityToggle(n.mobileNav,false,&quot;init&quot;,true);n.mobileNav.attr(&quot;role&quot;,&quot;menu&quot;);e(t).mousedown(function(){n._outlines(false)});e(t).keyup(function(){n._outlines(true)});e(n.btn).click(function(e){e.preventDefault();n._menuToggle()});n.mobileNav.on(&quot;click&quot;,&quot;.&quot;+s+&quot;_item&quot;,function(t){t.preventDefault();n._itemClick(e(this))});e(n.btn).keydown(function(e){var t=e||event;if(t.keyCode==13){e.preventDefault();n._menuToggle()}});n.mobileNav.on(&quot;keydown&quot;,&quot;.&quot;+s+&quot;_item&quot;,function(t){var r=t||event;if(r.keyCode==13){t.preventDefault();n._itemClick(e(t.target))}});if(i.allowParentLinks){e(&quot;.&quot;+s+&quot;_item a&quot;).click(function(e){e.stopImmediatePropagation()})}};o.prototype._menuToggle=function(e){var t=this;var n=t.btn;var r=t.mobileNav;if(n.hasClass(s+&quot;_collapsed&quot;)){n.removeClass(s+&quot;_collapsed&quot;);n.addClass(s+&quot;_open&quot;)}else{n.removeClass(s+&quot;_open&quot;);n.addClass(s+&quot;_collapsed&quot;)}n.addClass(s+&quot;_animating&quot;);t._visibilityToggle(r,true,n)};o.prototype._itemClick=function(e){var t=this;var n=t.settings;var r=e.data(&quot;menu&quot;);if(!r){r={};r.arrow=e.children(&quot;.&quot;+s+&quot;_arrow&quot;);r.ul=e.next(&quot;ul&quot;);r.parent=e.parent();e.data(&quot;menu&quot;,r)}if(r.parent.hasClass(s+&quot;_collapsed&quot;)){r.arrow.html(n.openedSymbol);r.parent.removeClass(s+&quot;_collapsed&quot;);r.parent.addClass(s+&quot;_open&quot;);r.parent.addClass(s+&quot;_animating&quot;);t._visibilityToggle(r.ul,true,e)}else{r.arrow.html(n.closedSymbol);r.parent.addClass(s+&quot;_collapsed&quot;);r.parent.removeClass(s+&quot;_open&quot;);r.parent.addClass(s+&quot;_animating&quot;);t._visibilityToggle(r.ul,true,e)}};o.prototype._visibilityToggle=function(t,n,r,i){var o=this;var u=o.settings;var a=o._getActionItems(t);var f=0;if(n)f=u.duration;if(t.hasClass(s+&quot;_hidden&quot;)){t.removeClass(s+&quot;_hidden&quot;);t.slideDown(f,u.easingOpen,function(){e(r).removeClass(s+&quot;_animating&quot;);e(r).parent().removeClass(s+&quot;_animating&quot;);if(!i){u.open(r)}});t.attr(&quot;aria-hidden&quot;,&quot;false&quot;);a.attr(&quot;tabindex&quot;,&quot;0&quot;);o._setVisAttr(t,false)}else{t.addClass(s+&quot;_hidden&quot;);t.slideUp(f,this.settings.easingClose,function(){t.attr(&quot;aria-hidden&quot;,&quot;true&quot;);a.attr(&quot;tabindex&quot;,&quot;-1&quot;);o._setVisAttr(t,true);t.hide();e(r).removeClass(s+&quot;_animating&quot;);e(r).parent().removeClass(s+&quot;_animating&quot;);if(!i)u.close(r);else if(r==&quot;init&quot;)u.init()})}};o.prototype._setVisAttr=function(t,n){var r=this;var i=t.children(&quot;li&quot;).children(&quot;ul&quot;).not(&quot;.&quot;+s+&quot;_hidden&quot;);if(!n){i.each(function(){var t=e(this);t.attr(&quot;aria-hidden&quot;,&quot;false&quot;);var i=r._getActionItems(t);i.attr(&quot;tabindex&quot;,&quot;0&quot;);r._setVisAttr(t,n)})}else{i.each(function(){var t=e(this);t.attr(&quot;aria-hidden&quot;,&quot;true&quot;);var i=r._getActionItems(t);i.attr(&quot;tabindex&quot;,&quot;-1&quot;);r._setVisAttr(t,n)})}};o.prototype._getActionItems=function(e){var t=e.data(&quot;menu&quot;);if(!t){t={};var n=e.children(&quot;li&quot;);var r=n.children(&quot;a&quot;);t.links=r.add(n.children(&quot;.&quot;+s+&quot;_item&quot;));e.data(&quot;menu&quot;,t)}return t.links};o.prototype._outlines=function(t){if(!t){e(&quot;.&quot;+s+&quot;_item, .&quot;+s+&quot;_btn&quot;).css(&quot;outline&quot;,&quot;none&quot;)}else{e(&quot;.&quot;+s+&quot;_item, .&quot;+s+&quot;_btn&quot;).css(&quot;outline&quot;,&quot;&quot;)}};o.prototype.toggle=function(){$this=this;$this._menuToggle()};o.prototype.open=function(){$this=this;if($this.btn.hasClass(s+&quot;_collapsed&quot;)){$this._menuToggle()}};o.prototype.close=function(){$this=this;if($this.btn.hasClass(s+&quot;_open&quot;)){$this._menuToggle()}};e.fn[i]=function(t){var n=arguments;if(t===undefined||typeof t===&quot;object&quot;){return this.each(function(){if(!e.data(this,&quot;plugin_&quot;+i)){e.data(this,&quot;plugin_&quot;+i,new o(this,t))}})}else if(typeof t===&quot;string&quot;&amp;&amp;t[0]!==&quot;_&quot;&amp;&amp;t!==&quot;init&quot;){var r;this.each(function(){var s=e.data(this,&quot;plugin_&quot;+i);if(s instanceof o&amp;&amp;typeof s[t]===&quot;function&quot;){r=s[t].apply(s,Array.prototype.slice.call(n,1))}});return r!==undefined?r:this}}})(jQuery,document,window)

	$(function(){
		$(&apos;.main-nav&apos;).slicknav({ prependTo:&apos;.mh-container&apos;, duration: 500, allowParentLinks: true });
	});

});</"+i.parenttag+'></"+i.parenttag+'></a.controlnav.length)h&&a.currentslide></a.currentslide?a.currentslide+=1:b<=a.currentslide&&0!==b&&(a.currentslide-=1),a.animatingto=a.currentslide);if(c.controlnav&&!a.manualcontrols)if("add"===d&&!h||a.pagingcount></c.move&&c.move<a.visible?c.move:a.visible,a.pagingcount=math.ceil((a.count-a.visible)></a.w?(a.w-d*f)></b?"next":"prev");if(!a.animating&&(a.canadvance(b,k)||n)&&a.is(":visible")){if(s&&i)if(n=d(c.asnavfor).data("flexslider"),a.atend=0===b||b===a.count-1,n.flexanimate(b,!0,!1,!0,k),a.direction=a.currentitem<b?"next":"prev",n.direction=a.direction,math.ceil((b+1)></math.abs(h)||math.abs(h)></j?math.abs(j)></math.abs(b.touches[0].pagex-e):math.abs(j)<math.abs(b.touches[0].pagey-e);if(!p||500<number(new></a.pagingcount&&a.pagingcount!==a.controlnav.length?a.update(c,b):f.controlnav.active()}},directionnav:{setup:function(){var></a.pagingcount&&"add"===b?a.controlnavscaffold.append(d("<li></a.pagingcount)for(var></c.initdelay?settimeout(a.play,c.initdelay):a.play());p&&c.touch&&f.touch();(!r||r&&c.smoothheight)&&d(window).bind("resize></d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return></g;e++)d.createelement(f[e]);return>