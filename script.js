'use strict'

;(function () {
	if (document.readyState === 'interactive' || document.readyState === 'complete') {
		onReady()
	} else {
		document.addEventListener("DOMContentLoaded", onReady)
	}

	function onReady() {
		document.removeEventListener("DOMContentLoaded", onReady)
		console.log('Ready')
	}

	window.addEventListener("load", onLoad)

	function onLoad() {
		window.removeEventListener("load", onLoad)
		console.log('Load')
	}
})()
