// GLOBAL VARIABLES            GLOBAL VARIABLES            GLOBAL VARIABLES            GLOBAL VARIABLES            GLOBAL VARIABLES            GLOBAL VARIABLES            GLOBAL VARIABLES            GLOBAL VARIABLES            GLOBAL VARIABLES            GLOBAL VARIABLES    

// html element variables
const globalStyle = document.querySelector('html');
const gameContainer = document.getElementById("game");
const startButtton = document.getElementById('start-button');
const guessesDisplay = document.getElementById('guesses');
const highscoreDisplay = document.getElementById('highscore');
const headerTitle = document.querySelector('h1');
const clearHighscoreButton = document.getElementById('clear');
const pairSlider = document.getElementById('pairslider');
const rangeLabel = document.getElementById('rangelabel');

// slider variables
let sliderValueOfCurrentGame = undefined;
let sliderValue = pairSlider.value;
let guessTotal = 0;

// behavior for card click
let lastCard1clickAllowed = undefined;
let lastCard2clickAllowed = undefined;
let lastCard1Id = undefined;
let amountOfCardsClicked = 0;

// highscores object
let highscoresObj = undefined;
assignHighscoresObj();


// card objects
const card1 = {
  id: "",
  color: ""
}

const card2 = {
  id: "",
  color: ""
}


// list of possible colors
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "maroon",
  "fuchsia",
  "yellow",
  "teal",
  "chartreuse",
  "coral",
  "pink",
  "deeppink",
  "gold",
  "thistle",
  "aqua",
];




// MAIN FUNCTIONS            MAIN FUNCTIONS            MAIN FUNCTIONS            MAIN FUNCTIONS            MAIN FUNCTIONS            MAIN FUNCTIONS            MAIN FUNCTIONS            MAIN FUNCTIONS            MAIN FUNCTIONS            MAIN FUNCTIONS            

// function for creating cards
function createDivsForColors(colorArray) {
  let cardCount = 0;
  for (let color of colorArray) {
    // increments card count
    cardCount++

    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // sets attribute used to determine whether clicking on each card is valid
    newDiv.dataset.allowClickInd = 'true';

    // adds unique card id
    newDiv.setAttribute('id', `card-${cardCount}`);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", function(event){
      handleCardClick(event);
      onlyTwoCards(event);
    });

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}



// Allows only two cards to be clicked
function onlyTwoCards(event){
  // action if one card has been clicked
  if(event.target.tagName === 'DIV' && allowedToClick(event) && amountOfCardsClicked === 0) {
        amountOfCardsClicked++;
  } else if (event.target.tagName === 'DIV' && amountOfCardsClicked === 1 && allowedToClick(event) && !didYouClickTheSameCardTwice(event)) {
   
    if (!doCardsMatch(card1, card2)) {
        ifCardsDoNotMatch();
    } else if (doCardsMatch(card1, card2)) {
        ifCardsMatch();
    }

  } 
}


function handleCardClick(event) {
  // variables
  let cardID = event.target.id;
  let cardColor = event.target.className;
  
    // flips card if two are not already turned over
    if (amountOfCardsClicked === 0 && allowedToClick(event)) {
          // assign card1 obj and flip card 1
          event.target.style.backgroundColor = cardColor;
          card1.id = event.target.id;
          card1.color = event.target.className;  
          lastCard1clickAllowed = event.target.dataset;
          lastCard1Id = event.target.id;
    }

    if (amountOfCardsClicked === 1 && allowedToClick(event)) {
          // assign card2 obj and flip card 2
          event.target.style.backgroundColor = cardColor;
          card2.id = event.target.id;
          card2.color = event.target.className;  
          lastCard2clickAllowed = event.target.dataset;
  }
}


// function that checks if the two cards selected have a matching class (color)   &&   it increments and updates the Guesses display  &&   it checks if game is over
function ifCardsMatch(){
  amountOfCardsClicked = 0;
  gameContainer.dataset.allowClick = 'true' 
  lastCard1clickAllowed.allowClickInd = 'false';
  lastCard2clickAllowed.allowClickInd = 'false';
  guessTotal++;
  guessesDisplay.innerText = `Guesses: ${guessTotal}`;
  if (isGameOver()) {
    whenGameisOver();
  }
}


