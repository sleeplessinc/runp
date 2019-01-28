
/*
Copyright 2017 Sleepless Software Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 
*/


// Creates a runp object and returns it
// The runp object contains 2 functions, add() and run()
function runp() {

	var o = {};
	var q = [];

	// Adds a function to the runp object
	var add = function add() {
		let args = Array.prototype.slice.call(arguments);
		let f = args.shift();
		q.push(f);
		return o;
	};

	// Starts all the functions at once
	var run = function(cb) {
		var errors = [];
		var results = [];
		var num_done = 0;
		q.forEach(function(f, i) {
			// Call each function with a callback and an index # (0-based)
			// The callback expect err, and result arguments.
			f(function(e, r) {
				// One of the functions is finished
				errors[i] = e || null;
				results[i] = r || null;
				num_done += 1;
				// when all finished, call the cb that was passed into run() with 
				// a list of errors and results.
				if(num_done == q.length) {
					if(cb) {
						cb(errors, results);
					}
				}
			}, i);
		});
	};

	o.add = add;
	o.run = run;

	return o;
};


if((typeof process) !== 'undefined') {
	// we're in node.js (versus browser)

	module.exports = runp;

	if(require && require.main === module) {
		// module is being executed directly, so run tests

		var log = function(s) { console.log(s); }
		var insp = require("util").inspect;

		var f = function(cb, n) {
			var t = 1000 + (Math.random() * 1000);
			log(n+" running for "+t+"ms ...");
			setTimeout(function() {
				if(Math.random() >= 0.6) {
					cb("ERROR-"+n);
				}
				else  {
					cb(null, "ok-"+n);
				}
			}, t);
		}

		runp()
		.add(f)
		.add(f)
		.run(function(e, r) {
			log("finished");
			log("errors: "+insp(e));
			log("results: "+insp(r));
		})

	}

}







