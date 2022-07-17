const PATH_CARDS = '';
let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let hidden;
let deck;
let canHit = true;
let userName = '';

window.onload = function () {
	document.querySelector('.container').style.visibility = 'hidden';
	document.querySelector('.container').style.position = 'fixed';
}

document.addEventListener('keydown' , (e) => {
	if(document.querySelector('#modal').style.visibility != 'hidden'){
		if(e.code == 'Enter'){
			clickEvent()
		}
	}

})

function clickEvent(){
	if(document.querySelector('#username').value == '' || document.querySelector('#username').value.length < 3) {
		alert('Name is not correct!')
		document.querySelector('#username').value = ''
		document.querySelector('#username').classList.add('n-correct');
	} else {
		userName = document.querySelector('#username').value
		load();
		document.querySelector('#modal').style.visibility = 'hidden';
		document.querySelector('#modal').style.position = 'fixed';
		document.querySelector('.container').style.visibility = 'visible';
		document.querySelector('.container').style.position = 'static';
	}
}

document.querySelector('.button-login').onclick = function() {
	clickEvent()
}

function addUserNameElement() {
    document.querySelector('.user-name').innerText = userName;
    let span = document.createElement('span');
    span.id = 'your-sum';
    document.querySelector('.user-name').append(span);
}

function buildDeck() {
    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let types = ['C', 'D', 'H', 'S'];
    deck = [];
    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + '-' + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    while (dealerSum < 17) {
        let cardImg = document.createElement('img');
        let card = deck.pop();
        cardImg.src = './img/cards/' + card + '.png';
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById('dealer-cards').append(cardImg);
    }
    console.log(dealerSum)
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement('img');
        let card = deck.pop();
        cardImg.src = './img/cards/' + card + '.png';
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById('your-cards').append(cardImg);
    }
    document.getElementById('hit').addEventListener('click', hit);
    document.getElementById('stay').addEventListener('click', stay);
    document.getElementById('reset').addEventListener('click', resetGame);
}

function resetGame() {
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;
    hidden = null;
    deck = null;
    document.getElementById("your-cards").innerHTML = '';
    document.getElementById("dealer-cards").innerHTML = '<img id="hidden" src="./img/cards/BACK.png" alt="img">';
    document.getElementById('dealer-sum').innerText = '';
    document.getElementById('your-sum').innerText = '';
    document.getElementById('results').innerText = '';
    buildDeck();
    shuffleDeck();
    startGame();
}

function hit() {
    if (!canHit) {
        return;
    }
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './img/cards/' + card + '.png';
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById('your-cards').append(cardImg);
    if (reduseAce(yourSum, yourAceCount) > 21) {
        canHit = false;
    }
}

function stay() {
    dealerSum = reduseAce(dealerSum, dealerAceCount);
    yourSum = reduseAce(yourSum, yourAceCount);
    canHit = false;
    document.getElementById('hidden').src = './img/cards/' + hidden + '.png';
    let message = '';
    if (yourSum > 21) {
        message = 'You lose!';
    } else if (dealerSum > 21) {
        message = 'You win!';
    } else if (yourSum == dealerSum) {
        message = 'Tie!';
    } else if (yourSum > dealerSum) {
        message = 'You win!';
    } else if (yourSum < dealerSum) {
        message = 'You lose!';
    }
    document.getElementById('dealer-sum').innerText = ': ' + dealerSum;
    document.getElementById('your-sum').innerText = ': ' + yourSum;
    document.getElementById('results').innerText = message;
}

function getValue(card) {
    let data = card.split('-');
    let value = data[0];
    if (isNaN(value)) {
        if (value == 'A') {
            return 11; // A count
        }
        return 10; // other NaN count
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == 'A') {
        return 1;
    }
    return 0;
}

function reduseAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function load() {
    addUserNameElement();
    buildDeck();
    shuffleDeck();
    startGame();
}