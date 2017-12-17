document.addEventListener('contextmenu', function (e) {
	e.preventDefault();
});
const ENEMY_HUMAN = 'human';

document.querySelector('#join').addEventListener('click', onJoin);
let name = '';
let enemy = ENEMY_HUMAN;
Array.from(document.getElementsByName('enemy')).forEach(input => {
	console.log('123');
	input.addEventListener('change', onChangeEnemy)
	if (input.value === enemy) {
		input.checked = true;
	}
})

function onChangeEnemy(event) {
	enemy = event.target.value;
}

function onJoin(event) {
	event.preventDefault();
	if (enemy !== ENEMY_HUMAN) {
		const href = 'https://neto-api.herokuapp.com/signin';
		let data = {
			email: "asdqqqqqq@asd.com",
			password: "123"
		};
		const request = new XMLHttpRequest();
		request.open('POST', href);
		request.setRequestHeader('Content-Type', 'application/json');
		request.addEventListener('load', onJoinLoadRequest);
		request.send(JSON.stringify(data));
	} else {
		onJoinLoadRequest()
	}
}

function onJoinLoadRequest() {
	document.querySelector('#loginForm').classList.add('hidden');
	name = document.querySelector('#name').value;
	document.querySelector('#message').innerText = 'Кликните по кораблю и установите его в поле, ' + name;
	document.querySelector('#gameField').classList.remove('hidden');
}

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

let isMyStep = false;

function changeStatusStep(isMy) {
	isMyStep = isMy;
	if (isMyStep) {
		document.querySelector('#message').innerText = 'Cтреляйте по вражескому полю, ' + name;
	} else {
		document.querySelector('#message').innerText = 'Ожидайте, ' + name;
	}
}

function tryToPlay() {
	if (shipsDiv.querySelectorAll('.s:not(.selected)').length === 0) {
		shipsDiv.classList.add('hidden');
		myField.removeEventListener('mouseover', deckOver);
		myField.removeEventListener('mouseout', deckOut);
		myField.removeEventListener('click', setShip);
		changeStatusStep(false);
		if (enemy !== ENEMY_HUMAN) {
			const ws = new WebSocket('wss://neto-api.herokuapp.com/realtime');
			ws.addEventListener('message', getSocketMessage);
		} else {
			drawEnemyField();
			changeStatusStep(true);
		}
	}
}

let isFirstMesage = true;

function getSocketMessage(event) {
	let data = JSON.parse(event.data);
	if (isFirstMesage) {
		console.log(data);
		drawEnemyField();
		isFirstMesage = false;
		changeStatusStep(true);
	} else if (!isMyStep) {
		console.log(data);
		backfire();
	}
}

function drawEnemyField() {
	const p2map = ['~~~s~~~~ss', '~s~s~~~~~~', '~~~s~~~~~~', '~~~s~~~s~~', '~~~~~~~s~~', '~s~~s~~s~~', '~s~~~~~~~~', '~s~s~~~~~~', '~~~~~ss~~~', 'ss~~~~~~s~'];
	for (let i = 0; i < w; i++) {
		for (let j = 0; j < h; j++) {
			const div2 = document.createElement('div');
			div2.classList.add(p2map[i][j] === 's' ? 's' : 'w');
			div2.onclick = function () {
				if (isMyStep && fire(this)) {
					changeStatusStep(false);
					if (enemy === ENEMY_HUMAN) {
						backfire();
					}
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
		drawDecks(point, selectedShip.dataset.deckCount, addStyle);
	}
}

function deckOut(event) {
	let point = getPoint(event.target.id);
	if (selectedShip !== null) {
		isCorrectPlace = true;
		drawDecks(point, selectedShip.dataset.deckCount);
	}
}

function getPoint(id) {
	let point = id.substr(1).split("_");
	return {
		row: point[0],
		column: point[1]
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

function drawDecks(point, deckCount, addStyle) {
	const currentRow = point.row;
	const currentColumn = point.column;
	if (isHorizontalShip) {
		for (let i = 0; i < deckCount; i++) {
			const column = parseInt(currentColumn) + i;
			drawDeck(currentRow, column, addStyle);
		}
	} else {
		for (let i = 0; i < deckCount; i++) {
			const row = parseInt(currentRow) + i;
			drawDeck(row, currentColumn, addStyle);
		}
	}
}

function drawDeck(row, column, addStyle) {
	if (row >= 0 && row < h && column >= 0 && column < w) {
		if (!addStyle) {
			addStyle = p1map[row][column] === 's' ? 's' : 'w';
		}
		const ship = myField.querySelector("#i" + row + "_" + column);
		ship.classList = '';
		ship.classList.add(addStyle);
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
	setTimeout(function () {
		for (let i = w * h; i > 0; i--) {
			const targets = document.querySelectorAll('#myField .s, #myField .w')
			if (targets.length === 0 || fire(targets[Math.floor(Math.random() * targets.length)])) {
				break;
			}
		}
		if (document.querySelectorAll('#myField .s').length === 0) {
			alert('You have lost!');
		}
		changeStatusStep(true);
	}, 1000);
}