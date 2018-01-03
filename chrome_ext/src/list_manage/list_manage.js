const bg = chrome.extension.getBackgroundPage();
document.addEventListener('DOMContentLoaded', _pageLoaded, false);

let list, entries;

/**
 * Executed when the page is loaded.
 * @returns {undefined}
 */
function _pageLoaded() {
	list = document.querySelector('#list');
	entries = bg.getEntries();
	let last = bg.getLastEntry();
	
	// Event handle
	document.querySelector('#clear_link').addEventListener('click', _onClearLinkClick);
	document.querySelector('#download_link').addEventListener('click', _onDownloadLinkClick);
	document.querySelector('#add_btn').addEventListener('click', _addButtonClick);
	
	// Manual input prefill.
	document.querySelector('#title').value = last.title;
	document.querySelector('#season').value = last.season;
	document.querySelector('#episode').value = parseInt(last.episode) + 1;
	
	_refresh();
}

/**
 * Clear the entry list.
 * @param   {Event}     The event object.
 * @returns {undefined}
 */
function _onClearLinkClick(e) {
	e.preventDefault();
	bg.clearEntries();
	_refresh();
}

function _onDownloadLinkClick(e) {
	e.preventDefault();
	bg.startDownload();
	_refresh();
}

function _addButtonClick() {
	const fields = {
			episode: document.querySelector('#episode'),
			url: document.querySelector('#url')
		},
		entry = {
			playlist_url: fields.url.value,
			title: document.querySelector('#title').value,
			season: document.querySelector('#season').value,
			episode: fields.episode.value
		};
	bg.addEntry(entry);
	
	url.value = "";
	episode.value = parseInt(episode.value) + 1;
	
	_refresh();
}

/**
 * Change the position of an item.
 * @param {Event} e The event object.
 * @returns {undefined}
 */
function _onPositionChanged(e) {
	const curIdx = parseInt(e.target.parentNode.parentNode.dataset.idx),
		newIdx = parseInt(e.target.value);
		
	bg.moveEntry(curIdx, newIdx);
	_refresh();
}

/**
 * Executed when the remove button is clicked.
 * @param   {Event}     e The event object.
 * @returns {undefined}
 */
function _onRemoveClick(e) {
	const idx = e.target.parentNode.parentNode.dataset.idx;
	bg.removeEntry(idx);
	_refresh();
}

/**
 * Fully refresh the list.
 * @returns {undefined}
 */
function _refresh() {
	document.querySelector('#total').innerText = entries.length;
	_clearList();
	_buildList();
}

/**
 * Clear the content of the list Node.
 * @returns {undefined}
 */
function _clearList() {
	while(list.firstChild)
		list.removeChild(list.firstChild);
}

/**
 * Populate the list Node.
 * @returns {undefined}
 */
function _buildList() {
	// Build the remove button
	const removeButton = document.createElement('button');
	removeButton.type = 'button';
	removeButton.innerText = '\u00D7'
	
	// Create content for each entries
	for(let i in entries) {
		const e = entries[i],
			entryElement = document.createElement('div'),
			leftPart = document.createElement('div'),
			rightPart = document.createElement('div'),
			positionInput = document.createElement('input');
		
		// Set the position button.
		positionInput.type = 'number';
		positionInput.min = 0;
		positionInput.max = entries.length - 1;
		positionInput.value = i;
		positionInput.addEventListener('blur', _onPositionChanged);
		
		// Build the left part of the entry element.
		leftPart.classList.add('leftPart')
		leftPart.append(positionInput);
		let rmv = removeButton.cloneNode(true);
		rmv.addEventListener('click', _onRemoveClick);
		leftPart.append(rmv);
		
		// Build the right part of the entry element.
		const content = [
			`<span>File URL</span>: ${e.playlist_url}`,
			`<span>File Information</span>: ${e.title} S${_zeroPad(e.season)}E${_zeroPad(e.episode)}`
		];
		for(let c of content) {
			let node = document.createElement('p');
			node.innerHTML = c;
			rightPart.append(node);
		}
		rightPart.classList.add('rightPart')
				
		// Get global entry element
		entryElement.dataset.idx = i;
		entryElement.append(leftPart);
		entryElement.append(rightPart);
		
		// Add entry element to list.
		list.append(entryElement);
	}
}

function _zeroPad(num) {
	if(num.length == 1)
		return `0${num}`;
	return num;
}
