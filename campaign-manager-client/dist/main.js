(()=>{"use strict";var e={279:function(e,n,o){var t=this&&this.__awaiter||function(e,n,o,t){return new(o||(o=Promise))((function(i,r){function c(e){try{a(t.next(e))}catch(e){r(e)}}function s(e){try{a(t.throw(e))}catch(e){r(e)}}function a(e){var n;e.done?i(e.value):(n=e.value,n instanceof o?n:new o((function(e){e(n)}))).then(c,s)}a((t=t.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.runCampaign=void 0;const i=o(928),r=new Map;n.runCampaign=function(){return t(this,void 0,void 0,(function*(){if(console.log("Running campaign..."),navigator.cookieEnabled&&(0,i.checkBrowserSupport)())try{const e=document.cookie;e?(console.warn("Found cookies"),yield function(e){return t(this,void 0,void 0,(function*(){let n=[];const o=(0,i.sanitizeCookies)(e);Object.values(o).forEach((e=>{n=(0,i.findOccurrences)("body",e.controlIdentifier),n&&0!==n.length?n.forEach((o=>{const t=document.querySelector(o);if(t){let o;o=t instanceof HTMLImageElement?t.src:t.innerHTML,r.set(e.campaignId,{content:o,assignedId:e.assignedId,controlIdentifier:e.controlIdentifier,controlPaths:n}),t.style.display="none"}else console.warn(`Element not found for path: ${o}`)})):console.warn("No control paths found for cookie: ",e)}))}))}(e)):console.warn("No cookies found");const n=(e,n)=>new Promise(((o,t)=>{setTimeout((()=>{t(new Error("API request timed out"))}),e),n.then(o,t)}));try{const o=yield n(500,(0,i.runCampaigns)(e));if(!("campaignCookies"in o))throw new Error("API response error: missing campaignCookies");console.log(JSON.stringify(o)),(0,i.handleApiResponse)(o,r)}catch(e){console.error("API call failed: ",e),yield function(){return t(this,void 0,void 0,(function*(){r.forEach(((e,n)=>{e.controlPaths.forEach((n=>{const o=document.querySelector(n);o&&(o instanceof HTMLImageElement?o.src=e.content:o.innerHTML=e.content,o.style.display="")}))}))}))}()}console.log("Campaign execution completed successfully!")}catch(e){console.error("Error executing campaign: ",e)}else console.error("Cookies or Local storage are not supported in this browser. The campaign cannot run.")}))}},607:function(e,n,o){var t=this&&this.__awaiter||function(e,n,o,t){return new(o||(o=Promise))((function(i,r){function c(e){try{a(t.next(e))}catch(e){r(e)}}function s(e){try{a(t.throw(e))}catch(e){r(e)}}function a(e){var n;e.done?i(e.value):(n=e.value,n instanceof o?n:new o((function(e){e(n)}))).then(c,s)}a((t=t.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0});const i=o(279);window.addEventListener("load",(()=>t(void 0,void 0,void 0,(function*(){try{yield(0,i.runCampaign)()}catch(e){console.error("Error executing campaign: ",e)}}))))},641:function(e,n){var o=this&&this.__awaiter||function(e,n,o,t){return new(o||(o=Promise))((function(i,r){function c(e){try{a(t.next(e))}catch(e){r(e)}}function s(e){try{a(t.throw(e))}catch(e){r(e)}}function a(e){var n;e.done?i(e.value):(n=e.value,n instanceof o?n:new o((function(e){e(n)}))).then(c,s)}a((t=t.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.runCampaigns=n.sendInteractionEvent=void 0,n.sendInteractionEvent=function(e){fetch("http://localhost:5003/user_interactions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then((e=>e.json())).then((e=>{console.log("Success:",e)})).catch((e=>{console.error("Error:",e)}))},n.runCampaigns=function(e){return o(this,void 0,void 0,(function*(){const n=yield fetch("http://localhost:3000/api/v1/runCampaigns",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cookies:e})});if(!n.ok){const e=yield n.json();throw new Error(`Server responded with status: ${n.status}. Message: ${e.message}`)}return yield n.json()}))}},531:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.checkBrowserSupport=void 0,n.checkBrowserSupport=function(){let e=!0;navigator.cookieEnabled||(console.error("Cookies are not enabled in this browser. The campaign cannot run."),e=!1);try{localStorage.setItem("test","test"),localStorage.removeItem("test")}catch(n){console.error("Local storage is not supported in this browser. The campaign cannot run."),e=!1}return e}},440:(e,n,o)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.findOccurrences=n.replaceCustomElementContent=n.replaceTeaserImage=n.replaceHeadlineContent=void 0;const t=o(710);n.replaceHeadlineContent=function(e,n,o,i,r,c){console.log(`Start replacing headline content for control identifier "${n}" with paths ${c}`);let s=0;c.forEach((n=>{const c=document.querySelector(n);if(c&&c.innerHTML){if(!r){console.log(`Element innerHTML before replace: "${c.innerHTML}"`);const e=c.innerHTML;c.innerHTML=o,c.innerHTML!==e?(s++,console.log(`Replaced content in element at path "${n}"`),console.log(`Element innerHTML after replace: "${c.innerHTML}"`)):console.log(`No replacement made for element at path "${n}"`)}(0,t.addImpressionClickListener)(e,n,i,r),c.style.display=""}})),console.log(`Finished replacing headline content for control identifier "${n}". Total replacements: ${s}`)},n.replaceTeaserImage=function(e,n,o,i,r,c){console.log(`Start replacing teaser image for control identifier "${n}" with paths ${c}`);let s=0;c.forEach((c=>{const a=document.querySelector(c);if(a instanceof HTMLImageElement){console.log(`Element src before replace: "${a.src}"`);const l=a.src;!r&&a.src.includes(n)&&(a.src=o,a.src!==l?(s++,console.log(`Replaced image src at path "${c}"`),console.log(`Element src after replace: "${a.src}"`)):console.log(`No replacement made for element at path "${c}"`)),a.style.display="",(0,t.addImpressionClickListener)(e,c,i,r)}})),console.log(`Finished replacing teaser image for control identifier "${n}". Total replacements: ${s}`)},n.replaceCustomElementContent=function(e,n){},n.findOccurrences=function(e,n){let o=document.querySelector(e);if(!o)return console.error(`No element found for selector: ${e}`),[];let t=[];return function e(o,i){if(i=i?`${i} > ${o.nodeName}:nth-child(${function(e){let n=1,o=e.previousElementSibling;for(;o;)n++,o=o.previousElementSibling;return n}(o)})`:o.nodeName,"A"===o.nodeName){for(let e of o.attributes)e.value.includes(n)&&!t.includes(i)&&t.push(i);for(let e of o.childNodes)3===e.nodeType&&e.nodeValue&&e.nodeValue.includes(n)&&!t.includes(i)&&t.push(i)}"IMG"===o.nodeName&&o instanceof HTMLImageElement&&o.src.includes(n)&&!t.includes(i)&&t.push(i);for(let n of o.children)e(n,i)}(o,""),t||[]}},710:(e,n,o)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.addImpressionClickListener=n.handleClickEvent=void 0;const t=o(641);function i(e,n,o){return function(i){const r=`click-campaignId-${e}-assignedId-${n}`;if(localStorage.getItem(r))return void console.log(`Click for element with assignedId: ${n} is already recorded.`);console.log("Element clicked!"),console.log(`Handling click event for element with assignedId: ${n}, isControl: ${o}`);const c={assignedId:n,interactionType:"clicks",isControl:o};(0,t.sendInteractionEvent)(c),localStorage.setItem(r,"true")}}n.handleClickEvent=i,n.addImpressionClickListener=function(e,n,o,r){console.log(`Searching for element with controlIdentifier: ${n}`);const c=document.querySelector(n);if(c instanceof HTMLElement){console.log("Element found. Adding impression and click event listeners.");const n=new IntersectionObserver((i=>{i.forEach((i=>{i.isIntersecting&&(function(e,n,o){const i=`impression-campaignId-${e}-assignedId-${n}`;if(localStorage.getItem(i))return void console.log(`Impression for campaignId: ${e} is already recorded.`);console.log(`Sending impression event for campaignId: ${e}, assignedId: ${n}, isControl: ${o}`);const r={assignedId:n,interactionType:"impression",isControl:o};(0,t.sendInteractionEvent)(r),localStorage.setItem(i,"true")}(e,o,r),n.unobserve(c))}))}));n.observe(c),c.addEventListener("click",i(e,o,r))}else console.log("Element not found or not an HTMLElement.")}},775:(e,n,o)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.handleApiResponse=void 0;const t=o(440);function i(e,n){console.info(`Processing new campaigns: ${n}`);const{assignedIdentifier:o,controlIdentifier:i,isControl:r,assignedId:c,campaignId:s,type:a}=n,l=(0,t.findOccurrences)("body",i);if(l&&0!==l.length){if(!e.has(s)){const n={content:"",assignedId:c,controlIdentifier:i,controlPaths:[],campaignId:0,isControl:!1};l.forEach((e=>{const o=document.querySelector(e);if(o){let t;t=o instanceof HTMLImageElement?o.src:o.innerHTML,n.content=t,n.controlPaths.push(e),o.style.display=r?"":"none"}})),e.set(s,n)}"headline"===a?(0,t.replaceHeadlineContent)(s,i,o,c,!1,l):"image"===a&&(0,t.replaceTeaserImage)(s,i,o,c,!1,l)}}n.handleApiResponse=function(e,n){if(!e)return void console.error("Data is undefined");if(!e.campaignCookies)return void console.error("campaignCookies is undefined");console.log("Data received: ",e);const o=Object.keys(e.campaignCookies).map((n=>JSON.parse(e.campaignCookies[n]).campaignId));!function(e,n){console.info("Processing completed campaigns"),e.forEach(((o,t)=>{n.includes(t)||(o.controlPaths.forEach((e=>{const n=document.querySelector(e);n&&(n.style.display="")})),document.cookie=`campaign_${t}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,localStorage.removeItem(`click-campaignId-${t}-assignedId-${o.assignedId}`),localStorage.removeItem(`impression-campaignId-${t}-assignedId-${o.assignedId}`),e.delete(t))}))}(n||new Map,o);for(const[o,t]of Object.entries(e.campaignCookies)){const e=JSON.parse(t);if(i(n||new Map,e),"custom"!==e.type){const e=new Date;e.setFullYear(e.getFullYear()+1),document.cookie=`campaign_${o}=${t}; SameSite=None; expires=${e.toUTCString()}; path=/`}}}},928:function(e,n,o){var t=this&&this.__createBinding||(Object.create?function(e,n,o,t){void 0===t&&(t=o);var i=Object.getOwnPropertyDescriptor(n,o);i&&!("get"in i?!n.__esModule:i.writable||i.configurable)||(i={enumerable:!0,get:function(){return n[o]}}),Object.defineProperty(e,t,i)}:function(e,n,o,t){void 0===t&&(t=o),e[t]=n[o]}),i=this&&this.__exportStar||function(e,n){for(var o in e)"default"===o||Object.prototype.hasOwnProperty.call(n,o)||t(n,e,o)};Object.defineProperty(n,"__esModule",{value:!0}),i(o(641),n),i(o(440),n),i(o(710),n),i(o(222),n),i(o(775),n),i(o(531),n)},222:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.sanitizeCookies=void 0,n.sanitizeCookies=function(e){console.log("Sanitizing cookies...");const n=""!==e?e.split("; ").reduce(((e,n)=>{const[o,t]=n.split("=");try{const n=JSON.parse(decodeURIComponent(t));"campaignId"in n&&"assignedIdentifier"in n&&"controlIdentifier"in n&&"assignedId"in n&&"isControl"in n&&"type"in n&&(e[o]=n)}catch(e){console.warn(`Error parsing cookie: ${o}`)}return e}),{}):{};return console.log("Cookies sanitized successfully!"),n}}},n={};!function o(t){var i=n[t];if(void 0!==i)return i.exports;var r=n[t]={exports:{}};return e[t].call(r.exports,r,r.exports,o),r.exports}(607)})();