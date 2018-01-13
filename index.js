#!/usr/bin/env node

/**
 * Consumer for TAP compliant output
 *
 * Usage:
 * a) producerApp | tap-pessimist
 * b) cat log.txt | tap-pessimist
 */
var InvertStream = require('./src/parser')

process.stdin
  .pipe(new InvertStream())
  .pipe(process.stdout);