// function that flips cards backover and allows them to be clicked again  &&  it aslo increments and updates the Guesses display
function ifCardsDoNotMatch(){
  // so nothing can be clicked during the 1 second wait period
  gameContainer.dataset.allowClick = 'false';
  guessTotal++;
  guessesDisplay.innerText = `Guesses: ${guessTotal}`;

  setTimeout(function(){
    amountOfCardsClicked = 0;
    gameContainer.dataset.allowClick = 'true'
    document.getElementById(card1.id).style.backgroundColor = 'white';
    document.getElementById(card2.id).style.backgroundColor = 'white';
    lastCard1clickAllowed.allowClickInd = 'true';
    lastCard2clickAllowed.allowClickInd = 'true';
  }, 1000);
}


// function for generating array of color pairs
function generateCardPairsColor(){
  let colorsCopy = COLORS.slice();
  let returnColors = [];
  for (let i = 0; i < sliderValue; i++) {
    let roll = Math.floor(Math.random() * colorsCopy.length);
    let colorPicked = colorsCopy[roll];
    returnColors.push(colorPicked);
    returnColors.push(colorPicked);
     colorsCopy.splice(roll, 1);
  }
  return returnColors;
}




// HELPER FUNCTIONS            HELPER FUNCTIONS            HELPER FUNCTIONS            HELPER FUNCTIONS            HELPER FUNCTIONS            HELPER FUNCTIONS            HELPER FUNCTIONS            HELPER FUNCTIONS            HELPER FUNCTIONS            HELPER FUNCTIONS  

// function that shuffles an array (Fisher Yates Algorithm)
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}



// function to check if both cards match
function doCardsMatch(card1, card2) {
    if (card1.color === card2.color) {
      return true;
    }
    return false;
}


// function to check if click is allowed
function allowedToClick(event) {
    if (event.target.dataset.allowClickInd === 'true' && gameContainer.dataset.allowClick === 'true') {
        return true;
    } else {
      return false;
    }
}



// function that prevents 'amountOfCardsClicked' to increment if card is not clickable
function didYouClickTheSameCardTwice(event) {
  if (event.target.id === lastCard1Id) {
      return true;
  } else {
    return false;
  }
}




// function that checks if game is over by returning true if all card divs are unable to be clicked
function isGameOver(){
  let allCards = gameContainer.querySelectorAll('div');
  for (let card of allCards) {
    if (card.dataset.allowClickInd === 'true') {
      return false;
    } 
  }
  return true;
}



// function that updates highscores when game is over
function whenGameisOver(){
  headerTitle.innerText = 'YOU WON!';
      // stores current score as highscore if there is no score in localStorage
  if (highscoreDisplay.innerText === 'High Score: N/A') {
      highscoresObj[sliderValueOfCurrentGame] = guessTotal;
      localStorage.setItem('Highscores', JSON.stringify(highscoresObj));
      setHighScoreDisplayValue();
   
      // checks to see if current game's score is lower than highscore in localStorage
  } else if (guessTotal < highscoresObj[sliderValueOfCurrentGame]) {
      highscoresObj[sliderValueOfCurrentGame] = guessTotal;
      localStorage.setItem('Highscores', JSON.stringify(highscoresObj));
      setHighScoreDisplayValue();
  }
}


// creates default Highscores obj if none exists in localStorage
function createDefaultHighscoresIfNoneExists() {
  if (!localStorage.Highscores) {
   let tempHighscoreObj = {
    2: 'N/A',
    3: 'N/A',
    4: 'N/A',
    5: 'N/A',
    6: 'N/A',
    7: 'N/A',
    8: 'N/A',
    9: 'N/A',
    10: 'N/A'
   };

    localStorage.setItem('Highscores', JSON.stringify(tempHighscoreObj));
  }
}




