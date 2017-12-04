"use strict";
var PassThrough = require("stream").PassThrough;
export default function bufferStream(opts) {
    opts = Object.assign({}, opts);
    var array = opts.array;
    var encoding = opts.encoding;
    var buffer = encoding === "buffer";
    var objectMode = false;
    if (array) {
        objectMode = !(encoding || buffer);
    }
    else {
        encoding = encoding || "utf8";
    }
    if (buffer) {
        encoding = null;
    }
    var len = 0;
    var ret = [];
    var stream = new PassThrough({ objectMode: objectMode });
    if (encoding) {
        stream.setEncoding(encoding);
    }
    stream.on("data", function (chunk) {
        ret.push(chunk);
        if (objectMode) {
            len = ret.length;
        }
        else {
            len += chunk.length;
        }
    });
    stream.getBufferedValue = function () {
        if (array) {
            return ret;
        }
        return buffer ? Buffer.concat(ret, len) : ret.join("");
    };
    stream.getBufferedLength = function () { return len; };
    return stream;
}
