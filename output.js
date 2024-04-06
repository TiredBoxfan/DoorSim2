/**
 * Snaps the view of the container to the bottom.
 */
function snapToBottom() {
    container.scrollTop = container.scrollHeight;
}

/**
 * Sets the alignment of future outputs.
 * @param {string} align - An HTML alignment.
 */
function setOutputAlign(align) {
    _outputAlign = align;
}

/**
 * Sets the delay in `outputTypewrite()`.
 * @param {number} ms - The delay time in miliseconds.
 */
function setOutputDelay(ms = DEFAULT_DELAY) {
    _outputDelay = ms;
}

/**
 * Appends a new paragraph to the game output.
 * @param {...string} line 
 * - The lines that should be displayed.
 * Each subsequent line will have a break-line inserted.
 */
function output(line) {
    // Appending the text piece by piece will cause auto-complete to do weird things.
    let p = `<p style="text-align:${_outputAlign}">`;
    p += Array.prototype.join.call(arguments, '<br>');
    p += '</p>';
    // Append text.
    textbox.innerHTML += p;
    snapToBottom();
}

/**
 * Should function identical to `output()` but has a typewriter effect.
 * Pipes (|) will not be printed and thus can be added for additional pauses.
 * @param {function} onComplete - Called one cycle after the last character is typed.
 * @param {...string} line 
 */
function outputTypewrite(onComplete, line) {
    // Store a copy of the original text.
    let origin = textbox.innerHTML;
    let p = `<p style="text-align:${_outputAlign}">`
    let i = 1; // Line index. Skip [0] since it is the onComplete.
    let j = 0; // Character index of current line.
    let args = arguments; // Allow our arguments object to be reached by nested functions.

    function finish() {
        toggleInput(true);
        if (typeof args[0] === 'function')
            args[0]();
    }

    function update() {
        // Increment character index.
        j += 1;
        // Increment to next line.
        if (j >= args[i].length) {
            i += 1;
            j = 0;
            if(i < args.length)
                p += '<br>';
        }
        // Show update & finish.
        if (i < args.length) { // Still more to display.
            setTimeout(typeNextLetter, _outputDelay);
        } else { // Done.
            p += '</p>'
            setTimeout(finish, _outputDelay);
        }
        // Update textbox.
        textbox.innerHTML = origin + p;
        snapToBottom();
    }

    function typeNextLetter() {
        // Complete tags instantly (nesting not supported).
        if (args[i][j] === '<') {
            // Search for closed triangle brace.
            let matched = false;
            let t = j;
            let q = '';
            while (t < args[i].length && !matched) {
                if (args[i][t] === '>') { // Match found. Leave "cursor" on >.
                    matched = true;
                    q += '>';
                } else { // Continue on to next character.
                    q += args[i][t];
                    t += 1;
                }
            }
            // If matched, skip over tag. Otherwise, continue as normal.
            if (matched) {
                j = t;
                p += q;
                update();
                return;
            }
        }
        // Add next character.
        if (args[i][j] !== '|')
            p += args[i][j];
        update();
    }

    toggleInput(false);
    typeNextLetter();
}

/* BELOW: MODULE LEVEL CODE */

const DEFAULT_DELAY = 100;

var container = document.getElementById('game-container');
var textbox = document.getElementById('output');

var _outputAlign = 'left';
var _outputDelay = DEFAULT_DELAY;