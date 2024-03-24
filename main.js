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

function readJson() {
	return fetch('./strings.json')
		.then(response => {
			if (!response.ok)
				throw new Error('Network response was not OK.')
			return response.json();
		})
		.then(data => {
			output(data);
		})
		.catch(error => {
			output('<font color=red>Could not load strings.json</font>' + error);
		});
}

const symCenter = Symbol("Center");
const symNorth = Symbol("North");
const symSouth = Symbol("South");
const symWest = Symbol("West");
const symEast = Symbol("East");
const symUp = Symbol("Up");
const symDown = Symbol("Down");

output("Loaded");

readJson();

output('Welcome to Door Simulator II: Before the Threshold!');
output('You are standing in the center of a small, decently lit room. In front of you is a door. The door is a standard \'pull to open\' model featuring a rotatable knob.');