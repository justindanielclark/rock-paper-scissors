const RockSVG = document.querySelector('#rock').cloneNode(true)
const PaperSVG = document.querySelector('#paper').cloneNode(true);
const ScissorsSVG = document.querySelector('#scissors').cloneNode(true);
const PlayerSVGs = [RockSVG, PaperSVG, ScissorsSVG];
PlayerSVGs.forEach(item => {
  item.id = "";
})

const States = {
  idle: Symbol('idle'),
  preFistBump: Symbol('preFistBump'),
  preBattle: Symbol('preBattle'),
  battle: Symbol('battle'),
  resolveBattle: Symbol('resolveBattle')
}

const Game = {
  preBattleRotates: 0,
  state: States.idle,
  PlayerSVGs: PlayerSVGs,
  playerChoice: null,
  computerChoice: null,
  playerScore: 0,
  computerScore: 0,
  makeComputerChoice: function(){
    this.computerChoice = Math.floor(Math.random()*3);
    return this.computerChoice;
  },
  determineWinner: function(){
    // 1 Player Wins
    // 0 Tie
    // -1 Computer Wins
    if (this.playerChoice === this.computerChoice){return 0}
    else if (this.playerChoice === 0){
      if(this.computerChoice === 1){return -1}
      return 1;
    }else if (this.playerChoice === 1){
      if(this.computerChoice === 2){return -1}
      return 1;
    }else if (this.playerChoice === 2){
      if(this.computerChoice === 0){return -1}
      return 1;
    }
  },
  updateScore: function(num){
    if(num === 1) {this.playerScore++}
    else if(num === -1) {this.computerScore++}
  },
  generateWinText: function(){
    const winText = [
      `Nice Work!`,
      `Aces!`,
      `Bingo!`,
      `EZ Game`,
      `GG`,
      `You Win!`,
      `Winner Winner!`,
      `Congrats!`,
    ]
    return winText[Math.floor(Math.random()*winText.length)];
  },
  generateTieText: function(){
    const tieText = [
      `Tie`,
      `Nothing Changes`,
      `Nada`,
      `Nothing Going`,
      `Evenly Matched`
    ]
    return tieText[Math.floor(Math.random()*tieText.length)];
  },
  generateLoseText: function(){
    const loseText = [
      `Ooph!`,
      `Get Rekt`,
      `That's gotta sting`,
      `You Lose!`
    ]
    return loseText[Math.floor(Math.random()*loseText.length)];
  },
}



init();



function init(){
  setupControls();
  setupTranstions();
}

function setupControls(){
  const controls = Array.from(document.querySelectorAll('.control')).forEach(control => control.addEventListener('click', (e)=>{
      Game.playerChoice = parseInt(e.currentTarget.dataset.choice);
      Game.computerChoice = Game.makeComputerChoice();
      Game.updateScore(Game.determineWinner());
      Game.state = States.preFistBump;
      toggleControls();
    }))
}

function setupTranstions(){
  //FROM PREFIST -> PRE BATTLE
  document.querySelector('#player').addEventListener('animationiteration', (e) => {
    if (Game.state === States.preFistBump) {
      Game.state = States.preBattle;
      toggleRotation();
      resetPlayerComputerSVG();
      toggleFistBump();
    }
  }, {capture: true});
  // FROM PRE BATTLE -> BATTLE, BATTLE -> RESOLVEBATTLE, RESOLVEBATTLE -> IDLE
  document.querySelector('#player').addEventListener('animationend', (e) => {
    if (Game.state === States.preBattle) {
      Game.state = States.battle;
      toggleFistBump();
      toggleBattle();
    } else if (Game.state === States.battle) {
      Game.state = States.resolveBattle;
      toggleBattle();
      toggleResolveBattle();
      setPlayerComputerSVG();
      updateNoticeBoard();
    } else if (Game.state === States.resolveBattle) {
      Game.state = States.idle;
      updateScoreBoard();
      toggleControls();
      toggleResolveBattle();
      toggleRotation();
      toggleNotice();
      setTimeout(()=>{
        toggleNotice();
      }, 2000)
    }
  })
}

//CLASS TOGGLES
function toggleNotice(){
  document.querySelector(`#notice`).classList.toggle('hideNotice');
  document.querySelector(`#notice`).classList.toggle('showNotice');
}
function toggleControls(){
  document.querySelector(`#controls`).classList.toggle('hideControls');
  document.querySelector(`#controls`).classList.toggle('showControls');
}
function toggleRotation(){
  document.querySelector('#player').classList.toggle('rotating');
  document.querySelector('#player>div>svg').classList.toggle('rotatingReverse');
  document.querySelector('#computer').classList.toggle('rotatingReverse');
  document.querySelector('#computer>div>svg').classList.toggle('rotatingReverse');
}
function toggleFistBump(){
  document.querySelector('#player').classList.toggle('prebattle');
  document.querySelector('#computer').classList.toggle('prebattleInvert');
}
function toggleBattle(){
  document.querySelector('#player').classList.toggle('battling');
  document.querySelector('#computer').classList.toggle('battling');
}
function toggleResolveBattle(){
  document.querySelector('#player').classList.toggle('resolveBattling');
  document.querySelector('#computer').classList.toggle('resolveBattling');

}
//STATE TRANSITIONS FUNCTIONS
function transitionToFistBump(e){
  e.stopPropagation();
  console.log('animation iteration');
  if (Game.state === States.preFistBump){
    Game.state = States.preBattle;
    toggleRotation();
    toggleFistBump();
  }  
}
function transitionToBattle(e){
  if (Game.state === States.preBattle){
    toggleFistBump();
    toggleBattle();
  }
}


//VIEW UPDATERS
function setPlayerComputerSVG(){
  const Player = document.querySelector('#player>.imageContainer>svg')
  Player.replaceWith(PlayerSVGs[Game.playerChoice].cloneNode(true));
  const Computer = document.querySelector('#computer>.imageContainer>svg')
  Computer.replaceWith(PlayerSVGs[Game.computerChoice].cloneNode(true));
}
function resetPlayerComputerSVG(){
  const Player = document.querySelector('#player>.imageContainer>svg')
  Player.replaceWith(PlayerSVGs[0].cloneNode(true));
  const Computer = document.querySelector('#computer>.imageContainer>svg')
  Computer.replaceWith(PlayerSVGs[0].cloneNode(true));
}
function updateScoreBoard(){
  document.querySelector(`#playerScore`).textContent = `${Game.playerScore}`;
  document.querySelector(`#computerScore`).textContent = `${Game.computerScore}`;
}
function updateNoticeBoard(){
  let text = '';
  switch(Game.determineWinner()){
    case 0:{
      text = Game.generateTieText();
      break;
    }
    case 1:{
      text = Game.generateWinText();
      break;
    }
    case -1:{
      text = Game.generateLoseText();
      break;
    }
  }
  document.querySelector(`#noticeText`).textContent = text;
}