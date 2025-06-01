/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/map.js":
/*!*****************************!*\
  !*** ./resources/js/map.js ***!
  \*****************************/
/***/ (() => {

$(document).ready(function () {
  // Initialize Bootstrap tooltips

  // Fetch locations via API
  $.getJSON("/api/locations", function (locations) {
    if (!locations['locations'].length) return;
    var lastIdx = locations['locations'].length - 1;
    console.log("Locations loaded:", locations['locations'][lastIdx]);
    var current = locations['locations'][lastIdx];
    $("#location-name").text(current.name);
    $("#location-desc").text(current.description);
    $("#location-date").text("Posted on " + new Date(current.created_at).toLocaleDateString());

    // Initialize Leaflet map
    var map = L.map("map").setView([50.471, -4.721], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Pin all locations
    locations['locations'].forEach(function (loc) {
      var marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
      marker.bindPopup("<strong>".concat(loc.name, "</strong><br>").concat(loc.description));
    });

    // Check-in logic
    $("#check-in").on("click", function () {
      if (!navigator.geolocation) {
        alert("Geolocation not supported by your browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(function (pos) {
        var userLat = pos.coords.latitude;
        var userLng = pos.coords.longitude;
        var toRad = function toRad(deg) {
          return deg * (Math.PI / 180);
        };
        var distance = function distance(lat1, lon1, lat2, lon2) {
          var R = 6371e3; // meters
          var φ1 = toRad(lat1),
            φ2 = toRad(lat2);
          var Δφ = toRad(lat2 - lat1);
          var Δλ = toRad(lon2 - lon1);
          var a = Math.pow(Math.sin(Δφ / 2), 2) + Math.cos(φ1) * Math.cos(φ2) * Math.pow(Math.sin(Δλ / 2), 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        // Compute distance to current location
        var dist = distance(userLat, userLng, current.latitude, current.longitude);
        if (dist <= 50) {
          // Device ID logic (same as in Blade)
          var generateUUID = function generateUUID() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
              return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
            });
          };
          var getOrSetDeviceId = function getOrSetDeviceId() {
            var cookieName = 'device_id';
            var match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
            if (match) {
              return match[2];
            } else {
              var uuid = generateUUID();
              document.cookie = cookieName + '=' + uuid + '; path=/; max-age=31536000'; // 1 year
              return uuid;
            }
          };
          var name = prompt("You're within 50 meters! Enter your name to claim the prize:");
          if (!name) return alert("Name is required to check in.");

          // Prompt for email
          var email = prompt("Enter your email address:");
          if (!email) return alert("Email is required to check in.");
          // Simple email validation
          var emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
          if (!emailPattern.test(email)) return alert("Please enter a valid email address.");

          // Optionally prompt for social tag
          var socialTag = prompt("Enter your social tag (optional):");
          var deviceId = getOrSetDeviceId();
          $.post("/api/checkin", {
            location_id: current.id,
            name: name,
            email: email,
            social_tag: socialTag,
            device_id: deviceId
          }, function (res) {
            alert(res.message);
            location.reload();
          }, "json").fail(function (xhr) {
            var msg = "Check-in failed.";
            if (xhr.responseJSON && xhr.responseJSON.message) {
              msg = xhr.responseJSON.message;
            }
            alert(msg);
          });
        } else {
          alert("You're too far from the location (".concat(Math.round(dist), "m away)."));
        }
      }, function () {
        alert("Could not get your location.");
      });
    });
  });
});

/***/ }),

/***/ "./resources/scss/main.scss":
/*!**********************************!*\
  !*** ./resources/scss/main.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/map": 0,
/******/ 			"css/main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkbore_street_hunt"] = self["webpackChunkbore_street_hunt"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/main"], () => (__webpack_require__("./resources/js/map.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/main"], () => (__webpack_require__("./resources/scss/main.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;