const bg = chrome.extension.getBackgroundPage();
let requests = null;
document.addEventListener('DOMContentLoaded', _onOpen, false);

/**
 * Action executed when the popup is opened.
 * @returns {undefined}
 */
function _onOpen() {
	const last = bg.getLastEntry(),
		list = document.querySelector("#url_list");
	requests = bg.getRequests();
	
	document.querySelector('#download_link').addEventListener("click", _startDownload);
	
	// Set last/default value.
	document.querySelector("#total").innerText = bg.getEntries().length;
	document.querySelector("#title").value = last.title;
	document.querySelector("#season").value = last.season;
	let episode = document.querySelector("#episode");
	episode.value = (parseInt(last.episode) + 1).toString();
	episode.focus();
	
	// Build request list.
	_buildList(list, requests);
}

/**
 * Build list html.
 * @returns {Promise} A promise with the list HTML as return.
 */
function _buildList(list, requests) {
	chrome.tabs.query({
		currentWindow: true,
		active: true}, (tab) => {				
			// If more than one element, remove the "None" default node.
			if (requests[tab[0].id].length > 0)
				list.removeChild(list.firstChild);
				
			// Add new list element for each requests.
			for (let i in requests[tab[0].id]) {
				// Get working information.
				const r = requests[tab[0].id][i],
					origin = r.initiator,
					file_match = /\/(?:([^\/]+)\?(?:.+)?|([^\/]+))$/.exec(r.url),
					filename = file_match[1] || file_match[2],
					listElement = document.createElement('li');
					
				// Setup list element.
				listElement.innerHTML = `<span>origin</span>: ${origin}<br /><span>filename</span>: ${filename}`;
				listElement.dataset.idx = i;
				listElement.dataset.tab = tab[0].id;
				listElement.addEventListener("click", _onClick);
				
				// Add list element to list.
				list.append(listElement);
			}
		});
}

/**
 * Event executed when one of the list elements is clicked.
 * @param   {Event}     event The event message.
 * @returns {undefined}
 */
function _onClick(event) {
	const element = event.target,
		idx = element.dataset.idx,
		tabId = element.dataset.tab,
		entry = {
			playlist_url: requests[tabId][idx].url,
			title: document.querySelector('#title').value,
			season: document.querySelector('#season').value,
			episode: document.querySelector('#episode').value
		};
		
	bg.addEntry(entry);
	window.close();
}

/**
 * Start the download of the list.
 * @returns {undefined}
 */
function _startDownload(e) {
	e.preventDefault();
	bg.startDownload();
}
