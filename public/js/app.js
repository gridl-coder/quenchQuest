/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ (() => {

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (c = i[4] || 3, u = i[5] === e ? i[3] : i[5], i[4] = 3, i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Quench Quest App Main JS
// Handles device ID, check-in modal, map, and location logic
// DRY, readable, and fully commented

// --- Device ID logic (used for check-in uniqueness) ---
function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
    return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
  });
}
function getOrSetDeviceId() {
  var cookieName = 'device_id';
  var match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
  if (match) {
    return match[2];
  } else {
    var uuid = generateUUID();
    document.cookie = cookieName + '=' + uuid + '; path=/; max-age=31536000'; // 1 year
    return uuid;
  }
}

// --- DOMContentLoaded: main app logic ---
document.addEventListener('DOMContentLoaded', function () {
  // --- Check-in Modal Logic ---
  var checkInBtn = document.getElementById('check-in');
  var checkinModalEl = document.getElementById('checkinModal');
  var checkinForm = document.getElementById('checkin-form');
  var checkinError = document.getElementById('checkin-error');
  var deviceId = getOrSetDeviceId();

  // Bootstrap modal instance
  var checkinModal = null;
  if (checkinModalEl && typeof bootstrap !== 'undefined') {
    checkinModal = new bootstrap.Modal(checkinModalEl);
  }
  if (checkInBtn && checkinModal) {
    checkInBtn.addEventListener('click', function () {
      checkinError.classList.add('d-none');
      checkinForm.reset();
      checkinModal.show();
    });
  }
  if (checkinForm) {
    checkinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      checkinError.classList.add('d-none');
      var submitBtn = document.getElementById('checkin-submit-btn');
      var submitText = document.getElementById('checkin-submit-text');
      var submitSpinner = document.getElementById('checkin-submit-spinner');
      if (submitBtn && submitText && submitSpinner) {
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitSpinner.classList.remove('d-none');
      }
      var formData = new FormData(checkinForm);
      formData.append('device_id', deviceId);
      fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: formData
      }).then(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(response) {
          var data;
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                _context.n = 1;
                return response.json();
              case 1:
                data = _context.v;
                if (response.ok) {
                  _context.n = 2;
                  break;
                }
                throw new Error(data.message || 'Check-in failed.');
              case 2:
                return _context.a(2, data);
            }
          }, _callee);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }()).then(function (data) {
        checkinModal.hide();
        Toastify({
          text: data.message || 'Check-in successful!',
          duration: 4000,
          gravity: 'top',
          position: 'center',
          backgroundColor: '#28a745',
          stopOnFocus: true
        }).showToast();
        setTimeout(function () {
          return window.location.reload();
        }, 1500);
      })["catch"](function (err) {
        checkinError.textContent = err.message;
        checkinError.classList.remove('d-none');
        Toastify({
          text: err.message || 'Check-in failed.',
          duration: 4000,
          gravity: 'top',
          position: 'center',
          backgroundColor: '#ff3b3f',
          stopOnFocus: true
        }).showToast();
      })["finally"](function () {
        if (submitBtn && submitText && submitSpinner) {
          submitBtn.disabled = false;
          submitText.style.display = '';
          submitSpinner.classList.add('d-none');
        }
      });
    });
  }

  // --- Map & Location Logic ---
  var mapContainer = document.getElementById('map');
  var mapLoadingSpinner = document.getElementById('map-loading-spinner');
  if (mapContainer) {
    if (mapLoadingSpinner) mapLoadingSpinner.style.display = '';
    fetch('/api/locations').then(function (res) {
      return res.json();
    }).then(function (locations) {
      if (!locations['locations'] || !locations['locations'].length) {
        if (mapLoadingSpinner) mapLoadingSpinner.style.display = 'none';
        return;
      }
      var lastIdx = locations['locations'].length - 1;
      var current = locations['locations'][lastIdx];

      // Update location info in DOM
      var locName = document.getElementById('location-name');
      var locDesc = document.getElementById('location-desc');
      var locDate = document.getElementById('location-date');
      if (locName) locName.textContent = current.name;
      if (locDesc) locDesc.textContent = current.description;
      if (locDate) locDate.textContent = 'Posted on ' + new Date(current.created_at).toLocaleDateString();

      // Initialize Leaflet map
      if (mapLoadingSpinner) mapLoadingSpinner.style.display = 'none';
      var map = L.map('map').setView([50.471, -4.721], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Pin all locations
      locations['locations'].forEach(function (loc) {
        var marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
        marker.bindPopup("<strong>".concat(loc.name, "</strong><br>").concat(loc.description));
      });

      // Geolocation-based check-in (if modal not used)
      if (checkInBtn && !checkinModal) {
        checkInBtn.addEventListener('click', function () {
          if (!navigator.geolocation) {
            Toastify({
              text: 'Geolocation not supported by your browser.',
              duration: 4000,
              gravity: 'top',
              position: 'center',
              backgroundColor: '#ff3b3f',
              stopOnFocus: true
            }).showToast();
            return;
          }
          navigator.geolocation.getCurrentPosition(function (pos) {
            var userLat = pos.coords.latitude;
            var userLng = pos.coords.longitude;
            // Haversine formula
            function toRad(deg) {
              return deg * (Math.PI / 180);
            }
            function distance(lat1, lon1, lat2, lon2) {
              var R = 6371e3;
              var φ1 = toRad(lat1),
                φ2 = toRad(lat2);
              var Δφ = toRad(lat2 - lat1);
              var Δλ = toRad(lon2 - lon1);
              var a = Math.pow(Math.sin(Δφ / 2), 2) + Math.cos(φ1) * Math.cos(φ2) * Math.pow(Math.sin(Δλ / 2), 2);
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              return R * c;
            }
            var dist = distance(userLat, userLng, current.latitude, current.longitude);
            if (dist <= 50) {
              var name = prompt("You're within 50 meters! Enter your name to claim the prize:");
              if (!name) return alert('Name is required to check in.');
              var email = prompt('Enter your email address:');
              if (!email) return alert('Email is required to check in.');
              var emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
              if (!emailPattern.test(email)) return alert('Please enter a valid email address.');
              var socialTag = prompt('Enter your social tag (optional):');
              var _deviceId = getOrSetDeviceId();
              fetch('/api/checkin', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  location_id: current.id,
                  name: name,
                  email: email,
                  social_tag: socialTag,
                  device_id: _deviceId
                })
              }).then(/*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(response) {
                  var data;
                  return _regenerator().w(function (_context2) {
                    while (1) switch (_context2.n) {
                      case 0:
                        _context2.n = 1;
                        return response.json();
                      case 1:
                        data = _context2.v;
                        if (response.ok) {
                          _context2.n = 2;
                          break;
                        }
                        throw new Error(data.message || 'Check-in failed.');
                      case 2:
                        return _context2.a(2, data);
                    }
                  }, _callee2);
                }));
                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              }()).then(function (data) {
                Toastify({
                  text: data.message,
                  duration: 4000,
                  gravity: 'top',
                  position: 'center',
                  backgroundColor: '#28a745',
                  stopOnFocus: true
                }).showToast();
                setTimeout(function () {
                  return window.location.reload();
                }, 1500);
              })["catch"](function (err) {
                Toastify({
                  text: err.message || 'Check-in failed.',
                  duration: 4000,
                  gravity: 'top',
                  position: 'center',
                  backgroundColor: '#ff3b3f',
                  stopOnFocus: true
                }).showToast();
              });
            } else {
              Toastify({
                text: "You're too far from the location (".concat(Math.round(dist), "m away)."),
                duration: 4000,
                gravity: 'top',
                position: 'center',
                backgroundColor: '#ff3b3f',
                stopOnFocus: true
              }).showToast();
            }
          }, function () {
            Toastify({
              text: 'Could not get your location.',
              duration: 4000,
              gravity: 'top',
              position: 'center',
              backgroundColor: '#ff3b3f',
              stopOnFocus: true
            }).showToast();
          });
        });
      }
    });
  }
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
/******/ 			"/js/app": 0,
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
/******/ 	__webpack_require__.O(undefined, ["css/main"], () => (__webpack_require__("./resources/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/main"], () => (__webpack_require__("./resources/scss/main.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;