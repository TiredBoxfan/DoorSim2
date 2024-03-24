document.getElementById('input').addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
		handleInput();
	}
});

function output(text) {
	document.getElementById('output').innerHTML += `<p>${text}</p>`;
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

output('Test')