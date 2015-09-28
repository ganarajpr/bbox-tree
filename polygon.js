var segseg = require('segseg');
var isArray = function(a) {
    return Object.prototype.toString.call(a) === "[object Array]";
};
/*******/


function Vec2(x, y) {
  if (!(this instanceof Vec2)) {
    return new Vec2(x, y);
  }

  if (isArray(x)) {
    y = x[1];
    x = x[0];
  } else if('object' === typeof x && x) {
    y = x.y;
    x = x.x;
  }

  this.x = Vec2.clean(x || 0);
  this.y = Vec2.clean(y || 0);
}
Vec2.precision = 8;
var p = Math.pow(10, Vec2.precision);
Vec2.fromArray = function(array, ctor) {
    return new (ctor || Vec2)(array[0], array[1]);
  };

Vec2.clean = function(val) {
    if (isNaN(val)) {
      throw new Error('NaN detected');
    }

    if (!isFinite(val)) {
      throw new Error('Infinity detected');
    }

    if(Math.round(val) === val) {
      return val;
    }

    return Math.round(val * p)/p;
  };

  /*******/



function Polygon(points) {
    if (points instanceof Polygon) {
        return points;
    }

    if (!(this instanceof Polygon)) {
        return new Polygon(points);
    }

    if (!Array.isArray(points)) {
        points = (points) ? [points] : [];
    }

    this.points = points.map(function(point) {
        if (Array.isArray(point)) {
            return Vec2.fromArray(point);
        } else if (!(point instanceof Vec2)) {
            if (typeof point.x !== 'undefined' &&
                typeof point.y !== 'undefined') {
                return Vec2(point.x, point.y);
            }
        } else {
            return point;
        }
    });
}

Polygon.prototype = {
    each: function(fn) {
        for (var i = 0; i < this.points.length; i++) {
            if (fn.call(this, this.point(i - 1), this.point(i), this.point(i + 1), i) === false) {
                break;
            }
        }
        return this;
    },
    line: function(idx) {
        return [this.point(idx), this.point(idx + 1)];
    },
    point: function(idx) {
        var el = idx % (this.points.length);
        if (el < 0) {
            el = this.points.length + el;
        }

        return this.points[el];
    },
    containsPoint: function(point) {
        var c = false;

        this.each(function(prev, current, next) {
            ((prev.y <= point.y && point.y < current.y) || (current.y <= point.y && point.y < prev.y)) && (point.x < (current.x - prev.x) * (point.y - prev.y) / (current.y - prev.y) + prev.x) && (c = !c);
        }.bind(this));

        return c;
    },

    containsPolygon: function(subject) {
        if (isArray(subject)) {
            subject = new Polygon(subject);
        }

        for (var i = 0; i < subject.points.length; i++) {
            if (!this.containsPoint(subject.points[i])) {
                return false;
            }
        }

        for (var i = 0; i < this.points.length; i++) {
            var outer = this.line(i);
            for (var j = 0; j < subject.points.length; j++) {
                var inner = subject.line(j);

                var isect = segseg(outer[0], outer[1], inner[0], inner[1]);
                if (isect && isect !== true) {
                    return false;
                }
            }
        }

        return true;
    }
};

module.exports = Polygon;
