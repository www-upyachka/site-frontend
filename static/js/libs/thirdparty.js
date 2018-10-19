function click_bb(Open, Close, aid = "text") {
	if (window.attachEvent && navigator.userAgent.indexOf('Opera') === -1) {
		var doc = document.getElementById(aid);
		doc.focus();
		sel = document.selection.createRange();
		sel.text = Open + sel.text + Close;
		doc.focus()
	} else {
		docs = document.getElementById(aid);
		var doc = docs[0] || docs;
		var ss = doc.scrollTop;
		sel1 = doc.value.substr(0, doc.selectionStart);
		sel2 = doc.value.substr(doc.selectionEnd);
		sel = doc.value.substr(doc.selectionStart, doc.selectionEnd - doc.selectionStart);
		var text = doc.firstChild;
		doc.value = sel1 + Open + sel + Close + sel2;
		selPos = Open.length + sel1.length + sel.length + Close.length;
		doc.setSelectionRange(sel1.length, selPos);
		doc.scrollTop = ss
	}
	return !1
}

function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"))
	return matches ? decodeURIComponent(matches[1]) : undefined
}

function setCookie(name, value, props) {
	props = props || {}
	var exp = props.expires
	if (typeof exp == "number" && exp) {
		var d = new Date()
		d.setTime(d.getTime() + exp * 1000)
		exp = props.expires = d
	}
	if (exp && exp.toUTCString) {
		props.expires = exp.toUTCString()
	}
	value = encodeURIComponent(value)
	var updatedCookie = name + "=" + value
	for (var propName in props) {
		updatedCookie += "; " + propName
		var propValue = props[propName]
		if (propValue !== !0) {
			updatedCookie += "=" + propValue
		}
	}
	document.cookie = updatedCookie
}

function deleteCookie(name) {
	setCookie(name, null, {
		expires: -1
	})
}

function function_exists(function_name) {
	if (typeof function_name == 'string') {
		return (typeof window[function_name] == 'function')
	} else {
		return (function_name instanceof Function)
	}
}

function empty(mixed_var) {
	return (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === !1 || (is_array(mixed_var) && mixed_var.length === 0))
}
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]]
			}
			o[this.name].push(this.value || '')
		} else {
			o[this.name] = this.value || ''
		}
	});
	return o
};

function arrayRand(array) {
	var rand = Math.floor(Math.random() * array.length);
	return array[rand]
}

function date(format, timestamp) {
	var a, jsdate = new Date(timestamp ? timestamp * 1000 : null);
	var pad = function(n, c) {
		if ((n = n + "").length < c) {
			return new Array(++c - n.length).join("0") + n
		} else {
			return n
		}
	};
	var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var txt_ordin = {
		1: "st",
		2: "nd",
		3: "rd",
		21: "st",
		22: "nd",
		23: "rd",
		31: "st"
	};
	var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var f = {
		d: function() {
			return pad(f.j(), 2)
		},
		D: function() {
			t = f.l();
			return t.substr(0, 3)
		},
		j: function() {
			return jsdate.getDate()
		},
		l: function() {
			return txt_weekdays[f.w()]
		},
		N: function() {
			return f.w() + 1
		},
		S: function() {
			return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'
		},
		w: function() {
			return jsdate.getDay()
		},
		z: function() {
			return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0
		},
		W: function() {
			var a = f.z(),
				b = 364 + f.L() - a;
			var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
			if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
				return 1
			} else {
				if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
					nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
					return date("W", Math.round(nd2.getTime() / 1000))
				} else {
					return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0)
				}
			}
		},
		F: function() {
			return txt_months[f.n()]
		},
		m: function() {
			return pad(f.n(), 2)
		},
		M: function() {
			t = f.F();
			return t.substr(0, 3)
		},
		n: function() {
			return jsdate.getMonth() + 1
		},
		t: function() {
			var n;
			if ((n = jsdate.getMonth() + 1) == 2) {
				return 28 + f.L()
			} else {
				if (n & 1 && n < 8 || !(n & 1) && n > 7) {
					return 31
				} else {
					return 30
				}
			}
		},
		L: function() {
			var y = f.Y();
			return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
		},
		Y: function() {
			return jsdate.getFullYear()
		},
		y: function() {
			return (jsdate.getFullYear() + "").slice(2)
		},
		a: function() {
			return jsdate.getHours() > 11 ? "pm" : "am"
		},
		A: function() {
			return f.a().toUpperCase()
		},
		B: function() {
			var off = (jsdate.getTimezoneOffset() + 60) * 60;
			var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
			var beat = Math.floor(theSeconds / 86.4);
			if (beat > 1000) beat -= 1000;
			if (beat < 0) beat += 1000;
			if ((String(beat)).length == 1) beat = "00" + beat;
			if ((String(beat)).length == 2) beat = "0" + beat;
			return beat
		},
		g: function() {
			return jsdate.getHours() % 12 || 12
		},
		G: function() {
			return jsdate.getHours()
		},
		h: function() {
			return pad(f.g(), 2)
		},
		H: function() {
			return pad(jsdate.getHours(), 2)
		},
		i: function() {
			return pad(jsdate.getMinutes(), 2)
		},
		s: function() {
			return pad(jsdate.getSeconds(), 2)
		},
		O: function() {
			var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
			if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
			else t = "+" + t;
			return t
		},
		P: function() {
			var O = f.O();
			return (O.substr(0, 3) + ":" + O.substr(3, 2))
		},
		c: function() {
			return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()
		},
		U: function() {
			return Math.round(jsdate.getTime() / 1000)
		}
	};
	return format.replace(/[\\]?([a-zA-Z])/g, function(t, s) {
		if (t != s) {
			ret = s
		} else if (f[s]) {
			ret = f[s]()
		} else {
			ret = s
		}
		return ret
	})
}