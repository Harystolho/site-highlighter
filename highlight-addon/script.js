(()=>{
	let script = document.createElement('script');
	script.async = true;
	script.type = 'text/javascript';
	script.src = "https://localhost:8181/dist/highlight.js";
	let node = document.getElementsByTagName('script')[0];
	node.parentNode.insertBefore(script, node);
})();