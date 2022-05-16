const FollowCursor = (function (e) {
    var t = {};
    function r(n) {
        if (t[n]) return t[n].exports;
        var o = (t[n] = { i: n, l: !1, exports: {} });
        return e[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
    }
    return (
        (r.m = e),
        (r.c = t),
        (r.d = function (e, t, n) {
            r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
        }),
        (r.r = function (e) {
            'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(e, '__esModule', { value: !0 });
        }),
        (r.t = function (e, t) {
            if ((1 & t && (e = r(e)), 8 & t)) return e;
            if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
            var n = Object.create(null);
            if ((r.r(n), Object.defineProperty(n, 'default', { enumerable: !0, value: e }), 2 & t && 'string' != typeof e))
                for (var o in e)
                    r.d(
                        n,
                        o,
                        function (t) {
                            return e[t];
                        }.bind(null, o),
                    );
            return n;
        }),
        (r.n = function (e) {
            var t =
                e && e.__esModule
                    ? function () {
                          return e.default;
                      }
                    : function () {
                          return e;
                      };
            return r.d(t, 'a', t), t;
        }),
        (r.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
        }),
        (r.p = ''),
        r((r.s = 0))
    );
})([
    function (e, t, r) {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
        var n,
            o =
                Object.assign ||
                function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var r = arguments[t];
                        for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
                    }
                    return e;
                },
            i = function (e, t) {
                if (Array.isArray(e)) return e;
                if (Symbol.iterator in Object(e))
                    return (function (e, t) {
                        var r = [],
                            n = !0,
                            o = !1,
                            i = void 0;
                        try {
                            for (var a, u = e[Symbol.iterator](); !(n = (a = u.next()).done) && (r.push(a.value), !t || r.length !== t); n = !0);
                        } catch (e) {
                            (o = !0), (i = e);
                        } finally {
                            try {
                                !n && u.return && u.return();
                            } finally {
                                if (o) throw i;
                            }
                        }
                        return r;
                    })(e, t);
                throw new TypeError('Invalid attempt to destructure non-iterable instance');
            },
            a = r(1),
            u = (n = a) && n.__esModule ? n : { default: n };
        var l = {
            'pointer-events': 'none',
            'user-select': 'none',
            display: 'block',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            'border-radius': '100%',
            zIndex: 99999,
            '@keyframes pulse': {
                '0%': { transform: 'scale(0.8) translate(-50%, -50%)' },
                '50%': { transform: 'scale(1) translate(-50%, -50%)' },
                '100%': { transform: 'scale(0.8) translate(-50%, -50%)' },
            },
            '@media only screen and (max-width: 700px)': { '#cursor': { display: 'none' } },
        };
        t.default = function (e) {
            var t = e.pulse,
                r = void 0 !== t && t,
                n = e.size,
                c = void 0 === n ? 23 : n,
                s = e.hollow,
                f = void 0 !== s && s,
                d = e.color,
                p = void 0 === d ? 'lightblue' : d,
                v = e.opacity,
                y = void 0 === v ? 1 : v,
                b = e.easing,
                m = void 0 === b ? 'cubic-bezier(0.18, 0.89, 0.32, 1.28)' : b,
                h = e.duration,
                x = void 0 === h ? 0.4 : h,
                g = e.custom,
                O = void 0 !== g && g,
                j = (function (e, t) {
                    var r = {};
                    for (var n in e) t.indexOf(n) >= 0 || (Object.prototype.hasOwnProperty.call(e, n) && (r[n] = e[n]));
                    return r;
                })(e, ['pulse', 'size', 'hollow', 'color', 'opacity', 'easing', 'duration', 'custom']),
                w = (0, a.useState)(0),
                _ = i(w, 2),
                S = _[0],
                P = _[1],
                M = (0, a.useState)(0),
                z = i(M, 2),
                k = z[0],
                E = z[1];
            (0, a.useLayoutEffect)(function () {
                document.onmousemove = function (e) {
                    var t = e;
                    P(t.clientX), E(t.clientY);
                };
            });
            var T = o({}, l, {
                animation: r ? 'pulse 2s infinite' : null,
                'background-color': f ? 'transparent' : p,
                border: f ? '1px solid ' + p : null,
                opacity: y,
                width: c + 'px',
                height: c + 'px',
                top: k,
                left: S,
                'transition-timing-function': m,
                'transition-duration': x + 's',
            });
            return u.default.createElement('div', o({ id: 'cursor' }, j, { style: O ? null : T }));
        };
    },
    function (e, t) {
        e.exports = require('react');
    },
]);
export default FollowCursor;
