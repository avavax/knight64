// 1. Шахматная доска

// кеширование document для экономии ресурсов
var $d = document;

var $chessboard = $d.getElementById('chessboard');
var $stepBack = $d.getElementById('return');
var $clear = $d.getElementById('clear');
var steps = [];

var statusGame = 0;

var board = {

	draw: function() {
		var vertical = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

		// Функция, которая добавляет на поле клеточку. 0 - белая, 1 - чёрная, 2 - прозрачная
		var addCell = function(color = 2, caption = '', bord = 'none', x = 0, y = 0, num = 0) {
			
			var $newCell = $d.createElement('div');
			$newCell.classList.add('cell');
			
			switch (color) {
				case 0: 
					$newCell.classList.add('light');
					break;
				case 1: 
					$newCell.classList.add('dark');
					break;
				case 2: 
					$newCell.classList.add('text');	
					break;				
			}

			switch (bord) {
				case 'top': 
					$newCell.classList.add('top');
					break;
				case 'right': 
					$newCell.classList.add('right');
					break;	
				case 'bottom': 
					$newCell.classList.add('bottom');
					break;
				case 'left': 
					$newCell.classList.add('left');
					break;										
			}

			if (x) {
				$newCell.setAttribute('x', x);
			}
			if (y) {
				$newCell.setAttribute('y', y);
			}
			if (num) {
				$newCell.setAttribute('num', 0);
			}

			$newCell.textContent = caption;
			$chessboard.appendChild($newCell);
		}

		// Выводим буквы аннотации в 0 и 10 строке
		var horCaption = function(bord) {
			addCell();
			for (var i = 1; i < 9; i++) {
				addCell(2, vertical[i - 1], bord);
			}
			addCell(bord);			
		}

		horCaption('bottom');
		var shift = 1;
		for (i = 8; i > 0; i--) {
			shift = 1 - shift;
			addCell(2, i, 'right');
			for (j = 0; j < 8; j ++) {
				addCell(((j + shift)  % 2), '', 'none', j + 1, i);

			}
			addCell(2, i, 'left');
		}
		horCaption('top');
	}
};

// Объект Конь. Свойства - текущее положение, метод - проверка на возможность перемещения
var knight = {
	$currentKnight: '',
	currentNum: 1,
	isRightMove: function(e) {
		var xNew = e.target.getAttribute('x');
		var yNew = e.target.getAttribute('y');
		if (xNew > 8 || xNew < 1 || yNew > 8 || yNew < 1) {
			return false;
		}
		var x = this.$currentKnight.getAttribute('x');
		var y = this.$currentKnight.getAttribute('y');
		if ((Math.abs(x - xNew) === 2) && (Math.abs(y - yNew) === 1) ||
		 (Math.abs(y - yNew) === 2) && (Math.abs(x - xNew) === 1)) {
			if (e.target.getAttribute('num') !== null) {
				return false;
			} else {
				return true;
			}
		}
		return false;
	}
}

var addKnight = function(e) {
	$currentDiv = e.target;
	
	if (!statusGame) {
		if (!e.target.getAttribute('x')) {
			return false;
		}
		$currentDiv.classList.toggle('knight');
		$currentDiv.setAttribute('num', 1);
		knight.$currentKnight = $currentDiv;
		statusGame = 1;
	} else {
		if (!knight.isRightMove(e)) {
			return;
		} else {
			knight.$currentKnight.classList.remove('knight');
			knight.$currentKnight.textContent = knight.currentNum;
			$currentDiv.setAttribute('num', knight.currentNum);
			$currentDiv.classList.add('knight');
			knight.$currentKnight = $currentDiv;
			knight.currentNum++;			
		}		
	}
	steps.push($currentDiv);
}

var newGame = function() {
	statusGame = 0;
	$chessboard.textContent ='';
	knight.currentNum = 1;
	board.draw();
}

var stepReward = function() {
	if (knight.currentNum === 1) {
		return;
	}
	steps[steps.length - 1].classList.toggle('knight');
	steps[steps.length - 1].removeAttribute('num');	
	knight.currentNum--;
	steps[steps.length - 2].classList.toggle('knight');
	steps[steps.length - 2].textContent = '';
	steps.length--;	
	knight.$currentKnight = steps[steps.length - 1];
}

$chessboard.addEventListener('click', addKnight);
$clear.addEventListener('click', newGame);
$stepBack.addEventListener('click', stepReward);

board.draw();
