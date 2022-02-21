/*
		Copy text from any appropriate field to the clipboard
		By Craig Buckler, @craigbuckler
		use it, abuse it, do whatever you like with it!
*/

var copyAnimation = function (el: HTMLElement) {
		el.classList.add("c2c-copied");
		setTimeout(function () {
				el.classList.remove("c2c-copied");
		}, 1500);
};

var copyHandler = function (e: Event) {
		// find target element
	var t = <HTMLElement>e.target,
			c = t.dataset.copytarget,
			srcEl = <any>(c ? document.querySelector(c) : null);

	// is element selectable?
	if (srcEl && srcEl.select) {
			// select text
			srcEl.select();
			try {
					// copy text
					document.execCommand("copy");
					srcEl.blur();
					copyAnimation(t);
			}
			catch (err) {
					alert("Please press Ctrl/Cmd+C to copy.");
			}
	}
	else if (srcEl && srcEl.innerText) {
		// creating new textarea element and giveing it id 'txt'
		var txt = document.createElement("textarea");
		txt.id = "tp-txt";
		txt.style.height = "0";
		document.body.appendChild(txt);
		txt.value = srcEl.innerText;
		var tptxt = <HTMLTextAreaElement>document.querySelector("#tp-txt");
		try {
			if (tptxt) {
				tptxt.select();
				document.execCommand("copy");
				copyAnimation(t);
			}
			else
				throw new Error();
		}
		catch (err) {
				alert("Something went wrong trying to copy.");
		}
		finally {
				document.body.removeChild(txt);
		}
	}
};

// click events
document.body.addEventListener("click", copyHandler, true);

export {};
