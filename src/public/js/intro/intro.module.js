/*!
 * Intro.js v7.2.0
 * https://introjs.com
 *
 * Copyright (C) 2012-2023 Afshin Mehrabani (@afshinmeh).
 * https://introjs.com
 *
 * Date: Mon, 14 Aug 2023 19:47:14 GMT
 */
function t(e) {
	return (
		(t =
			"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
				? function (t) {
						return typeof t;
					}
				: function (t) {
						return t &&
							"function" == typeof Symbol &&
							t.constructor === Symbol &&
							t !== Symbol.prototype
							? "symbol"
							: typeof t;
					}),
		t(e)
	);
}
function e(t, e, n, o) {
	return new (n || (n = Promise))(function (i, r) {
		function s(t) {
			try {
				l(o.next(t));
			} catch (t) {
				r(t);
			}
		}
		function a(t) {
			try {
				l(o.throw(t));
			} catch (t) {
				r(t);
			}
		}
		function l(t) {
			var e;
			t.done
				? i(t.value)
				: ((e = t.value),
					e instanceof n
						? e
						: new n(function (t) {
								t(e);
							})).then(s, a);
		}
		l((o = o.apply(t, e || [])).next());
	});
}
function n(t, e) {
	var n,
		o,
		i,
		r,
		s = {
			label: 0,
			sent: function () {
				if (1 & i[0]) throw i[1];
				return i[1];
			},
			trys: [],
			ops: [],
		};
	return (
		(r = { next: a(0), throw: a(1), return: a(2) }),
		"function" == typeof Symbol &&
			(r[Symbol.iterator] = function () {
				return this;
			}),
		r
	);
	function a(a) {
		return function (l) {
			return (function (a) {
				if (n) throw new TypeError("Generator is already executing.");
				for (; r && ((r = 0), a[0] && (s = 0)), s; )
					try {
						if (
							((n = 1),
							o &&
								(i =
									2 & a[0]
										? o.return
										: a[0]
											? o.throw || ((i = o.return) && i.call(o), 0)
											: o.next) &&
								!(i = i.call(o, a[1])).done)
						)
							return i;
						switch (((o = 0), i && (a = [2 & a[0], i.value]), a[0])) {
							case 0:
							case 1:
								i = a;
								break;
							case 4:
								return s.label++, { value: a[1], done: !1 };
							case 5:
								s.label++, (o = a[1]), (a = [0]);
								continue;
							case 7:
								(a = s.ops.pop()), s.trys.pop();
								continue;
							default:
								if (
									!((i = s.trys),
									(i = i.length > 0 && i[i.length - 1]) ||
										(6 !== a[0] && 2 !== a[0]))
								) {
									s = 0;
									continue;
								}
								if (3 === a[0] && (!i || (a[1] > i[0] && a[1] < i[3]))) {
									s.label = a[1];
									break;
								}
								if (6 === a[0] && s.label < i[1]) {
									(s.label = i[1]), (i = a);
									break;
								}
								if (i && s.label < i[2]) {
									(s.label = i[2]), s.ops.push(a);
									break;
								}
								i[2] && s.ops.pop(), s.trys.pop();
								continue;
						}
						a = e.call(t, s);
					} catch (t) {
						(a = [6, t]), (o = 0);
					} finally {
						n = i = 0;
					}
				if (5 & a[0]) throw a[1];
				return { value: a[0] ? a[1] : void 0, done: !0 };
			})([a, l]);
		};
	}
}
function o(t, e, n) {
	var o,
		r = (((o = {})[t] = e), (o.path = "/"), (o.expires = void 0), o);
	if (n) {
		var s = new Date();
		s.setTime(s.getTime() + 24 * n * 60 * 60 * 1e3),
			(r.expires = s.toUTCString());
	}
	var a = [];
	for (var l in r) a.push("".concat(l, "=").concat(r[l]));
	return (document.cookie = a.join("; ")), i(t);
}
function i(t) {
	return ((e = {}),
	document.cookie.split(";").forEach(function (t) {
		var n = t.split("="),
			o = n[0],
			i = n[1];
		e[o.trim()] = i;
	}),
	e)[t];
	var e;
}
"function" == typeof SuppressedError && SuppressedError;
function r(t, e) {
	e
		? o(
				t._options.dontShowAgainCookie,
				"true",
				t._options.dontShowAgainCookieDays,
			)
		: o(t._options.dontShowAgainCookie, "", -1);
}
var s,
	a =
		((s = {}),
		function (t, e) {
			return (
				void 0 === e && (e = "introjs-stamp"),
				(s[e] = s[e] || 0),
				void 0 === t[e] && (t[e] = s[e]++),
				t[e]
			);
		}),
	l = new ((function () {
		function t() {
			this.events_key = "introjs_event";
		}
		return (
			(t.prototype._id = function (t, e, n) {
				return t + a(e) + (n ? "_".concat(a(n)) : "");
			}),
			(t.prototype.on = function (t, e, n, o, i) {
				var r = this._id(e, n, o),
					s = function (e) {
						return n(o || t, e || window.event);
					};
				"addEventListener" in t
					? t.addEventListener(e, s, i)
					: "attachEvent" in t && t.attachEvent("on".concat(e), s),
					(t[this.events_key] = t[this.events_key] || {}),
					(t[this.events_key][r] = s);
			}),
			(t.prototype.off = function (t, e, n, o, i) {
				var r = this._id(e, n, o),
					s = t[this.events_key] && t[this.events_key][r];
				s &&
					("removeEventListener" in t
						? t.removeEventListener(e, s, i)
						: "detachEvent" in t && t.detachEvent("on".concat(e), s),
					(t[this.events_key][r] = null));
			}),
			t
		);
	})())(),
	c = function (t) {
		return "function" == typeof t;
	};
