document.getElementById('input').addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
		handleInput()
	}
})

function output() {
	var textbox = document.getElementById('output')
	textbox.innerHTML += '<p>'
	for (let i = 0; i < arguments.length; i++)
	{
		if (i !== 0)
			textbox.innerHTML += '<br>'
		textbox.innerHTML += arguments[i]
	}
	textbox.innerHTML += '</p>'
	// Snap view to bottom.
	var field = document.getElementById('game-container')
	field.scrollTop = field.scrollHeight
}

function handleInput() {
	// Get input.
	var field = document.getElementById('input')
	var rawInput = field.value
	var args = new Set(rawInput.trim().toLowerCase().split(/\s+/).filter(w => w !== '').map(w => w.replace(/[^a-zA-Z0-9]/g, '')))
	
	function hasSubstring(substring) {
		for (const value of args) {
			if (value.includes(substring)) {
				return true
			}
		}
		return false
	}

	function hasFirmSynonym() {
		return hasSubstring('firm') || hasSubstring('tight') || hasSubstring('strong') || hasSubstring('strength') || hasSubstring('hard')
	}

	function hasKnobSynonym() {
		return args.has('knob') || args.has('handle') || args.has('doorknob')
	}

	function doGrab() {
		if(hasKnobSynonym()) {
			handState = handKnob
			tightGrip = hasFirmSynonym()
			if (tightGrip) {
				output('You firmly grab the doorknob.')
			} else {
				output('You gently place your hand on the doorknob.')
			}
		} else if (args.has('door')) {
			handState = handDoor
			tightGrip = hasFirmSynonym()
			if (tightGrip) {
				output('You firmly place your hand on the wood of the door. The door jostles slightly in the frame but gives no impression of giving in.')
			} else {
				output('You calmly place your hand on the wood of the door. It has a nice varnish allowing your hand to easily slide on its surface.')
			}
		} else {
			output('Can\'t put your hand there.')
		}
	}

	function releaseGrip() {
		handState = handNone
		tightGrip = false
	}

	function doKnobTurn() {
		if (handState != handKnob) {
			output('You turn your hand but accomplish nothing.')
		} else if (tightGrip) {
			output('The knob turns. You are so close.')
		} else {
			output('You lose your gentle grip, caressing the door knob wistfully in the process.')
			releaseGrip()
		}
	}

	// Clear field.
	field.value = ''
	// Do nothing if input is blank.
	if (args.size == 0)
		return
	// Display input.
	output(`<i> \> ${rawInput}</i>`)
	if (args.has('help')) {
		output('TODO: HELP TEXT')
	} else if (args.has('open') && args.has('door')) {
		output('Missing a few steps there, bud.')
	} else if (args.has('put') || args.has('place')) {
		if (args.has('hand')) {
			doGrab()
		} else {
			output('Can\'t place that.')
		}
	} else if (args.has('grab') || args.has('grasp') || args.has('hold')) {
		doGrab()
	} else if (args.has('turn')) {
		if (hasKnobSynonym() || args.has('hand')) {
			doKnobTurn()
		} else {
			output('You turn yourself around 360 degrees.')
		}
	} else {
		output('Unrecognized command.')
	}
}

const handNone = Symbol('Hand None')
const handDoor = Symbol('Hand Door')
const handKnob = Symbol('Hand Knob')

var handState = handNone
var tightGrip = false
var distance = 0

output('You stand in a small room, a closet really. In front of you there is a door. A light is above you.')



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