async function loadStrings() {
	response = await fetch('./strings.json')
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			_data = data;
			startGame();
		})
		.catch(error => {
			output('<font color=red>Error while loading text strings. :(</font>')
			output(`<font color=red>${error}</font>`);
		});
}

/* BELOW: MODULE LEVEL CODE */

var _data;