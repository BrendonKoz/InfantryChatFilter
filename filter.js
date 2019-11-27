// TODO: Use something like player001 for class names instead of full alias in chat lines;
//  - aliases might contain invalid characters which, when removed, can cause improper matching...
//  - this would require keeping player names in memory while building the chat display from the file

	function addEventListenerList(list, event, fn) {
		for (var i = 0, len = list.length; i < len; i++) {
			list[i].addEventListener(event, fn, false);
			selectedChats = toggle(selectedChats, '.' + list[i].name);
		}
	}
	function toggleChatType(el) {
		toggleVisibility(this.name);
		selectedChats = toggle(selectedChats, '.' + this.name);
		deSelectedChats = toggle(deSelectedChats, '.' + this.name);
		var activeChatTypes = document.querySelectorAll('input[type=checkbox]:checked');
		if (activeChatTypes.length >= 1) {
			var inactive = true;
			activeChatTypes.forEach(chat => {
				switch (chat.name) {
					case 'mt0':
					case 'mt1':
					case 'mt2':
					case 'mt3':
					case 'mt4':
					case 'mt6':
					case 'mt7':
						inactive = false;
						break;
				}
			});
			if (inactive) {
				selector.disable();
			} else {
				selector.enable();
			}
		} else {
			selector.disable();
		}
		console.log('Selected: ' + selectedChats);
		console.log('Deselected: ' + deSelectedChats);
	}
	function toggleVisibility(chatType) {
		var lines = document.getElementsByClassName(chatType);
		for (var i = 0; i < lines.length; i++) {
			lines[i].classList.toggle('hidden');
		}
	}
	function nameSelected(name) {
		// Show only messages from specifically chosen names; retain chat type selections
		selectedNames = toggle(selectedNames, '.' + name);
		if (selectedNames.length > 1) {
			var classNames = '.' + name;
			var lines = document.querySelectorAll(classNames);
			lines.forEach(function(line) {
				line.classList.toggle('hidden');
			});
		} else {
			// Disable chat type filter options 5,8,9
			document.querySelectorAll('input[type=checkbox]').forEach(function(check) {
				if (['mt5', 'mt8', 'mt9'].includes(check.getAttribute('name'))) {
					check.setAttribute('disabled', 'disabled');
				}
			});
			var classNames = '.chat>div:not(' + selectedNames + ')';
			console.log(classNames);
			var lines = document.querySelectorAll(classNames);
			lines.forEach(function(line) {
				line.classList.toggle('hidden');
			});
		}
	}
	function nameDeselected(name) {
		selectedNames = toggle(selectedNames, '.' + name);
		if (selectedNames.length) {
			var classNames = '.chat>div.' + name + selectedChats.join(', .chat>div.' + name);
			console.log('toggle classNames: ' + classNames);
			var lines = document.querySelectorAll(classNames);
			lines.forEach(function(line) {
				line.classList.toggle('hidden');
			});
		} else {
			// ToDo: factor in selected/deSelected chats
			// Enable chat type filter options 5,8,9
			document.querySelectorAll('input[type=checkbox]').forEach(function(check) {
				if (['mt5', 'mt8', 'mt9'].includes(check.getAttribute('name'))) {
					check.removeAttribute('disabled');
				}
			});
			var lines = document.querySelectorAll('.hidden');
			lines.forEach(function(line) {
				line.classList.toggle('hidden');
			});
		}
	}
	function updateNamewidth() {
		var namewidth = document.getElementById('namewidth').value;
		var output    = document.querySelector('output');
		var styles    = getStyleSheet('style');
		var rules     = styles.cssRules;
		output.innerHTML = namewidth;
		for (var i = 0; i < rules.length; i++) {
			if (rules[i].selectorText == '.msg-from') {
				rules[i].style.setProperty('width', namewidth + 'ch');
				rules[i].style.setProperty('min-width', namewidth + 'ch');
			}
		}
	}
	function getStyleSheet(unique_title) {
		for (var i=0; i<document.styleSheets.length; i++) {
			var sheet = document.styleSheets[i];
			if (sheet.title == unique_title) {
				return sheet;
			}
		}
	}
	// toggle (boolean) elements in an array ... `toggle(array, value);`
	// Source: https://stackoverflow.com/questions/17153238
	const toggle = (arr, item) => arr.includes(item) ? arr.filter(i => i !== item) : [ ...arr, item ];

	var selectedNames      = [];
	var selectedChats      = [];
	var deSelectedChats    = [];
	var disabledSelections = [];

	var namewidth = document.getElementById('namewidth');
	namewidth.addEventListener('input', updateNamewidth, false);

	var chatTypes = document.querySelectorAll('input[type=checkbox]');
	addEventListenerList(chatTypes, 'click', toggleChatType);

	// if chat types 0,1,2,3,4,6,7 are inactive, disable the selector
	var selector = new Selectr('#players', { multiple: true, clearable: true, sortSelected: true });
	selector.on('selectr.select', function(selectedOption) {
		console.log('selected: ' + selectedOption.value);
		nameSelected(selectedOption.value);
	});
	selector.on('selectr.deselect', function(deselectedOption) {
		console.log('deselected: ' + deselectedOption.value);
		nameDeselected(deselectedOption.value);
	});