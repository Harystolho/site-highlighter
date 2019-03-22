(()=>{
	let script = document.createElement('script');
	script.async = true;
	script.type = 'text/javascript';
	script.src = "https://page-highlight.com:8181/dist/highlight.js";
	
	script.onload = () => {
		// It sends a message because it can't call Highlight.load(), for some
		// reason the Highlight object is undefined here
		
		// Wait before sending the message to make sure the script is loaded
		setTimeout(() => {
			window.postMessage("highlight.load", window.location.origin);	
		}, 500);
	}
	
	let node = document.getElementsByTagName('script')[0];
	node.parentNode.insertBefore(script, node);	
})();