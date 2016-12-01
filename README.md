
# runp

Run some functions in parallel.


## Install

	npm install runp


## Usage

	runp = require("runp");

	runp()
	.add(function(cb, a) {
		cb("error");
	})
	.add(function(cb, a) {
		cb(null, "okay");
	})
	.run(function(errors, results) {
		// all the functions have completed
		// errors = ["error", null];
		// results = [null, "okay"];
	}, 1)


