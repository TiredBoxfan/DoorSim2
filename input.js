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

/* BELOW: MODULE LEVEL CODE */

// Add enter functionality to the input field.
document.getElementById('input').addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
		// TODO: Handle input.
	}
})
// Enable input, showing that this script was run successfully.
toggleInput(true);