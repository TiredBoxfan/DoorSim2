function loadLevel() {
    clearOutput();
    output('Loaded level...');
    toggleInput(true);
}

/**
 * @param {Set} args 
 */
function takeTurn(args) {
    let enableInput = true;
    if (args.has('help')) {
        output('out.help')
    } else if(args.has('and') || args.has('then') || args.has('while')) {
        output('out.conjunction')
    } else {
        output('out.invalid')
    }
    if (enableInput)
        toggleInput(true);
}