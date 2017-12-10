document.addEventListener('contextmenu', function (e) {
	e.preventDefault();
});

const w = 10;
const h = 10;
const p1map = new Array(h);
for (let i = 0; i < h; i++) {
	p1map[i] = new Array(w);
}

const myField = document.querySelector('#myField'), enemyField = document.querySelector('#enemyField');
for (let i = 0; i < w; i++) {
	for (let j = 0; j < h; j++) {
		const div1 = document.createElement('div');
		div1.id = 'i' + i + '_' + j;
		div1.classList.add('w');
		myField.appendChild(div1);
	}
}

let selectedShip = null;
let isHorizontalShip = true;
let isCorrectPlace = true;
const shipsDiv = document.querySelector('#ships');
shipsDiv.addEventListener('click', selectShip);
myField.addEventListener('mouseover', deckOver);
myField.addEventListener('mouseout', deckOut);
myField.addEventListener('click', setShip);
myField.addEventListener('contextmenu', changeDirection);

function changeDirection(event) {
	deckOut(event);
	isHorizontalShip = !isHorizontalShip;
	deckOver(event);
}

function setShip(event) {
	if (selectedShip !== null && isCorrectPlace) {
		let point = getPoint(event.target.id);
		if (isHorizontalShip) {
			for (let i = 0; i < selectedShip.dataset.deckCount; i++) {
				const column = parseInt(point.column) + i;
				p1map[point.row][column] = 's';
			}
		} else {
			for (let i = 0; i < selectedShip.dataset.deckCount; i++) {
				const row = parseInt(point.row) + i;
				p1map[row][point.column] = 's';
			}
		}
		selectedShip = null;
	}
	tryToPlay();
}

function tryToPlay() {
	if (shipsDiv.querySelectorAll('.s:not(.selected)').length === 0) {
		shipsDiv.classList.add('hidden');
		document.querySelector('p').innerText = 'Игра началась, стреляйте по вражескому полю';
		drawEnemyField();
		myField.removeEventListener('mouseover', deckOver);
		myField.removeEventListener('mouseout', deckOut);
		myField.removeEventListener('click', setShip);
	}
}

function drawEnemyField() {
	const p2map = ['~~~s~~~~ss', '~s~s~~~~~~', '~~~s~~~~~~', '~~~s~~~s~~', '~~~~~~~s~~', '~s~~s~~s~~', '~s~~~~~~~~', '~s~s~~~~~~', '~~~~~ss~~~', 'ss~~~~~~s~'];
	for (let i = 0; i < w; i++) {
		for (let j = 0; j < h; j++) {
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
	enemyField.classList.remove('hidden');
}

function deckOver(event) {
	let point = getPoint(event.target.id);
	if (selectedShip !== null) {
		isCorrectPlace = checkDecksForShip(point, selectedShip.dataset.deckCount);
		let addStyle = isCorrectPlace ? 's' : 'd';
		drawDecks(point, selectedShip.dataset.deckCount, addStyle, 'w');
	}
}

function deckOut(event) {
	let point = getPoint(event.target.id);
	if (selectedShip !== null) {
		let removeStyle = isCorrectPlace ? 's' : 'd';
		isCorrectPlace = true;
		drawDecks(point, selectedShip.dataset.deckCount, 'w', removeStyle);
	}
}

function getPoint(id) {
	let coord = id.substr(1).split("_");
	return {
		row: coord[0],
		column: coord[1]
	};
}

function checkDecksForShip(point, deckCount) {
	const currentRow = point.row;
	const currentColumn = point.column;
	if (isHorizontalShip) {
		if (parseInt(currentColumn) + parseInt(deckCount) > w) {
			return false;
		}
		for (let i = 0; i < deckCount; i++) {
			const column = parseInt(currentColumn) + i;
			if (!checkDeckForShip(currentRow, column)) {
				return false;
			}
		}
	} else {
		if (parseInt(currentRow) + parseInt(deckCount) > h) {
			return false;
		}
		for (let i = 0; i < deckCount; i++) {
			const row = parseInt(currentRow) + i;
			if (!checkDeckForShip(row, currentColumn)) {
				return false;
			}
		}
	}
	return true;
}

function checkDeckForShip(row, column) {
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			let currentRow = parseInt(row) + i;
			let currentColumn = parseInt(column) + j;
			if (currentRow >= 0 && currentRow < h && currentColumn >= 0 && currentColumn < w) {
				if (p1map[currentRow][currentColumn] === 's') {
					return false;
				}
			}

		}
	}
	return true;
}

function drawDecks(point, deckCount, addStyle, removeStyle) {
	const currentRow = point.row;
	const currentColumn = point.column;
	if (isHorizontalShip) {
		for (let i = 0; i < deckCount; i++) {
			const column = parseInt(currentColumn) + i;
			drawDeck(currentRow, column, addStyle, removeStyle);
		}
	} else {
		for (let i = 0; i < deckCount; i++) {
			const row = parseInt(currentRow) + i;
			drawDeck(row, currentColumn, addStyle, removeStyle);
		}
	}
}

function drawDeck(row, column, addStyle, removeStyle) {
	if (row >= 0 && row < h && column >= 0 && column < w) {
		if (p1map[row][column] !== 's') {
			const ship = myField.querySelector("#i" + row + "_" + column);
			ship.classList.remove(removeStyle);
			ship.classList.add(addStyle);
		}
	}
}

function selectShip(event) {
	if (event.target.classList.contains("s") && !event.target.classList.contains("selected") && selectedShip === null) {
		isCorrectPlace = true;
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