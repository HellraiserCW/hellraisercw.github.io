class Display {

    constructor() {
        this.startBtn = null;
    }

    renderStart(units) {
        this.startBtn = document.querySelector('.start');
        this.startBtn.addEventListener('click', () => this.onStartClick(this.startBtn, units), {once: true});
    }

    onStartClick(startBtn, units) {
        alert('Choose your fighter');
        startBtn.classList.add('hidden');
        this.renderCharacters(units);
    }

    renderCharacters(units) {
        units.forEach(e => {
            let character = document.createElement('button');
            character.className = 'character';
            character.innerText = e.initialStats.name;
            document.querySelector('.characters-list').appendChild(character);
            character.onclick = this.renderCards;
        });
    }

    renderCards(character) {
        let player1 = units.find(i => i.initialStats.name === character.target.innerText);
        const randomPC = units.filter(i => i.initialStats.name !== character.target.innerText);
        let player2 = randomPC[Math.floor(Math.random()*randomPC.length)];

        const charsList = document.querySelector('.characters-list');
        while (charsList.firstChild) {
            charsList.removeChild(charsList.firstChild);
        }

        const battleField = document.querySelector('.battle-field');

        const playerOne = document.createElement('div');
        playerOne.className = 'player-name1';
        playerOne.innerHTML = `<p>You selected: <span class="name">${player1.currentStats.name}</span></p>
                                <p>HP: <span class="hp1">${player1.currentStats.healthPoints}</span>
                                <span class="hitbox1"></span></p>
                                <p>Damage: ${player1.currentStats.damage}</p>
                                <p>Cooldown: ${player1.currentStats.cooldown}</p>
                                <p>Armor: ${player1.currentStats.armor}</p>`;
        battleField.appendChild(playerOne);

        const playerTwo = document.createElement('div');
        playerTwo.className = 'player-name2';
        playerTwo.innerHTML = `<p>Computer selected: <span class="name">${player2.currentStats.name}</span></p>
                                <p>HP: <span class="hp2">${player2.currentStats.healthPoints}</span>
                                <span class="hitbox2"></span></p>
                                <p>Damage: ${player2.currentStats.damage}</p>
                                <p>Cooldown: ${player2.currentStats.cooldown}</p>
                                <p>Armor: ${player2.currentStats.armor}</p>`;
        battleField.appendChild(playerTwo);

        const fightBtn = document.querySelector('.fight');
        fightBtn.classList.remove('hidden');
        fightBtn.addEventListener('click', () => game.fight(player1.initialStats, player2.initialStats), {once: true});
    }

    clearField() {
        this.startBtn.classList.remove('hidden');
        document.querySelector('.fight').classList.add('hidden');
        const bField = document.querySelector('.battle-field');
        while (bField.firstChild) {
            bField.removeChild(bField.firstChild);
        }
    }

    refreshPlayerStats(currentPlayer, currentHP, hitbox, damage) {
        document.querySelector(`.${currentHP}`).innerHTML = `${currentPlayer.healthPoints}`;
        document.querySelector(`.${hitbox}`).innerHTML = ` -${damage}`;
        const hitboxTime = 600;
        setTimeout(() => document.querySelector(`.${hitbox}`).classList.add('hidden'), hitboxTime);
    }

}

class Unit {

    constructor({
        name,
        healthPoints,
        damage,
        cooldown,
        armor
    }) {
        this.initialStats = {
            name: name,
            healthPoints: healthPoints,
            damage: damage,
            cooldown: cooldown,
            armor: armor
        };
        this.resetStats();
    }

    resetStats() {
        this.currentStats = Object.assign({}, this.initialStats);
    }

}

class Game {
    
    constructor(units, displayController) {
        this.units = units;
        this.displayControl = displayController;
        this.displayControl.renderStart(this.units);
    }

    reStartGame() {
        this.clearGame();
        this.displayControl.clearField();
        this.displayControl.renderStart(this.units);
    }

    clearGame() {
        this.units.forEach(i => i.resetStats());
    }

    fight(player1, player2) {
        const run = (player1Stats, player2Stats) => {
            const [player1StatsRes, player2StatsRes] = this.initRound(player1Stats, player2Stats);
            const roundTime = 1000;
            if (player1StatsRes.healthPoints > 0 && player2StatsRes.healthPoints > 0) {
                setTimeout(() => run(player1StatsRes, player2StatsRes), roundTime);
            } else {
                setTimeout(() => this.result(player1StatsRes, player2StatsRes), roundTime);
            }
        }
        run(player1, player2);
    }
    
    initRound(player1, player2) {
        const currentP1Stats = Object.assign({}, player1);
        const currentP2Stats = Object.assign({}, player2);

        let dam1 = this.calculateDamage(currentP1Stats, currentP2Stats);
        document.querySelector('.hitbox2').classList.remove('hidden');
        this.displayControl.refreshPlayerStats(currentP2Stats, 'hp2', 'hitbox2', dam1);
        let dam2 = this.calculateDamage(currentP2Stats, currentP1Stats);
        document.querySelector('.hitbox1').classList.remove('hidden');
        this.displayControl.refreshPlayerStats(currentP1Stats, 'hp1', 'hitbox1', dam2);

        return [currentP1Stats, currentP2Stats];
    }

    calculateDamage(pl1, pl2) {
        const armorPow = 0.06;
        const minRand = -4;
        const maxRand = 4;
        let dmgMod = Math.floor(minRand + Math.random() * (maxRand + 1 - minRand));
        let dmgReduction = pl1.damage*(pl2.armor*armorPow/(1+pl2.armor*armorPow));
        let damage = Math.ceil((pl1.damage - dmgReduction)/pl1.cooldown) + dmgMod;
        pl2.healthPoints -= damage;
        if (pl2.healthPoints < 0) {
            pl2.healthPoints = 0;
        }
        return damage;
    }

    result(player1, player2) {
        if (player1.healthPoints > player2.healthPoints) {
            alert(`${player1.name} wins!`)
        } else if (player2.healthPoints > player1.healthPoints) {
            alert(`${player2.name} wins!`)
        } else {
            alert('Draw!');
        }
        this.reStartGame();
    }

}

const units = [
new Unit({
    name: 'Footman',
    healthPoints: 420,
    damage: 12.5,
    cooldown: 1.35,
    armor: 2
}),
new Unit({
    name: 'Grunt',
    healthPoints: 700,
    damage: 19.5,
    cooldown: 1.6,
    armor: 1
}),
new Unit({
    name: 'Archer',
    healthPoints: 255,
    damage: 17,
    cooldown: 1.5,
    armor: 0
}),
new Unit({
    name: 'Ghoul',
    healthPoints: 340,
    damage: 13,
    cooldown: 1.3,
    armor: 0
})
];

const game = new Game(units, new Display());