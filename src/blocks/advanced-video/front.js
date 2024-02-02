(function (e) {
	var t = {};
	function r(n) {
		if (t[n]) return t[n].exports;
		var a = (t[n] = { i: n, l: false, exports: {} });
		e[n].call(a.exports, a, a.exports, r);
		a.l = true;
		return a.exports;
	}
	r.m = e;
	r.c = t;
	r.d = function (e, t, n) {
		if (!r.o(e, t)) Object.defineProperty(e, t, { enumerable: true, get: n });
	};
	r.r = function (e) {
		if ("undefined" !== typeof Symbol && Symbol.toStringTag)
			Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
		Object.defineProperty(e, "__esModule", { value: true });
	};
	r.t = function (e, t) {
		if (1 & t) e = r(e);
		if (8 & t) return e;
		if (4 & t && "object" === typeof e && e && e.__esModule) return e;
		var n = Object.create(null);
		r.r(n);
		Object.defineProperty(n, "default", { enumerable: true, value: e });
		if (2 & t && "string" != typeof e)
			for (var a in e)
				r.d(
					n,
					a,
					function (t) {
						return e[t];
					}.bind(null, a),
				);
		return n;
	};
	r.n = function (e) {
		var t =
			e && e.__esModule
				? function t() {
						return e["default"];
					}
				: function t() {
						return e;
					};
		r.d(t, "a", t);
		return t;
	};
	r.o = function (e, t) {
		return Object.prototype.hasOwnProperty.call(e, t);
	};
	r.p = "/";
	return r((r.s = 0));
})({
	0: function (e, t, r) {
		r("3fe06cb9615786e0ea67");
		e.exports = r("3177845424933048caec");
	},
	"0116c75136b233002fb9": function (e, t) {
		var r = {}.toString;
		e.exports = function (e) {
			return r.call(e).slice(8, -1);
		};
	},
	"03192b087bb464f059c0": function (e, t, r) {
		"use strict";
		var n = r("d394d0a4c1838202489d");
		var a = r("23d432718b3e8ce32362");
		var c = r("ca19e32ab6ee3b3692aa");
		e.exports = function e(t) {
			var r = n(this);
			var o = c(r.length);
			var i = arguments.length;
			var f = a(i > 1 ? arguments[1] : void 0, o);
			var u = i > 2 ? arguments[2] : void 0;
			var d = void 0 === u ? o : a(u, o);
			while (d > f) r[f++] = t;
			return r;
		};
	},
	"0565be87d109f51269ca": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("ecd0e0fb36455021f082")(2);
		n(n.P + n.F * !r("40b064d4eb439c0c1c2b")([].filter, true), "Array", {
			filter: function e(t) {
				return a(this, t, arguments[1]);
			},
		});
	},
	"0594430ce9777a0767aa": function (e, t, r) {
		var n = r("6ae9955278ddcf01bbfd");
		e.exports = function (e, t) {
			return new (n(e))(t);
		};
	},
	"06b2b473e53cc019ca74": function (e, t, r) {
		"use strict";
		var n = r("d394d0a4c1838202489d");
		var a = r("23d432718b3e8ce32362");
		var c = r("ca19e32ab6ee3b3692aa");
		e.exports =
			[].copyWithin ||
			function e(t, r) {
				var o = n(this);
				var i = c(o.length);
				var f = a(t, i);
				var u = a(r, i);
				var d = arguments.length > 2 ? arguments[2] : void 0;
				var s = Math.min((void 0 === d ? i : a(d, i)) - u, i - f);
				var v = 1;
				if (u < f && f < u + s) {
					v = -1;
					u += s - 1;
					f += s - 1;
				}
				while (s-- > 0) {
					if (u in o) o[f] = o[u];
					else delete o[f];
					f += v;
					u += v;
				}
				return o;
			};
	},
	"0a5193b0534d54dbcda1": function (e, t, r) {
		"use strict";
		var n = r("0e717e1f47872428608d");
		var a = r("2d13d93c336705cd8ff9");
		var c = r("d394d0a4c1838202489d");
		var o = r("4357234160788ed77205");
		var i = r("71d3ec5bd65418e28ebc");
		var f = r("ca19e32ab6ee3b3692aa");
		var u = r("8de492c765fbfb624515");
		var d = r("f88518adc3004bf8d923");
		a(
			a.S +
				a.F *
					!r("574ea81f94fc0b2f332a")(function (e) {
						Array.from(e);
					}),
			"Array",
			{
				from: function e(t) {
					var r = c(t);
					var a = "function" == typeof this ? this : Array;
					var s = arguments.length;
					var v = s > 1 ? arguments[1] : void 0;
					var l = void 0 !== v;
					var b = 0;
					var h = d(r);
					var p, y, m, g;
					if (l) v = n(v, s > 2 ? arguments[2] : void 0, 2);
					if (void 0 != h && !(a == Array && i(h)))
						for (g = h.call(r), y = new a(); !(m = g.next()).done; b++)
							u(y, b, l ? o(g, v, [m.value, b], true) : m.value);
					else {
						p = f(r.length);
						for (y = new a(p); p > b; b++) u(y, b, l ? v(r[b], b) : r[b]);
					}
					y.length = b;
					return y;
				},
			},
		);
	},
	"0e717e1f47872428608d": function (e, t, r) {
		var n = r("4d073e2fededcdd3f3d3");
		e.exports = function (e, t, r) {
			n(e);
			if (void 0 === t) return e;
			switch (r) {
				case 1:
					return function (r) {
						return e.call(t, r);
					};
				case 2:
					return function (r, n) {
						return e.call(t, r, n);
					};
				case 3:
					return function (r, n, a) {
						return e.call(t, r, n, a);
					};
			}
			return function () {
				return e.apply(t, arguments);
			};
		};
	},
	"0f025c284bc567debf3d": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("ecd0e0fb36455021f082")(0);
		var c = r("40b064d4eb439c0c1c2b")([].forEach, true);
		n(n.P + n.F * !c, "Array", {
			forEach: function e(t) {
				return a(this, t, arguments[1]);
			},
		});
	},
	"1139de1233fd67f45bd7": function (e, t) {
		var r = (e.exports =
			"undefined" != typeof window && window.Math == Math
				? window
				: "undefined" != typeof self && self.Math == Math
					? self
					: Function("return this")());
		if ("number" == typeof __g) __g = r;
	},
	"12323e1413cbffdabe02": function (e, t, r) {
		var n = r("d34390b928ecadc11dc8");
		var a = r("d394d0a4c1838202489d");
		var c = r("5f6eded14a8ed86276fc")("IE_PROTO");
		var o = Object.prototype;
		e.exports =
			Object.getPrototypeOf ||
			function (e) {
				e = a(e);
				if (n(e, c)) return e[c];
				if ("function" == typeof e.constructor && e instanceof e.constructor)
					return e.constructor.prototype;
				return e instanceof Object ? o : null;
			};
	},
	"145c4f2bdc487b2578df": function (e, t, r) {
		var n = r("e3136eea77d23f8d97ec");
		var a = r("380c0734c088ca78ccda");
		e.exports =
			Object.keys ||
			function e(t) {
				return n(t, a);
			};
	},
	"1468f5d37f30f63d76ea": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("efae14a3f8cd9a616256");
		var c = r("1f3157d073736826d4fa");
		var o = r("ca19e32ab6ee3b3692aa");
		var i = [].lastIndexOf;
		var f = !!i && 1 / [1].lastIndexOf(1, -0) < 0;
		n(n.P + n.F * (f || !r("40b064d4eb439c0c1c2b")(i)), "Array", {
			lastIndexOf: function e(t) {
				if (f) return i.apply(this, arguments) || 0;
				var r = a(this);
				var n = o(r.length);
				var u = n - 1;
				if (arguments.length > 1) u = Math.min(u, c(arguments[1]));
				if (u < 0) u = n + u;
				for (; u >= 0; u--) if (u in r) if (r[u] === t) return u || 0;
				return -1;
			},
		});
	},
	"1591b90b4327c94245ad": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("ecd0e0fb36455021f082")(1);
		n(n.P + n.F * !r("40b064d4eb439c0c1c2b")([].map, true), "Array", {
			map: function e(t) {
				return a(this, t, arguments[1]);
			},
		});
	},
	"1b01d0e59d3af79760a0": function (e, t, r) {
		var n = r("79c91dcd8cd554c59c7b");
		var a = r("bc1a333d2b6eceac22e3");
		var c = r("4ef7a75a1d1957a7c5c0");
		var o = Object.defineProperty;
		t.f = r("5975c7ea3ecd56e534e3")
			? Object.defineProperty
			: function e(t, r, i) {
					n(t);
					r = c(r, true);
					n(i);
					if (a)
						try {
							return o(t, r, i);
						} catch (f) {}
					if ("get" in i || "set" in i)
						throw TypeError("Accessors not supported!");
					if ("value" in i) t[r] = i.value;
					return t;
				};
	},
	"1b24b031f63a74d1f57f": function (e, t, r) {
		"use strict";
		var n = r("f8f08bdd917755ac017a");
		function a() {}
		var c = null;
		var o = {};
		function i(e) {
			try {
				return e.then;
			} catch (t) {
				c = t;
				return o;
			}
		}
		function f(e, t) {
			try {
				return e(t);
			} catch (r) {
				c = r;
				return o;
			}
		}
		function u(e, t, r) {
			try {
				e(t, r);
			} catch (n) {
				c = n;
				return o;
			}
		}
		e.exports = d;
		function d(e) {
			if ("object" !== typeof this)
				throw new TypeError("Promises must be constructed via new");
			if ("function" !== typeof e)
				throw new TypeError("Promise constructor's argument is not a function");
			this._U = 0;
			this._V = 0;
			this._W = null;
			this._X = null;
			if (e === a) return;
			m(e, this);
		}
		d._Y = null;
		d._Z = null;
		d._0 = a;
		d.prototype.then = function (e, t) {
			if (this.constructor !== d) return s(this, e, t);
			var r = new d(a);
			v(this, new y(e, t, r));
			return r;
		};
		function s(e, t, r) {
			return new e.constructor(function (n, c) {
				var o = new d(a);
				o.then(n, c);
				v(e, new y(t, r, o));
			});
		}
		function v(e, t) {
			while (3 === e._V) e = e._W;
			if (d._Y) d._Y(e);
			if (0 === e._V) {
				if (0 === e._U) {
					e._U = 1;
					e._X = t;
					return;
				}
				if (1 === e._U) {
					e._U = 2;
					e._X = [e._X, t];
					return;
				}
				e._X.push(t);
				return;
			}
			l(e, t);
		}
		function l(e, t) {
			n(function () {
				var r = 1 === e._V ? t.onFulfilled : t.onRejected;
				if (null === r) {
					if (1 === e._V) b(t.promise, e._W);
					else h(t.promise, e._W);
					return;
				}
				var n = f(r, e._W);
				if (n === o) h(t.promise, c);
				else b(t.promise, n);
			});
		}
		function b(e, t) {
			if (t === e)
				return h(e, new TypeError("A promise cannot be resolved with itself."));
			if (t && ("object" === typeof t || "function" === typeof t)) {
				var r = i(t);
				if (r === o) return h(e, c);
				if (r === e.then && t instanceof d) {
					e._V = 3;
					e._W = t;
					p(e);
					return;
				} else if ("function" === typeof r) {
					m(r.bind(t), e);
					return;
				}
			}
			e._V = 1;
			e._W = t;
			p(e);
		}
		function h(e, t) {
			e._V = 2;
			e._W = t;
			if (d._Z) d._Z(e, t);
			p(e);
		}
		function p(e) {
			if (1 === e._U) {
				v(e, e._X);
				e._X = null;
			}
			if (2 === e._U) {
				for (var t = 0; t < e._X.length; t++) v(e, e._X[t]);
				e._X = null;
			}
		}
		function y(e, t, r) {
			this.onFulfilled = "function" === typeof e ? e : null;
			this.onRejected = "function" === typeof t ? t : null;
			this.promise = r;
		}
		function m(e, t) {
			var r = false;
			var n = u(
				e,
				function (e) {
					if (r) return;
					r = true;
					b(t, e);
				},
				function (e) {
					if (r) return;
					r = true;
					h(t, e);
				},
			);
			if (!r && n === o) {
				r = true;
				h(t, c);
			}
		}
	},
	"1b71f5e96f29a92413b6": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("5b9dc0e027f5c68eff1a");
		var c = r("0116c75136b233002fb9");
		var o = r("23d432718b3e8ce32362");
		var i = r("ca19e32ab6ee3b3692aa");
		var f = [].slice;
		n(
			n.P +
				n.F *
					r("7a7739dd8a198a2cfcb5")(function () {
						if (a) f.call(a);
					}),
			"Array",
			{
				slice: function e(t, r) {
					var n = i(this.length);
					var a = c(this);
					r = void 0 === r ? n : r;
					if ("Array" == a) return f.call(this, t, r);
					var u = o(t, n);
					var d = o(r, n);
					var s = i(d - u);
					var v = new Array(s);
					var l = 0;
					for (; l < s; l++)
						v[l] = "String" == a ? this.charAt(u + l) : this[u + l];
					return v;
				},
			},
		);
	},
	"1e0f00d296712713afe6": function (e, t, r) {
		var n = r("4d073e2fededcdd3f3d3");
		var a = r("d394d0a4c1838202489d");
		var c = r("a537d0accb907bf9d41f");
		var o = r("ca19e32ab6ee3b3692aa");
		e.exports = function (e, t, r, i, f) {
			n(t);
			var u = a(e);
			var d = c(u);
			var s = o(u.length);
			var v = f ? s - 1 : 0;
			var l = f ? -1 : 1;
			if (r < 2)
				for (;;) {
					if (v in d) {
						i = d[v];
						v += l;
						break;
					}
					v += l;
					if (f ? v < 0 : s <= v)
						throw TypeError("Reduce of empty array with no initial value");
				}
			for (; f ? v >= 0 : s > v; v += l) if (v in d) i = t(i, d[v], v, u);
			return i;
		};
	},
	"1f3157d073736826d4fa": function (e, t) {
		var r = Math.ceil;
		var n = Math.floor;
		e.exports = function (e) {
			return isNaN((e = +e)) ? 0 : (e > 0 ? n : r)(e);
		};
	},
	"2076e982c14c41925fb4": function (e, t, r) {
		var n = r("efae14a3f8cd9a616256");
		var a = r("ca19e32ab6ee3b3692aa");
		var c = r("23d432718b3e8ce32362");
		e.exports = function (e) {
			return function (t, r, o) {
				var i = n(t);
				var f = a(i.length);
				var u = c(o, f);
				var d;
				if (e && r != r)
					while (f > u) {
						d = i[u++];
						if (d != d) return true;
					}
				else
					for (; f > u; u++)
						if (e || u in i) if (i[u] === r) return e || u || 0;
				return !e && -1;
			};
		};
	},
	"224ae09e536c09e69a0a": function (e, t) {
		e.exports = {};
	},
	"23617503340803072f22": function (e, t, r) {
		"use strict";
		r.d(t, "b", function () {
			return o;
		});
		r.d(t, "d", function () {
			return i;
		});
		r.d(t, "a", function () {
			return v;
		});
		r.d(t, "c", function () {
			return l;
		});
		function n(e, t, r, n, a, c, o) {
			try {
				var i = e[c](o);
				var f = i.value;
			} catch (u) {
				r(u);
				return;
			}
			if (i.done) t(f);
			else Promise.resolve(f).then(n, a);
		}
		function a(e) {
			return function () {
				var t = this,
					r = arguments;
				return new Promise(function (a, c) {
					var o = e.apply(t, r);
					function i(e) {
						n(o, a, c, i, f, "next", e);
					}
					function f(e) {
						n(o, a, c, i, f, "throw", e);
					}
					i(void 0);
				});
			};
		}
		function c(e) {
			"@babel/helpers - typeof";
			return (
				(c =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? function (e) {
								return typeof e;
							}
						: function (e) {
								return e &&
									"function" == typeof Symbol &&
									e.constructor === Symbol &&
									e !== Symbol.prototype
									? "symbol"
									: typeof e;
							}),
				c(e)
			);
		}
		function o() {
			return Math.round(1e17 * Math.random());
		}
		function i() {
			var e =
				arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
			var t = arguments.length > 1 ? arguments[1] : void 0;
			var r = arguments.length > 2 ? arguments[2] : void 0;
			if (!e.length || !t) return [];
			return e.reduce(function () {
				var e =
					arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
				var n = arguments.length > 1 ? arguments[1] : void 0;
				var a =
					arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
				var c = Math.floor(a / t);
				if (!e[c]) e[c] = [];
				if (r) e[c].push(n[r]);
				else e[c].push(n);
				return e;
			}, []);
		}
		function f(e, t) {
			var r = t.type || "GET";
			var n = t.data;
			var a = t.success,
				o =
					void 0 === a
						? function e(t, r) {
								void 0;
							}
						: a,
				i = t.fail,
				f =
					void 0 === i
						? function e(t, r) {
								void 0;
							}
						: i;
			var u = new XMLHttpRequest();
			u.onreadystatechange = function () {
				if (4 === Number(u.readyState))
					if ((u.status >= 200 && u.status < 300) || 304 === u.status)
						o(u.responseText, u);
					else f(u.responseText, u);
			};
			function d(e) {
				var t = e;
				var r = [];
				if ("string" === typeof t) t = encodeURI(t);
				else if ("object" === c(t)) {
					Object.keys(t).forEach(function (e) {
						r.push(
							"".concat(e, "=").concat(encodeURIComponent(t[e].toString())),
						);
					});
					t = r.join("&");
				}
				return t;
			}
			if ("GET" === r.toUpperCase()) {
				var s = "".concat(e, "?").concat(d(n || ""));
				u.open("get", s, true);
				u.send(null);
			} else if ("POST" === r.toUpperCase()) {
				u.open("post", e, true);
				u.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				u.send(d(n || ""));
			}
		}
		function u(e, t) {
			return d.apply(this, arguments);
		}
		function d() {
			d = a(
				regeneratorRuntime.mark(function e(t, r) {
					return regeneratorRuntime.wrap(function e(n) {
						while (1)
							switch ((n.prev = n.next)) {
								case 0:
									return n.abrupt(
										"return",
										new Promise(function (e, n) {
											var a = { data: r, success: e, fail: n };
											f(t, a);
										}).then(function () {
											var e =
												arguments.length > 0 && void 0 !== arguments[0]
													? arguments[0]
													: "{}";
											var t = {};
											try {
												t = JSON.parse(e);
											} catch (r) {
												t = {};
											}
											return t;
										}),
									);
								case 1:
								case "end":
									return n.stop();
							}
					}, e);
				}),
			);
			return d.apply(this, arguments);
		}
		function s() {
			var e = "TikTok";
			var t = {};
			var r = function t(r) {
				return "[".concat(e, "] ").concat(r.toString());
			};
			["error", "log", "info"].forEach(function (e) {
				t[e] = function (t) {
					if ("info" === e) void 0;
					else void 0;
				};
			});
			return t;
		}
		var v = s();
		function l(e) {
			var t = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var r = new RegExp("[\\?&]".concat(t, "=([^&#]*)"));
			var n = r.exec(location.search);
			return null === n ? "" : decodeURIComponent(n[1].replace(/\+/g, " "));
		}
		function b() {
			return false || "production" === "dev";
		}
	},
	"23d432718b3e8ce32362": function (e, t, r) {
		var n = r("1f3157d073736826d4fa");
		var a = Math.max;
		var c = Math.min;
		e.exports = function (e, t) {
			e = n(e);
			return e < 0 ? a(e + t, 0) : c(e, t);
		};
	},
	"273d2eedcd369c189e70": function (e, t) {
		var r = 0;
		var n = Math.random();
		e.exports = function (e) {
			return "Symbol(".concat(
				void 0 === e ? "" : e,
				")_",
				(++r + n).toString(36),
			);
		};
	},
	"2c09af3fb5c4ba3698b3": function (e, t, r) {
		var n = (function (e) {
			"use strict";
			var t = Object.prototype;
			var r = t.hasOwnProperty;
			var n;
			var a = "function" === typeof Symbol ? Symbol : {};
			var c = a.iterator || "@@iterator";
			var o = a.asyncIterator || "@@asyncIterator";
			var i = a.toStringTag || "@@toStringTag";
			function f(e, t, r, n) {
				var a = t && t.prototype instanceof h ? t : h;
				var c = Object.create(a.prototype);
				var o = new O(n || []);
				c._invoke = j(e, r, o);
				return c;
			}
			e.wrap = f;
			function u(e, t, r) {
				try {
					return { type: "normal", arg: e.call(t, r) };
				} catch (n) {
					return { type: "throw", arg: n };
				}
			}
			var d = "suspendedStart";
			var s = "suspendedYield";
			var v = "executing";
			var l = "completed";
			var b = {};
			function h() {}
			function p() {}
			function y() {}
			var m = {};
			m[c] = function () {
				return this;
			};
			var g = Object.getPrototypeOf;
			var w = g && g(g(P([])));
			if (w && w !== t && r.call(w, c)) m = w;
			var x = (y.prototype = h.prototype = Object.create(m));
			p.prototype = x.constructor = y;
			y.constructor = p;
			y[i] = p.displayName = "GeneratorFunction";
			function _(e) {
				["next", "throw", "return"].forEach(function (t) {
					e[t] = function (e) {
						return this._invoke(t, e);
					};
				});
			}
			e.isGeneratorFunction = function (e) {
				var t = "function" === typeof e && e.constructor;
				return t
					? t === p || "GeneratorFunction" === (t.displayName || t.name)
					: false;
			};
			e.mark = function (e) {
				if (Object.setPrototypeOf) Object.setPrototypeOf(e, y);
				else {
					e.__proto__ = y;
					if (!(i in e)) e[i] = "GeneratorFunction";
				}
				e.prototype = Object.create(x);
				return e;
			};
			e.awrap = function (e) {
				return { __await: e };
			};
			function k(e, t) {
				function n(a, c, o, i) {
					var f = u(e[a], e, c);
					if ("throw" === f.type) i(f.arg);
					else {
						var d = f.arg;
						var s = d.value;
						if (s && "object" === typeof s && r.call(s, "__await"))
							return t.resolve(s.__await).then(
								function (e) {
									n("next", e, o, i);
								},
								function (e) {
									n("throw", e, o, i);
								},
							);
						return t.resolve(s).then(
							function (e) {
								d.value = e;
								o(d);
							},
							function (e) {
								return n("throw", e, o, i);
							},
						);
					}
				}
				var a;
				function c(e, r) {
					function c() {
						return new t(function (t, a) {
							n(e, r, t, a);
						});
					}
					return (a = a ? a.then(c, c) : c());
				}
				this._invoke = c;
			}
			_(k.prototype);
			k.prototype[o] = function () {
				return this;
			};
			e.AsyncIterator = k;
			e.async = function (t, r, n, a, c) {
				if (void 0 === c) c = Promise;
				var o = new k(f(t, r, n, a), c);
				return e.isGeneratorFunction(r)
					? o
					: o.next().then(function (e) {
							return e.done ? e.value : o.next();
						});
			};
			function j(e, t, r) {
				var n = d;
				return function a(c, o) {
					if (n === v) throw new Error("Generator is already running");
					if (n === l) {
						if ("throw" === c) throw o;
						return T();
					}
					r.method = c;
					r.arg = o;
					while (true) {
						var i = r.delegate;
						if (i) {
							var f = E(i, r);
							if (f) {
								if (f === b) continue;
								return f;
							}
						}
						if ("next" === r.method) r.sent = r._sent = r.arg;
						else if ("throw" === r.method) {
							if (n === d) {
								n = l;
								throw r.arg;
							}
							r.dispatchException(r.arg);
						} else if ("return" === r.method) r.abrupt("return", r.arg);
						n = v;
						var h = u(e, t, r);
						if ("normal" === h.type) {
							n = r.done ? l : s;
							if (h.arg === b) continue;
							return { value: h.arg, done: r.done };
						} else if ("throw" === h.type) {
							n = l;
							r.method = "throw";
							r.arg = h.arg;
						}
					}
				};
			}
			function E(e, t) {
				var r = e.iterator[t.method];
				if (r === n) {
					t.delegate = null;
					if ("throw" === t.method) {
						if (e.iterator["return"]) {
							t.method = "return";
							t.arg = n;
							E(e, t);
							if ("throw" === t.method) return b;
						}
						t.method = "throw";
						t.arg = new TypeError(
							"The iterator does not provide a 'throw' method",
						);
					}
					return b;
				}
				var a = u(r, e.iterator, t.arg);
				if ("throw" === a.type) {
					t.method = "throw";
					t.arg = a.arg;
					t.delegate = null;
					return b;
				}
				var c = a.arg;
				if (!c) {
					t.method = "throw";
					t.arg = new TypeError("iterator result is not an object");
					t.delegate = null;
					return b;
				}
				if (c.done) {
					t[e.resultName] = c.value;
					t.next = e.nextLoc;
					if ("return" !== t.method) {
						t.method = "next";
						t.arg = n;
					}
				} else return c;
				t.delegate = null;
				return b;
			}
			_(x);
			x[i] = "Generator";
			x[c] = function () {
				return this;
			};
			x.toString = function () {
				return "[object Generator]";
			};
			function S(e) {
				var t = { tryLoc: e[0] };
				if (1 in e) t.catchLoc = e[1];
				if (2 in e) {
					t.finallyLoc = e[2];
					t.afterLoc = e[3];
				}
				this.tryEntries.push(t);
			}
			function A(e) {
				var t = e.completion || {};
				t.type = "normal";
				delete t.arg;
				e.completion = t;
			}
			function O(e) {
				this.tryEntries = [{ tryLoc: "root" }];
				e.forEach(S, this);
				this.reset(true);
			}
			e.keys = function (e) {
				var t = [];
				for (var r in e) t.push(r);
				t.reverse();
				return function r() {
					while (t.length) {
						var n = t.pop();
						if (n in e) {
							r.value = n;
							r.done = false;
							return r;
						}
					}
					r.done = true;
					return r;
				};
			};
			function P(e) {
				if (e) {
					var t = e[c];
					if (t) return t.call(e);
					if ("function" === typeof e.next) return e;
					if (!isNaN(e.length)) {
						var a = -1,
							o = function t() {
								while (++a < e.length)
									if (r.call(e, a)) {
										t.value = e[a];
										t.done = false;
										return t;
									}
								t.value = n;
								t.done = true;
								return t;
							};
						return (o.next = o);
					}
				}
				return { next: T };
			}
			e.values = P;
			function T() {
				return { value: n, done: true };
			}
			O.prototype = {
				constructor: O,
				reset: function (e) {
					this.prev = 0;
					this.next = 0;
					this.sent = this._sent = n;
					this.done = false;
					this.delegate = null;
					this.method = "next";
					this.arg = n;
					this.tryEntries.forEach(A);
					if (!e)
						for (var t in this)
							if ("t" === t.charAt(0) && r.call(this, t) && !isNaN(+t.slice(1)))
								this[t] = n;
				},
				stop: function () {
					this.done = true;
					var e = this.tryEntries[0];
					var t = e.completion;
					if ("throw" === t.type) throw t.arg;
					return this.rval;
				},
				dispatchException: function (e) {
					if (this.done) throw e;
					var t = this;
					function a(r, a) {
						i.type = "throw";
						i.arg = e;
						t.next = r;
						if (a) {
							t.method = "next";
							t.arg = n;
						}
						return !!a;
					}
					for (var c = this.tryEntries.length - 1; c >= 0; --c) {
						var o = this.tryEntries[c];
						var i = o.completion;
						if ("root" === o.tryLoc) return a("end");
						if (o.tryLoc <= this.prev) {
							var f = r.call(o, "catchLoc");
							var u = r.call(o, "finallyLoc");
							if (f && u) {
								if (this.prev < o.catchLoc) return a(o.catchLoc, true);
								else if (this.prev < o.finallyLoc) return a(o.finallyLoc);
							} else if (f) {
								if (this.prev < o.catchLoc) return a(o.catchLoc, true);
							} else if (u) {
								if (this.prev < o.finallyLoc) return a(o.finallyLoc);
							} else throw new Error("try statement without catch or finally");
						}
					}
				},
				abrupt: function (e, t) {
					for (var n = this.tryEntries.length - 1; n >= 0; --n) {
						var a = this.tryEntries[n];
						if (
							a.tryLoc <= this.prev &&
							r.call(a, "finallyLoc") &&
							this.prev < a.finallyLoc
						) {
							var c = a;
							break;
						}
					}
					if (
						c &&
						("break" === e || "continue" === e) &&
						c.tryLoc <= t &&
						t <= c.finallyLoc
					)
						c = null;
					var o = c ? c.completion : {};
					o.type = e;
					o.arg = t;
					if (c) {
						this.method = "next";
						this.next = c.finallyLoc;
						return b;
					}
					return this.complete(o);
				},
				complete: function (e, t) {
					if ("throw" === e.type) throw e.arg;
					if ("break" === e.type || "continue" === e.type) this.next = e.arg;
					else if ("return" === e.type) {
						this.rval = this.arg = e.arg;
						this.method = "return";
						this.next = "end";
					} else if ("normal" === e.type && t) this.next = t;
					return b;
				},
				finish: function (e) {
					for (var t = this.tryEntries.length - 1; t >= 0; --t) {
						var r = this.tryEntries[t];
						if (r.finallyLoc === e) {
							this.complete(r.completion, r.afterLoc);
							A(r);
							return b;
						}
					}
				},
				catch: function (e) {
					for (var t = this.tryEntries.length - 1; t >= 0; --t) {
						var r = this.tryEntries[t];
						if (r.tryLoc === e) {
							var n = r.completion;
							if ("throw" === n.type) {
								var a = n.arg;
								A(r);
							}
							return a;
						}
					}
					throw new Error("illegal catch attempt");
				},
				delegateYield: function (e, t, r) {
					this.delegate = { iterator: P(e), resultName: t, nextLoc: r };
					if ("next" === this.method) this.arg = n;
					return b;
				},
			};
			return e;
		})(true ? e.exports : void 0);
		try {
			regeneratorRuntime = n;
		} catch (a) {
			Function("r", "regeneratorRuntime = r")(n);
		}
	},
	"2d13d93c336705cd8ff9": function (e, t, r) {
		var n = r("1139de1233fd67f45bd7");
		var a = r("5925dad3c5243ffee3db");
		var c = r("5f25c015bbbf9d42c661");
		var o = r("88db22626e6c88b175cf");
		var i = r("0e717e1f47872428608d");
		var f = "prototype";
		var u = function (e, t, r) {
			var d = e & u.F;
			var s = e & u.G;
			var v = e & u.S;
			var l = e & u.P;
			var b = e & u.B;
			var h = s ? n : v ? n[t] || (n[t] = {}) : (n[t] || {})[f];
			var p = s ? a : a[t] || (a[t] = {});
			var y = p[f] || (p[f] = {});
			var m, g, w, x;
			if (s) r = t;
			for (m in r) {
				g = !d && h && void 0 !== h[m];
				w = (g ? h : r)[m];
				x =
					b && g
						? i(w, n)
						: l && "function" == typeof w
							? i(Function.call, w)
							: w;
				if (h) o(h, m, w, e & u.U);
				if (p[m] != w) c(p, m, x);
				if (l && y[m] != w) y[m] = w;
			}
		};
		n.core = a;
		u.F = 1;
		u.G = 2;
		u.S = 4;
		u.P = 8;
		u.B = 16;
		u.W = 32;
		u.U = 64;
		u.R = 128;
		e.exports = u;
	},
	"307014e72ed12da69e15": function (e, t, r) {
		"use strict";
		var n = r("a5e6f0092ff0290e0bcf");
		var a = r("dabaabbe8ba08d59975f");
		var c = r("224ae09e536c09e69a0a");
		var o = r("efae14a3f8cd9a616256");
		e.exports = r("429cfc8e3ed333e40618")(
			Array,
			"Array",
			function (e, t) {
				this._t = o(e);
				this._i = 0;
				this._k = t;
			},
			function () {
				var e = this._t;
				var t = this._k;
				var r = this._i++;
				if (!e || r >= e.length) {
					this._t = void 0;
					return a(1);
				}
				if ("keys" == t) return a(0, r);
				if ("values" == t) return a(0, e[r]);
				return a(0, [r, e[r]]);
			},
			"values",
		);
		c.Arguments = c.Array;
		n("keys");
		n("values");
		n("entries");
	},
	"3177845424933048caec": function (e, t, r) {
		"use strict";
		r.r(t);
		var n = r("3fe06cb9615786e0ea67");
		var a = r("e0b8897ffbf48a102fbb");
		var c, o;
		try {
			c = window.localStorage;
			o = window.sessionStorage;
		} catch (p) {}
		function i(e) {
			function t() {
				if (!o) return false;
				var e = "".concat(a["k"], "storage_test");
				var t = "";
				try {
					t = o.getItem(e);
					if (!t) o.setItem(e, true);
				} catch (r) {
					o.setItem(e, "");
				}
				return Boolean(t);
			}
			this.getItem = function (r) {
				var n = "";
				if (t()) n = e.getItem("".concat(a["k"]).concat(r));
				return n;
			};
			this.setItem = function (r, n) {
				if (t()) e.setItem("".concat(a["k"]).concat(r), n);
			};
			this.removeItem = function (r) {
				if (t()) e.removeItem("".concat(a["k"]).concat(r));
			};
		}
		var f = new i(c);
		var u = new i(o);
		var d = r("23617503340803072f22");
		function s(e, t) {
			if (!(e instanceof t))
				throw new TypeError("Cannot call a class as a function");
		}
		function v(e, t) {
			for (var r = 0; r < t.length; r++) {
				var n = t[r];
				n.enumerable = n.enumerable || false;
				n.configurable = true;
				if ("value" in n) n.writable = true;
				Object.defineProperty(e, n.key, n);
			}
		}
		function l(e, t, r) {
			if (t) v(e.prototype, t);
			if (r) v(e, r);
			Object.defineProperty(e, "prototype", { writable: false });
			return e;
		}
		function b(e, t, r, n, a, c, o) {
			try {
				var i = e[c](o);
				var f = i.value;
			} catch (u) {
				r(u);
				return;
			}
			if (i.done) t(f);
			else Promise.resolve(f).then(n, a);
		}
		function h(e) {
			return function () {
				var t = this,
					r = arguments;
				return new Promise(function (n, a) {
					var c = e.apply(t, r);
					function o(e) {
						b(c, n, a, o, i, "next", e);
					}
					function i(e) {
						b(c, n, a, o, i, "throw", e);
					}
					o(void 0);
				});
			};
		}
		(function () {
			var e = h(
				regeneratorRuntime.mark(function e(t) {
					var r, n, c, o;
					return regeneratorRuntime.wrap(function e(i) {
						while (1)
							switch ((i.prev = i.next)) {
								case 0:
									r = t;
									n = "true";
									c = (function () {
										function e() {
											s(this, e);
											this.mountStatus = false;
										}
										l(e, [
											{
												key: "mount",
												value: (function () {
													var e = h(
														regeneratorRuntime.mark(function e() {
															var t, r;
															return regeneratorRuntime.wrap(
																function e(a) {
																	while (1)
																		switch ((a.prev = a.next)) {
																			case 0:
																				t = this.mountStatus === n;
																				if (!t) {
																					a.next = 5;
																					break;
																				}
																				this.setNewMount(true);
																				a.next = 14;
																				break;
																			case 5:
																				this.mountStatus = true;
																				a.next = 8;
																				return this.checkLib();
																			case 8:
																				r = a.sent;
																				if (!r) {
																					a.next = 14;
																					break;
																				}
																				a.next = 12;
																				return this.libHandle();
																			case 12:
																				this.checkNewMount();
																				this.mountStatus = false;
																			case 14:
																			case "end":
																				return a.stop();
																		}
																},
																e,
																this,
															);
														}),
													);
													return function t() {
														return e.apply(this, arguments);
													};
												})(),
											},
											{
												key: "checkLib",
												value: (function () {
													var e = h(
														regeneratorRuntime.mark(function e() {
															var t, n;
															return regeneratorRuntime.wrap(
																function e(c) {
																	while (1)
																		switch ((c.prev = c.next)) {
																			case 0:
																				t = false;
																				if (!r[a["j"]]) r[a["j"]] = {};
																				n = r[a["j"]].version;
																				if (!n) {
																					n = this.getLibVersion();
																					r[a["j"]].version = n;
																				}
																				c.prev = 4;
																				c.next = 7;
																				return Promise.all([
																					this.checkCSS(n),
																					this.checkScript(n),
																				]);
																			case 7:
																				t = c.sent;
																				c.next = 14;
																				break;
																			case 10:
																				c.prev = 10;
																				c.t0 = c["catch"](4);
																				t = false;
																				d["a"].error(c.t0);
																			case 14:
																				return c.abrupt("return", t);
																			case 15:
																			case "end":
																				return c.stop();
																		}
																},
																e,
																this,
																[[4, 10]],
															);
														}),
													);
													return function t() {
														return e.apply(this, arguments);
													};
												})(),
											},
											{
												key: "libHandle",
												value: (function () {
													var e = h(
														regeneratorRuntime.mark(function e() {
															var t, n, c, o, i;
															return regeneratorRuntime.wrap(
																function e(f) {
																	while (1)
																		switch ((f.prev = f.next)) {
																			case 0:
																				(t = r[a["j"]] || {}),
																					(n = t.lib),
																					(c = t.isEventsInit),
																					(o = void 0 === c ? false : c);
																				if (o) {
																					f.next = 6;
																					break;
																				}
																				f.t0 = n;
																				if (!f.t0) {
																					f.next = 6;
																					break;
																				}
																				f.next = 6;
																				return n.init();
																			case 6:
																				i = this.collectNodes();
																				f.t1 = n;
																				if (!f.t1) {
																					f.next = 11;
																					break;
																				}
																				f.next = 11;
																				return n.render(i);
																			case 11:
																			case "end":
																				return f.stop();
																		}
																},
																e,
																this,
															);
														}),
													);
													return function t() {
														return e.apply(this, arguments);
													};
												})(),
											},
											{
												key: "collectNodes",
												value: function e() {
													var t = document.getElementsByClassName(a["i"]);
													var r = [];
													if (t.length)
														r = Array.prototype.filter.call(t, function (e) {
															var t = e.nodeName.toLowerCase() === a["l"];
															var r = !e.id;
															return t && r;
														});
													return r;
												},
											},
											{
												key: "getLibVersion",
												value: function e() {
													return a["e"];
												},
											},
											{
												key: "checkCSS",
												value: function e(t) {
													return new Promise(function (e) {
														var r = document.getElementById(a["c"]);
														if (r) e(true);
														else {
															var n = document.createElement("link");
															n.rel = "stylesheet";
															n.type = "text/css";
															n.id = a["c"];
															n.href = ""
																.concat(a["b"], "/")
																.concat(a["f"])
																.concat(t, ".css");
															document.head.appendChild(n);
															n.onload = function () {
																e(true);
															};
															n.onerror = function (t) {
																d["a"].error(t);
																e(false);
															};
														}
													});
												},
											},
											{
												key: "checkScript",
												value: function e(t) {
													return new Promise(function (e) {
														var r = document.getElementById(a["d"]);
														if (r) e(true);
														else {
															var n = document.createElement("script");
															n.type = "text/javascript";
															n.id = a["d"];
															n.src = ""
																.concat(a["b"], "/")
																.concat(a["f"])
																.concat(t, ".js");
															document.body.appendChild(n);
															n.onload = function () {
																e(true);
															};
															n.onerror = function (t) {
																d["a"].error(t);
																e(false);
															};
														}
													});
												},
											},
											{
												key: "checkNewMount",
												value: function e() {
													var t = u.getItem(a["h"]) || "";
													var r = t === n;
													if (r) {
														this.mount();
														this.setNewMount(false);
													}
												},
											},
											{
												key: "setNewMount",
												value: function e() {
													var t =
														arguments.length > 0 && void 0 !== arguments[0]
															? arguments[0]
															: "";
													u.setItem(a["h"], t);
												},
											},
											{
												key: "mountStatus",
												set: function e() {
													var t =
														arguments.length > 0 && void 0 !== arguments[0]
															? arguments[0]
															: "";
													u.setItem(a["g"], t);
												},
												get: function e() {
													return u.getItem(a["g"]) || "";
												},
											},
										]);
										return e;
									})();
									o = (function () {
										var e = h(
											regeneratorRuntime.mark(function e() {
												var t;
												return regeneratorRuntime.wrap(function e(r) {
													while (1)
														switch ((r.prev = r.next)) {
															case 0:
																t = new c();
																r.next = 3;
																return t.mount();
															case 3:
															case "end":
																return r.stop();
														}
												}, e);
											}),
										);
										return function t() {
											return e.apply(this, arguments);
										};
									})();
									setTimeout(o, 0);
								case 5:
								case "end":
									return i.stop();
							}
					}, e);
				}),
			);
			return function t(r) {
				return e.apply(this, arguments);
			};
		})()(window);
	},
	"32b716d95af2fd3c5c23": function (e, t, r) {
		var n = r("0116c75136b233002fb9");
		var a = r("621a65702ee1a566fd32")("toStringTag");
		var c =
			"Arguments" ==
			n(
				(function () {
					return arguments;
				})(),
			);
		var o = function (e, t) {
			try {
				return e[t];
			} catch (r) {}
		};
		e.exports = function (e) {
			var t, r, i;
			return void 0 === e
				? "Undefined"
				: null === e
					? "Null"
					: "string" == typeof (r = o((t = Object(e)), a))
						? r
						: c
							? n(t)
							: "Object" == (i = n(t)) && "function" == typeof t.callee
								? "Arguments"
								: i;
		};
	},
	"340dbda6fe6f17098a91": function (e, t, r) {
		"use strict";
		var n = r("770f76c876afc046e4e0")(true);
		r("429cfc8e3ed333e40618")(
			String,
			"String",
			function (e) {
				this._t = String(e);
				this._i = 0;
			},
			function () {
				var e = this._t;
				var t = this._i;
				var r;
				if (t >= e.length) return { value: void 0, done: true };
				r = n(e, t);
				this._i += r.length;
				return { value: r, done: false };
			},
		);
	},
	"380c0734c088ca78ccda": function (e, t) {
		e.exports =
			"constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(
				",",
			);
	},
	"3932316ffef991f5d157": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("ecd0e0fb36455021f082")(5);
		var c = "find";
		var o = true;
		if (c in [])
			Array(1)[c](function () {
				o = false;
			});
		n(n.P + n.F * o, "Array", {
			find: function e(t) {
				return a(this, t, arguments.length > 1 ? arguments[1] : void 0);
			},
		});
		r("a5e6f0092ff0290e0bcf")(c);
	},
	"3f2012daa60f226e86ec": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("8de492c765fbfb624515");
		n(
			n.S +
				n.F *
					r("7a7739dd8a198a2cfcb5")(function () {
						function e() {}
						return !(Array.of.call(e) instanceof e);
					}),
			"Array",
			{
				of: function e() {
					var t = 0;
					var r = arguments.length;
					var n = new ("function" == typeof this ? this : Array)(r);
					while (r > t) a(n, t, arguments[t++]);
					n.length = r;
					return n;
				},
			},
		);
	},
	"3fc8b4ca32b0aebd9ff3": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("ecd0e0fb36455021f082")(6);
		var c = "findIndex";
		var o = true;
		if (c in [])
			Array(1)[c](function () {
				o = false;
			});
		n(n.P + n.F * o, "Array", {
			findIndex: function e(t) {
				return a(this, t, arguments.length > 1 ? arguments[1] : void 0);
			},
		});
		r("a5e6f0092ff0290e0bcf")(c);
	},
	"3fe06cb9615786e0ea67": function (e, t, r) {
		window.regeneratorRuntime = r("2c09af3fb5c4ba3698b3");
		r("a6444c69152f1487917b");
		if ("undefined" === typeof Promise) {
			r("9fbadcf2c98d054f245e").enable();
			window.Promise = r("e6615fafe8e11b81e37a");
		}
	},
	"40b064d4eb439c0c1c2b": function (e, t, r) {
		"use strict";
		var n = r("7a7739dd8a198a2cfcb5");
		e.exports = function (e, t) {
			return (
				!!e &&
				n(function () {
					t ? e.call(null, function () {}, 1) : e.call(null);
				})
			);
		};
	},
	"40b8419e3e2132ef0a63": function (e) {
		e.exports = {
			name: "tiktok_embed",
			version: "1.0.11",
			embedVersion: "1.0.11",
			description: "TikTok Embed SDK",
			main: "index.js",
			scripts: {
				test: "jest --forceExit",
				dev: "eden start",
				build: "eden build",
				"build:gcp": "NODE_REGION=GCP eden build",
				"build:dev": "eden build -a",
				commit: "eden push",
				feature: "eden feature",
				mr: "eden release -m",
				lint: "eden-lint ./src --fix",
			},
			keywords: ["tiktok", "embed"],
			author: "yangminghui.jasmine, chloe.chao",
			license: "ISC",
			devDependencies: {
				"@ies/create-eden-config": "^1.0.2",
				"@ies/eden-lint": "^2.15.4",
				"@testing-library/dom": "^8.17.1",
				"@testing-library/jest-dom": "^5.16.5",
				jest: "^28.1.3",
				jsdom: "^20.0.0",
			},
			dependencies: {
				"core-js": "2.5.7",
				promise: "^8.0.3",
				"regenerator-runtime": "^0.13.3",
			},
			husky: {
				hooks: {
					"commit-msg": "commitlint .commitlintrc.js -E HUSKY_GIT_PARAMS",
					"pre-commit": "lint-staged",
				},
			},
			"lint-staged": { "*": ["eden lint format", "git add"] },
		};
	},
	"429cfc8e3ed333e40618": function (e, t, r) {
		"use strict";
		var n = r("46a1a30d151cac60057c");
		var a = r("2d13d93c336705cd8ff9");
		var c = r("88db22626e6c88b175cf");
		var o = r("5f25c015bbbf9d42c661");
		var i = r("224ae09e536c09e69a0a");
		var f = r("5c5d334c57135891e397");
		var u = r("62828dc3ffa96c06b7c9");
		var d = r("12323e1413cbffdabe02");
		var s = r("621a65702ee1a566fd32")("iterator");
		var v = !([].keys && "next" in [].keys());
		var l = "@@iterator";
		var b = "keys";
		var h = "values";
		var p = function () {
			return this;
		};
		e.exports = function (e, t, r, y, m, g, w) {
			f(r, t, y);
			var x = function (e) {
				if (!v && e in E) return E[e];
				switch (e) {
					case b:
						return function t() {
							return new r(this, e);
						};
					case h:
						return function t() {
							return new r(this, e);
						};
				}
				return function t() {
					return new r(this, e);
				};
			};
			var _ = t + " Iterator";
			var k = m == h;
			var j = false;
			var E = e.prototype;
			var S = E[s] || E[l] || (m && E[m]);
			var A = S || x(m);
			var O = m ? (!k ? A : x("entries")) : void 0;
			var P = "Array" == t ? E.entries || S : S;
			var T, I, R;
			if (P) {
				R = d(P.call(new e()));
				if (R !== Object.prototype && R.next) {
					u(R, _, true);
					if (!n && "function" != typeof R[s]) o(R, s, p);
				}
			}
			if (k && S && S.name !== h) {
				j = true;
				A = function e() {
					return S.call(this);
				};
			}
			if ((!n || w) && (v || j || !E[s])) o(E, s, A);
			i[t] = A;
			i[_] = p;
			if (m) {
				T = { values: k ? A : x(h), keys: g ? A : x(b), entries: O };
				if (w) {
					for (I in T) if (!(I in E)) c(E, I, T[I]);
				} else a(a.P + a.F * (v || j), t, T);
			}
			return T;
		};
	},
	"43382cd620aa5a0df057": function (e, t) {
		var r;
		r = (function () {
			return this;
		})();
		try {
			r = r || Function("return this")() || (1, eval)("this");
		} catch (n) {
			if ("object" === typeof window) r = window;
		}
		e.exports = r;
	},
	"4357234160788ed77205": function (e, t, r) {
		var n = r("79c91dcd8cd554c59c7b");
		e.exports = function (e, t, r, a) {
			try {
				return a ? t(n(r)[0], r[1]) : t(r);
			} catch (o) {
				var c = e["return"];
				if (void 0 !== c) n(c.call(e));
				throw o;
			}
		};
	},
	"43a62b7f9a94dda95bf8": function (e, t, r) {
		var n = r("5925dad3c5243ffee3db");
		var a = r("1139de1233fd67f45bd7");
		var c = "__core-js_shared__";
		var o = a[c] || (a[c] = {});
		(e.exports = function (e, t) {
			return o[e] || (o[e] = void 0 !== t ? t : {});
		})("versions", []).push({
			version: n.version,
			mode: r("46a1a30d151cac60057c") ? "pure" : "global",
			copyright: "\xa9 2018 Denis Pushkarev (zloirock.ru)",
		});
	},
	"46a1a30d151cac60057c": function (e, t) {
		e.exports = false;
	},
	"481c1f0e850b0c8d0f7d": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("1e0f00d296712713afe6");
		n(n.P + n.F * !r("40b064d4eb439c0c1c2b")([].reduce, true), "Array", {
			reduce: function e(t) {
				return a(this, t, arguments.length, arguments[1], false);
			},
		});
	},
	"4cc77e026250beeef142": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("efae14a3f8cd9a616256");
		var c = [].join;
		n(
			n.P +
				n.F *
					(r("a537d0accb907bf9d41f") != Object ||
						!r("40b064d4eb439c0c1c2b")(c)),
			"Array",
			{
				join: function e(t) {
					return c.call(a(this), void 0 === t ? "," : t);
				},
			},
		);
	},
	"4d073e2fededcdd3f3d3": function (e, t) {
		e.exports = function (e) {
			if ("function" != typeof e) throw TypeError(e + " is not a function!");
			return e;
		};
	},
	"4ef7a75a1d1957a7c5c0": function (e, t, r) {
		var n = r("a459ab805827640a27e8");
		e.exports = function (e, t) {
			if (!n(e)) return e;
			var r, a;
			if (t && "function" == typeof (r = e.toString) && !n((a = r.call(e))))
				return a;
			if ("function" == typeof (r = e.valueOf) && !n((a = r.call(e)))) return a;
			if (!t && "function" == typeof (r = e.toString) && !n((a = r.call(e))))
				return a;
			throw TypeError("Can't convert object to primitive value");
		};
	},
	"574ea81f94fc0b2f332a": function (e, t, r) {
		var n = r("621a65702ee1a566fd32")("iterator");
		var a = false;
		try {
			var c = [7][n]();
			c["return"] = function () {
				a = true;
			};
			Array.from(c, function () {
				throw 2;
			});
		} catch (o) {}
		e.exports = function (e, t) {
			if (!t && !a) return false;
			var r = false;
			try {
				var c = [7];
				var i = c[n]();
				i.next = function () {
					return { done: (r = true) };
				};
				c[n] = function () {
					return i;
				};
				e(c);
			} catch (o) {}
			return r;
		};
	},
	"5925dad3c5243ffee3db": function (e, t) {
		var r = (e.exports = { version: "2.5.7" });
		if ("number" == typeof __e) __e = r;
	},
	"5975c7ea3ecd56e534e3": function (e, t, r) {
		e.exports = !r("7a7739dd8a198a2cfcb5")(function () {
			return (
				7 !=
				Object.defineProperty({}, "a", {
					get: function () {
						return 7;
					},
				}).a
			);
		});
	},
	"5b9dc0e027f5c68eff1a": function (e, t, r) {
		var n = r("1139de1233fd67f45bd7").document;
		e.exports = n && n.documentElement;
	},
	"5baa1143f58e62614ca0": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("4d073e2fededcdd3f3d3");
		var c = r("d394d0a4c1838202489d");
		var o = r("7a7739dd8a198a2cfcb5");
		var i = [].sort;
		var f = [1, 2, 3];
		n(
			n.P +
				n.F *
					(o(function () {
						f.sort(void 0);
					}) ||
						!o(function () {
							f.sort(null);
						}) ||
						!r("40b064d4eb439c0c1c2b")(i)),
			"Array",
			{
				sort: function e(t) {
					return void 0 === t ? i.call(c(this)) : i.call(c(this), a(t));
				},
			},
		);
	},
	"5c5d334c57135891e397": function (e, t, r) {
		"use strict";
		var n = r("ef09ce044ac3210bc947");
		var a = r("9d5592e83ab7f3d08974");
		var c = r("62828dc3ffa96c06b7c9");
		var o = {};
		r("5f25c015bbbf9d42c661")(
			o,
			r("621a65702ee1a566fd32")("iterator"),
			function () {
				return this;
			},
		);
		e.exports = function (e, t, r) {
			e.prototype = n(o, { next: a(1, r) });
			c(e, t + " Iterator");
		};
	},
	"5f25c015bbbf9d42c661": function (e, t, r) {
		var n = r("1b01d0e59d3af79760a0");
		var a = r("9d5592e83ab7f3d08974");
		e.exports = r("5975c7ea3ecd56e534e3")
			? function (e, t, r) {
					return n.f(e, t, a(1, r));
				}
			: function (e, t, r) {
					e[t] = r;
					return e;
				};
	},
	"5f6eded14a8ed86276fc": function (e, t, r) {
		var n = r("43a62b7f9a94dda95bf8")("keys");
		var a = r("273d2eedcd369c189e70");
		e.exports = function (e) {
			return n[e] || (n[e] = a(e));
		};
	},
	"621a65702ee1a566fd32": function (e, t, r) {
		var n = r("43a62b7f9a94dda95bf8")("wks");
		var a = r("273d2eedcd369c189e70");
		var c = r("1139de1233fd67f45bd7").Symbol;
		var o = "function" == typeof c;
		var i = (e.exports = function (e) {
			return n[e] || (n[e] = (o && c[e]) || (o ? c : a)("Symbol." + e));
		});
		i.store = n;
	},
	"62828dc3ffa96c06b7c9": function (e, t, r) {
		var n = r("1b01d0e59d3af79760a0").f;
		var a = r("d34390b928ecadc11dc8");
		var c = r("621a65702ee1a566fd32")("toStringTag");
		e.exports = function (e, t, r) {
			if (e && !a((e = r ? e : e.prototype), c))
				n(e, c, { configurable: true, value: t });
		};
	},
	"68a989d6f90923909f2a": function (e, t, r) {
		var n = r("a459ab805827640a27e8");
		var a = r("1139de1233fd67f45bd7").document;
		var c = n(a) && n(a.createElement);
		e.exports = function (e) {
			return c ? a.createElement(e) : {};
		};
	},
	"6ae9955278ddcf01bbfd": function (e, t, r) {
		var n = r("a459ab805827640a27e8");
		var a = r("8f648b1026e01323935b");
		var c = r("621a65702ee1a566fd32")("species");
		e.exports = function (e) {
			var t;
			if (a(e)) {
				t = e.constructor;
				if ("function" == typeof t && (t === Array || a(t.prototype)))
					t = void 0;
				if (n(t)) {
					t = t[c];
					if (null === t) t = void 0;
				}
			}
			return void 0 === t ? Array : t;
		};
	},
	"71d3ec5bd65418e28ebc": function (e, t, r) {
		var n = r("224ae09e536c09e69a0a");
		var a = r("621a65702ee1a566fd32")("iterator");
		var c = Array.prototype;
		e.exports = function (e) {
			return void 0 !== e && (n.Array === e || c[a] === e);
		};
	},
	"74be682203e7c82cb4c9": function (e, t, r) {
		r("89a21af31babcdc56725")("Array");
	},
	"770f76c876afc046e4e0": function (e, t, r) {
		var n = r("1f3157d073736826d4fa");
		var a = r("7ad2c0eb9a8edcc472a4");
		e.exports = function (e) {
			return function (t, r) {
				var c = String(a(t));
				var o = n(r);
				var i = c.length;
				var f, u;
				if (o < 0 || o >= i) return e ? "" : void 0;
				f = c.charCodeAt(o);
				return f < 55296 ||
					f > 56319 ||
					o + 1 === i ||
					(u = c.charCodeAt(o + 1)) < 56320 ||
					u > 57343
					? e
						? c.charAt(o)
						: f
					: e
						? c.slice(o, o + 2)
						: ((f - 55296) << 10) + (u - 56320) + 65536;
			};
		};
	},
	"79c91dcd8cd554c59c7b": function (e, t, r) {
		var n = r("a459ab805827640a27e8");
		e.exports = function (e) {
			if (!n(e)) throw TypeError(e + " is not an object!");
			return e;
		};
	},
	"7a7739dd8a198a2cfcb5": function (e, t) {
		e.exports = function (e) {
			try {
				return !!e();
			} catch (t) {
				return true;
			}
		};
	},
	"7ad2c0eb9a8edcc472a4": function (e, t) {
		e.exports = function (e) {
			if (void 0 == e) throw TypeError("Can't call method on  " + e);
			return e;
		};
	},
	"88db22626e6c88b175cf": function (e, t, r) {
		var n = r("1139de1233fd67f45bd7");
		var a = r("5f25c015bbbf9d42c661");
		var c = r("d34390b928ecadc11dc8");
		var o = r("273d2eedcd369c189e70")("src");
		var i = "toString";
		var f = Function[i];
		var u = ("" + f).split(i);
		r("5925dad3c5243ffee3db").inspectSource = function (e) {
			return f.call(e);
		};
		(e.exports = function (e, t, r, i) {
			var f = "function" == typeof r;
			if (f) c(r, "name") || a(r, "name", t);
			if (e[t] === r) return;
			if (f) c(r, o) || a(r, o, e[t] ? "" + e[t] : u.join(String(t)));
			if (e === n) e[t] = r;
			else if (!i) {
				delete e[t];
				a(e, t, r);
			} else if (e[t]) e[t] = r;
			else a(e, t, r);
		})(Function.prototype, i, function e() {
			return ("function" == typeof this && this[o]) || f.call(this);
		});
	},
	"896f33738142bf70015e": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("1e0f00d296712713afe6");
		n(n.P + n.F * !r("40b064d4eb439c0c1c2b")([].reduceRight, true), "Array", {
			reduceRight: function e(t) {
				return a(this, t, arguments.length, arguments[1], true);
			},
		});
	},
	"89a21af31babcdc56725": function (e, t, r) {
		"use strict";
		var n = r("1139de1233fd67f45bd7");
		var a = r("1b01d0e59d3af79760a0");
		var c = r("5975c7ea3ecd56e534e3");
		var o = r("621a65702ee1a566fd32")("species");
		e.exports = function (e) {
			var t = n[e];
			if (c && t && !t[o])
				a.f(t, o, {
					configurable: true,
					get: function () {
						return this;
					},
				});
		};
	},
	"8de492c765fbfb624515": function (e, t, r) {
		"use strict";
		var n = r("1b01d0e59d3af79760a0");
		var a = r("9d5592e83ab7f3d08974");
		e.exports = function (e, t, r) {
			if (t in e) n.f(e, t, a(0, r));
			else e[t] = r;
		};
	},
	"8f648b1026e01323935b": function (e, t, r) {
		var n = r("0116c75136b233002fb9");
		e.exports =
			Array.isArray ||
			function e(t) {
				return "Array" == n(t);
			};
	},
	"9125d51ebaa93f49cfd5": function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("ecd0e0fb36455021f082")(3);
		n(n.P + n.F * !r("40b064d4eb439c0c1c2b")([].some, true), "Array", {
			some: function e(t) {
				return a(this, t, arguments[1]);
			},
		});
	},
	"9d5592e83ab7f3d08974": function (e, t) {
		e.exports = function (e, t) {
			return {
				enumerable: !(1 & e),
				configurable: !(2 & e),
				writable: !(4 & e),
				value: t,
			};
		};
	},
	"9fbadcf2c98d054f245e": function (e, t, r) {
		"use strict";
		var n = r("1b24b031f63a74d1f57f");
		var a = [ReferenceError, TypeError, RangeError];
		var c = false;
		t.disable = o;
		function o() {
			c = false;
			n._Y = null;
			n._Z = null;
		}
		t.enable = i;
		function i(e) {
			e = e || {};
			if (c) o();
			c = true;
			var t = 0;
			var r = 0;
			var i = {};
			n._Y = function (e) {
				if (2 === e._V && i[e._1]) {
					if (i[e._1].logged) s(e._1);
					else clearTimeout(i[e._1].timeout);
					delete i[e._1];
				}
			};
			n._Z = function (e, r) {
				if (0 === e._U) {
					e._1 = t++;
					i[e._1] = {
						displayId: null,
						error: r,
						timeout: setTimeout(d.bind(null, e._1), u(r, a) ? 100 : 2e3),
						logged: false,
					};
				}
			};
			function d(t) {
				if (e.allRejections || u(i[t].error, e.whitelist || a)) {
					i[t].displayId = r++;
					if (e.onUnhandled) {
						i[t].logged = true;
						e.onUnhandled(i[t].displayId, i[t].error);
					} else {
						i[t].logged = true;
						f(i[t].displayId, i[t].error);
					}
				}
			}
			function s(t) {
				if (i[t].logged)
					if (e.onHandled) e.onHandled(i[t].displayId, i[t].error);
					else if (!i[t].onUnhandled) {
						void 0;
						void 0;
					}
			}
		}
		function f(e, t) {
			void 0;
			var r = (t && (t.stack || t)) + "";
			r.split("\n").forEach(function (e) {
				void 0;
			});
		}
		function u(e, t) {
			return t.some(function (t) {
				return e instanceof t;
			});
		}
	},
	a459ab805827640a27e8: function (e, t) {
		e.exports = function (e) {
			return "object" === typeof e ? null !== e : "function" === typeof e;
		};
	},
	a537d0accb907bf9d41f: function (e, t, r) {
		var n = r("0116c75136b233002fb9");
		e.exports = Object("z").propertyIsEnumerable(0)
			? Object
			: function (e) {
					return "String" == n(e) ? e.split("") : Object(e);
				};
	},
	a5e6f0092ff0290e0bcf: function (e, t, r) {
		var n = r("621a65702ee1a566fd32")("unscopables");
		var a = Array.prototype;
		if (void 0 == a[n]) r("5f25c015bbbf9d42c661")(a, n, {});
		e.exports = function (e) {
			a[n][e] = true;
		};
	},
	a6444c69152f1487917b: function (e, t, r) {
		r("340dbda6fe6f17098a91");
		r("cff317ca62d09454b2d3");
		r("0a5193b0534d54dbcda1");
		r("3f2012daa60f226e86ec");
		r("4cc77e026250beeef142");
		r("1b71f5e96f29a92413b6");
		r("5baa1143f58e62614ca0");
		r("0f025c284bc567debf3d");
		r("1591b90b4327c94245ad");
		r("0565be87d109f51269ca");
		r("9125d51ebaa93f49cfd5");
		r("cf802dc5a6982c8247e6");
		r("481c1f0e850b0c8d0f7d");
		r("896f33738142bf70015e");
		r("c9be824f185f52a1979a");
		r("1468f5d37f30f63d76ea");
		r("bc0f72eb2321587e4779");
		r("fa5cd10f53a62f249502");
		r("3932316ffef991f5d157");
		r("3fc8b4ca32b0aebd9ff3");
		r("74be682203e7c82cb4c9");
		r("307014e72ed12da69e15");
		e.exports = r("5925dad3c5243ffee3db").Array;
	},
	a6d645856102faf17328: function (e, t, r) {
		var n = r("1b01d0e59d3af79760a0");
		var a = r("79c91dcd8cd554c59c7b");
		var c = r("145c4f2bdc487b2578df");
		e.exports = r("5975c7ea3ecd56e534e3")
			? Object.defineProperties
			: function e(t, r) {
					a(t);
					var o = c(r);
					var i = o.length;
					var f = 0;
					var u;
					while (i > f) n.f(t, (u = o[f++]), r[u]);
					return t;
				};
	},
	bc0f72eb2321587e4779: function (e, t, r) {
		var n = r("2d13d93c336705cd8ff9");
		n(n.P, "Array", { copyWithin: r("06b2b473e53cc019ca74") });
		r("a5e6f0092ff0290e0bcf")("copyWithin");
	},
	bc1a333d2b6eceac22e3: function (e, t, r) {
		e.exports =
			!r("5975c7ea3ecd56e534e3") &&
			!r("7a7739dd8a198a2cfcb5")(function () {
				return (
					7 !=
					Object.defineProperty(r("68a989d6f90923909f2a")("div"), "a", {
						get: function () {
							return 7;
						},
					}).a
				);
			});
	},
	c9be824f185f52a1979a: function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("2076e982c14c41925fb4")(false);
		var c = [].indexOf;
		var o = !!c && 1 / [1].indexOf(1, -0) < 0;
		n(n.P + n.F * (o || !r("40b064d4eb439c0c1c2b")(c)), "Array", {
			indexOf: function e(t) {
				return o ? c.apply(this, arguments) || 0 : a(this, t, arguments[1]);
			},
		});
	},
	ca19e32ab6ee3b3692aa: function (e, t, r) {
		var n = r("1f3157d073736826d4fa");
		var a = Math.min;
		e.exports = function (e) {
			return e > 0 ? a(n(e), 9007199254740991) : 0;
		};
	},
	cf802dc5a6982c8247e6: function (e, t, r) {
		"use strict";
		var n = r("2d13d93c336705cd8ff9");
		var a = r("ecd0e0fb36455021f082")(4);
		n(n.P + n.F * !r("40b064d4eb439c0c1c2b")([].every, true), "Array", {
			every: function e(t) {
				return a(this, t, arguments[1]);
			},
		});
	},
	cff317ca62d09454b2d3: function (e, t, r) {
		var n = r("2d13d93c336705cd8ff9");
		n(n.S, "Array", { isArray: r("8f648b1026e01323935b") });
	},
	d34390b928ecadc11dc8: function (e, t) {
		var r = {}.hasOwnProperty;
		e.exports = function (e, t) {
			return r.call(e, t);
		};
	},
	d394d0a4c1838202489d: function (e, t, r) {
		var n = r("7ad2c0eb9a8edcc472a4");
		e.exports = function (e) {
			return Object(n(e));
		};
	},
	dabaabbe8ba08d59975f: function (e, t) {
		e.exports = function (e, t) {
			return { value: t, done: !!e };
		};
	},
	e0b8897ffbf48a102fbb: function (e, t, r) {
		"use strict";
		r.d(t, "b", function () {
			return f;
		});
		r.d(t, "c", function () {
			return u;
		});
		r.d(t, "d", function () {
			return d;
		});
		r.d(t, "f", function () {
			return s;
		});
		r.d(t, "e", function () {
			return v;
		});
		r.d(t, "o", function () {
			return l;
		});
		r.d(t, "l", function () {
			return b;
		});
		r.d(t, "j", function () {
			return h;
		});
		r.d(t, "i", function () {
			return p;
		});
		r.d(t, "m", function () {
			return y;
		});
		r.d(t, "k", function () {
			return m;
		});
		r.d(t, "g", function () {
			return g;
		});
		r.d(t, "h", function () {
			return w;
		});
		r.d(t, "a", function () {
			return x;
		});
		r.d(t, "n", function () {
			return _;
		});
		var n = "production" !== "production";
		var a = "SG" === "TTP";
		var c = "SG" === "VA";
		var o = a
			? "https://lf16-tiktok-web.tiktokcdn-us.com"
			: "https://lf16-tiktok-web.ttwstatic.com";
		var i = a
			? "/obj/tiktok-web-tx/tiktok/falcon/embed"
			: c
				? "/obj/tiktok-web-us/tiktok/falcon/embed"
				: "/obj/tiktok-web/tiktok/falcon/embed";
		var f = n ? "http://127.0.0.1:4000" : "".concat(o).concat(i);
		var u = "ttEmbedLibCSS";
		var d = "ttEmbedLibScript";
		var s = "embed_lib_v";
		var v = r("40b8419e3e2132ef0a63").version;
		var l = "https://www.tiktok.com";
		var b = "blockquote";
		var h = "tiktokEmbed";
		var p = "tiktok-embed";
		var y = "message";
		var m = "__tt_embed__";
		var g = "mounting";
		var w = "newmount";
		var x = Object.freeze({
			CREATOR: "creator",
			VIDEO: "video",
			TAG: "tag",
			MUSIC: "music",
			TRENDING: "trending",
			CURATED: "curated",
		});
		var _ = {
			TTP: [
				"https://www.tiktok.com",
				"https://lf16-tiktok-common.tiktokcdn-us.com",
				"https://vmweb.us.tiktok.com",
			],
			VA: [
				"https://www.tiktok.com",
				"https://lf16-tiktok-common.ttwstatic.com",
				"https://vmweb-va.byteoversea.com",
			],
			SG: [
				"https://www.tiktok.com",
				"https://lf16-tiktok-common.ttwstatic.com",
				"https://vmweb-sg.byteoversea.com",
			],
			Default: [
				"https://www.tiktok.com",
				"https://lf16-tiktok-common.tiktokcdn-us.com",
				"https://vmweb.us.tiktok.com",
			],
		};
	},
	e3136eea77d23f8d97ec: function (e, t, r) {
		var n = r("d34390b928ecadc11dc8");
		var a = r("efae14a3f8cd9a616256");
		var c = r("2076e982c14c41925fb4")(false);
		var o = r("5f6eded14a8ed86276fc")("IE_PROTO");
		e.exports = function (e, t) {
			var r = a(e);
			var i = 0;
			var f = [];
			var u;
			for (u in r) if (u != o) n(r, u) && f.push(u);
			while (t.length > i) if (n(r, (u = t[i++]))) ~c(f, u) || f.push(u);
			return f;
		};
	},
	e6615fafe8e11b81e37a: function (e, t, r) {
		"use strict";
		var n = r("1b24b031f63a74d1f57f");
		e.exports = n;
		var a = d(true);
		var c = d(false);
		var o = d(null);
		var i = d(void 0);
		var f = d(0);
		var u = d("");
		function d(e) {
			var t = new n(n._0);
			t._V = 1;
			t._W = e;
			return t;
		}
		n.resolve = function (e) {
			if (e instanceof n) return e;
			if (null === e) return o;
			if (void 0 === e) return i;
			if (true === e) return a;
			if (false === e) return c;
			if (0 === e) return f;
			if ("" === e) return u;
			if ("object" === typeof e || "function" === typeof e)
				try {
					var t = e.then;
					if ("function" === typeof t) return new n(t.bind(e));
				} catch (r) {
					return new n(function (e, t) {
						t(r);
					});
				}
			return d(e);
		};
		var s = function (e) {
			if ("function" === typeof Array.from) {
				s = Array.from;
				return Array.from(e);
			}
			s = function (e) {
				return Array.prototype.slice.call(e);
			};
			return Array.prototype.slice.call(e);
		};
		n.all = function (e) {
			var t = s(e);
			return new n(function (e, r) {
				if (0 === t.length) return e([]);
				var a = t.length;
				function c(o, i) {
					if (i && ("object" === typeof i || "function" === typeof i))
						if (i instanceof n && i.then === n.prototype.then) {
							while (3 === i._V) i = i._W;
							if (1 === i._V) return c(o, i._W);
							if (2 === i._V) r(i._W);
							i.then(function (e) {
								c(o, e);
							}, r);
							return;
						} else {
							var f = i.then;
							if ("function" === typeof f) {
								var u = new n(f.bind(i));
								u.then(function (e) {
									c(o, e);
								}, r);
								return;
							}
						}
					t[o] = i;
					if (0 === --a) e(t);
				}
				for (var o = 0; o < t.length; o++) c(o, t[o]);
			});
		};
		n.reject = function (e) {
			return new n(function (t, r) {
				r(e);
			});
		};
		n.race = function (e) {
			return new n(function (t, r) {
				s(e).forEach(function (e) {
					n.resolve(e).then(t, r);
				});
			});
		};
		n.prototype["catch"] = function (e) {
			return this.then(null, e);
		};
	},
	ecd0e0fb36455021f082: function (e, t, r) {
		var n = r("0e717e1f47872428608d");
		var a = r("a537d0accb907bf9d41f");
		var c = r("d394d0a4c1838202489d");
		var o = r("ca19e32ab6ee3b3692aa");
		var i = r("0594430ce9777a0767aa");
		e.exports = function (e, t) {
			var r = 1 == e;
			var f = 2 == e;
			var u = 3 == e;
			var d = 4 == e;
			var s = 6 == e;
			var v = 5 == e || s;
			var l = t || i;
			return function (t, i, b) {
				var h = c(t);
				var p = a(h);
				var y = n(i, b, 3);
				var m = o(p.length);
				var g = 0;
				var w = r ? l(t, m) : f ? l(t, 0) : void 0;
				var x, _;
				for (; m > g; g++)
					if (v || g in p) {
						x = p[g];
						_ = y(x, g, h);
						if (e)
							if (r) w[g] = _;
							else if (_)
								switch (e) {
									case 3:
										return true;
									case 5:
										return x;
									case 6:
										return g;
									case 2:
										w.push(x);
								}
							else if (d) return false;
					}
				return s ? -1 : u || d ? d : w;
			};
		};
	},
	ef09ce044ac3210bc947: function (e, t, r) {
		var n = r("79c91dcd8cd554c59c7b");
		var a = r("a6d645856102faf17328");
		var c = r("380c0734c088ca78ccda");
		var o = r("5f6eded14a8ed86276fc")("IE_PROTO");
		var i = function () {};
		var f = "prototype";
		var u = function () {
			var e = r("68a989d6f90923909f2a")("iframe");
			var t = c.length;
			var n = "<";
			var a = ">";
			var o;
			e.style.display = "none";
			r("5b9dc0e027f5c68eff1a").appendChild(e);
			e.src = "javascript:";
			o = e.contentWindow.document;
			o.open();
			o.write(n + "script" + a + "document.F=Object" + n + "/script" + a);
			o.close();
			u = o.F;
			while (t--) delete u[f][c[t]];
			return u();
		};
		e.exports =
			Object.create ||
			function e(t, r) {
				var c;
				if (null !== t) {
					i[f] = n(t);
					c = new i();
					i[f] = null;
					c[o] = t;
				} else c = u();
				return void 0 === r ? c : a(c, r);
			};
	},
	efae14a3f8cd9a616256: function (e, t, r) {
		var n = r("a537d0accb907bf9d41f");
		var a = r("7ad2c0eb9a8edcc472a4");
		e.exports = function (e) {
			return n(a(e));
		};
	},
	f88518adc3004bf8d923: function (e, t, r) {
		var n = r("32b716d95af2fd3c5c23");
		var a = r("621a65702ee1a566fd32")("iterator");
		var c = r("224ae09e536c09e69a0a");
		e.exports = r("5925dad3c5243ffee3db").getIteratorMethod = function (e) {
			if (void 0 != e) return e[a] || e["@@iterator"] || c[n(e)];
		};
	},
	f8f08bdd917755ac017a: function (e, t, r) {
		"use strict";
		(function (t) {
			e.exports = r;
			function r(e) {
				if (!n.length) {
					c();
					a = true;
				}
				n[n.length] = e;
			}
			var n = [];
			var a = false;
			var c;
			var o = 0;
			var i = 1024;
			function f() {
				while (o < n.length) {
					var e = o;
					o += 1;
					n[e].call();
					if (o > i) {
						for (var t = 0, r = n.length - o; t < r; t++) n[t] = n[t + o];
						n.length -= o;
						o = 0;
					}
				}
				n.length = 0;
				o = 0;
				a = false;
			}
			var u = "undefined" !== typeof t ? t : self;
			var d = u.MutationObserver || u.WebKitMutationObserver;
			if ("function" === typeof d) c = s(f);
			else c = v(f);
			r.requestFlush = c;
			function s(e) {
				var t = 1;
				var r = new d(e);
				var n = document.createTextNode("");
				r.observe(n, { characterData: true });
				return function e() {
					t = -t;
					n.data = t;
				};
			}
			function v(e) {
				return function t() {
					var r = setTimeout(a, 0);
					var n = setInterval(a, 50);
					function a() {
						clearTimeout(r);
						clearInterval(n);
						e();
					}
				};
			}
			r.makeRequestCallFromTimer = v;
		}).call(this, r("43382cd620aa5a0df057"));
	},
	fa5cd10f53a62f249502: function (e, t, r) {
		var n = r("2d13d93c336705cd8ff9");
		n(n.P, "Array", { fill: r("03192b087bb464f059c0") });
		r("a5e6f0092ff0290e0bcf")("fill");
	},
});

Array.prototype.slice
	.call(document.getElementsByClassName("ub-advanced-video-thumbnail"))
	.forEach((instance) => {
		instance.addEventListener("click", function () {
			instance.setAttribute("hidden", true);
			instance.nextElementSibling.removeAttribute("hidden");
		});
	});
