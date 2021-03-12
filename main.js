const MAX_ENEMY = 6;
const HEIGHT_ELEM = 152;

const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gameArea'),
      car = document.createElement('div'),
      topScore = document.getElementById('topScore');

const audio = document.createElement('embed');
const carCrash = new Audio ('crash.mp3');

audio.src = 'JavaScriptCarRace.mp3';
audio.style.cssText = `position: absolute; top: -1000px;`;


carCrash.src = 'crash.mp3';
carCrash.style.cssText = `position: absolute; top: -1000px;`;

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const countSection = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM + 1);
gameArea.style.cssText = `overflow: hidden;`;

console.log();

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 0,
    traffic: 0,
    level: 0,
};

let level = setting.level;

const getLocalStorage = () =>
  parseInt(localStorage.getItem("jscarrace_score", setting.score));
topScore.innerHTML =
  "Best Score:<br><br>" + getLocalStorage() ? "Best Score:<br><br>" + getLocalStorage() : 0;

const addLocalStorage = () => {
    const result = getLocalStorage();
    if (!result || result < setting.score) {
      localStorage.setItem("jscarrace_score", setting.score);
      topScore.innerHTML = "Best Score:<br><br>" + setting.score;
    }
  };

// localStorage.clear();

function getQuantityElements(heightElement) {
    return (gameArea.offsetHeight / heightElement) + 1;
}

function startGame(event){

    const target = event.target;

    if (target === start) return;

    switch (target.id){
        case'easy':
            setting.speed = 4;
            setting.traffic = 4;
            break;
        case'medium':
            setting.speed = 6;
            setting.traffic = 3;
            break;
        case'hard':
            setting.speed = 8;
            setting.traffic = 2;
            break;
    }


    start.classList.add('hide');
    gameArea.innerHTML = '';
    

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * HEIGHT_ELEM) + "px";
        line.y = i * HEIGHT_ELEM;
        gameArea.append(line);
    }

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
        const enemy = document.createElement('div');
        const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
        enemy.classList.add('enemy');

         const periodEnemy = -HEIGHT_ELEM * setting.traffic * (i + 1);

        enemy.y = periodEnemy < 100 ? -100 * setting.traffic * (i + 1) : periodEnemy;

        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(image/enemy${randomEnemy}.png) center / cover no-repeat`;
        gameArea.append(enemy);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';

    }

    setting.score = 0;
    setting.start = true;
    gameArea.append(car);
    document.body.append(audio);
    car.style.left = '180px';
    car.style.top = 'auto';
    car.style.bottom = '15px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame(){

    setting.level = Math.floor(setting.score / 2000);

    if(setting.level !== level) {
        level = setting.level;
        setting.speed += 1;
    }

    if (setting.start){
        setting.score += setting.speed;
        score.innerHTML = 'SCORE:<br><br>' + setting.score;
        moveRoad();
        moveEnemy();
        if(keys.ArrowLeft && setting.x > 0){
            setting.x -= setting.speed;
        }

        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }

        if(keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed;
        }

        if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    }
}

function startRun(event){
    
    if(keys.hasOwnProperty(event.key)){
        event.preventDefault();
        keys[event.key] = true;
    }
}

function stopRun(event){
    
    if(keys.hasOwnProperty(event.key)){
        event.preventDefault();
        keys[event.key] = false;
    }
}

function moveRoad(){
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if(line.y >= gameArea.offsetHeight) {
            line.y = -HEIGHT_ELEM;
        }
    });
}

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function(item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if(carRect.top + 3 <= enemyRect.bottom &&
            carRect.right + 3 >= enemyRect.left &&
            carRect.left + 3 <= enemyRect.right &&
            carRect.bottom + 3 >= enemyRect.top){
                setting.start = false;
                audio.remove();
                console.warn('crash');
                carCrash.play();
                start.classList.remove('hide');
                addLocalStorage();
        }

        
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        
        if(item.y >= gameArea.offsetHeight){
            item.y = -HEIGHT_ELEM * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px';
        }


    });

}