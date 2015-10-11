/**
 * logdown - Debug utility with markdown support that runs on browser and server
 *
 * @version v1.2.4
 * @link https://github.com/caiogondim/logdown
 * @author Caio Gondim <me@caiogondim.com> (http://caiogondim.com)
 * @license ISC
 */
!function(){"use strict";function e(r){if(!(this instanceof e))return new e(r);r=r||{};var o=void 0===r.prefix?"":r.prefix;return o=p(o),o&&a(o,h)?u(o,h):(this.markdown=void 0===r.markdown?!0:r.markdown,this.prefix=o,m=Math.max(m,this.prefix.length),h.push(this),x()?(this.prefixColor=y[b%y.length],b+=1):d()&&(this.prefixColor=T()),this)}function r(e,r){for(;e.length<r;)e+=" ";return e}function o(e){for(var r=[],o=t(e);o;)e=e.replace(o.rule.regexp,o.rule.replacer),x()&&(r.push(o.rule.style),r.push("color:inherit;")),o=t(e);return{text:e,styles:r}}function t(e){var r=[],o=[];return x()?o=[{regexp:/\*([^\*]+)\*/,replacer:function(e,r){return"%c"+r+"%c"},style:"font-weight:bold;"},{regexp:/\_([^\_]+)\_/,replacer:function(e,r){return"%c"+r+"%c"},style:"font-style:italic;"},{regexp:/\`([^\`]+)\`/,replacer:function(e,r){return"%c"+r+"%c"},style:"background:#FDF6E3; color:#586E75; padding:1px 5px; border-radius:4px;"}]:d()&&(o=[{regexp:/\*([^\*]+)\*/,replacer:function(e,r){return"["+v.modifiers.bold[0]+"m"+r+"["+v.modifiers.bold[1]+"m"}},{regexp:/\_([^\_]+)\_/,replacer:function(e,r){return"["+v.modifiers.italic[0]+"m"+r+"["+v.modifiers.italic[1]+"m"}},{regexp:/\`([^\`]+)\`/,replacer:function(e,r){return"["+v.bgColors.bgYellow[0]+"m["+v.colors.black[0]+"m "+r+" ["+v.colors.black[1]+"m["+v.bgColors.bgYellow[1]+"m"}}]),o.forEach(function(o){var t=e.match(o.regexp);t&&r.push({rule:o,match:t})}),0===r.length?null:(r.sort(function(e,r){return e.match.index-r.match.index}),r[0])}function n(e,r,t){var n,l,s,c;return"string"==typeof e?t.markdown&&f()?(n=o(e),l=n.text,s=n.styles):(l=e,s=[]):(l=l||"",s=s||[],c=e),t.prefix&&(f()?(l="%c"+i(t.prefix,r)+"%c "+l,s.unshift("color:"+t.prefixColor+"; font-weight:bold;","color:inherit;")):l=i(t.prefix,r)+l),{parsedText:l,styles:s,notText:c}}function i(e,o,t){e=f()?e:"["+e+"] ";var n=m;return f()||(n+=3),("log"!==o&&d()?"":"  ")+r(e,n)}function l(e,r,t){var n,l="";return t.prefix&&(l=f()?"["+t.prefixColor[0]+"m["+v.modifiers.bold[0]+"m"+i(t.prefix,r)+"["+v.modifiers.bold[1]+"m["+t.prefixColor[1]+"m ":i(t.prefix,r)),"string"==typeof e?l+=t.markdown?o(e).text:e:n=e,{parsedText:l,styles:[],notText:n}}function s(r){var o=null;"undefined"!=typeof process&&void 0!==process.env&&0===E.length&&(void 0!==process.env.NODE_DEBUG&&""!==process.env.NODE_DEBUG?o="NODE_DEBUG":void 0!==process.env.DEBUG&&""!==process.env.DEBUG&&(o="DEBUG"),o&&(e.disable("*"),process.env[o].split(",").forEach(function(r){e.enable(r)})));var t=!1;return E.forEach(function(e){"enable"===e.type&&e.regExp.test(r.prefix)?t=!1:"disable"===e.type&&e.regExp.test(r.prefix)&&(t=!0)}),t}function c(e){return new RegExp("^"+e.replace(/\*/g,".*?")+"$")}function a(e,r){var o=!1;return r.forEach(function(r){return r.prefix===e?void(o=!0):void 0}),o}function u(e,r){var o;return r.forEach(function(r){return r.prefix===e?void(o=r):void 0}),o}function p(e){return"string"==typeof e?e.replace(/\%c/g,""):e}function f(){return!1}function d(){return"undefined"!=typeof module&&"undefined"!=typeof module.exports}function x(){return"undefined"!=typeof window}function g(e){return e}var h=[],m=0,b=0,y=["#B58900","#CB4B16","#DC322F","#D33682","#6C71C4","#268BD2","#2AA198","#859900"],v={modifiers:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},colors:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],gray:[90,39]},bgColors:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49]}},E=[];e.enable=function(){Array.prototype.forEach.call(arguments,function(r){"-"===r[0]&&e.disable(r.substr(1));var o=c(r);"*"===r?E=[]:E.push({type:"enable",regExp:o})})},e.disable=function(){Array.prototype.forEach.call(arguments,function(r){"-"===r[0]&&e.enable(r.substr(1));var o=c(r);"*"===r?E=[{type:"disable",regExp:o}]:E.push({type:"disable",regExp:o})})};var w=["debug","log","info","warn","error"];w.forEach(function(r){e.prototype[r]=function(){var e,o=[];if(!s(this)){var t=Array.prototype.slice.call(arguments,0).join(" ");x()?(t=p(t),e=n(t,r,this),Function.prototype.apply.call(console[r]||console.log,console,[e.parsedText].concat(e.styles,"undefined"!=typeof e.notText?[e.notText]:""))):d()&&(t=g(t),e=l(t,r,this),"warn"===r?e.parsedText="["+v.colors.yellow[0]+"m⚠["+v.colors.yellow[1]+"m "+e.parsedText:"error"===r?e.parsedText="["+v.colors.red[0]+"m✖["+v.colors.red[1]+"m "+e.parsedText:"info"===r?e.parsedText="["+v.colors.blue[0]+"mℹ["+v.colors.blue[1]+"m "+e.parsedText:"debug"===r&&(e.parsedText="["+v.colors.gray[0]+"m🐛["+v.colors.gray[1]+"m "+e.parsedText),o.push(e.parsedText),e.notText&&o.push(e.notText),(console[r]||console.log).apply(console,o))}}});var T=function(){var e=0,r=[[31,39],[32,39],[33,39],[34,39],[35,39],[36,39]];return function(){return r[(e+=1)%r.length]}}();d()?module.exports=e:x()&&(window.Logdown=e)}();