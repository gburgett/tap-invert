var Transform = require('stream').Transform
var Parser = require('tap-parser')

class InvertStream extends Transform {

  constructor(options) {
    super(options);
    this.lines = [];
    this.extra = [];

    this.parser = new Parser()
    this.parser.on('extra', this._onExtra.bind(this))
    this.parser.on('assert', this._onAssert.bind(this))
    this.parser.on('line', this._onLine.bind(this))
  }

  _transform(chunk, encoding, callback) {
    this.parser.write(chunk, encoding, callback)
  }

  _flush(callback) {
    this.lines.forEach((l) => this.push(l))
    this.lines = []
    this.extra.forEach((l) => this.push(l))
    this.extra = []
  }

  _onExtra(line) {
    // The most recent line was an extra - we need to hold that separately
    this.extra.push(line)
    this.lines.pop()
  }

  _onAssert() {
    // All the STDOUT lines that we grabbed before the assert now get appended
    this.lines.push(...this.extra)
    this.extra = []
  }

  _onLine(line) {
    this.lines.push(line)
  }
}

module.exports = InvertStream