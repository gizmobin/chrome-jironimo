/*
string.js - Copyright (C) 2012-2013, JP Richardson <jprichardson@gmail.com>
*/!function(){"use strict";function n(e){e!==null&&e!==undefined?typeof e=="string"?this.s=e:this.s=e.toString():this.s=e,this.orig=e,e!==null&&e!==undefined?this.__defineGetter__?this.__defineGetter__("length",function(){return this.s.length}):this.length=e.length:this.length=-1}function o(){for(var e in i)(function(e){var t=i[e];r.hasOwnProperty(e)||(s.push(e),r[e]=function(){return String.prototype.s=this,t.apply(this,arguments)})})(e)}function u(){for(var e=0;e<s.length;++e)delete String.prototype[s[e]];s.length=0}function l(){var e=c(),t={};for(var n=0;n<e.length;++n){var i=e[n],s=r[i];try{var o=typeof s.apply("teststring",[]);t[i]=o}catch(u){}}return t}function c(){var e=[];if(Object.getOwnPropertyNames)return e=Object.getOwnPropertyNames(r),e.splice(e.indexOf("valueOf"),1),e.splice(e.indexOf("toString"),1),e;var t={},n=[];for(var i in String.prototype)t[i]=i;for(var i in Object.prototype)delete t[i];for(var i in t)e.push(i);return e}function h(e){return new n(e)}function p(e,t){var n=[],r;for(r=0;r<e.length;r++)n.push(e[r]),t&&t.call(e,e[r],r);return n}var e="1.3.1",t={},r=String.prototype,i=n.prototype={between:function(e,t){var r=this.s,i=r.indexOf(e),s=r.indexOf(t),o=i+e.length;return new n(s>i?r.slice(o,s):"")},camelize:function(){var e=this.trim().s.replace(/(\-|_|\s)+(.)?/g,function(e,t,n){return n?n.toUpperCase():""});return new n(e)},capitalize:function(){return new n(this.s.substr(0,1).toUpperCase()+this.s.substring(1).toLowerCase())},charAt:function(e){return this.s.charAt(e)},chompLeft:function(e){var t=this.s;return t.indexOf(e)===0?(t=t.slice(e.length),new n(t)):this},chompRight:function(e){if(this.endsWith(e)){var t=this.s;return t=t.slice(0,t.length-e.length),new n(t)}return this},collapseWhitespace:function(){var e=this.s.replace(/[\s\xa0]+/g," ").replace(/^\s+|\s+$/g,"");return new n(e)},contains:function(e){return this.s.indexOf(e)>=0},dasherize:function(){var e=this.trim().s.replace(/[_\s]+/g,"-").replace(/([A-Z])/g,"-$1").replace(/-+/g,"-").toLowerCase();return new n(e)},decodeHtmlEntities:function(){var e=this.s;return e=e.replace(/&#(\d+);?/g,function(e,t){return String.fromCharCode(t)}).replace(/&#[xX]([A-Fa-f0-9]+);?/g,function(e,t){return String.fromCharCode(parseInt(t,16))}).replace(/&([^;\W]+;?)/g,function(e,n){var r=n.replace(/;$/,""),i=t[n]||n.match(/;$/)&&t[r];return typeof i=="number"?String.fromCharCode(i):typeof i=="string"?i:e}),new n(e)},endsWith:function(e){var t=this.s.length-e.length;return t>=0&&this.s.indexOf(e,t)===t},escapeHTML:function(){return new n(this.s.replace(/[&<>"']/g,function(e){return"&"+v[e]+";"}))},ensureLeft:function(e){var t=this.s;return t.indexOf(e)===0?this:new n(e+t)},ensureRight:function(e){var t=this.s;return this.endsWith(e)?this:new n(t+e)},isAlpha:function(){return!/[^a-z\xC0-\xFF]/.test(this.s.toLowerCase())},isAlphaNumeric:function(){return!/[^0-9a-z\xC0-\xFF]/.test(this.s.toLowerCase())},isEmpty:function(){return this.s===null||this.s===undefined?!0:/^[\s\xa0]*$/.test(this.s)},isLower:function(){return this.isAlpha()&&this.s.toLowerCase()===this.s},isNumeric:function(){return!/[^0-9]/.test(this.s)},isUpper:function(){return this.isAlpha()&&this.s.toUpperCase()===this.s},left:function(e){if(e>=0){var t=this.s.substr(0,e);return new n(t)}return this.right(-e)},lines:function(){var e=this.s.split("\n");for(var t=0;t<e.length;++t)e[t]=e[t].replace(/(^\s*|\s*$)/g,"");return e},pad:function(e,t){t=t||" ";if(this.s.length>=e)return new n(this.s);e-=this.s.length;var r=Array(Math.ceil(e/2)+1).join(t),i=Array(Math.floor(e/2)+1).join(t);return new n(r+this.s+i)},padLeft:function(e,t){return t=t||" ",this.s.length>=e?new n(this.s):new n(Array(e-this.s.length+1).join(t)+this.s)},padRight:function(e,t){return t=t||" ",this.s.length>=e?new n(this.s):new n(this.s+Array(e-this.s.length+1).join(t))},parseCSV:function(e,t,n,r){e=e||",",n=n||"\\",typeof t=="undefined"&&(t='"');var i=0,s=[],o=[],u=this.s.length,a=!1,f=this,l=function(e){return f.s.charAt(e)};if(typeof r!="undefined")var c=[];t||(a=!0);while(i<u){var h=l(i);switch(h){case n:if(a&&(n!==t||l(i+1)===t)){i+=1,s.push(l(i));break}if(n!==t)break;case t:a=!a;break;case e:a&&t?s.push(h):(o.push(s.join("")),s.length=0);break;case r:a?s.push(h):c&&(o.push(s.join("")),c.push(o),o=[],s.length=0);break;default:a&&s.push(h)}i+=1}return o.push(s.join("")),c?(c.push(o),c):o},replaceAll:function(e,t){var r=this.s.split(e).join(t);return new n(r)},right:function(e){if(e>=0){var t=this.s.substr(this.s.length-e,e);return new n(t)}return this.left(-e)},slugify:function(){var e=(new n(this.s.replace(/[^\w\s-]/g,"").toLowerCase())).dasherize().s;return e.charAt(0)==="-"&&(e=e.substr(1)),new n(e)},startsWith:function(e){return this.s.lastIndexOf(e,0)===0},stripPunctuation:function(){return new n(this.s.replace(/[^\w\s]|_/g,"").replace(/\s+/g," "))},stripTags:function(){var e=this.s,t=arguments.length>0?arguments:[""];return p(t,function(t){e=e.replace(RegExp("</?"+t+"[^<>]*>","gi"),"")}),new n(e)},template:function(e,t,r){var i=this.s,t=t||h.TMPL_OPEN,r=r||h.TMPL_CLOSE,s=new RegExp(t+"(.+?)"+r,"g"),o=i.match(s)||[];return o.forEach(function(n){var s=n.substring(t.length,n.length-r.length);e[s]&&(i=i.replace(n,e[s]))}),new n(i)},times:function(e){return new n((new Array(e+1)).join(this.s))},toBoolean:function(){if(typeof this.orig=="string"){var e=this.s.toLowerCase();return e==="true"||e==="yes"||e==="on"}return this.orig===!0||this.orig===1},toFloat:function(e){var t=parseFloat(this.s,10);return e?parseFloat(t.toFixed(e)):t},toInt:function(){return/^\s*-?0x/i.test(this.s)?parseInt(this.s,16):parseInt(this.s,10)},trim:function(){var e;return typeof String.prototype.trim=="undefined"?e=this.s.replace(/(^\s*|\s*$)/g,""):e=this.s.trim(),new n(e)},trimLeft:function(){var e;return r.trimLeft?e=this.s.trimLeft():e=this.s.replace(/(^\s*)/g,""),new n(e)},trimRight:function(){var e;return r.trimRight?e=this.s.trimRight():e=this.s.replace(/\s+$/,""),new n(e)},truncate:function(e,t){var r=this.s;e=~~e,t=t||"...";if(r.length<=e)return new n(r);var i=function(e){return e.toUpperCase()!==e.toLowerCase()?"A":" "},s=r.slice(0,e+1).replace(/.(?=\W*\w*$)/g,i);return s.slice(s.length-2).match(/\w\w/)?s=s.replace(/\s*\S+$/,""):s=(new n(s.slice(0,s.length-1))).trimRight().s,(s+t).length>r.length?new n(r):new n(r.slice(0,s.length)+t)},toCSV:function(){function u(e){return e!==null&&e!==""}var e=",",t='"',r="\\",i=!0,s=!1,o=[];typeof arguments[0]=="object"?(e=arguments[0].delimiter||e,e=arguments[0].separator||e,t=arguments[0].qualifier||t,i=!!arguments[0].encloseNumbers,r=arguments[0].escapeChar||r,s=!!arguments[0].keys):typeof arguments[0]=="string"&&(e=arguments[0]),typeof arguments[1]=="string"&&(t=arguments[1]),arguments[1]===null&&(t=null);if(this.orig instanceof Array)o=this.orig;else for(var a in this.orig)this.orig.hasOwnProperty(a)&&(s?o.push(a):o.push(this.orig[a]));var f=r+t,l=[];for(var c=0;c<o.length;++c){var h=u(t);typeof o[c]=="number"&&(h&=i),h&&l.push(t);if(o[c]!==null&&o[c]!==undefined){var p=(new n(o[c])).replaceAll(t,f).s;l.push(p)}else l.push("");h&&l.push(t),e&&l.push(e)}return l.length=l.length-1,new n(l.join(""))},toString:function(){return this.s},underscore:function(){var e=this.trim().s.replace(/([a-z\d])([A-Z]+)/g,"$1_$2").replace(/[-\s]+/g,"_").toLowerCase();return(new n(this.s.charAt(0))).isUpper()&&(e="_"+e),new n(e)},unescapeHTML:function(){return new n(this.s.replace(/\&([^;]+);/g,function(e,t){var n;return t in d?d[t]:(n=t.match(/^#x([\da-fA-F]+)$/))?String.fromCharCode(parseInt(n[1],16)):(n=t.match(/^#(\d+)$/))?String.fromCharCode(~~n[1]):e}))},valueOf:function(){return this.s.valueOf()}},s=[],a=l();for(var f in a)(function(e){var t=r[e];typeof t=="function"&&(i[e]||(a[e]==="string"?i[e]=function(){return new n(t.apply(this,arguments))}:i[e]=t))})(f);i.repeat=i.times,i.include=i.contains,i.toInteger=i.toInt,i.toBool=i.toBoolean,i.decodeHTMLEntities=i.decodeHtmlEntities,h.extendPrototype=o,h.restorePrototype=u,h.VERSION=e,h.TMPL_OPEN="{{",h.TMPL_CLOSE="}}",h.ENTITIES=t,typeof module!="undefined"&&typeof module.exports!="undefined"?module.exports=h:typeof define=="function"&&define.amd?define([],function(){return h}):window.S=h;var d={lt:"<",gt:">",quot:'"',apos:"'",amp:"&"},v={};for(var m in d)v[d[m]]=m;t={amp:"&",gt:">",lt:"<",quot:'"',apos:"'",AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,aelig:230,agrave:224,aring:229,atilde:227,auml:228,ccedil:231,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,iacute:237,icirc:238,igrave:236,iuml:239,ntilde:241,oacute:243,ocirc:244,ograve:242,oslash:248,otilde:245,ouml:246,szlig:223,thorn:254,uacute:250,ucirc:251,ugrave:249,uuml:252,yacute:253,yuml:255,copy:169,reg:174,nbsp:160,iexcl:161,cent:162,pound:163,curren:164,yen:165,brvbar:166,sect:167,uml:168,ordf:170,laquo:171,not:172,shy:173,macr:175,deg:176,plusmn:177,sup1:185,sup2:178,sup3:179,acute:180,micro:181,para:182,middot:183,cedil:184,ordm:186,raquo:187,frac14:188,frac12:189,frac34:190,iquest:191,times:215,divide:247,"OElig;":338,"oelig;":339,"Scaron;":352,"scaron;":353,"Yuml;":376,"fnof;":402,"circ;":710,"tilde;":732,"Alpha;":913,"Beta;":914,"Gamma;":915,"Delta;":916,"Epsilon;":917,"Zeta;":918,"Eta;":919,"Theta;":920,"Iota;":921,"Kappa;":922,"Lambda;":923,"Mu;":924,"Nu;":925,"Xi;":926,"Omicron;":927,"Pi;":928,"Rho;":929,"Sigma;":931,"Tau;":932,"Upsilon;":933,"Phi;":934,"Chi;":935,"Psi;":936,"Omega;":937,"alpha;":945,"beta;":946,"gamma;":947,"delta;":948,"epsilon;":949,"zeta;":950,"eta;":951,"theta;":952,"iota;":953,"kappa;":954,"lambda;":955,"mu;":956,"nu;":957,"xi;":958,"omicron;":959,"pi;":960,"rho;":961,"sigmaf;":962,"sigma;":963,"tau;":964,"upsilon;":965,"phi;":966,"chi;":967,"psi;":968,"omega;":969,"thetasym;":977,"upsih;":978,"piv;":982,"ensp;":8194,"emsp;":8195,"thinsp;":8201,"zwnj;":8204,"zwj;":8205,"lrm;":8206,"rlm;":8207,"ndash;":8211,"mdash;":8212,"lsquo;":8216,"rsquo;":8217,"sbquo;":8218,"ldquo;":8220,"rdquo;":8221,"bdquo;":8222,"dagger;":8224,"Dagger;":8225,"bull;":8226,"hellip;":8230,"permil;":8240,"prime;":8242,"Prime;":8243,"lsaquo;":8249,"rsaquo;":8250,"oline;":8254,"frasl;":8260,"euro;":8364,"image;":8465,"weierp;":8472,"real;":8476,"trade;":8482,"alefsym;":8501,"larr;":8592,"uarr;":8593,"rarr;":8594,"darr;":8595,"harr;":8596,"crarr;":8629,"lArr;":8656,"uArr;":8657,"rArr;":8658,"dArr;":8659,"hArr;":8660,"forall;":8704,"part;":8706,"exist;":8707,"empty;":8709,"nabla;":8711,"isin;":8712,"notin;":8713,"ni;":8715,"prod;":8719,"sum;":8721,"minus;":8722,"lowast;":8727,"radic;":8730,"prop;":8733,"infin;":8734,"ang;":8736,"and;":8743,"or;":8744,"cap;":8745,"cup;":8746,"int;":8747,"there4;":8756,"sim;":8764,"cong;":8773,"asymp;":8776,"ne;":8800,"equiv;":8801,"le;":8804,"ge;":8805,"sub;":8834,"sup;":8835,"nsub;":8836,"sube;":8838,"supe;":8839,"oplus;":8853,"otimes;":8855,"perp;":8869,"sdot;":8901,"lceil;":8968,"rceil;":8969,"lfloor;":8970,"rfloor;":8971,"lang;":9001,"rang;":9002,"loz;":9674,"spades;":9824,"clubs;":9827,"hearts;":9829,"diams;":9830}}.call(this);