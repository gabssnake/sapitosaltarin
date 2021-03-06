// CeeBox 2.1.5 By Colin Fahrion
// http://github.com/catcubed/ceebox


// apply to everything
$(document).ready(function(){
	$(".ceebox").ceebox();
	$(".ceebox-img").ceebox('imageGallery:true');
	$(".page-single").ceebox('imageGallery:true');
	$(".post-single").ceebox('imageGallery:true');
});


(function($) {
$.ceebox = {version:"2.1.5"};

$.fn.ceebox = function(opts){
	opts = $.extend({selector: $(this).selector},$.fn.ceebox.defaults, opts);

	var elem = this;
	var selector = $(this).selector;
	if (opts.videoJSON) { 
		$.getJSON(opts.videoJSON, function(json){
			$.extend($.fn.ceebox.videos,json);
			init(elem,opts,selector);
		});
	} else {init(elem,opts,selector);}
	
	return this;
};



$.fn.ceebox.defaults = {

	html:false,
	image:true,
	video:true,
	modal:false, 
	
	titles: false, 
	htmlGallery:false,
	imageGallery:true,
	videoGallery:false,
	videoWidth: false, 
	videoHeight: false, 
	videoRatio: "16:9",
	htmlWidth: false, 
	htmlHeight: false,
	htmlRatio: false,
	imageWidth: false, 
	imageHeight: false,
	
	animSpeed: "fast", 
	easing: "swing", 
	fadeOut: 400, 
	fadeIn: 400, 
	overlayColor:"#000",
	overlayOpacity:0.8,
	boxColor:"#fff", 
	textColor:"", 
	borderColor:"#fff", 
	borderWidth: "0", 
	padding: 15, 
	margin: 90, 
	onload:null, 
	unload:null, 
	videoJSON:null,
	iPhoneRedirect:true 
};
$.fn.ceebox.ratios = {"4:3": 1.333, "3:2": 1.5, "16:9": 1.778,"1:1":1,"square":1};

$.fn.ceebox.relMatch = {
	width: /(?:width:)([0-9]+)/i, 
	height: /(?:height:)([0-9]+)/i, 
	ratio: /(?:ratio:)([0-9\.:]+)/i, 
	modal: /modal:true/i, 
	nonmodal: /modal:false/i, 
	videoSrc:/(?:videoSrc:)(http:[\/\-\._0-9a-zA-Z:]+)/i, 
	videoId:/(?:videoId:)([\-\._0-9a-zA-Z:]+)/i 
};

$.fn.ceebox.loader = "<div id='cee_load' style='z-index:105;top:50%;left:50%;position:fixed'></div>";

$.fn.ceebox.videos = {
	base : { 
		param: {wmode: "transparent",allowFullScreen: "true",allowScriptAccess: "always"},
		flashvars: {autoplay: true}
	},
	facebook: {
		siteRgx: /facebook\.com\/video/i,
		idRgx: /(?:v=)([a-zA-Z0-9_]+)/i,
		src: "http://www.facebook.com/v/[id]"
	},
	youtube: {
		siteRgx : /youtube\.com\/watch/i, 
		idRgx: /(?:v=)([a-zA-Z0-9_\-]+)/i,
		src : "http://www.youtube.com/v/[id]&hl=en&fs=1&autoplay=1"
	},
	google: {
		siteRgx : /google\.com\/videoplay/i,
		idRgx: /(?:id=)([a-zA-Z0-9_\-]+)/i,
		src : "http://video.google.com/googleplayer.swf?docId=[id]&hl=en&fs=true",
		flashvars: {playerMode: "normal",fs: true}
	},
	vimeo: {
		siteRgx : /vimeo\.com\/[0-9]+/i,
		idRgx: /(?:\.com\/)([a-zA-Z0-9_]+)/i,
		src : "http://www.vimeo.com/moogaloop.swf?clip_id=[id]&server=vimeo.com&show_title=1&show_byline=1&show_portrait=0&color=&fullscreen=1"
	}
};


$.fn.ceebox.overlay = function(opts) {
	opts = $.extend({
		width: 60,
		height: 30,
		type: "html"
	}, $.fn.ceebox.defaults, opts);
	
	if ($("#cee_overlay").size() === 0){
		$("<div id='cee_overlay'></div>").css({
				 opacity : opts.overlayOpacity,
				 position: "absolute",
				 top: 0,
				 left: 0,
				 backgroundColor: opts.overlayColor,
				 width: "100%",
				 height: $(document).height(),
				 zIndex: 100
			}).appendTo($("body"));
	}
	if ($("#cee_box").size() === 0){
		var pos = boxPos(opts); 
		
		var boxCSS = {
			position: pos.position,
			zIndex: 102,
			top: "50%",
			left: "50%",
			height: opts.height + "px",
			width: opts.width + "px",
			marginLeft: pos.mleft + 'px',
			marginTop: pos.mtop + 'px',
			opacity:0,
			borderWidth:opts.borderWidth,
			borderColor:opts.borderColor,
			backgroundColor:opts.boxColor,
			color:opts.textColor
		};
		
		$("<div id='cee_box'></div>").css(boxCSS).appendTo("body").animate({opacity:1},opts.animSpeed,function(){
				$("#cee_overlay").addClass("cee_close");
			});
	} 
	
	$("#cee_box").removeClass().addClass("cee_" + opts.type);
	
	if ($("#cee_load").size() === 0) {$($.fn.ceebox.loader).appendTo("body");}
	
	$("#cee_load").show("fast").animate({opacity:1},"fast");

};


$.fn.ceebox.popup = function(content,opts) {
	var page = pageSize(opts.margin);
	opts = $.extend({
		width: page.width, 
		height: page.height, 
		modal:false,
		type: "html",
		onload:null
	}, $.fn.ceebox.defaults, opts);
	
	var gallery,family;
	
	if ($(content).is("a,area,input") && (opts.type == "html" || opts.type == "image" || opts.type == "video")) { 
		if (opts.gallery) {family = $(opts.selector).eq(opts.gallery.parentId).find("a[href],area[href],input[href]");}
		
		Build[opts.type].prototype = new BoxAttr(content,opts);
		var cb = new Build[opts.type]();
		content = cb.content;
		
		opts.action = cb.action;
		opts.modal = cb.modal;
		
		if (opts.titles) {
			opts.titleHeight = $(cb.titlebox).contents().contents().wrap("<div></div>").parent().attr("id","ceetitletest").css({position:"absolute",top:"-300px",width:cb.width + "px"}).appendTo("body").height();
			$("#ceetitletest").remove();
			opts.titleHeight = (opts.titleHeight >= 10) ? opts.titleHeight + 20 : 30;
		} else {opts.titleHeight = 0;}
		
		opts.width = cb.width + 2*opts.padding;
		opts.height = cb.height + opts.titleHeight + 2*opts.padding;
	}
	
	$.fn.ceebox.overlay(opts);
	
	base.action = opts.action;
	base.onload = opts.onload;
	base.unload = opts.unload;

	var pos = boxPos(opts);
	
	var animOpts = {
			marginLeft: pos.mleft,
			marginTop: pos.mtop,
			width: opts.width + "px",
			height: opts.height + "px",
			borderWidth:opts.borderWidth
	};
	if (opts.borderColor) {
		var reg = /#[1-90a-f]+/gi;
		var borderColor = cssParse(opts.borderColor,reg);
		animOpts = $.extend(animOpts,{
			borderTopColor:borderColor[0],
			borderRightColor:borderColor[1],
			borderBottomColor:borderColor[2],
			borderLeftColor:borderColor[3]
		});
	}
	animOpts = (opts.textColor) ? $.extend(animOpts,{color:opts.textColor}): animOpts;
	animOpts = (opts.boxColor) ? $.extend(animOpts,{backgroundColor:opts.boxColor}): animOpts;
	
	$("#cee_box").animate(animOpts,opts.animSpeed,opts.easing,function(){

			var children = $(this).append(content).children().hide();
			var len = children.length;
			var onloadcall = true;
			
			children.fadeIn(opts.fadeIn,function(){
				if ($(this).is("#cee_iframeContent")) {onloadcall = false;} 
				if (onloadcall && this == children[len-1]) {$.fn.ceebox.onload();}

			});
			
			if (opts.modal===true) {
				$("#cee_overlay").removeClass("cee_close"); //remove close function on overlay
			} else {
				/*
				$("<a href='#' id='cee_closeBtn' class='cee_close' title='Cerrar'>Cerrar</a>").prependTo("#cee_box");
				*/
				if (opts.gallery) {addGallery(opts.gallery,family,opts);}
				
				keyEvents(gallery,family,opts.fadeOut);
			}
		});
};



$.fn.ceebox.closebox = function(fade,unload) {
	fade = fade || 400;
	$("#cee_box").fadeOut(fade);
	$("#cee_overlay").fadeOut((typeof fade == 'number') ? fade*2 : "slow",function(){
		$('#cee_box,#cee_overlay,#cee_HideSelect,#cee_load').unbind().trigger("unload").remove();
		if (isFunction(unload)) { unload(); } else if (isFunction(base.unload)) {base.unload();}
		base.unload = null;
	});
	document.onkeydown = null;
};

$.fn.ceebox.onload = function(opts){
		$("#cee_load").hide(300).fadeOut(600,function(){$(this).remove();}); 
		if (isFunction(base.action)) {base.action(); base.action = null;} 
		if (isFunction(base.onload)) {base.onload(); base.onload = null;}
};


var base = {};
function init(elem,opts,selector) {
	base.vidRegex = function(){
		var regStr = "";
		$.each($.fn.ceebox.videos,function(i,v){ 
			if (v.siteRgx !== null && typeof v.siteRgx !== 'string') {
				var tmp = String(v.siteRgx);
				regStr = regStr + tmp.slice(1,tmp.length-2) + "|";
			}
		});
		return new RegExp(regStr + "\\.swf$","i");
	}();
	
	base.userAgent = navigator.userAgent;
	$(".cee_close").die().live("click",function(){$.fn.ceebox.closebox();return false;});
	
	if (selector != false) {$(elem).each(function(i){ceeboxLinkSort(this,i,opts,selector);});}	
	
	$(elem).live("click", function(e){
		var tgt = $(e.target).closest("[href]");
		var tgtData = tgt.data("ceebox");
		if (tgtData) {
			var linkOpts = (tgtData.opts) ? $.extend({}, opts, tgtData.opts) : opts;
			$.fn.ceebox.overlay(linkOpts);
			if (tgtData.type == "image") { 
				var imgPreload = new Image();
				imgPreload.onload = function(){
					var w = imgPreload.width,h=imgPreload.height;
					
					linkOpts.imageWidth = getSmlr(w,$.fn.ceebox.defaults.imageWidth);
					linkOpts.imageHeight = getSmlr(h,$.fn.ceebox.defaults.imageHeight);
					linkOpts.imageRatio = w/h;
					$.fn.ceebox.popup(tgt,$.extend(linkOpts,{type:tgtData.type},{gallery:tgtData.gallery})); 
				};
				imgPreload.src = $(tgt).attr("href");
			} else {$.fn.ceebox.popup(tgt,$.extend(linkOpts,{type:tgtData.type},{gallery:tgtData.gallery}));} 
			return false;
		}
	});
}


var ceeboxLinkSort = function(parent,parentId,opts,selector) {
	
	var family,cbLinks = [],galleryLinks = [],gNum = 0;
	
	($(parent).is("[href]")) ? family = $(parent) : family = $(parent).find("[href]");
	
	var urlMatch = {
		image: function(h,r) {if (r && r.match(/\bimage\b/i)) { return true; } else { return h.match(/\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/i) || false;}},
		video: function(h,r) {if (r && r.match(/\bvideo\b/i)) { return true; } else { return h.match(base.vidRegex) || false; }},
		html: function(h) {return true;}
	};
	var familyLen = family.length;
	
	family.each(function(i){
		var alink = this;
		var metadata = $.metadata ? $(alink).metadata() : false;
		var linkOpts = metadata ? $.extend({}, opts, metadata) : opts;
		
		$.each(urlMatch, function(type) {
			
			if (urlMatch[type]($(alink).attr("href"),$(alink).attr("rel")) && linkOpts[type]) {	
				var gallery = false;
				
				if (linkOpts[type + "Gallery"] === true) {
					galleryLinks[galleryLinks.length] = i;
					gallery = true;
				}
				cbLinks[cbLinks.length] = {linkObj:alink,type:type,gallery:gallery,linkOpts:linkOpts};
				return false;
			}
		});
	});
	var gLen = galleryLinks.length;
	$.each(cbLinks,function(i){
		if (cbLinks[i].gallery) {
			var gallery = {parentId:parentId,gNum:gNum,gLen:gLen};
			if (gNum > 0) {gallery.prevId = galleryLinks[gNum-1];}
			if (gNum < gLen - 1) {gallery.nextId = galleryLinks[gNum+1];}
			gNum++;
		}
		if (!$.support.opacity && $(parent).is("map")) {$(cbLinks[i].linkObj).click(function(e){e.preventDefault();});} 
		$.data(cbLinks[i].linkObj,"ceebox",{type:cbLinks[i].type,opts:cbLinks[i].linkOpts,gallery:gallery});
	});
	
};

var BoxAttr = function(cblink,o) {
	var w = o[o.type + "Width"];
	var h = o[o.type + "Height"]; 
	var r = o[o.type + "Ratio"] || w/h; 

	var rel = $(cblink).attr("rel");
	if (rel && rel!== "") {
		var m = {};
		$.each($.fn.ceebox.relMatch,function(i,v){m[i] = v.exec(rel);});
		
		if (m.modal) {o.modal = true;}
		if (m.nonmodal) {o.modal = false;}
		
		if (m.width) {w = Number(lastItem(m.width));}
		if (m.height) {h = Number(lastItem(m.height));}
		if (m.ratio) {r = lastItem(m.ratio); r = (Number(r)) ? Number(r) : String(r);}
		
		if (m.videoSrc) {this.videoSrc = String(lastItem(m.videoSrc));}
		if (m.videoId) {this.videoId = String(lastItem(m.videoId));}
	}
	
	var p = pageSize(o.margin);
	w = getSmlr(w,p.width);
	h = getSmlr(h,p.height);
	
	if (r) { 
		if (!Number(r)) {r = ($.fn.ceebox.ratios[r]) ? Number($.fn.ceebox.ratios[r]) : 1;}
		
		if (w/h > r) {w = parseInt(h * r,10);}
		if (w/h < r) {h = parseInt(w / r,10);}
	}
	
	this.modal = o.modal;
	this.href = $(cblink).attr("href");
	this.title = $(cblink).attr("title") || cblink.t || ""; 
	this.titlebox = (o.titles) ? "<div id='cee_title'><h2>"+this.title+"</h2></div>" : "";
	this.width = w;
	this.height = h;
	this.rel = rel;
	this.iPhoneRedirect = o.iPhoneRedirect;
};

var Build = {
	image: function() {
		this.content = "<img id='cee_img' src='"+this.href+"' width='"+this.width+"' height='"+this.height+"' alt='"+this.title+"'/>" + this.titlebox;
	}, 
	video: function() { 
		var content = "",cb = this;
		
		var vid = function(){
			var rtn = this,id = cb.videoId;
			rtn.flashvars = rtn.param = {};
			rtn.src = cb.videoSrc || cb.href;
			rtn.width = cb.width;
			rtn.height = cb.height;
			$.each($.fn.ceebox.videos,function(i,v){ 
				if (v.siteRgx && typeof v.siteRgx != 'string' && v.siteRgx.test(cb.href)) {
					if (v.idRgx) { 
						v.idRgx = new RegExp(v.idRgx);
						id = String(lastItem(v.idRgx.exec(cb.href)));
					}
					rtn.src = (v.src) ? v.src.replace("[id]",id) : rtn.src;
					
					if (v.flashvars) {$.each(v.flashvars, function(ii,vv){
							if (typeof vv =='string') {rtn.flashvars[ii] = vv.replace("[id]",id);}
						});}
					
					if (v.param) {$.each(v.param, function(ii,vv){
							if (typeof vv =='string') {rtn.param[ii] = vv.replace("[id]",id);}
						});}
					rtn.width = v.width || rtn.width;
					rtn.height = v.height || rtn.height;
					rtn.site = i;
					return;
				}
			});
			return rtn;
			
		}();
		
		if ($.flash.hasVersion(8)) {
			
			this.width = vid.width;
			this.height = vid.height;
			
			this.action = function() {
				$('#cee_vid').flash({
					swf: vid.src,
					params: $.extend($.fn.ceebox.videos.base.param,vid.param),
					flashvars: $.extend($.fn.ceebox.videos.base.flashvars,vid.flashvars),
					width: vid.width,
					height: vid.height
				});
			};
		} else {
			this.width = 400; this.height = 200;
			if( ((base.userAgent.match(/iPhone/i)) && this.iPhoneRedirect) || ((base.userAgent.match(/iPod/i)) && this.iPhoneRedirect)) { 
				var redirect = this.href;
				this.action = function(){$.fn.ceebox.closebox(400,function(){window.location = redirect;});};
			} else {
				vid.site = vid.site || "SWF file";
				content = "<p style='margin:20px'>Adobe Flash 8 or higher is required to view this movie. You can either:</p><ul><li>Follow link to <a href='"+ this.href +"'>" + vid.site + " </a></li><li>or <a href='http://www.adobe.com/products/flashplayer/'>Install Flash</a></li><li> or <a href='#' class='cee_close'>Close This Popup</a></li></ul>";
			}
		}
		this.content = "<div id='cee_vid' style='width:"+this.width+"px;height:"+this.height+"px;'>" + content + "</div>" + this.titlebox;
		},
	html: function() {
		var h = this.href,r = this.rel;
		var m = [h.match(/[a-zA-Z0-9_\.]+\.[a-zA-Z]{2,4}/i),h.match(/^http:+/),(r) ? r.match(/^iframe/) : false];
		if ((document.domain == m[0] && m[1] && !m[2]) || (!m[1] && !m[2])) { 
			var id, ajx = (id = h.match(/#[a-zA-Z0-9_\-]+/)) ? String(h.split("#")[0] + " " + id) : h;
			this.action = function(){ $("#cee_ajax").load(ajx);};
			this.content = this.titlebox + "<div id='cee_ajax' style='width:"+(this.width-30)+"px;height:"+(this.height-20)+"px'></div>";
		} else {
			$("#cee_iframe").remove();
			this.content = this.titlebox + "<iframe frameborder='0' hspace='0' src='"+h+"' id='cee_iframeContent' name='cee_iframeContent"+Math.round(Math.random()*1000)+"' onload='jQuery.fn.ceebox.onload()' style='width:"+(this.width)+"px;height:"+(this.height)+"px;' > </iframe>";
			
		}
	}
};


function pageSize(margin){
	var de = document.documentElement;
	margin = margin || 100;
	this.width = (window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth) - margin;
	this.height = (window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight) - margin;
	return this;
}
function boxPos(opts){ 
	var pos = "fixed",scroll = 0, reg = /[0-9]+/g, b = cssParse(opts.borderWidth,reg);
	
	if (!window.XMLHttpRequest) {
		if ($("#cee_HideSelect") === null) {$("body").append("<iframe id='cee_HideSelect'></iframe>");} 
		pos = "absolute"; 
		scroll = parseInt((document.documentElement && document.documentElement.scrollTop || document.body.scrollTop),10);
	}
	
	this.mleft = parseInt(-1*((opts.width) / 2 + Number(b[3])),10);
	this.mtop = parseInt(-1*((opts.height) / 2 + Number(b[0])),10) + scroll;
	this.position = pos;
	return this;
}

function cssParse(css,reg){ 
	var temp = css.match(reg),rtn = [],l = temp.length;
	if (l > 1) {
		rtn[0] = temp[0];
		rtn[1] = temp[1];
		rtn[2] = (l == 2) ? temp[0] : temp[2];
		rtn[3] = (l == 4) ? temp[3] : temp[1];
	} else {rtn = [temp,temp,temp,temp];}
	return rtn;
}

function keyEvents() { 
	document.onkeydown = function(e){
		e = e || window.event;
		var kc = e.keyCode || e.which;
		switch (kc) {
			case 13:
				return false;
			case 27:
				$.fn.ceebox.closebox();
				document.onkeydown = null;
				break;
			case 188:
			case 37:
				$("#cee_prev").trigger("click");
				break;
			case 190:
			case 39:
				$("#cee_next").trigger("click");
				break;
			default:
				break;
		}
		return true;
	};
}

function addGallery(g,family,opts){ 
	var h = opts.height, w = opts.width, th = opts.titleHeight, p = opts.padding;
	var nav = {
		image : {
			w: parseInt(w / 2,10),
			h: h-th-2*p,
			top: p,
			bgtop: (h-th-2*p)/2
		},
		video : {
			w: 60,
			h: 80,
			top: parseInt(((h-th-10)-2*p) / 2,10),
			bgtop: 24
		}
	};
	nav.html = nav.video;
	function navLink(btn,id) {
		var s, on = nav[opts.type].bgtop, off = (on-2000), px = "px";
		
		(btn == "prev") ? s = [{left:0},"left"] : s = [{right:0}, x = "right"];

		var style = function(y) {return $.extend({zIndex:105,width:nav[opts.type].w + px, height:nav[opts.type].h + px,position:"absolute",top:nav[opts.type].top,backgroundPosition:s[1] + " " + y + px},s[0]);};
		
		$("<a href='#'></a>").text(btn).attr({id:"cee_" + btn}).css(style(off)).hover(
				function(){$(this).css(style(on));},
				function(){$(this).css(style(off));}
			).one("click",function(e){
				e.preventDefault();
				(function(f,id,fade){ 
					$("#cee_prev,#cee_next").unbind().click(function(){return false;}); 
					document.onkeydown = null; 
					var content = $("#cee_box").children(), len = content.length;
					content.fadeOut(fade,function(){
						$(this).remove();
						if (this == content[len-1]) {f.eq(id).trigger("click");} //triggers next gallery item once all content is gone
					});
				})(family,id,opts.fadeOut);

			}).appendTo("#cee_box");
	}
	
	if (g.prevId >= 0) {navLink("prev",g.prevId);}
	if (g.nextId) {navLink("next",g.nextId);}
	$("#cee_title").append("<div id='cee_count'>Item " + (g.gNum+1) +" of "+ g.gLen + "</div>");
}

function getSmlr(a,b) {return ((a && a < b) || !b) ? a : b;}
function isFunction(a) {return typeof a == 'function';}
function lastItem(a) {var l = a.length;return (l > 1) ? a[l-1] : a;}

function debug(a,tag,opts) {
	
	if (debugging === true) {var bugs="", header = "[ceebox](" + (tag||"")  + ")";
		($.isArray(a) || typeof a == 'object' || typeof a == 'function') ? $.each(a, function(i, val) { bugs = bugs +i + ":" + val + ", ";}) : bugs = a;
		
		if (window.console && window.console.log) {
			window.console.log(header + bugs);
		} else {
			if ($("#debug").size() === 0) {$("<ul id='debug'></ul>").appendTo("body").css({border:"1px solid #ccf",position:"fixed",top:"10px",right:"10px",width:"300px",padding:"10px",listStyle:"square"});
			$("<li>").css({margin:"0 0 5px"}).appendTo("#debug").append(header).wrapInner("<b></b>").append(" " + bugs);}
		}
	}
}


})(jQuery);