// function the creates restart filter blur effect
function startBlurEffect(){
  globalStyle.style.filter = 'blur(5px)';
  setTimeout(function(){
    globalStyle.style.filter = 'blur(0px)';
  }, 500)
}



// function for handling default object values
function assignHighscoresObj(){
  if (localStorage.Highscores) {
    highscoresObj = JSON.parse(localStorage.Highscores);
  } else {
    highscoresObj = {
      2: 'N/A',
      3: 'N/A',
      4: 'N/A',
      5: 'N/A',
      6: 'N/A',
      7: 'N/A',
      8: 'N/A',
      9: 'N/A',
      10: 'N/A'
     };
  }
}



//function that assigns text for highscoreDisplay
function setHighScoreDisplayValue(){
  highscoreDisplay.innerText = 'High Score: ' + highscoresObj[sliderValue];
}



// function that sets flex-basis style relative to the amount of cards
function setFlexBasis(){
  let allCards = gameContainer.querySelectorAll('div');
  let flexBasisPercentage = undefined;
  
  switch (sliderValue){
    case '2':
      flexBasisPercentage = '40%';
      break;
    case '3':
      flexBasisPercentage = '30%';
      break;
    case '4':
      flexBasisPercentage = '21%';
      break;
    case '5':
      flexBasisPercentage = '16%';
      break;
    case '6':
      flexBasisPercentage = '13%';
      break;
    case '7':
      flexBasisPercentage = '11%';
      break;
    case '8':
      flexBasisPercentage = '21%';
      break;
    case '9':
      flexBasisPercentage = '13%';
      break;
    case '10':
      flexBasisPercentage = '16%';
      break;
    default:
      console.log('setFlexBasis: SWITCH PROBLEM !!')
  }
  
  for (let card of allCards) {
    card.style.flexBasis = flexBasisPercentage;
  }
}




// EVENT LISTENERS            EVENT LISTENERS            EVENT LISTENERS            EVENT LISTENERS            EVENT LISTENERS            EVENT LISTENERS            EVENT LISTENERS            EVENT LISTENERS            EVENT LISTENERS            EVENT LISTENERS            

// creates new game when start/restart button is clicked   &&  adjusts start/restart button color 
startButtton.addEventListener('click', function(event){
  event.preventDefault();
  guessTotal = 0;
  guessesDisplay.innerText = `Guesses: ${guessTotal}`;
  
  if (startButtton.value === 'PRESS TO START!') {
      let shuffledColors = shuffle(generateCardPairsColor());
      createDivsForColors(shuffledColors);
      startButtton.value = "RESTART!";
      startButtton.style.backgroundColor = `rgb(246, 255, 177)`;
      sliderValueOfCurrentGame = sliderValue;

  } else if (startButtton.value === 'RESTART!') {
      let shuffledColors = shuffle(generateCardPairsColor());
      headerTitle.innerText = 'Memory Game!';
      gameContainer.innerHTML = "";
      startBlurEffect();
      createDivsForColors(shuffledColors);
      sliderValueOfCurrentGame = sliderValue;
  }

  setFlexBasis();
}); 



//adjusts pair slider value
pairSlider.addEventListener('input', function(event){
  sliderValue = event.target.value;
  rangeLabel.innerText = `${sliderValue} Pairs`;
  setHighScoreDisplayValue();
})




// clears highscore in localStorage when clicked
clearHighscoreButton.addEventListener('click', function(event){
  localStorage.removeItem('Highscores');
  createDefaultHighscoresIfNoneExists();
  assignHighscoresObj();
  setHighScoreDisplayValue();
}) 




// loads highscore and creates default highscores if necessecary when page is opened
document.addEventListener("DOMContentLoaded", function(){
  createDefaultHighscoresIfNoneExists();
  setHighScoreDisplayValue();
})










// POSSIBLE IMPROVEMENTS:

  // Header element spatial relaionships are still sort of sloppy
    // Maybe rework entire header as flexbox?
