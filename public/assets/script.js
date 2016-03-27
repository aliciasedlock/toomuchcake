$(function() {
	function Game() {
		// Stored elements
		this.gameArea = document.getElementById('gameArea');
		this.grandma = document.getElementById('grandma');
		this.timerEl = document.getElementById('timer');
		this.levelEl = document.getElementById('level');
		// Game board
		this.width = parseInt(window.getComputedStyle(this.gameArea).width); // using vw so we need computed
		this.height = parseInt(window.getComputedStyle(this.gameArea).height); // using vh so we need computed
		// Internal stats
		this.timeLeft;
		this.level;
		this.isGrandmaClear;
		this.cakeWidth;
		this.cakeHeight;
		this.audio = new AudioInterface();
	}

	/*
	* Inital setup, cake generation, placement.
	*/
	Game.prototype.startGame = function() {
		document.getElementById('intro').classList.add('hidden');
		document.getElementById('gameArea').classList.remove('hidden');
		document.getElementById('defeatScreen').classList.remove('show');
		this.setInternalStats();
		this.initGameArea();
	}

	Game.prototype.setInternalStats = function() {
		this.timeLeft = 15;
		this.level = 1;
		this.isGrandmaClear = false;
		this.cakeWidth = 350;
		this.cakeHeight = 300;
		$('.cake').remove();
	}

	Game.prototype.initGameArea = function() {
		var game = this;

		this.positionGrandma();
		this.placeCake();
		this.grandma.classList.remove('secret');
		this.levelEl.innerHTML = this.level;
		game.timerEl.innerHTML = game.timeLeft;

		$('.cake').draggable({
			containment: "#gameArea",
			stop: game.detectGrandmaCoverage.bind(game)
		});

		this.timer = setInterval(function() {
			game.timeLeft--;
			game.timerEl.innerHTML = game.timeLeft;

			if (!game.timeLeft) {
				document.getElementById('defeatScreen').classList.add('show');
				document.getElementById('gameArea').classList.add('hidden');
				clearInterval(game.timer);
				game.audio.initAudio('assets/audio/ded.mp3', false);
			}
		}, 1000);

		if (Math.round(Math.random())) {
			game.audio.initAudio('assets/audio/ohno.mp3', false);
		} else {
			game.audio.initAudio('assets/audio/helpme.mp3', false);
		}
	}

	/*
	* Adds a random assortment of cakes based on current difficulty.
	*/
	Game.prototype.placeCake = function() {
		var header = document.getElementById('stats');
		var cakeCountWidth = Math.round(this.width / this.cakeWidth);
		var cakeCountWHeight = Math.round(this.height / this.cakeHeight);
		var totalCake = ((cakeCountWHeight * cakeCountWHeight) * this.level) * 2;
		var maxX = this.width - this.cakeWidth;
		var maxY = this.height - this.cakeHeight;
		var minY = parseInt(window.getComputedStyle(header).height);

		for (var i = 0; i < totalCake; i++) {
			var number = parseInt(Math.random() * (9) + 1); // used to grab random cake image
			var xPos = parseInt(Math.random() * maxX);
			var yPos = parseInt(Math.random() * (maxY - minY) + minY);
			var element = new Image();

			element.setAttribute('style', 'width: ' + this.cakeWidth + 'px; height: ' + this.cakeHeight + 'px; left: ' + xPos + 'px; top: ' + yPos + 'px;');
			element.setAttribute('class', 'cake');
			element.src = 'images/cake/' + number + '.png';
			this.gameArea.appendChild(element);
		}
	}

	/*
	* Resets grandma's position in the game area.
	*/
	Game.prototype.positionGrandma = function() {
		var minY = parseInt(window.getComputedStyle(document.getElementById('stats')).height);
		var xPos = parseInt(Math.random() * (this.width - 235));
		var yPos = parseInt(Math.random() * (this.height - minY) + minY);


		this.grandma.setAttribute('style', 'left: ' + xPos + 'px; top: ' + yPos + 'px;');
	}

	/*
	* Loops through all cake items to see if any are
	* overlapping with grandma. If grandma is clear, we 
	* move on to the next difficulty.
	*/
	Game.prototype.detectGrandmaCoverage = function() {
		var cake = document.getElementsByClassName('cake');
		var game = this;

		for (var i = 0; i < cake.length; i++) {
			var element = cake[i];
			if (this.grandmaHitTest.toObject(element)) {
				this.isGrandmaClear = false;
				return;
			} else {
				this.isGrandmaClear = true;
			}
		}

		if (this.isGrandmaClear) {
			document.getElementById('victoryScreen').classList.add('show');
			document.getElementById('gameArea').classList.add('hidden');
			clearInterval(this.timer);
			game.audio.initAudio('assets/audio/thankgoodness.mp3', false);
		}
	}

	Game.prototype.increaseDifficulty = function() {
		this.level++;
		this.cakeWidth -= 50;
		this.cakeHeight -= 50;
	}

	Game.prototype.resetForNextLevel = function() {
		$('.cake').remove();
		this.grandma.classList.add('secret');
		document.getElementById('victoryScreen').classList.remove('show');
		this.increaseDifficulty();
		this.timeLeft += 10;
		clearInterval(this.timer);
		this.initGameArea();
		document.getElementById('gameArea').classList.remove('hidden');
	}

	/*
	* Kick off the jam
	*/
	var game = new Game();
	game.grandmaHitTest = new HitTest(game.grandma);
	game.audio.initAudio('assets/audio/lolmusic.mp3', true);

	document.getElementById('startGame').addEventListener('click', game.startGame.bind(game), false);
	document.getElementById('newGame').addEventListener('click', game.startGame.bind(game), false);
	document.getElementById('generateLevel').addEventListener('click', game.resetForNextLevel.bind(game), false);
	document.getElementById('goHome').addEventListener('click', function() { document.location.reload() }, false);
});
