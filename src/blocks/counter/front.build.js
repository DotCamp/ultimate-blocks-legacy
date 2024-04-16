"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var UltimateBlocksCounter = /*#__PURE__*/function () {
  function UltimateBlocksCounter(wrapper) {
    _classCallCheck(this, UltimateBlocksCounter);
    this.container = wrapper;
    this.counterNumber = this.container.querySelector(".ub_counter-number");
    this.startCount = parseInt(this.container.dataset.start_num, 10);
    this.stopCounter = parseInt(this.container.dataset.end_num, 10);
    this.animationDuration = parseInt(this.container.dataset.animation_duration, 10);
    this.frameDuration = 1000 / 60;
    this.totalFrames = Math.round(this.animationDuration * 1000 / this.frameDuration);
    this.easeOutQuad = function (t) {
      return t * (2 - t);
    };
    this.initialize();
  }
  return _createClass(UltimateBlocksCounter, [{
    key: "initialize",
    value: function initialize() {
      this.updateCounter();
    }
  }, {
    key: "updateCounter",
    value: function updateCounter() {
      var _this = this;
      var frame = 0;
      var countTo = this.stopCounter - this.startCount;
      var interval = setInterval(function () {
        frame++;
        var progress = _this.easeOutQuad(frame / _this.totalFrames);
        var currentCount = Math.round(countTo * progress) + _this.startCount;
        if (parseInt(_this.counterNumber.innerHTML, 10) !== currentCount) {
          _this.counterNumber.innerHTML = currentCount;
        }
        if (frame === _this.totalFrames) {
          clearInterval(interval);
        }
      }, this.frameDuration);
    }
  }]);
}();
window.addEventListener("DOMContentLoaded", function () {
  var container = document.querySelectorAll(".ub_counter");
  container.forEach(function (wrapper) {
    return new UltimateBlocksCounter(wrapper);
  });
});