function u(t, e) {
	if (t instanceof SVGElement) {
		var n = t.getAttribute("class") || "";
		n.match(e) || t.setAttribute("class", "".concat(n, " ").concat(e));
	} else if (void 0 !== t.classList)
		for (var o = 0, i = e.split(" "); o < i.length; o++) {
			var r = i[o];
			t.classList.add(r);
		}
	else t.className.match(e) || (t.className += " ".concat(e));
}
function p(t, e) {
	var n = "";
	return (
		"currentStyle" in t
			? (n = t.currentStyle[e])
			: document.defaultView &&
				document.defaultView.getComputedStyle &&
				(n = document.defaultView
					.getComputedStyle(t, null)
					.getPropertyValue(e)),
		n && n.toLowerCase ? n.toLowerCase() : n
	);
}
function h(t, e) {
	if (t) {
		var n = (function (t) {
			var e = window.getComputedStyle(t),
				n = "absolute" === e.position,
				o = /(auto|scroll)/;
			if ("fixed" === e.position) return document.body;
			for (var i = t; (i = i.parentElement); )
				if (
					((e = window.getComputedStyle(i)),
					(!n || "static" !== e.position) &&
						o.test(e.overflow + e.overflowY + e.overflowX))
				)
					return i;
			return document.body;
		})(e);
		n !== document.body && (n.scrollTop = e.offsetTop - n.offsetTop);
	}
}
function d() {
	if (void 0 !== window.innerWidth)
		return { width: window.innerWidth, height: window.innerHeight };
	var t = document.documentElement;
	return { width: t.clientWidth, height: t.clientHeight };
}
function f(t, e, n, o, i) {
	var r;
	if (
		"off" !== e &&
		t &&
		((r =
			"tooltip" === e ? i.getBoundingClientRect() : o.getBoundingClientRect()),
		!(function (t) {
			var e = t.getBoundingClientRect();
			return (
				e.top >= 0 &&
				e.left >= 0 &&
				e.bottom + 80 <= window.innerHeight &&
				e.right <= window.innerWidth
			);
		})(o))
	) {
		var s = d().height;
		r.bottom - (r.bottom - r.top) < 0 || o.clientHeight > s
			? window.scrollBy(0, r.top - (s / 2 - r.height / 2) - n)
			: window.scrollBy(0, r.top - (s / 2 - r.height / 2) + n);
	}
}
function b(t) {
	t.setAttribute("role", "button"), (t.tabIndex = 0);
}
function m(t) {
	var e = t.parentElement;
	return (
		!(!e || "HTML" === e.nodeName) && ("fixed" === p(t, "position") || m(e))
	);
}
function g(t, e) {
	var n = document.body,
		o = document.documentElement,
		i = window.pageYOffset || o.scrollTop || n.scrollTop,
		r = window.pageXOffset || o.scrollLeft || n.scrollLeft;
	e = e || n;
	var s = t.getBoundingClientRect(),
		a = e.getBoundingClientRect(),
		l = p(e, "position"),
		c = { width: s.width, height: s.height };
	return ("body" !== e.tagName.toLowerCase() && "relative" === l) ||
		"sticky" === l
		? Object.assign(c, { top: s.top - a.top, left: s.left - a.left })
		: m(t)
			? Object.assign(c, { top: s.top, left: s.left })
			: Object.assign(c, { top: s.top + i, left: s.left + r });
}
function v(t, e) {
	if (t instanceof SVGElement) {
		var n = t.getAttribute("class") || "";
		t.setAttribute("class", n.replace(e, "").replace(/^\s+|\s+$/g, ""));
	} else t.className = t.className.replace(e, "").replace(/^\s+|\s+$/g, "");
}
function y(t, e) {
	var n = "";
	if ((t.style.cssText && (n += t.style.cssText), "string" == typeof e)) n += e;
	else for (var o in e) n += "".concat(o, ":").concat(e[o], ";");
	t.style.cssText = n;
}
function w(t, e, n) {
	if (n && e) {
		var o = g(e.element, t._targetElement),
			i = t._options.helperElementPadding;
		e.element instanceof Element && m(e.element)
			? u(n, "introjs-fixedTooltip")
			: v(n, "introjs-fixedTooltip"),
			"floating" === e.position && (i = 0),
			y(n, {
				width: "".concat(o.width + i, "px"),
				height: "".concat(o.height + i, "px"),
				top: "".concat(o.top - i / 2, "px"),
				left: "".concat(o.left - i / 2, "px"),
			});
	}
}
function _(t, e, n, o, i) {
	return t.left + e + n.width > o.width
		? ((i.style.left = "".concat(o.width - n.width - t.left, "px")), !1)
		: ((i.style.left = "".concat(e, "px")), !0);
}
function C(t, e, n, o) {
	return t.left + t.width - e - n.width < 0
		? ((o.style.left = "".concat(-t.left, "px")), !1)
		: ((o.style.right = "".concat(e, "px")), !0);
}
function S(t, e) {
	t.includes(e) && t.splice(t.indexOf(e), 1);
}
function k(t, e, n, o) {
	var i = t.slice(),
		r = d(),
		s = g(n).height + 10,
		a = g(n).width + 20,
		l = e.getBoundingClientRect(),
		c = "floating";
	if (
		(l.bottom + s > r.height && S(i, "bottom"),
		l.top - s < 0 && S(i, "top"),
		l.right + a > r.width && S(i, "right"),
		l.left - a < 0 && S(i, "left"),
		o && (o = o.split("-")[0]),
		i.length && ((c = i[0]), i.includes(o) && (c = o)),
		"top" === c || "bottom" === c)
	) {
		var u = void 0,
			p = [];
		"top" === c
			? ((u = "top-middle-aligned"),
				(p = ["top-left-aligned", "top-middle-aligned", "top-right-aligned"]))
			: ((u = "bottom-middle-aligned"),
				(p = [
					"bottom-left-aligned",
					"bottom-middle-aligned",
					"bottom-right-aligned",
				])),
			(c =
				(function (t, e, n, o) {
					var i = e / 2,
						r = Math.min(n, window.screen.width);
					return (
						r - t < e &&
							(S(o, "top-left-aligned"), S(o, "bottom-left-aligned")),
						(t < i || r - t < i) &&
							(S(o, "top-middle-aligned"), S(o, "bottom-middle-aligned")),
						t < e && (S(o, "top-right-aligned"), S(o, "bottom-right-aligned")),
						o.length ? o[0] : null
					);
				})(l.left, a, r.width, p) || u);
	}
	return c;
}
function j(t, e, n, o, i) {
	if ((void 0 === i && (i = !1), e)) {
		var r,
			s,
			a,
			l,
			c = "";
		(n.style.top = ""),
			(n.style.right = ""),
			(n.style.bottom = ""),
			(n.style.left = ""),
			(n.style.marginLeft = ""),
			(n.style.marginTop = ""),
			(o.style.display = "inherit"),
			(c =
				"string" == typeof e.tooltipClass
					? e.tooltipClass
					: t._options.tooltipClass),
			(n.className = ["introjs-tooltip", c].filter(Boolean).join(" ")),
			n.setAttribute("role", "dialog"),
			"floating" !== (l = e.position) &&
				t._options.autoPosition &&
				(l = k(t._options.positionPrecedence, e.element, n, l)),
			(s = g(e.element)),
			(r = g(n)),
			(a = d()),
			u(n, "introjs-".concat(l));
		var p = s.width / 2 - r.width / 2;
		switch (l) {
			case "top-right-aligned":
				o.className = "introjs-arrow bottom-right";
				var h = 0;
				C(s, h, r, n), (n.style.bottom = "".concat(s.height + 20, "px"));
				break;
			case "top-middle-aligned":
				(o.className = "introjs-arrow bottom-middle"),
					i && (p += 5),
					C(s, p, r, n) && ((n.style.right = ""), _(s, p, r, a, n)),
					(n.style.bottom = "".concat(s.height + 20, "px"));
				break;
			case "top-left-aligned":
			case "top":
				(o.className = "introjs-arrow bottom"),
					_(s, i ? 0 : 15, r, a, n),
					(n.style.bottom = "".concat(s.height + 20, "px"));
				break;
			case "right":
				(n.style.left = "".concat(s.width + 20, "px")),
					s.top + r.height > a.height
						? ((o.className = "introjs-arrow left-bottom"),
							(n.style.top = "-".concat(r.height - s.height - 20, "px")))
						: (o.className = "introjs-arrow left");
				break;
			case "left":
				i || !0 !== t._options.showStepNumbers || (n.style.top = "15px"),
					s.top + r.height > a.height
						? ((n.style.top = "-".concat(r.height - s.height - 20, "px")),
							(o.className = "introjs-arrow right-bottom"))
						: (o.className = "introjs-arrow right"),
					(n.style.right = "".concat(s.width + 20, "px"));
				break;
			case "floating":
				(o.style.display = "none"),
					(n.style.left = "50%"),
					(n.style.top = "50%"),
					(n.style.marginLeft = "-".concat(r.width / 2, "px")),
					(n.style.marginTop = "-".concat(r.height / 2, "px"));
				break;
			case "bottom-right-aligned":
				(o.className = "introjs-arrow top-right"),
					C(s, (h = 0), r, n),
					(n.style.top = "".concat(s.height + 20, "px"));
				break;
			case "bottom-middle-aligned":
				(o.className = "introjs-arrow top-middle"),
					i && (p += 5),
					C(s, p, r, n) && ((n.style.right = ""), _(s, p, r, a, n)),
					(n.style.top = "".concat(s.height + 20, "px"));
				break;
			default:
				(o.className = "introjs-arrow top"),
					_(s, 0, r, a, n),
					(n.style.top = "".concat(s.height + 20, "px"));
		}
	}
}
function A() {
	for (
		var t = 0,
			e = Array.from(document.querySelectorAll(".introjs-showElement"));
		t < e.length;
		t++
	) {
		v(e[t], /introjs-[a-zA-Z]+/g);
	}
}
function x(t, e) {
	var n = document.createElement(t);
	e = e || {};
	var o = /^(?:role|data-|aria-)/;
	for (var i in e) {
		var r = e[i];
		"style" === i && "function" != typeof r
			? y(n, r)
			: "string" == typeof r && i.match(o)
				? n.setAttribute(i, r)
				: (n[i] = r);
	}
	return n;
}
function N(t, e, n) {
	if ((void 0 === n && (n = !1), n)) {
		var o = e.style.opacity || "1";
		y(e, { opacity: "0" }),
			window.setTimeout(function () {
				y(e, { opacity: o });
			}, 10);
	}
	t.appendChild(e);
}
function E(t, e) {
	return ((t + 1) / e) * 100;
}
function T(t, e) {
	var n = x("div", { className: "introjs-bullets" });
	!1 === t._options.showBullets && (n.style.display = "none");
	var o = x("ul");
	o.setAttribute("role", "tablist");
	for (
		var i = function () {
				var e = this.getAttribute("data-step-number");
				null != e && t.goToStep(parseInt(e, 10));
			},
			r = 0;
		r < t._introItems.length;
		r++
	) {
		var s = t._introItems[r].step,
			a = x("li"),
			l = x("a");
		a.setAttribute("role", "presentation"),
			l.setAttribute("role", "tab"),
			(l.onclick = i),
			r === e.step - 1 && (l.className = "active"),
			b(l),
			(l.innerHTML = "&nbsp;"),
			l.setAttribute("data-step-number", s.toString()),
			a.appendChild(l),
			o.appendChild(a);
	}
	return n.appendChild(o), n;
}
function I(t, e, n) {
	var o = t.querySelector(".introjs-progress .introjs-progressbar");
	if (o) {
		var i = E(e, n);
		(o.style.cssText = "width:".concat(i, "%;")),
			o.setAttribute("aria-valuenow", i.toString());
	}
}
function L(t, o) {
	return e(this, void 0, void 0, function () {
		var i,
			r,
			s,
			a,
			l,
			d,
			m,
			g,
			v,
			_,
			C,
			S,
			k,
			L,
			P,
			q,
			R,
			O,
			M,
			D,
			F,
			V,
			z,
			G,
			W = this;
		return n(this, function (Q) {
			switch (Q.label) {
				case 0:
					return c(t._introChangeCallback)
						? [4, t._introChangeCallback.call(t, o.element)]
						: [3, 2];
				case 1:
					Q.sent(), (Q.label = 2);
				case 2:
					return (
						(i = document.querySelector(".introjs-helperLayer")),
						(r = document.querySelector(".introjs-tooltipReferenceLayer")),
						(s = "introjs-helperLayer"),
						"string" == typeof o.highlightClass &&
							(s += " ".concat(o.highlightClass)),
						"string" == typeof t._options.highlightClass &&
							(s += " ".concat(t._options.highlightClass)),
						null !== i && null !== r
							? ((m = r.querySelector(".introjs-helperNumberLayer")),
								(g = r.querySelector(".introjs-tooltiptext")),
								(v = r.querySelector(".introjs-tooltip-title")),
								(_ = r.querySelector(".introjs-arrow")),
								(C = r.querySelector(".introjs-tooltip")),
								(d = r.querySelector(".introjs-skipbutton")),
								(l = r.querySelector(".introjs-prevbutton")),
								(a = r.querySelector(".introjs-nextbutton")),
								(i.className = s),
								(C.style.opacity = "0"),
								(C.style.display = "none"),
								h(t._options.scrollToElement, o.element),
								w(t, o, i),
								w(t, o, r),
								A(),
								t._lastShowElementTimer &&
									window.clearTimeout(t._lastShowElementTimer),
								(t._lastShowElementTimer = window.setTimeout(function () {
									null !== m &&
										(m.innerHTML = ""
											.concat(o.step, " ")
											.concat(t._options.stepNumbersOfLabel, " ")
											.concat(t._introItems.length)),
										(g.innerHTML = o.intro || ""),
										(v.innerHTML = o.title || ""),
										(C.style.display = "block"),
										j(t, o, C, _),
										(function (t, e, n) {
											if (t) {
												var o = e.querySelector(
														".introjs-bullets li > a.active",
													),
													i = e.querySelector(
														'.introjs-bullets li > a[data-step-number="'.concat(
															n.step,
															'"]',
														),
													);
												o &&
													i &&
													((o.className = ""), (i.className = "active"));
											}
										})(t._options.showBullets, r, o),
										I(r, t._currentStep, t._introItems.length),
										(C.style.opacity = "1"),
										((null != a && /introjs-donebutton/gi.test(a.className)) ||
											null != a) &&
											a.focus(),
										f(
											t._options.scrollToElement,
											o.scrollTo,
											t._options.scrollPadding,
											o.element,
											g,
										);
								}, 350)))
							: ((S = x("div", { className: s })),
								(k = x("div", { className: "introjs-tooltipReferenceLayer" })),
								(L = x("div", { className: "introjs-arrow" })),
								(P = x("div", { className: "introjs-tooltip" })),
								(q = x("div", { className: "introjs-tooltiptext" })),
								(R = x("div", { className: "introjs-tooltip-header" })),
								(O = x("h1", { className: "introjs-tooltip-title" })),
								(M = x("div")),
								y(S, {
									"box-shadow":
										"0 0 1px 2px rgba(33, 33, 33, 0.8), rgba(33, 33, 33, ".concat(
											t._options.overlayOpacity.toString(),
											") 0 0 0 5000px",
										),
								}),
								h(t._options.scrollToElement, o.element),
								w(t, o, S),
								w(t, o, k),
								N(t._targetElement, S, !0),
								N(t._targetElement, k),
								(q.innerHTML = o.intro),
								(O.innerHTML = o.title),
								(M.className = "introjs-tooltipbuttons"),
								!1 === t._options.showButtons && (M.style.display = "none"),
								R.appendChild(O),
								P.appendChild(R),
								P.appendChild(q),
								t._options.dontShowAgain &&
									((D = x("div", { className: "introjs-dontShowAgain" })),
									((F = x("input", {
										type: "checkbox",
										id: "introjs-dontShowAgain",
										name: "introjs-dontShowAgain",
									})).onchange = function (e) {
										t.setDontShowAgain(e.target.checked);
									}),
									((V = x("label", {
										htmlFor: "introjs-dontShowAgain",
									})).innerText = t._options.dontShowAgainLabel),
									D.appendChild(F),
									D.appendChild(V),
									P.appendChild(D)),
								P.appendChild(T(t, o)),
								P.appendChild(
									(function (t) {
										var e = x("div");
										(e.className = "introjs-progress"),
											!1 === t._options.showProgress &&
												(e.style.display = "none");
										var n = x("div", { className: "introjs-progressbar" });
										t._options.progressBarAdditionalClass &&
											(n.className +=
												" " + t._options.progressBarAdditionalClass);
										var o = E(t._currentStep, t._introItems.length);
										return (
											n.setAttribute("role", "progress"),
											n.setAttribute("aria-valuemin", "0"),
											n.setAttribute("aria-valuemax", "100"),
											n.setAttribute("aria-valuenow", o.toString()),
											(n.style.cssText = "width:".concat(o, "%;")),
											e.appendChild(n),
											e
										);
									})(t),
								),
								(z = x("div")),
								!0 === t._options.showStepNumbers &&
									((z.className = "introjs-helperNumberLayer"),
									(z.innerHTML = ""
										.concat(o.step, " ")
										.concat(t._options.stepNumbersOfLabel, " ")
										.concat(t._introItems.length)),
									P.appendChild(z)),
								P.appendChild(L),
								k.appendChild(P),
								((a = x("a")).onclick = function () {
									return e(W, void 0, void 0, function () {
										return n(this, function (e) {
											switch (e.label) {
												case 0:
													return t._introItems.length - 1 === t._currentStep
														? [3, 2]
														: [4, B(t)];
												case 1:
													return e.sent(), [3, 6];
												case 2:
													return /introjs-donebutton/gi.test(a.className)
														? c(t._introCompleteCallback)
															? [
																	4,
																	t._introCompleteCallback.call(
																		t,
																		t._currentStep,
																		"done",
																	),
																]
															: [3, 4]
														: [3, 6];
												case 3:
													e.sent(), (e.label = 4);
												case 4:
													return [4, et(t, t._targetElement)];
												case 5:
													e.sent(), (e.label = 6);
												case 6:
													return [2];
											}
										});
									});
								}),
								b(a),
								(a.innerHTML = t._options.nextLabel),
								((l = x("a")).onclick = function () {
									return e(W, void 0, void 0, function () {
										return n(this, function (e) {
											switch (e.label) {
												case 0:
													return t._currentStep > 0 ? [4, H(t)] : [3, 2];
												case 1:
													e.sent(), (e.label = 2);
												case 2:
													return [2];
											}
										});
									});
								}),
								b(l),
								(l.innerHTML = t._options.prevLabel),
								b((d = x("a", { className: "introjs-skipbutton" }))),
								(d.innerHTML = t._options.skipLabel),
								(d.onclick = function () {
									return e(W, void 0, void 0, function () {
										return n(this, function (e) {
											switch (e.label) {
												case 0:
													return t._introItems.length - 1 === t._currentStep &&
														c(t._introCompleteCallback)
														? [
																4,
																t._introCompleteCallback.call(
																	t,
																	t._currentStep,
																	"skip",
																),
															]
														: [3, 2];
												case 1:
													e.sent(), (e.label = 2);
												case 2:
													return c(t._introSkipCallback)
														? [4, t._introSkipCallback.call(t, t._currentStep)]
														: [3, 4];
												case 3:
													e.sent(), (e.label = 4);
												case 4:
													return [4, et(t, t._targetElement)];
												case 5:
													return e.sent(), [2];
											}
										});
									});
								}),
								R.appendChild(d),
								t._introItems.length > 1 && M.appendChild(l),
								M.appendChild(a),
								P.appendChild(M),
								j(t, o, P, L),
								f(
									t._options.scrollToElement,
									o.scrollTo,
									t._options.scrollPadding,
									o.element,
									P,
								)),
						(G = t._targetElement.querySelector(
							".introjs-disableInteraction",
						)) &&
							G.parentNode &&
							G.parentNode.removeChild(G),
						o.disableInteraction &&
							(function (t, e) {
								var n = document.querySelector(".introjs-disableInteraction");
								null === n &&
									((n = x("div", { className: "introjs-disableInteraction" })),
									t._targetElement.appendChild(n)),
									w(t, e, n);
							})(t, o),
						0 === t._currentStep && t._introItems.length > 1
							? (null != a &&
									((a.className = "".concat(
										t._options.buttonClass,
										" introjs-nextbutton",
									)),
									(a.innerHTML = t._options.nextLabel)),
								!0 === t._options.hidePrev
									? (null != l &&
											(l.className = "".concat(
												t._options.buttonClass,
												" introjs-prevbutton introjs-hidden",
											)),
										null != a && u(a, "introjs-fullbutton"))
									: null != l &&
										(l.className = "".concat(
											t._options.buttonClass,
											" introjs-prevbutton introjs-disabled",
										)))
							: t._introItems.length - 1 === t._currentStep ||
									1 === t._introItems.length
								? (null != l &&
										(l.className = "".concat(
											t._options.buttonClass,
											" introjs-prevbutton",
										)),
									!0 === t._options.hideNext
										? (null != a &&
												(a.className = "".concat(
													t._options.buttonClass,
													" introjs-nextbutton introjs-hidden",
												)),
											null != l && u(l, "introjs-fullbutton"))
										: null != a &&
											(!0 === t._options.nextToDone
												? ((a.innerHTML = t._options.doneLabel),
													u(
														a,
														"".concat(
															t._options.buttonClass,
															" introjs-nextbutton introjs-donebutton",
														),
													))
												: (a.className = "".concat(
														t._options.buttonClass,
														" introjs-nextbutton introjs-disabled",
													))))
								: (null != l &&
										(l.className = "".concat(
											t._options.buttonClass,
											" introjs-prevbutton",
										)),
									null != a &&
										((a.className = "".concat(
											t._options.buttonClass,
											" introjs-nextbutton",
										)),
										(a.innerHTML = t._options.nextLabel))),
						null != l && l.setAttribute("role", "button"),
						null != a && a.setAttribute("role", "button"),
						null != d && d.setAttribute("role", "button"),
						null != a && a.focus(),
						(function (t) {
							u(t, "introjs-showElement");
							var e = p(t, "position");
							"absolute" !== e &&
								"relative" !== e &&
								"sticky" !== e &&
								"fixed" !== e &&
								u(t, "introjs-relativePosition");
						})(o.element),
						c(t._introAfterChangeCallback)
							? [4, t._introAfterChangeCallback.call(t, o.element)]
							: [3, 4]
					);
				case 3:
					Q.sent(), (Q.label = 4);
				case 4:
					return [2];
			}
		});
	});
}
function P(t, o) {
	return e(this, void 0, void 0, function () {
		return n(this, function (e) {
			switch (e.label) {
				case 0:
					return (
						(t._currentStep = o - 2),
						void 0 === t._introItems ? [3, 2] : [4, B(t)]
					);
				case 1:
					e.sent(), (e.label = 2);
				case 2:
					return [2];
			}
		});
	});
}
function q(t, o) {
	return e(this, void 0, void 0, function () {
		return n(this, function (e) {
			switch (e.label) {
				case 0:
					return (
						(t._currentStepNumber = o),
						void 0 === t._introItems ? [3, 2] : [4, B(t)]
					);
				case 1:
					e.sent(), (e.label = 2);
				case 2:
					return [2];
			}
		});
	});
}
function B(t) {
	return e(this, void 0, void 0, function () {
		var e, o, i;
		return n(this, function (n) {
			switch (n.label) {
				case 0:
					if (((t._direction = "forward"), void 0 !== t._currentStepNumber))
						for (e = 0; e < t._introItems.length; e++)
							t._introItems[e].step === t._currentStepNumber &&
								((t._currentStep = e - 1), (t._currentStepNumber = void 0));
					return (
						-1 === t._currentStep ? (t._currentStep = 0) : ++t._currentStep,
						(o = t._introItems[t._currentStep]),
						(i = !0),
						c(t._introBeforeChangeCallback)
							? [
									4,
									t._introBeforeChangeCallback.call(
										t,
										o && o.element,
										t._currentStep,
										t._direction,
									),
								]
							: [3, 2]
					);
				case 1:
					(i = n.sent()), (n.label = 2);
				case 2:
					return !1 === i
						? (--t._currentStep, [2, !1])
						: t._introItems.length <= t._currentStep
							? c(t._introCompleteCallback)
								? [4, t._introCompleteCallback.call(t, t._currentStep, "end")]
								: [3, 4]
							: [3, 6];
				case 3:
					n.sent(), (n.label = 4);
				case 4:
					return [4, et(t, t._targetElement)];
				case 5:
					return n.sent(), [2, !1];
				case 6:
					return [4, L(t, o)];
				case 7:
					return n.sent(), [2, !0];
			}
		});
	});
}
function H(t) {
	return e(this, void 0, void 0, function () {
		var e, o;
		return n(this, function (n) {
			switch (n.label) {
				case 0:
					return (
						(t._direction = "backward"),
						t._currentStep <= 0
							? [2, !1]
							: (--t._currentStep,
								(e = t._introItems[t._currentStep]),
								(o = !0),
								c(t._introBeforeChangeCallback)
									? [
											4,
											t._introBeforeChangeCallback.call(
												t,
												e && e.element,
												t._currentStep,
												t._direction,
											),
										]
									: [3, 2])
					);
				case 1:
					(o = n.sent()), (n.label = 2);
				case 2:
					return !1 === o ? (++t._currentStep, [2, !1]) : [4, L(t, e)];
				case 3:
					return n.sent(), [2, !0];
			}
		});
	});
}
function R(t, o) {
	return e(this, void 0, void 0, function () {
		var e, i;
		return n(this, function (n) {
			switch (n.label) {
				case 0:
					return (
						null === (e = void 0 === o.code ? o.which : o.code) &&
							(e = null === o.charCode ? o.keyCode : o.charCode),
						("Escape" !== e && 27 !== e) || !0 !== t._options.exitOnEsc
							? [3, 2]
							: [4, et(t, t._targetElement)]
					);
				case 1:
					return n.sent(), [3, 16];
				case 2:
					return "ArrowLeft" !== e && 37 !== e ? [3, 4] : [4, H(t)];
				case 3:
					return n.sent(), [3, 16];
				case 4:
					return "ArrowRight" !== e && 39 !== e ? [3, 6] : [4, B(t)];
				case 5:
					return n.sent(), [3, 16];
				case 6:
					return "Enter" !== e && "NumpadEnter" !== e && 13 !== e
						? [3, 16]
						: (i = o.target || o.srcElement) &&
								i.className.match("introjs-prevbutton")
							? [4, H(t)]
							: [3, 8];
				case 7:
					return n.sent(), [3, 15];
				case 8:
					return i && i.className.match("introjs-skipbutton")
						? t._introItems.length - 1 === t._currentStep &&
							c(t._introCompleteCallback)
							? [4, t._introCompleteCallback.call(t, t._currentStep, "skip")]
							: [3, 10]
						: [3, 12];
				case 9:
					n.sent(), (n.label = 10);
				case 10:
					return [4, et(t, t._targetElement)];
				case 11:
					return n.sent(), [3, 15];
				case 12:
					return i && i.getAttribute("data-step-number")
						? (i.click(), [3, 15])
						: [3, 13];
				case 13:
					return [4, B(t)];
				case 14:
					n.sent(), (n.label = 15);
				case 15:
					o.preventDefault ? o.preventDefault() : (o.returnValue = !1),
						(n.label = 16);
				case 16:
					return [2];
			}
		});
	});
}
function O(e) {
	if (null === e || "object" !== t(e) || "nodeType" in e) return e;
	var n = {};
	for (var o in e)
		"jQuery" in window && e[o] instanceof window.jQuery
			? (n[o] = e[o])
			: (n[o] = O(e[o]));
	return n;
}
function M(t) {
	var e = document.querySelector(".introjs-hints");
	return e ? Array.from(e.querySelectorAll(t)) : [];
}
function D(t, o) {
	return e(this, void 0, void 0, function () {
		var e;
		return n(this, function (n) {
			switch (n.label) {
				case 0:
					return (
						(e = M('.introjs-hint[data-step="'.concat(o, '"]'))[0]),
						Y(),
						e && u(e, "introjs-hidehint"),
						c(t._hintCloseCallback)
							? [4, t._hintCloseCallback.call(t, o)]
							: [3, 2]
					);
				case 1:
					n.sent(), (n.label = 2);
				case 2:
					return [2];
			}
		});
	});
}
function F(t) {
	return e(this, void 0, void 0, function () {
		var e, o, i, r, s;
		return n(this, function (n) {
			switch (n.label) {
				case 0:
					(e = M(".introjs-hint")), (o = 0), (i = e), (n.label = 1);
				case 1:
					return o < i.length
						? ((r = i[o]),
							(s = r.getAttribute("data-step"))
								? [4, D(t, parseInt(s, 10))]
								: [3, 3])
						: [3, 4];
				case 2:
					n.sent(), (n.label = 3);
				case 3:
					return o++, [3, 1];
				case 4:
					return [2];
			}
		});
	});
}
function V(t) {
	return e(this, void 0, void 0, function () {
		var e, o, i, r, s;
		return n(this, function (n) {
			switch (n.label) {
				case 0:
					if (!(e = M(".introjs-hint")) || !e.length) return [3, 1];
					for (o = 0, i = e; o < i.length; o++)
						(r = i[o]), (s = r.getAttribute("data-step")) && z(parseInt(s, 10));
					return [3, 3];
				case 1:
					return [4, $(t, t._targetElement)];
				case 2:
					n.sent(), (n.label = 3);
				case 3:
					return [2];
			}
		});
	});
}
function z(t) {
	var e = M('.introjs-hint[data-step="'.concat(t, '"]'))[0];
	e && v(e, /introjs-hidehint/g);
}
function G(t) {
	var e = M('.introjs-hint[data-step="'.concat(t, '"]'))[0];
	e && e.parentNode && e.parentNode.removeChild(e);
}
function W(t) {
	return e(this, void 0, void 0, function () {
		var e, o, i, r, s, a, p;
		return n(this, function (n) {
			switch (n.label) {
				case 0:
					for (
						null === (e = document.querySelector(".introjs-hints")) &&
							(e = x("div", { className: "introjs-hints" })),
							o = function (e) {
								return function (n) {
									var o = n || window.event;
									o && o.stopPropagation && o.stopPropagation(),
										o && null !== o.cancelBubble && (o.cancelBubble = !0),
										X(t, e);
								};
							},
							i = 0;
						i < t._hintItems.length;
						i++
					) {
						if (
							((r = t._hintItems[i]),
							document.querySelector(
								'.introjs-hint[data-step="'.concat(i, '"]'),
							))
						)
							return [2];
						b((s = x("a", { className: "introjs-hint" }))),
							(s.onclick = o(i)),
							r.hintAnimation || u(s, "introjs-hint-no-anim"),
							m(r.element) && u(s, "introjs-fixedhint"),
							(a = x("div", { className: "introjs-hint-dot" })),
							(p = x("div", { className: "introjs-hint-pulse" })),
							s.appendChild(a),
							s.appendChild(p),
							s.setAttribute("data-step", i.toString()),
							(r.hintTargetElement = r.element),
							(r.element = s),
							Q(r.hintPosition, s, r.hintTargetElement),
							e.appendChild(s);
					}
					return (
						document.body.appendChild(e),
						c(t._hintsAddedCallback)
							? [4, t._hintsAddedCallback.call(t)]
							: [3, 2]
					);
				case 1:
					n.sent(), (n.label = 2);
				case 2:
					return (
						t._options.hintAutoRefreshInterval >= 0 &&
							((t._hintsAutoRefreshFunction =
								((h = function () {
									return U(t);
								}),
								(d = t._options.hintAutoRefreshInterval),
								function () {
									for (var t = [], e = 0; e < arguments.length; e++)
										t[e] = arguments[e];
									window.clearTimeout(f),
										(f = window.setTimeout(function () {
											h(t);
										}, d));
								})),
							l.on(window, "scroll", t._hintsAutoRefreshFunction, t, !0)),
						[2]
					);
			}
			var h, d, f;
		});
	});
}
function Q(t, e, n) {
	if (void 0 !== n) {
		var o = g(n),
			i = 20,
			r = 20;
		switch (t) {
			default:
			case "top-left":
				(e.style.left = "".concat(o.left, "px")),
					(e.style.top = "".concat(o.top, "px"));
				break;
			case "top-right":
				(e.style.left = "".concat(o.left + o.width - i, "px")),
					(e.style.top = "".concat(o.top, "px"));
				break;
			case "bottom-left":
				(e.style.left = "".concat(o.left, "px")),
					(e.style.top = "".concat(o.top + o.height - r, "px"));
				break;
			case "bottom-right":
				(e.style.left = "".concat(o.left + o.width - i, "px")),
					(e.style.top = "".concat(o.top + o.height - r, "px"));
				break;
			case "middle-left":
				(e.style.left = "".concat(o.left, "px")),
					(e.style.top = "".concat(o.top + (o.height - r) / 2, "px"));
				break;
			case "middle-right":
				(e.style.left = "".concat(o.left + o.width - i, "px")),
					(e.style.top = "".concat(o.top + (o.height - r) / 2, "px"));
				break;
			case "middle-middle":
				(e.style.left = "".concat(o.left + (o.width - i) / 2, "px")),
					(e.style.top = "".concat(o.top + (o.height - r) / 2, "px"));
				break;
			case "bottom-middle":
				(e.style.left = "".concat(o.left + (o.width - i) / 2, "px")),
					(e.style.top = "".concat(o.top + o.height - r, "px"));
				break;
			case "top-middle":
				(e.style.left = "".concat(o.left + (o.width - i) / 2, "px")),
					(e.style.top = "".concat(o.top, "px"));
		}
	}
}
function X(t, o) {
	return e(this, void 0, void 0, function () {
		var e, i, r, s, a, l, u, p, h, d, f;
		return n(this, function (n) {
			switch (n.label) {
				case 0:
					return (
						(e = document.querySelector(
							'.introjs-hint[data-step="'.concat(o, '"]'),
						)),
						(i = t._hintItems[o]),
						c(t._hintClickCallback)
							? [4, t._hintClickCallback.call(t, e, i, o)]
							: [3, 2]
					);
				case 1:
					n.sent(), (n.label = 2);
				case 2:
					return (
						(void 0 !== (r = Y()) && parseInt(r, 10) === o) ||
							((s = x("div", { className: "introjs-tooltip" })),
							(a = x("div")),
							(l = x("div")),
							(u = x("div")),
							(s.onclick = function (t) {
								t.stopPropagation ? t.stopPropagation() : (t.cancelBubble = !0);
							}),
							(a.className = "introjs-tooltiptext"),
							((p = x("p")).innerHTML = i.hint || ""),
							a.appendChild(p),
							t._options.hintShowButton &&
								(((h = x("a")).className = t._options.buttonClass),
								h.setAttribute("role", "button"),
								(h.innerHTML = t._options.hintButtonLabel),
								(h.onclick = function () {
									return D(t, o);
								}),
								a.appendChild(h)),
							(l.className = "introjs-arrow"),
							s.appendChild(l),
							s.appendChild(a),
							(d = e.getAttribute("data-step") || ""),
							(t._currentStep = parseInt(d, 10)),
							(f = t._hintItems[t._currentStep]),
							(u.className =
								"introjs-tooltipReferenceLayer introjs-hintReference"),
							u.setAttribute("data-step", d),
							w(t, f, u),
							u.appendChild(s),
							document.body.appendChild(u),
							j(t, f, s, l, !0)),
						[2]
					);
			}
		});
	});
}
function Y() {
	var t = document.querySelector(".introjs-hintReference");
	if (t && t.parentNode) {
		var e = t.getAttribute("data-step");
		if (!e) return;
		return t.parentNode.removeChild(t), e;
	}
}
function $(t, o) {
	return e(this, void 0, void 0, function () {
		var e, i, r, s, a, c, u, p, h, d;
		return n(this, function (n) {
			switch (n.label) {
				case 0:
					if (
						((t._hintItems = []),
						t._options.hints && t._options.hints.length > 0)
					)
						for (e = 0, i = t._options.hints; e < i.length; e++)
							(r = i[e]),
								"string" == typeof (s = O(r)).element &&
									(s.element = document.querySelector(s.element)),
								(s.hintPosition = s.hintPosition || t._options.hintPosition),
								(s.hintAnimation = s.hintAnimation || t._options.hintAnimation),
								null !== s.element && t._hintItems.push(s);
					else {
						if (
							!(a = Array.from(o.querySelectorAll("*[data-hint]"))) ||
							!a.length
						)
							return [2, !1];
						for (c = 0, u = a; c < u.length; c++)
							(p = u[c]),
								(h = p.getAttribute("data-hint-animation")),
								(d = t._options.hintAnimation),
								h && (d = "true" === h),
								t._hintItems.push({
									element: p,
									hint: p.getAttribute("data-hint") || "",
									hintPosition:
										p.getAttribute("data-hint-position") ||
										t._options.hintPosition,
									hintAnimation: d,
									tooltipClass: p.getAttribute("data-tooltip-class") || void 0,
									position:
										p.getAttribute("data-position") ||
										t._options.tooltipPosition,
								});
					}
					return [4, W(t)];
				case 1:
					return (
						n.sent(),
						l.on(document, "click", Y, t, !1),
						l.on(window, "resize", U, t, !0),
						[2, !0]
					);
			}
		});
	});
}
function U(t) {
	for (var e = 0, n = t._hintItems; e < n.length; e++) {
		var o = n[e],
			i = o.hintTargetElement;
		Q(o.hintPosition, o.element, i);
	}
}
function Z(t, e) {
	var n = Array.from(e.querySelectorAll("*[data-intro]")),
		o = [];
	if (t._options.steps && t._options.steps.length)
		for (var i = 0, r = t._options.steps; i < r.length; i++) {
			var s = O((h = r[i]));
			if (
				((s.step = o.length + 1),
				(s.title = s.title || ""),
				"string" == typeof s.element &&
					(s.element = document.querySelector(s.element) || void 0),
				void 0 === s.element || null === s.element)
			) {
				var a = document.querySelector(".introjsFloatingElement");
				null === a &&
					((a = x("div", { className: "introjsFloatingElement" })),
					document.body.appendChild(a)),
					(s.element = a),
					(s.position = "floating");
			}
			(s.position = s.position || t._options.tooltipPosition),
				(s.scrollTo = s.scrollTo || t._options.scrollTo),
				void 0 === s.disableInteraction &&
					(s.disableInteraction = t._options.disableInteraction),
				null !== s.element && o.push(s);
		}
	else {
		var l = void 0;
		if (n.length < 1) return [];
		for (var c = 0, u = n; c < u.length; c++) {
			var p = u[c];
			if (
				(!t._options.group ||
					p.getAttribute("data-intro-group") === t._options.group) &&
				"none" !== p.style.display
			) {
				var h = parseInt(p.getAttribute("data-step") || "", 10);
				(l = t._options.disableInteraction),
					p.hasAttribute("data-disable-interaction") &&
						(l = !!p.getAttribute("data-disable-interaction")),
					h > 0 &&
						(o[h - 1] = {
							step: h,
							element: p,
							title: p.getAttribute("data-title") || "",
							intro: p.getAttribute("data-intro") || "",
							tooltipClass: p.getAttribute("data-tooltip-class") || void 0,
							highlightClass: p.getAttribute("data-highlight-class") || void 0,
							position:
								p.getAttribute("data-position") || t._options.tooltipPosition,
							scrollTo: p.getAttribute("data-scroll-to") || t._options.scrollTo,
							disableInteraction: l,
						});
			}
		}
		for (var d = 0, f = 0, b = n; f < b.length; f++) {
			p = b[f];
			if (
				(!t._options.group ||
					p.getAttribute("data-intro-group") === t._options.group) &&
				null === p.getAttribute("data-step")
			) {
				for (; void 0 !== o[d]; ) d++;
				(l = p.hasAttribute("data-disable-interaction")
					? !!p.getAttribute("data-disable-interaction")
					: t._options.disableInteraction),
					(o[d] = {
						element: p,
						title: p.getAttribute("data-title") || "",
						intro: p.getAttribute("data-intro") || "",
						step: d + 1,
						tooltipClass: p.getAttribute("data-tooltip-class") || void 0,
						highlightClass: p.getAttribute("data-highlight-class") || void 0,
						position:
							p.getAttribute("data-position") || t._options.tooltipPosition,
						scrollTo: p.getAttribute("data-scroll-to") || t._options.scrollTo,
						disableInteraction: l,
					});
			}
		}
	}
	for (var m = [], g = 0; g < o.length; g++) o[g] && m.push(o[g]);
	return (
		(o = m).sort(function (t, e) {
			return t.step - e.step;
		}),
		o
	);
}
function J(t, e) {
	var n = t._currentStep;
	if (null != n && -1 != n) {
		var o = t._introItems[n],
			i = document.querySelector(".introjs-tooltipReferenceLayer"),
			r = document.querySelector(".introjs-helperLayer"),
			s = document.querySelector(".introjs-disableInteraction");
		w(t, o, r),
			w(t, o, i),
			w(t, o, s),
			e &&
				((t._introItems = Z(t, t._targetElement)),
				(function (t, e) {
					if (t._options.showBullets) {
						var n = document.querySelector(".introjs-bullets");
						n && n.parentNode && n.parentNode.replaceChild(T(t, e), n);
					}
				})(t, o),
				I(i, n, t._introItems.length));
		var a = document.querySelector(".introjs-arrow"),
			l = document.querySelector(".introjs-tooltip");
		return l && a && j(t, t._introItems[n], l, a), U(t), t;
	}
}
function K(t) {
	J(t);
}
function tt(t, e) {
	if ((void 0 === e && (e = !1), t && t.parentElement)) {
		var n = t.parentElement;
		e
			? (y(t, { opacity: "0" }),
				window.setTimeout(function () {
					try {
						n.removeChild(t);
					} catch (t) {}
				}, 500))
			: n.removeChild(t);
	}
}
function et(t, o, i) {
	return (
		void 0 === i && (i = !1),
		e(this, void 0, void 0, function () {
			var e, r, s, a;
			return n(this, function (n) {
				switch (n.label) {
					case 0:
						return (
							(e = !0),
							void 0 === t._introBeforeExitCallback
								? [3, 2]
								: [4, t._introBeforeExitCallback.call(t, o)]
						);
					case 1:
						(e = n.sent()), (n.label = 2);
					case 2:
						if (!i && !1 === e) return [2];
						if (
							(r = Array.from(o.querySelectorAll(".introjs-overlay"))) &&
							r.length
						)
							for (s = 0, a = r; s < a.length; s++) tt(a[s]);
						return (
							tt(o.querySelector(".introjs-helperLayer"), !0),
							tt(o.querySelector(".introjs-tooltipReferenceLayer")),
							tt(o.querySelector(".introjs-disableInteraction")),
							tt(document.querySelector(".introjsFloatingElement")),
							A(),
							l.off(window, "keydown", R, t, !0),
							l.off(window, "resize", K, t, !0),
							c(t._introExitCallback)
								? [4, t._introExitCallback.call(t)]
								: [3, 4]
						);
					case 3:
						n.sent(), (n.label = 4);
					case 4:
						return (t._currentStep = -1), [2];
				}
			});
		})
	);
}
function nt(t, o) {
	return e(this, void 0, void 0, function () {
		var i;
		return n(this, function (r) {
			switch (r.label) {
				case 0:
					return t.isActive()
						? c(t._introStartCallback)
							? [4, t._introStartCallback.call(t, o)]
							: [3, 2]
						: [2, !1];
				case 1:
					r.sent(), (r.label = 2);
				case 2:
					return 0 === (i = Z(t, o)).length
						? [2, !1]
						: ((t._introItems = i),
							(function (t, o) {
								var i = this,
									r = x("div", { className: "introjs-overlay" });
								y(r, {
									top: 0,
									bottom: 0,
									left: 0,
									right: 0,
									position: "fixed",
								}),
									o.appendChild(r),
									!0 === t._options.exitOnOverlayClick &&
										(y(r, { cursor: "pointer" }),
										(r.onclick = function () {
											return e(i, void 0, void 0, function () {
												return n(this, function (e) {
													switch (e.label) {
														case 0:
															return [4, et(t, o)];
														case 1:
															return e.sent(), [2];
													}
												});
											});
										}));
							})(t, o),
							[4, B(t)]);
				case 3:
					r.sent(),
						o.addEventListener,
						t._options.keyboardNavigation && l.on(window, "keydown", R, t, !0),
						l.on(window, "resize", K, t, !0),
						(r.label = 4);
				case 4:
					return [2, !1];
			}
		});
	});
}
function ot(t, e, n) {
	return (t[e] = n), t;
}
var it = (function () {
		function t(t) {
			(this._currentStep = -1),
				(this._introItems = []),
				(this._hintItems = []),
				(this._targetElement = t),
				(this._options = {
					steps: [],
					hints: [],
					isActive: !0,
					nextLabel: "Next",
					prevLabel: "Back",
					skipLabel: "×",
					doneLabel: "Done",
					hidePrev: !1,
					hideNext: !1,
					nextToDone: !0,
					tooltipPosition: "bottom",
					tooltipClass: "",
					group: "",
					highlightClass: "",
					exitOnEsc: !0,
					exitOnOverlayClick: !0,
					showStepNumbers: !1,
					stepNumbersOfLabel: "of",
					keyboardNavigation: !0,
					showButtons: !0,
					showBullets: !0,
					showProgress: !1,
					scrollToElement: !0,
					scrollTo: "element",
					scrollPadding: 30,
					overlayOpacity: 0.5,
					autoPosition: !0,
					positionPrecedence: ["bottom", "top", "right", "left"],
					disableInteraction: !1,
					dontShowAgain: !1,
					dontShowAgainLabel: "Don't show this again",
					dontShowAgainCookie: "introjs-dontShowAgain",
					dontShowAgainCookieDays: 365,
					helperElementPadding: 10,
					hintPosition: "top-middle",
					hintButtonLabel: "Got it",
					hintShowButton: !0,
					hintAutoRefreshInterval: 10,
					hintAnimation: !0,
					buttonClass: "introjs-button",
					progressBarAdditionalClass: !1,
				});
		}
		return (
			(t.prototype.isActive = function () {
				return (
					(!this._options.dontShowAgain ||
						"" === (t = i(this._options.dontShowAgainCookie)) ||
						"true" !== t) &&
					this._options.isActive
				);
				var t;
			}),
			(t.prototype.clone = function () {
				return new t(this._targetElement);
			}),
			(t.prototype.setOption = function (t, e) {
				return (this._options = ot(this._options, t, e)), this;
			}),
			(t.prototype.setOptions = function (t) {
				return (
					(this._options = (function (t, e) {
						for (var n = 0, o = Object.entries(e); n < o.length; n++) {
							var i = o[n];
							t = ot(t, i[0], i[1]);
						}
						return t;
					})(this._options, t)),
					this
				);
			}),
			(t.prototype.start = function () {
				return e(this, void 0, void 0, function () {
					return n(this, function (t) {
						switch (t.label) {
							case 0:
								return [4, nt(this, this._targetElement)];
							case 1:
								return t.sent(), [2, this];
						}
					});
				});
			}),
			(t.prototype.goToStep = function (t) {
				return e(this, void 0, void 0, function () {
					return n(this, function (e) {
						switch (e.label) {
							case 0:
								return [4, P(this, t)];
							case 1:
								return e.sent(), [2, this];
						}
					});
				});
			}),
			(t.prototype.addStep = function (t) {
				return (
					this._options.steps || (this._options.steps = []),
					this._options.steps.push(t),
					this
				);
			}),
			(t.prototype.addSteps = function (t) {
				if (!t.length) return this;
				for (var e = 0; e < t.length; e++) this.addStep(t[e]);
				return this;
			}),
			(t.prototype.goToStepNumber = function (t) {
				return e(this, void 0, void 0, function () {
					return n(this, function (e) {
						switch (e.label) {
							case 0:
								return [4, q(this, t)];
							case 1:
								return e.sent(), [2, this];
						}
					});
				});
			}),
			(t.prototype.nextStep = function () {
				return e(this, void 0, void 0, function () {
					return n(this, function (t) {
						switch (t.label) {
							case 0:
								return [4, B(this)];
							case 1:
								return t.sent(), [2, this];
						}
					});
				});
			}),
			(t.prototype.previousStep = function () {
				return e(this, void 0, void 0, function () {
					return n(this, function (t) {
						switch (t.label) {
							case 0:
								return [4, H(this)];
							case 1:
								return t.sent(), [2, this];
						}
					});
				});
			}),
			(t.prototype.currentStep = function () {
				return this._currentStep;
			}),
			(t.prototype.exit = function (t) {
				return e(this, void 0, void 0, function () {
					return n(this, function (e) {
						switch (e.label) {
							case 0:
								return [4, et(this, this._targetElement, t)];
							case 1:
								return e.sent(), [2, this];
						}
					});
				});
			}),
			(t.prototype.refresh = function (t) {
				return J(this, t), this;
			}),
			(t.prototype.setDontShowAgain = function (t) {
				return r(this, t), this;
			}),
			(t.prototype.onbeforechange = function (t) {
				if (!c(t))
					throw new Error(
						"Provided callback for onbeforechange was not a function",
					);
				return (this._introBeforeChangeCallback = t), this;
			}),
			(t.prototype.onchange = function (t) {
				if (!c(t))
					throw new Error("Provided callback for onchange was not a function.");
				return (this._introChangeCallback = t), this;
			}),
			(t.prototype.onafterchange = function (t) {
				if (!c(t))
					throw new Error(
						"Provided callback for onafterchange was not a function",
					);
				return (this._introAfterChangeCallback = t), this;
			}),
			(t.prototype.oncomplete = function (t) {
				if (!c(t))
					throw new Error(
						"Provided callback for oncomplete was not a function.",
					);
				return (this._introCompleteCallback = t), this;
			}),
			(t.prototype.onhintsadded = function (t) {
				if (!c(t))
					throw new Error(
						"Provided callback for onhintsadded was not a function.",
					);
				return (this._hintsAddedCallback = t), this;
			}),
			(t.prototype.onhintclick = function (t) {
				if (!c(t))
					throw new Error(
						"Provided callback for onhintclick was not a function.",
					);
				return (this._hintClickCallback = t), this;
			}),
			(t.prototype.onhintclose = function (t) {
				if (!c(t))
					throw new Error(
						"Provided callback for onhintclose was not a function.",
					);
				return (this._hintCloseCallback = t), this;
			}),
			(t.prototype.onstart = function (t) {
				if (!c(t))
					throw new Error("Provided callback for onstart was not a function.");
				return (this._introStartCallback = t), this;
			}),
			(t.prototype.onexit = function (t) {
				if (!c(t))
					throw new Error("Provided callback for onexit was not a function.");
				return (this._introExitCallback = t), this;
			}),
			(t.prototype.onskip = function (t) {
				if (!c(t))
					throw new Error("Provided callback for onskip was not a function.");
				return (this._introSkipCallback = t), this;
			}),
			(t.prototype.onbeforeexit = function (t) {
				if (!c(t))
					throw new Error(
						"Provided callback for onbeforeexit was not a function.",
					);
				return (this._introBeforeExitCallback = t), this;
			}),
			(t.prototype.addHints = function () {
				return e(this, void 0, void 0, function () {
					return n(this, function (t) {
						switch (t.label) {
							case 0:
								return [4, $(this, this._targetElement)];
							case 1:
								return t.sent(), [2, this];
						}
					});
				});
			}),
			(t.prototype.hideHint = function (t) {
				return e(this, void 0, void 0, function () {
					return n(this, function (e) {
						switch (e.label) {
							case 0:
								return [4, D(this, t)];
							case 1:
								return e.sent(), [2, this];
						}
					});
				});
			}),
			(t.prototype.hideHints = function () {
				return e(this, void 0, void 0, function () {
					return n(this, function (t) {
						switch (t.label) {
							case 0:
								return [4, F(this)];
							case 1:
								return t.sent(), [2, this];
						}
					});
				});
			}),
			(t.prototype.showHint = function (t) {
				return z(t), this;
			}),
			(t.prototype.showHints = function () {
				return e(this, void 0, void 0, function () {
					return n(this, function (t) {
						switch (t.label) {
							case 0:
								return [4, V(this)];
							case 1:
								return t.sent(), [2, this];
						}
					});
				});
			}),
			(t.prototype.removeHints = function () {
				return (
					(function (t) {
						for (var e = 0, n = M(".introjs-hint"); e < n.length; e++) {
							var o = n[e].getAttribute("data-step");
							o && G(parseInt(o, 10));
						}
						l.off(document, "click", Y, t, !1),
							l.off(window, "resize", U, t, !0),
							t._hintsAutoRefreshFunction &&
								l.off(window, "scroll", t._hintsAutoRefreshFunction, t, !0);
					})(this),
					this
				);
			}),
			(t.prototype.removeHint = function (t) {
				return G(t), this;
			}),
			(t.prototype.showHintDialog = function (t) {
				return e(this, void 0, void 0, function () {
					return n(this, function (e) {
						switch (e.label) {
							case 0:
								return [4, X(this, t)];
							case 1:
								return e.sent(), [2, this];
						}
					});
				});
			}),
			t
		);
	})(),
	rt = function e(n) {
		var o;
		if ("object" === t(n)) o = new it(n);
		else if ("string" == typeof n) {
			var i = document.querySelector(n);
			if (!i) throw new Error("There is no element with given selector.");
			o = new it(i);
		} else o = new it(document.body);
		return (e.instances[a(o, "introjs-instance")] = o), o;
	};
(rt.version = "7.2.0"), (rt.instances = {});
export { rt as default };
//# sourceMappingURL=intro.module.js.map