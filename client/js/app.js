const w = 10;
const h = 10;
const p1map = ['~ss~~~~s~~', '~~~~~~~~~~', '~~~~s~~~~s', '~s~~~~s~~s', '~s~~~~s~~s', '~s~~~~~~~~', '~~~~~~~~s~', '~~~~ss~~~~', '~s~~~~~~~~', '~~~~ssss~~'];
const p2map = ['~~~s~~~~ss', '~s~s~~~~~~', '~~~s~~~~~~', '~~~s~~~s~~', '~~~~~~~s~~', '~s~~s~~s~~', '~s~~~~~~~~', '~s~s~~~~~~', '~~~~~ss~~~', 'ss~~~~~~s~'];

const myField = document.querySelector('#myField'), enemyField = document.querySelector('#enemyField');
for (i = 0; i < w; i++) {
	for (j = 0; j < h; j++) {
		div1 = document.createElement('div');
		div1.id = i + '_' + j;
		div1.classList.add(p1map[i][j] === 's' ? 's' : 'w');
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

const sheeps = document.querySelector('#sheeps');
sheeps.addEventListener('click', chooseSheep);

function chooseSheep(event) {
	if (event.target.classList.contains("s")) {
		event.target.classList.toggle("selected");
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