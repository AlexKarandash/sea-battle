const w = 10;
const h = 10;
//const p1map = ['~ss~~~~s~~', '~~~~~~~~~~', '~~~~s~~~~s', '~s~~~~s~~s', '~s~~~~s~~s', '~s~~~~~~~~', '~~~~~~~~s~', '~~~~ss~~~~', '~s~~~~~~~~', '~~~~ssss~~'];
const p2map = ['~~~s~~~~ss', '~s~s~~~~~~', '~~~s~~~~~~', '~~~s~~~s~~', '~~~~~~~s~~', '~s~~s~~s~~', '~s~~~~~~~~', '~s~s~~~~~~', '~~~~~ss~~~', 'ss~~~~~~s~'];

const p1map = new Array(h);
for (let i = 0; i < h; i++) {
	p1map[i] = new Array(w);
}

const myField = document.querySelector('#myField'), enemyField = document.querySelector('#enemyField');
for (let i = 0; i < w; i++) {
	for (let j = 0; j < h; j++) {
		const div1 = document.createElement('div');
		div1.id = 'i' + i + '_' + j;
		//div1.classList.add(p1map[i][j] === 's' ? 's' : 'w');
		div1.classList.add('w');
		myField.appendChild(div1);

		const div2 = document.createElement('div');
		div2.classList.add(p2map[i][j] === 's' ? 's' : 'w');
		div2.onclick = function () {
			if (fire(this)) {
				backfire();
			}
		};
		enemyField.appendChild(div2);
	}
}

let selectedShip = null;
const shipsDiv = document.querySelector('#ships');
shipsDiv.addEventListener('click', selectShip);
myField.addEventListener('mouseover', deckOver);
myField.addEventListener('mouseout', deckOut);
myField.addEventListener('click', setShip);

function setShip(event) {
	let point = getPoint(event.target.id);
	for (let i = 0; i < selectedShip.dataset.deckCount; i++) {
		p1map[point.row][parseInt(point.column) + i] = 1;
	}
	selectedShip = null;
	console.log(p1map);
}

function deckOver(event) {
	deckEventHandler(event, 'w', 's');
}

function deckOut(event) {
	deckEventHandler(event, 's', 'w');
}

function deckEventHandler(event, addStyle, removeStyle) {
	let point = getPoint(event.target.id);
	if (selectedShip !== null) {
		drawDecks(point, selectedShip.dataset.deckCount, addStyle, removeStyle);
	}
}

function getPoint(id) {
	let coord = id.substr(1).split("_");
	return {
		row: coord[0],
		column: coord[1]
	};
}

function drawDecks(point, deckCount, addStyle, removeStyle) {
	const currentRow = point.row;
	const currentColumn = point.column;
	for (let i = 0; i < deckCount; i++) {
		if (p1map[point.row][parseInt(point.column) + i] !== 1) {
			const column = parseInt(currentColumn) + i;
			const ship = myField.querySelector("#i" + currentRow + "_" + column);
			ship.classList.remove(addStyle);
			ship.classList.add(removeStyle);
		}
	}
}

function selectShip(event) {
	if (event.target.classList.contains("s") && !event.target.classList.contains("selected") && selectedShip === null) {
		/*shipsDiv.querySelectorAll(".s").forEach(ship => {
			ship.classList.remove("selected");
		})*/
		event.target.classList.add("selected");
		selectedShip = event.target;
		console.log(selectedShip);
	}
}

function fire(el) {
	const classList = el.classList;
	if (classList.contains('d') || classList.contains('m')) {
		return false;
	}
	if (classList.contains('s')) {
		classList.remove('s');
		classList.add('d');
	} else {
		classList.add('m');
	}
	if (document.querySelectorAll('#enemyField .s').length === 0) {
		alert('You have won!');
		return false;
	}
	if (classList.contains('m')) {
		return true;
	}
}

function backfire() {
	for (let i = w * h; i > 0; i--) {
		const targets = document.querySelectorAll('#myField .s, #myField .w')
		if (targets.length === 0 || fire(targets[Math.floor(Math.random() * targets.length)])) {
			break;
		}
	}
	if (document.querySelectorAll('#myField .s').length === 0) {
		alert('You have lost!');
	}
}