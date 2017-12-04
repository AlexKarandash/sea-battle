const w = 10;
const h = 10;
const p1map = ['~ss~~~~s~~', '~~~~~~~~~~', '~~~~s~~~~s', '~s~~~~s~~s', '~s~~~~s~~s', '~s~~~~~~~~', '~~~~~~~~s~', '~~~~ss~~~~', '~s~~~~~~~~', '~~~~ssss~~'];
const p2map = ['~~~s~~~~ss', '~s~s~~~~~~', '~~~s~~~~~~', '~~~s~~~s~~', '~~~~~~~s~~', '~s~~s~~s~~', '~s~~~~~~~~', '~s~s~~~~~~', '~~~~~ss~~~', 'ss~~~~~~s~'];

const myField = document.querySelector('#myField'), enemyField = document.querySelector('#enemyField');
for (i = 0; i < w; i++) {
	for (j = 0; j < h; j++) {
		div1 = document.createElement('div');
		div1.id = 'i' + i + '_' + j;
		//div1.classList.add(p1map[i][j] === 's' ? 's' : 'w');
		div1.classList.add('w');
		myField.appendChild(div1);

		div2 = document.createElement('div');
		div2.classList.add(p2map[i][j] === 's' ? 's' : 'w');
		div2.onclick = function () {
			if (fire(this)) {
				backfire();
			}
		};
		enemyField.appendChild(div2);
	}
}

let selectedShip;
const shipsDiv = document.querySelector('#ships');
shipsDiv.addEventListener('click', selectShip);
myField.addEventListener('mouseover', deckOver);
myField.addEventListener('mouseout', deckOut);

function deckOver(event) {
	console.log(event.target.id);
	let id = event.target.id;
	let coord = id.substr(1).split("_");
	let row = coord[0];
	let column = coord[1];
	console.log(column);
	drawShip(row, column, selectedShip.dataset.deckCount);
}

function deckOut(event) {
	console.log(event.target.id);
	let id = event.target.id;
	let coord = id.substr(1).split("_");
	let row = coord[0];
	let column = coord[1];
	console.log(column);
	clearShip(row, column, selectedShip.dataset.deckCount);
}

function drawShip(currentRow, currentColumn, deckCount) {
	for (let i = 0; i < deckCount; i++) {
		const column = parseInt(currentColumn) + i;
		const ship = myField.querySelector("#i" + currentRow + "_" + column);
		ship.classList.remove('w');
		ship.classList.add('s');
		console.log("#i" + currentRow + "_" + column);
		console.log(myField.querySelector("#i" + currentRow + "_" + column));
	}
}

function clearShip(currentRow, currentColumn, deckCount) {
	for (let i = 0; i < deckCount; i++) {
		const column = parseInt(currentColumn) + i;
		const ship = myField.querySelector("#i" + currentRow + "_" + column);
		ship.classList.remove('s');
		ship.classList.add('w');
		console.log("#i" + currentRow + "_" + column);
		console.log(myField.querySelector("#i" + currentRow + "_" + column));
	}
}

function selectShip(event) {
	if (event.target.classList.contains("s") && selectedShip !== event.target) {
		shipsDiv.querySelectorAll(".s").forEach(ship => {
			ship.classList.remove("selected");
		})
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
	for (i = w * h; i > 0; i--) {
		var targets = document.querySelectorAll('#myField .s, #myField .w');
		if (targets.length === 0 || fire(targets[Math.floor(Math.random() * targets.length)])) {
			break;
		}
	}
	if (document.querySelectorAll('#myField .s').length === 0) {
		alert('You have lost!');
	}
}