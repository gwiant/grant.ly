Function.prototype.bind = function (a) {
    var b = this,
        c = Array.prototype.slice.call(arguments, 1),
        d = function () {},
        e = function () {
            return b.apply(this instanceof d && a ? this : a, Array.prototype.concat.apply(c, arguments))
        };
    return d.prototype = e.prototype = b.prototype, e
};

var CustomEvent;

CustomEvent = function(event, params) {
  var evt;
  params = params || {
    bubbles: false,
    cancelable: false,
    detail: undefined
  };
  evt = document.createEvent("CustomEvent");
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
  return evt;
};

CustomEvent.prototype = window.Event.prototype;

window.CustomEvent = CustomEvent;