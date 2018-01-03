const requests = [],
	req_filter = {
		urls: ["<all_urls>"],
		types: ["xmlhttprequest", "media"]
	};
let entries = [];

// Event listeners.
chrome.webNavigation.onBeforeNavigate.addListener(_onNavigate);
chrome.webRequest.onResponseStarted.addListener(_onRequest, req_filter);
chrome.webRequest.onErrorOccurred.addListener(_onRequestError, req_filter);

/**
 * Start the json download.
 * @returns {undefined}
 */
function startDownload() {
	const json_b64 = btoa(JSON.stringify(entries));
	chrome.downloads.download({
		url: `data:application/json;base64,${json_b64}`,
		filename: 'show.json',
		saveAs: true
	})
	
	// Clear the list
	entries.splice(0, entries.length);
}

/**
 * Add an entry to the entries list.
 * @param   {object}    entry Push an entry to the list.
 * @returns {undefined}
 */
function addEntry(entry) {
	entries.push(entry);
}

/**
 * Remove an entry from the list.
 * @param   {number}    id The id of the entry
 * @returns {undefined}
 */
function removeEntry(id) {
	entries.splice(id, 1);
}

/**
 * Move an entry to the new index and shift all the other entries.
 * @param   {number}    curIdx The current index of the item.
 * @param   {number}    newIdx The new index of the item.
 * @returns {undefined}
 */
function moveEntry(curIdx, newIdx) {
	const entry = entries[curIdx];
	entries.splice(curIdx, 1);
	entries.splice(newIdx, 0, entry);
}

/**
 * Clear the list of entry
 * @returns {undefined}
 */
function clearEntries() {
	entries.splice(0, entries.length);
}

/**
 * Get the last entry or default.
 * @returns {object} The last entry or default value.
 */
function getLastEntry() {
	return entries.slice(-1)[0] || {
		playlist_url: "",
		title: "",
		season: "1",
		episode: "0"
	};
}

/**
 * Get the number of entries.
 * @returns {number} The number of entries in the list.
 */
function getEntries() {
	return entries;
}

/**
 * Return the list of request.
 * @returns {Array<object>} The list of request.
 */
function getRequests() {
	return requests;
}

/**
 * Callback function when a request is started.
 * @param   {object}    req The request object.
 * @returns {undefined}
 */
function _onRequest(req) {
	// Add the request to the list if needed.
	if (req.type == "media" || (req.url.indexOf(".m3u8") != -1)) {
		// Set the request array.
		if(requests[req.tabId] == null)
			requests[req.tabId] = [];
		
		// Add the request to the list.
		requests[req.tabId].push(req);
		
		// Update the badge
		_setBadge(req.tabId);
	}
}

/**
 * Callback function when an error occure during a request.
 * @param   {object}    req The request object.
 * @returns {undefined}
 */
function _onRequestError(req) {
	// Remove the request from list.
	let req_idx = requests[req.tabId].findIndex(x => x.requestId == req.requestId);
	requests.splice(req_idx, 1);
	
	// Update the badge.
	_setBadge(req.tabId);
}

/**
 * Callback function when any tab navigate to a differente page (or reload).
 * @param   {object}    nav The navigation information.
 * @returns {undefined}
 */
function _onNavigate(nav) {
	if (nav.parentFrameId == -1) {
		// Reset request list.
		requests[nav.tabId] = [];
		
		// Reset badge.
		_setBadge(nav.tabId);
	}
}

/**
 * Update the badge number of a tab.
 * @param   {number}    tabId The tab id.
 * @returns {undefined}
 */
function _setBadge(tabId) {
	if(requests[tabId] == null)
		requests[tabId] = [];
	chrome.browserAction.setBadgeText({
		text: (requests[tabId].length).toString(),
		tabId: tabId
	});
}
