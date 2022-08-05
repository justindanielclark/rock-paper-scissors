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
  }
}



init();

function init(){
  //NORMAL BUTTONS
  setupControls();
  setupTranstions();
  //DEBUG BUTTONS
  // setupControlsButton();
  // setupNoticeBoardButton();
  // setupRotationButton();
  // setupPreBattleButton();
  // setupBattleButton();
}



//BUTTONS
function setupControls(){
  const controls = Array.from(document.querySelectorAll('.control')).forEach(control => control.addEventListener('click', (e)=>{
      Game.playerChoice = parseInt(e.currentTarget.dataset.choice);
      Game.computerChoice = Game.makeComputerChoice();
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
      toggleFistBump();
    }
  }, {capture: true});
  // FROM PRE BATTLE -> BATTLE
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
//IMAGE SETTERS
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


//DEBUG BUTTONS
function setupRotationButton(){
  document.querySelector('#buttonRotation').addEventListener('click', (e)=>{
    toggleRotation();
  })
}
function setupPreBattleButton(){
  document.querySelector('#buttonPreBattle').addEventListener('click', (e)=>{
    toggleFistBump();
  })
}
function setupBattleButton(){
  document.querySelector('#buttonBattle').addEventListener('click', (e)=>{
    toggleBattle();
  })
}