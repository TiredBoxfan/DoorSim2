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

function toggleInput(state) {
	toggleElement('input', state);
	toggleElement('submit-button', state);
}

// Shows lines on screen as a paragraph.
// Multiple arguments can be given to break lines.
function output() {
	// Show text on screen.
	var textbox = document.getElementById('output')
	textbox.innerHTML += '<p>'
	for (let i = 0; i < arguments.length; i++) {
		if (i !== 0)
			textbox.innerHTML += '<br>'
		textbox.innerHTML += arguments[i]
	}
	textbox.innerHTML += '</p>'
	// Snap view to bottom.
	var field = document.getElementById('game-container')
	field.scrollTop = field.scrollHeight
}

function outputSlow() {
	// Disable input.
	toggleInput(false)

	// Declare variables.
	var textbox = document.getElementById('output')
	var field = document.getElementById('game-container')
	var delay
	var i = 0
	var j = 0
	var args = arguments
	var onComplete = null

	// Determine delay.
	if (args.length >= 1 && typeof args[i] === "number") {
		delay = args[i]
		i = 1
	} else {
		delay = 50 // Default value.
	}

	// Check if next parameter is an onComplete function.
	if (args.length >= i+1 && typeof args[i] !== "string") {
		onComplete = args[i]
		i += 1
	}

	// Nested function that types a letter at a time.
	function typeLetter() {
		textbox.innerHTML += args[i][j]
		j += 1
		// Increment character.
		if (j >= args[i].length) {
			i += 1
			j = 0
			textbox.innerHTML += '<br>'
		}
		if (i < args.length) { // Increment line.
			setTimeout(typeLetter, delay)
			field.scrollTop = field.scrollHeight
		}
		else { // Done, re-enable input.
			textbox.innerHTML += '</p>'
			toggleInput(true)
			// Call onComplete.
			if (onComplete !== null)
				onComplete()
		}
	}

	// Run code.
	textbox.innerHTML += '<p>'
	field.scrollTop = field.scrollHeight
	typeLetter()
}

function handleInput() {
	// Get input.
	var field = document.getElementById('input')
	var rawInput = field.value

	// Calculate args.
	// Ensure text is completely lowercase.
	var args = rawInput.trim().toLowerCase()
	// Remove non-alphanumeric and non-whitespace characters.
	args = args.replace(/[^a-z0-9\s]/g, '')
	// Merge important key phrases.
	//args = args.replace(/left\shand/g, 'lefthand')
	//args = args.replace(/right\shand/g, 'righthand')
	// Split args by whitespace and convert to set.
	args = new Set(args.split(/\s+/).filter(w => w != ''))

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
					output('You gently place your hand on the doorknob.')
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

	function actStepBack() {
		if (position == posClosetNear) {
			output('You take a step backwards.')
			position = posClosetFar
		} else if(position == posClosetFar) {
			output('The wall behind you prevents this action.')
		} else {
			output('ERROR: Unhandled location.')
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
					output('The door is open! You did it! Good job!')
					toggleInput(false)
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
	// Notes:
	// - Knob should always come before Door in if-else trees. So "door knob" gets a hit for knob, not door.
	if(args.has('help')) {
		output('Brave hero, your most noble quest is to open doors.',
			'Your can accomplish this by typing in actions.',
			'These actions should be short and sweet, around 2 to 5 words',
			'Perhaps you could [look] at things such as the [door].',
			'You might even decide to [put] your [hand] on the [knob]!',
			'For a fresh start, you may [chant] the phrase [reset].',
			'Take it a [step] at a time and your quest will be won!')
	} else if (args.has('chant') || args.has('intone') || args.has('recite')) {
		if (args.has('reset') || args.has('restart')) {
			outputSlow(startLevel, 'The world warps around you...')
		} else {
			output('But your call went unanswered...')
		}
	} else if (args.has('and') || args.has('then') || args.has('while')) {
		output('Woah there, partner! One thing at a time, okay?')
	} else if (args.has('grab') || args.has('grasp') || args.has('hold')) {
		actGrab()
	} else if(args.has('put') || args.has('place')) {
		if (args.has('hand')) {
			actGrab()
		} else {
			output('You cannot put that there.')
		}
	} else if(args.has('tighten') || args.has('strengthen') || args.has('fasten') || args.has('clench')) {
		if (argsGrip()) {
			if (isHandOnKnob()) {
				actFirmKnob()
			} else {
				output('You clench your hands into a fist.')
				tightGrip = true
			}
		} else {
			output('You cannot tighten that.')
		}
	} else if(args.has('loosen') || args.has('relax')) {
		if (argsGrip()) {
			if (tightGrip) {
				output('You loosen your grip.')
				tightGrip = false
			} else {
				output('Your hand is already relaxed.')
			}
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
	} else if(args.has('look')) {
		if (argsKnob()) {
			if (isHandOnKnob()) {
				output('You can\'t get a good look at the knob with your hand in the way.')
			} else {
				output('It\'s a round doorknob.')
			}
		} else if (args.has('door')) {
			output('It\'s a wooden door.')
		} else if(args.has('hand')) {
			if (isHandOnKnob()) {
				if (tightGrip) {
					output('Your hand is firmly on the doorknob.')
				} else {
					output('Your hand is resting on the knob')
				}
			} else {
				if (tightGrip) {
					output('Your hand is clenched into a fist.')
				} else {
					output('You know it like the back of your hand.')
				}
			}
		} else {
			output('You cannot look at that.')
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
			actStepBack()
		} else {
			output('You cannot step there.')
		}
	} else if(args.has('back') && args.has('up')) { // Probably fine, but compound would be better.
		actStepBack()
	} else if(args.has('open')) {
		if (args.has('door')) {
			openDoor()
		} else if(args.has('hand')) {
			if (isHandOnKnob()) {
				output('You open your hand, releasing the doorknob in the process.')
				handState = handNone
				tightGrip = false
			} else if(tightGrip) {
				output('You open your fist.')
				tightGrip = false
			} else {
				output('Your hand is already open.')
			}
		} else {
			output('You cannot open that.')
		}
	} else if (args.has('push')) {
		if (argsKnob() || args.has('door')) {
			output('Pulling on a push door won\'t get you very far...')
		} else {
			output('You cannot push that.')
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
	} else if(args.has('kick')) {
		if (args.has('door')) {
			output('You kick the door.')
		} else {
			output('You cannot kick that.')
		}
	} else if(args.has('hit') || args.has('punch')) {
		if (args.has('door')) {
			output('You punch the door')
		} else {
			output('You cannot hit that.')
		}
	} else if (args.has('knock') || args.has('bang')) {
		output('You try knocking on the door but after getting no response, you conclude that no one is coming to your rescue. On the bright side, knocking on wood is supposed to prevent jinxes so you\'ve got that going for you now.')	
	} else {
		output('I do not recognize that command.')
	}
}

function resetVariables() {
	handState = handNone
	tightGrip = false
	position = posClosetNear
}

function startLevel() { // TODO: Add a variable that determines which level to laod.
	resetVariables()
	output('Welcome to Door Simulator II: Behind the Threshold!')
	output('This is the tale of a hero and a door.')
	output('You can use the [help] command to get more information on how to play!')
	output('You stand in a small room, a closet really. In front of you there is a door. A light is above you.')
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

// Direction symbols.


// Player states.
var handState = handNone
var tightGrip = false
var position = posClosetNear

startLevel()