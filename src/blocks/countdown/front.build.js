"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var timer = [];
  var initialValue = [];
  var timeUnits = ["week", "day", "hour", "minute", "second"];
  Array.prototype.slice.call(document.getElementsByClassName("ub-countdown")).forEach(function (instance, i) {
    timer[i] = setInterval(function () {
      var timeLeft = parseInt(instance.getAttribute("data-enddate")) - Math.floor(Date.now() / 1000);
      var largestUnit = instance.getAttribute("data-largestunit");
      var smallestUnit = instance.getAttribute("data-smallestunit");
      var seconds = timeLeft % 60;
      var minutes = (timeLeft - seconds) % 3600 / 60;
      var hours = (timeLeft - minutes * 60 - seconds) / 3600;

      if (timeUnits.indexOf(largestUnit) < 2) {
        hours %= 24;
      }

      var days = (timeLeft - hours * 3600 - minutes * 60 - seconds) / 86400;

      if (largestUnit === "week") {
        days %= 7;
      }

      var weeks = (timeLeft - days * 86400 - hours * 3600 - minutes * 60 - seconds) / 604800;
      var animationDirection = "decrease";

      var generateValue = function generateValue(arr) {
        return arr.reduce(function (sum, currDigit, j) {
          return sum + Math.pow(10, arr.length - j - 1) * currDigit;
        }, 0);
      };

      if (!initialValue[i]) {
        //use queryselector only once, then use saved value in future iterations of the loop
        initialValue[i] = Array.prototype.slice.call(instance.querySelectorAll(".ub-countdown-odometer")).map(function (unit) {
          return Array.prototype.slice.call(unit.children).map(function (c) {
            return parseInt(c.innerHTML);
          });
        });
        var conversionFactor = [7, 24, 60, 60, 1];

        if (largestUnit && smallestUnit) {
          var amounts = Array(timeUnits.indexOf(largestUnit)).fill(0).concat(initialValue[i].map(function (arr) {
            return generateValue(arr);
          }), Array(4 - timeUnits.indexOf(smallestUnit)).fill(0));

          if (timeLeft > amounts.reduce(function (total, current, j) {
            return total + current * conversionFactor.slice(j, 4).reduce(function (curFactor, current) {
              return curFactor * current;
            }, 1);
          }, 0)) {
            animationDirection = "increase";
          }
        }
      }

      if (timeLeft >= 0) {
        if (instance.querySelector(".ub-countdown-odometer-container")) {
          var breakIntoDigits = function breakIntoDigits(num, minDigits) {
            //adapted from from https://stackoverflow.com/a/7784664
            var digits = [];

            while (num > 0) {
              digits.push(num % 10);
              num = parseInt(num / 10);
            }

            var missingDigits = minDigits - digits.length;
            return (missingDigits > 0 ? Array(missingDigits).fill(0) : []).concat(digits.reverse());
          };

          var integerArray = function integerArray(limit1, limit2) {
            if (limit1 === limit2) {
              return [limit1];
            } else if (limit1 < limit2) {
              return Array.apply(null, Array(limit2 - limit1 + 1)).map(function (_, i) {
                return i;
              }).map(function (a) {
                return a + limit1;
              });
            } else {
              return Array.apply(null, Array(limit1 - limit2 + 1)).map(function (_, i) {
                return i;
              }).map(function (a) {
                return limit1 - a;
              });
            }
          }; //make array of max values


          var _timeUnits = ["week", "day", "hour", "minute", "second"];
          var maxValues = [0, 6, 23, 59, 59].slice(_timeUnits.indexOf(largestUnit), _timeUnits.indexOf(smallestUnit) + 1);

          if (_timeUnits.indexOf(largestUnit) < 3) {
            maxValues[0] = 0;
          }

          var replacements = [weeks, days, hours, minutes, seconds].slice(_timeUnits.indexOf(largestUnit), _timeUnits.indexOf(smallestUnit) + 1).map(function (r, j) {
            return breakIntoDigits(r, Math.floor(Math.log10(maxValues[j] || Math.max(generateValue(initialValue[i][j]), r) || 1) + 1));
          });
          var incomingDigits = []; //should also contain digits for other values

          initialValue[i].forEach(function (display, j) {
            if (display.every(function (digit, k) {
              return digit === replacements[j][k];
            })) {
              incomingDigits.push(display);
            } else {
              var currentValue = generateValue(display);
              var newValue = generateValue(replacements[j]);
              var digitCount = maxValues[j] ? Math.floor(Math.log10(maxValues[j])) + 1 : currentValue === 0 && newValue === 0 ? 1 : Math.floor(Math.log10(Math.max(currentValue, newValue))) + 1;

              var addExtraZeroes = function addExtraZeroes(arr, targetLength) {
                return [].concat(Array(targetLength - arr.length).fill(0), arr);
              };

              if (display.length < digitCount) {
                addExtraZeroes(display, digitCount);
              }

              if (replacements[j].count < digitCount) {
                addExtraZeroes(replacements[j], digitCount);
              }

              if (animationDirection === "increase") {
                var maxDigits = breakIntoDigits(maxValues[j] || newValue);

                if (maxDigits.length === 0) {
                  maxDigits = [0];
                }

                var extraDigits = [];
                var prevDigits = [];
                incomingDigits.push(replacements[j].map(function (d, k) {
                  var currentMax = display[k - 1] === maxDigits[k - 1] ? maxDigits[i] : 9;

                  if (prevDigits.length > 1) {
                    var prevDigits2 = prevDigits.slice(1, prevDigits.length - 1);
                    var cycle = prevDigits2.map(function (p) {
                      return integerArray(0, maxDigits[k - 1] === p ? maxDigits[k] : 9);
                    });
                    extraDigits = cycle.reduce(function (prev, curr) {
                      return prev.concat(curr);
                    }, []);
                  }

                  if (d === display[k]) {
                    if (newValue > currentValue) {
                      prevDigits = prevDigits.length > 0 ? integerArray(d, currentMax).concat(extraDigits, integerArray(0, d)) : [d];
                    } else {
                      prevDigits = extraDigits.concat(integerArray(0, d));
                    }
                  } else if (display[k] < d) {
                    if (prevDigits.length > 1) {
                      prevDigits = integerArray(display[k], currentMax).concat(extraDigits, integerArray(0, d));
                    } else {
                      prevDigits = integerArray(display[k], d);
                    }
                  } else {
                    prevDigits = integerArray(display[k], currentMax).concat(extraDigits, integerArray(0, d));
                  }

                  return prevDigits.length > 1 ? prevDigits : d;
                }));
              } else if (animationDirection === "decrease") {
                var _maxDigits = breakIntoDigits(maxValues[j] || currentValue);

                if (_maxDigits.length === 0) {
                  _maxDigits = [0];
                }

                var _extraDigits = [];
                var _prevDigits = [];
                incomingDigits.push(replacements[j].map(function (d, k) {
                  var currentMax = replacements[j][k - 1] === _maxDigits[k - 1] ? _maxDigits[k] : 9;

                  if (_prevDigits.length > 1) {
                    var prevDigits2 = _prevDigits.slice(1, _prevDigits.length - 1);

                    var cycle = prevDigits2.map(function (p) {
                      return integerArray(0, _maxDigits[k - 1] === p ? _maxDigits[k] : 9);
                    });
                    _extraDigits = cycle.reduce(function (prev, curr) {
                      return prev.concat(curr);
                    }, []);
                  }

                  if (d === display[k]) {
                    if (newValue < currentValue) {
                      _prevDigits = _prevDigits.length > 0 ? integerArray(d, currentMax).concat(_extraDigits, integerArray(0, d)) : [d];
                    } else {
                      _prevDigits = integerArray(d, currentMax).concat(_extraDigits, integerArray(0, d));
                    }
                  } else if (display[k] > d) {
                    if (_prevDigits.length > 1) {
                      _prevDigits = integerArray(d, currentMax).concat(_extraDigits, integerArray(0, display[k]));
                    } else {
                      _prevDigits = integerArray(d, display[k]);
                    }
                  } else {
                    _prevDigits = integerArray(d, currentMax).concat(_extraDigits, integerArray(0, display[k]));
                  }

                  return _prevDigits.length > 1 ? _prevDigits : d;
                }));
              }
            }
          });
          var odometerSlot = Array.prototype.slice.call(instance.querySelectorAll(".ub-countdown-odometer")).map(function (a) {
            return Array.prototype.slice.call(a.children);
          });
          var finishedTransitions = 0;
          var transitionCount = incomingDigits.reduce(function (collection, currentArray) {
            return collection.concat(currentArray);
          }, []).filter(function (a) {
            return Array.isArray(a);
          }).length;

          var removeExtraZeroes = function removeExtraZeroes() {
            maxValues.forEach(function (m, j) {
              if (m === 0) {
                //at least one extra leading zero is spotted
                if (initialValue[i][j][0] === 0) {
                  var curVal = generateValue(initialValue[i][j]);
                  var targetLength = (curVal ? Math.floor(Math.log10(curVal)) : 0) + 1; //eliminate element containing extra zero

                  odometerSlot[j].slice(0, initialValue[i][j].length - targetLength).forEach(function (o) {
                    o.parentNode.removeChild(o);
                  });
                  initialValue[i][j] = initialValue[i][j].slice(initialValue[i][j].length - targetLength);
                }
              }
            });
          };

          incomingDigits.forEach(function (arr, j) {
            arr.forEach(function (d, k) {
              if (Array.isArray(d)) {
                odometerSlot[j][k].classList.add("ub-countdown-odometer-digits");
                odometerSlot[j][k].classList.remove("ub-countdown-odometer-digit");
                odometerSlot[j][k].innerHTML = d.map(function (dd) {
                  return "<div class=\"odometer-moving-digit\">".concat(dd, "</div>");
                }).join(""); //do pre-animation prep

                if (animationDirection === "decrease") {
                  odometerSlot[j][k].style.transform = "translateY(".concat(100 * (1 / d.length - 1), "%)");
                } //animate


                setTimeout(function () {
                  odometerSlot[j][k].style.transition = "all 0.3s";

                  if (animationDirection === "increase") {
                    odometerSlot[j][k].style.transform = "translateY(".concat(100 * (1 / d.length - 1), "%)");
                  } else {
                    odometerSlot[j][k].style.transform = "translateY(0px)";
                  } //event listener for end of animation


                  odometerSlot[j][k].addEventListener("transitionend", function () {
                    //switch to pre-animation style
                    odometerSlot[j][k].classList.add("ub-countdown-odometer-digit");
                    odometerSlot[j][k].classList.remove("ub-countdown-odometer-digits");
                    odometerSlot[j][k].removeAttribute("style"); //check if there are leading zeroes to be removed

                    odometerSlot[j][k].innerHTML = replacements[j][k];
                    initialValue[i][j][k] = replacements[j][k];
                    finishedTransitions++;

                    if (finishedTransitions === transitionCount) {
                      removeExtraZeroes();
                    }
                  }, {
                    once: true
                  });
                }, 40);
              }
            });
          });
          animationDirection = "decrease";
        } else {
          if (instance.querySelector(".ub_countdown_week")) instance.querySelector(".ub_countdown_week").innerHTML = weeks;
          if (instance.querySelector(".ub_countdown_day")) instance.querySelector(".ub_countdown_day").innerHTML = days;
          if (instance.querySelector(".ub_countdown_hour")) instance.querySelector(".ub_countdown_hour").innerHTML = hours;
          if (instance.querySelector(".ub_countdown_minute")) instance.querySelector(".ub_countdown_minute").innerHTML = minutes;
          if (instance.querySelector(".ub_countdown_second")) instance.querySelector(".ub_countdown_second").innerHTML = seconds;

          if (instance.querySelector(".ub_countdown_circular_container")) {
            if (instance.querySelector(".ub_countdown_circle_week")) {
              instance.querySelector(".ub_countdown_circle_week .ub_countdown_circle_path").style.strokeDasharray = "".concat(weeks * 219.911 / 52, "px, 219.911px");
              instance.querySelector(".ub_countdown_circle_week .ub_countdown_circle_trail").style.strokeLinecap = weeks > 0 ? "round" : "butt";
            }

            if (instance.querySelector(".ub_countdown_circle_day")) {
              instance.querySelector(".ub_countdown_circle_day .ub_countdown_circle_path").style.strokeDasharray = "".concat(days * 219.911 / 7, "px, 219.911px");
              instance.querySelector(".ub_countdown_circle_day .ub_countdown_circle_trail").style.strokeLinecap = days > 0 ? "round" : "butt";
            }

            if (instance.querySelector(".ub_countdown_circle_hour")) {
              instance.querySelector(".ub_countdown_circle_hour .ub_countdown_circle_path").style.strokeDasharray = "".concat(hours * 219.911 / 24, "px, 219.911px");
              instance.querySelector(".ub_countdown_circle_hour .ub_countdown_circle_trail").style.strokeLinecap = hours > 0 ? "round" : "butt";
            }

            if (instance.querySelector(".ub_countdown_circle_minute")) {
              instance.querySelector(".ub_countdown_circle_minute .ub_countdown_circle_path").style.strokeDasharray = "".concat(minutes * 219.911 / 60, "px, 219.911px");
              instance.querySelector(".ub_countdown_circle_minute .ub_countdown_circle_trail").style.strokeLinecap = minutes > 0 ? "round" : "butt";
            }

            if (instance.querySelector(".ub_countdown_circle_second")) {
              instance.querySelector(".ub_countdown_circle_second .ub_countdown_circle_path").style.strokeDasharray = "".concat(seconds * 219.911 / 60, "px, 219.911px");
              instance.querySelector(".ub_countdown_circle_second .ub_countdown_circle_trail").style.strokeLinecap = seconds > 0 ? "round" : "butt";
            }
          }
        }
      } else {
        clearInterval(timer[i]);

        if (!isNaN(timeLeft)) {
          instance.innerHTML = instance.getAttribute("data-expirymessage");
        }
      }
    }, 1000);
  });
});