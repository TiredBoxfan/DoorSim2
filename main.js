document.getElementById('input').addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
		handleInput();
	}
});

function output() {
	var textbox = document.getElementById('output');
	textbox.innerHTML += '<p>';//`<p>${text}</p>`;
	for (var i = 0; i < arguments.length; i++)
	{
		if (i !== 0)
			textbox.innerHTML += '<br>';
		textbox.innerHTML += arguments[i];
	}
	textbox.innerHTML += '</p>'
	// Snap view to bottom.
	var field = document.getElementById('game-container');
	field.scrollTop = field.scrollHeight;
}

function handleInput() {
	// Get input.
	var field = document.getElementById('input');
	var rawInput = field.value;
	var args = new Set(rawInput.trim().toLowerCase().split(/\s+/).filter(w => w !== '').map(w => w.replace(/[^a-zA-Z0-9]/g, '')));
	// Clear field.
	field.value = '';
	// Do nothing if input is blank.
	output(args.size)
	if (args.size == 0)
		return;
	// Display input.
	output(` > ${rawInput} Set[${new Array(...args).join('|')}]`);
}

output('A simple','test','of this multiline')
output('And another','one')

/*function toggleElement(name, state) {
	var obj = document.getElementById(name);
	if (obj) {
		obj.disabled = !state;
	}
}

function inputToggle(state) {
	toggleElement('input', state);
	toggleElement('submit-button', state);
}*/

/*async function loadStrings() {
	response = await fetch('./strings.json')
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			output(data['intro'])
			text = data;
			startGame();
		})
		.catch(error => {
			output('<font color=red>Error while loading text strings. :(</font>')
			output(`<font color=red>${error}</font>`);
		});
}

function startGame() {
	inputToggle(true);
}

var text = null;
inputToggle(false);
loadStrings();*/