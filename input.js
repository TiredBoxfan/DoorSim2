/**
 * Sets the state of an HTML element to either enabled or disabled.
 * @param {string} id - The HTML id of the element to toggle.
 * @param {boolean} state - The target toggle state. true = enabled. false = disabled.
 */
function toggleElement(id, state) {
	var element = document.getElementById(id);
	if (element) { // Ensure that element exists.
		element.disabled = !state;
	}
}

/**
 * Toggles whether or not input can be received.
 * @param {boolean} state - The target toggle state.
 */
function toggleInput(state) {
    // Handle Input Field.
	toggleElement('input', state);
    // Handle Input Submit Button.
	toggleElement('submit-button', state);
}

/**
 * Starts interpretation of the input field.
 */
function submitInput() {
	// Get input.
	toggleInput(false);
	let field = document.getElementById('input');
	let rawInput = field.value;
	field.value = '';

	// Calculate args.
	// Normalize rawInput.
	let args = rawInput.trim().toLowerCase();
	// Ensure there is something process, otherwise end early.
	if (args.length == 0)
		return;
	// Remove unwanted characters (including punctuation).
	args = args.replace(/[^a-z0-9\s]/g, '');
	
	// Merge important key phrases where order matters.
	args = args.replace(/left\shand/g, 'lefthand'); // EX: Turn left hand right -> Turn lefthand right
	args = args.replace(/right\shand/g, 'righthand');

	// Convert args to a set of keywords.
	args = new Set(args.split(/s+/).filter(x => x != ''));

	// Display input.
	output(`<font color=lightgray><i> \> ${rawInput}</i></font>`);
}

/* BELOW: MODULE LEVEL CODE */

// Add enter functionality to the input field.
document.getElementById('input').addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
		submitInput();
	}
})