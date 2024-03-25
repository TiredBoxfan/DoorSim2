// Add enter functionality to the input field.
document.getElementById('input').addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
		handleInput()
	}
})

function toggleElement(name, state) {
	var obj = document.getElementById(name);
	if (obj) {
		obj.disabled = !state;
	}
}

function inputToggle(state) {
	toggleElement('input', state);
	toggleElement('submit-button', state);
}

// Shows lines on screen as a paragraph.
// Multiple arguments can be given to break lines.
function output() {
	// Show text on screen.
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

	// Clear field.
	field.value = ''
	// Do nothing if input is blank.
	if (args.size == 0)
		return
	// Display input.
	output(`<i> \> ${rawInput}</i>`)

	// Action functions.

	function isHandOnKnob() {
		return handState == handKnob || handState == handKnobLeft || handState == handKnobRight
	}

	function argsKnob() {
		return args.has('knob') || args.has('handle') || args.has('doorknob')
	}

	function argsGrip() {
		return args.has('grip') || args.has('hand')
	}

	function actGrab() {
		var firm = args.has('firmly') || args.has('tightly')
		var alreadyOnKnob = isHandOnKnob()

		if (argsKnob()) {
			if (firm) {
				if (alreadyOnKnob) {
					actFirmKnob()
				} else {
					output('You firmly grab the doorknob.')
					handState = handKnob
					tightGrip = true
				}
			} else {
				if (alreadyOnKnob) {
					output('Your hand is already on the doorknob.')
				} else {
					output('You gently grab the doorknob.')
					handState = handKnob
					tightGrip = false
				}
			}
		} else if (args.has('door')) {
			output('You place your hand on the wood of the door.')
			handState = handDoor
		} else {
			output('You cannot grab that.')
		}
	}

	function actFirmKnob() {
		if (tightGrip) {
			output('You cannot grab the doorknob any tighter.')
		} else {
			output('You tighten your grip on the knob')
		}
		tightGrip = true
	}

	function actTurnKnob() {
		if (!tightGrip) {
			output('As you attempt to turn the knob, your gentle grip slips.')
			handState = handNone
		} else if (args.has('left') || args.has('counter') || args.has('counterclockwise')) {
			output('You turn the knob to the left.')
			handState = handKnobLeft
		} else if (args.has('right') || args.has('clockwise')) {
			output('You turn the knob to the right.')
			handState = handKnobRight
		} else {
			output('You attempt to turn the knob but your lack of commitment to any particular direction prevents your progress.')
		}
	}
	
	function openDoor() {
		if (isHandOnKnob()) {
			if (tightGrip) {
				if (handState == handKnob) {
					output('You pull on the knob but nothing happens.')
				} else if (position == posClosetNear) {
					output('You open the door into your face. You grab your face, releasing the door.')
					handState = handNone
					tightGrip = false
				} else {
					output('You did it! Good job!')
					inputToggle(false)
				}
			} else {
				output('You lose your weak grip on the knob.')
				handState = handNone
			}
		} else {
			output('Missing a few steps there, bud.')
		}
	}

	// Handle args.
	if (args.has('grab') || args.has('grasp') || args.has('hold')) {
		actGrab()
	} else if(args.has('put') || args.has('place')) {
		if (args.has('hand')) {
			actGrab()
		} else {
			output('You cannot put that there.')
		}
	} else if(args.has('tighten') || args.has('strengthen') || args.has('fasten')) {
		if (argsGrip()) {
			actFirmKnob()
		} else {
			output('You cannot tighten that.')
		}
	} else if(args.has('loosen') || args.has('relax')) {
		if (argsGrip()) {
			output('You loosen your grip.')
			tightGrip = false
		} else {
			output('You cannot loosen that.')
		}
	} else if(args.has('release') || (args.has('let') && args.has('go')) || args.has('remove')) {
		if (argsGrip()) {
			if (isHandOnKnob()) {
				output('You release your hold of the knob.')
				handState = handNone
				tightGrip = false
			} else if (handState == handDoor) {
				output('You let go of the door.')
				handState = handNone
				tightGrip = false
			} else if (handState == handNone) {
				output('You are not holding anything to release.')
			} else {
				output('You cannot let go of that.')
			}
		} else {
			output('You cannot let go of that.')
		}
	} else if(args.has('turn') || args.has('rotate') || args.has('twist')) {
		if (args.has('hand')) {
			if (isHandOnKnob()) {
				actTurnKnob()
			} else {
				output('You twist your hand but accomplish little.')
			}
		} else if (argsKnob()) {
			if (isHandOnKnob()) {
				actTurnKnob()
			} else {
				output('Alas, you cannot turn the knob with your mind.')
			}
		}
	} else if(args.has('step') || args.has('walk') || args.has('move')) {
		if (args.has('forward') || args.has('forwards')) {
			if (position == posClosetNear) {
				output('You walk into the door but it stays firm.')
			} else if (position == posClosetFar) {
				output('You take a step forward. You are now against the door.')
				position = posClosetNear
			} else {
				output('ERROR: Unhandled location.')
			}
		} else if (args.has('backward') || args.has('backwards') || args.has('back')) {
			if (position == posClosetNear) {
				output('You take a step backwards.')
				position = posClosetFar
			} else if(position == posClosetFar) {
				output('The wall behind you prevents this action.')
			} else {
				output('ERROR: Unhandled location.')
			}
		} else {
			output('You cannot step there.')
		}
	} else if(args.has('open')) {
		if (args.has('door')) {
			openDoor()
		} else {
			output('You cannot open that.')
		}
	} else if(args.has('pull')) {
		if (args.has('door') || argsKnob()) {
			openDoor()
		} if (args.has('hand')) {
			if (handState == handKnobLeft || handState == handKnobRight) {
				openDoor()
			} else if(handState == handKnob && tightGrip) {
				output('Your hand\'s tight grip on the knob prevents its retreat.')
			} else {
				output('Your hand retreats.')
				handState = handNone
				tightGrip = false
			}
		} else {
			output('You cannot pull that.')
		}
	} else {
		output('I do not recognize that command.')
	}
}

// Hand symbols.
const handNone = Symbol('Hand None')
const handDoor = Symbol('Hand Door')
const handKnob = Symbol('Hand Knob')
const handKnobLeft = Symbol('Hand Knob Left')
const handKnobRight = Symbol('Hand Knob Right')

// Position symbols.
const posClosetNear = Symbol('Closet Near')
const posClosetFar = Symbol('Closet Far')

// Player states.
var handState = handNone
var tightGrip = false
var position = posClosetNear

output('You stand in a small room, a closet really. In front of you there is a door. A light is above you.')