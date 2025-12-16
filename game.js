const btnAttack = document.getElementById('attackBtn');

// Configuration des terrains
const TERRAINS = {
    plaine: { name: 'Plaine', icon: 'fa-mountain', resistance: 3, minResistance: 1 },
    ville: { name: 'Ville', icon: 'fa-city', resistance: 4, minResistance: 2 },
    fleuve: { name: 'Fleuve', icon: 'fa-water', resistance: 5, minResistance: 3 },
    foret: { name: 'Forêt', icon: 'fa-tree', resistance: 6, minResistance: 3 },
    montagne: { name: 'Montagne', icon: 'fa-mountain', resistance: 10, minResistance: 5 },
    mer: { name: 'Mer', icon: 'fa-water-ladder', resistance: 10, minResistance: 5 },
    tour: { name: 'Tour', icon: 'fa-building', resistance: 13, minResistance: 3 },
    castle: { name: 'Black Castle', icon: 'fa-chess-rook', resistance: 100, minResistance: 10 }
};

// Configuration des combinaisons
const COMBINATIONS = {
    nada: { code: 'N', name: 'Nada', force: 1, chance: 2 },
    petiteSuite: { code: 'PS', name: 'Petite Suite', force: 7, chance: 0.5 },
    suite: { code: 'S', name: 'Suite', force: 12, chance: 1.3 },
    double: { code: 'D', name: 'Double', force: 2, chance: 1.5 },
    brelan: { code: 'L', name: 'Brelan', force: 4, chance: 1 },
    full: { code: 'F', name: 'Full', force: 6, chance: 0.4 },
    carre: { code: 'C', name: 'Carré', force: 8, chance: 0.2 },
    yatzy: { code: 'T', name: 'Yatzy', force: 30, chance: 0 }
};
// boost etat
const BOOST_STATE = {
    NONE: 0,
    LEVEL1: 10,
    LEVEL2: 20,
    LEVEL3: 30
}

// État du jeu
const gameState = {
    players: [
        {
            name: 'Joueur 1',
            position: 0,
            gauge: 0,
            maxGauge: 30,
            chance: 2,
            memory: [null, null, null],
            boost: BOOST_STATE.NONE
        },
        {
            name: 'Joueur 2',
            position: 0,
            gauge: 0,
            maxGauge: 30,
            chance: 2,
            memory: [null, null, null],
            boost: BOOST_STATE.NONE
        }
    ],
    currentPlayer: 0,
    path: [],
    dice: [],
    lockedDice: [false, false, false, false, false],
    rollsLeft: 3,
    currentCombination: null,
    lastMessage: 'En attente de démarrage...'
};



// Initialisation
document.getElementById('setupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const player1Name = document.getElementById('player1Name').value.trim() || 'Joueur 1';
    const player2Name = document.getElementById('player2Name').value.trim() || 'Joueur 2';
    const pathLength = parseInt(document.querySelector('input[name="pathLength"]:checked').value);

    startGame(player1Name, player2Name, pathLength);
});

function startGame(player1Name, player2Name, pathLength) {
    // Configuration des joueurs
    gameState.players[0].name = player1Name;
    gameState.players[1].name = player2Name;

    // Génération du parcours
    generatePath(pathLength);

    //  Affichage de la page de jeu
    document.getElementById('setupPage').classList.add('d-none');
    document.getElementById('gamePage').classList.remove('d-none');

    // Mise à jour de l'interface
    updateUI();
    updateMessage(`${getCurrentPlayer().name} commence ! Lance les dés.`);
}

function generatePath(length) {
    gameState.path = [];
    const terrainTypes = ['plaine', 'ville', 'fleuve', 'foret', 'montagne', 'mer', 'tour'];

    for (let i = 0; i < length - 1; i++) {
        const randomTerrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
        const terrain = { ...TERRAINS[randomTerrain] };
        terrain.currentResistance = terrain.resistance;
        terrain.damaged = false;
        terrain.damageTurns = 0;
        gameState.path.push(terrain);
    }

    // Ajout du château final
    const castle = { ...TERRAINS.castle };
    castle.currentResistance = castle.resistance;
    castle.damaged = false;
    castle.damageTurns = 0;
    gameState.path.push(castle);

    renderPath();
}

function renderPath() {
    const container = document.getElementById('pathContainer');
    container.innerHTML = '';

    gameState.path.forEach((terrain, index) => {
        const card = document.createElement('div');
        card.className = 'terrain-card';
        card.dataset.index = index;

        // Marquer les positions des joueurs
        const player1Here = gameState.players[0].position === index;
        const player2Here = gameState.players[1].position === index;

        if (player1Here && player2Here) {
            card.classList.add('active', 'both-players');
        } else if (player1Here) {
            card.classList.add('active', 'player1');
        } else if (player2Here) {
            card.classList.add('active', 'player2');
        }

        if (terrain.damaged) {
            card.classList.add('damaged');
        }

        // Icône du terrain
        const iconDiv = document.createElement('div');
        iconDiv.className = 'terrain-icon';
        iconDiv.innerHTML = `<i class="fa-solid ${terrain.icon}"></i>`;

        // Tours de dégâts
        if (terrain.damaged && terrain.damageTurns > 0) {
            const turnsDiv = document.createElement('div');
            turnsDiv.className = 'damage-turns';
            turnsDiv.textContent = terrain.damageTurns;
            iconDiv.appendChild(turnsDiv);
        }

        // Marqueurs des joueurs
        if (player1Here) {
            const marker1 = document.createElement('div');
            marker1.className = 'player-marker player1-marker';
            iconDiv.appendChild(marker1);
        }
        if (player2Here) {
            const marker2 = document.createElement('div');
            marker2.className = 'player-marker player2-marker';
            iconDiv.appendChild(marker2);
        }

        // Résistance
        const resistanceDiv = document.createElement('div');
        resistanceDiv.className = 'terrain-resistance';
        resistanceDiv.textContent = Math.floor(terrain.currentResistance);

        card.appendChild(iconDiv);
        card.appendChild(resistanceDiv);
        container.appendChild(card);
    });
}

function updateUI() {
    // Noms des joueurs
    document.getElementById('player1NameDisplay').textContent = gameState.players[0].name.substring(0, 2).toUpperCase();
    document.getElementById('player2NameDisplay').textContent = gameState.players[1].name.substring(0, 2).toUpperCase();

    gameState.players.forEach((player, index) => {
        const playerNum = index + 1;
        // Jauges
        const maxGauge = player.maxGauge;
        document.getElementById(`player${playerNum}Gauge`).textContent = `${player.gauge}/${maxGauge}`;

        const gaugeProgressFill = document.getElementById(`player${playerNum}GaugeBar`);
        gaugeProgressFill.style.setProperty('--progress', (player.gauge / maxGauge) * 100 + '%');
        // montrer ou cacher la carte boost
        const boostCard = document.querySelector(`.boost-card[data-player="${playerNum}"]`);
        if (player.gauge < 10) boostCard.classList.add('d-none');
        else boostCard.classList.remove('d-none');
        

        // Chance
        document.querySelector(`#player${playerNum}Chance .chance-value`).textContent = player.chance.toFixed(1);

        // Cartes mémoire
        player.memory.forEach((mem, slot) => {
            const card = document.querySelector(`.memory-card[data-player="${playerNum}"][data-slot="${slot}"]`);
            if (mem) {
                card.textContent = mem.code;
                card.classList.add('filled');
            } else {
                card.innerHTML = '<i class="bi bi-plus-circle-dotted"></i>';
                card.classList.remove('filled');
            }
        });
    });

    // Joueur actuel
    document.getElementById('currentPlayerName').textContent = getCurrentPlayer().name;

    // Mise à jour du parcours
    renderPath();
}

function getCurrentPlayer() {
    return gameState.players[gameState.currentPlayer];
}

function getOtherPlayer() {
    return gameState.players[1 - gameState.currentPlayer];
}

// Gestion des dés
document.getElementById('rollBtn').addEventListener('click', rollDice);

function rollDice() {
    if (gameState.rollsLeft <= 0) return;

    gameState.rollsLeft--;
    document.getElementById('rollCount').textContent = gameState.rollsLeft;

    // Lancer les dés non vrrouillés
    if (gameState.dice.length === 0) {
        gameState.dice = [0, 0, 0, 0, 0];
        gameState.lockedDice = [false, false, false, false, false];
    }

    for (let i = 0; i < 5; i++) {
        if (!gameState.lockedDice[i]) {
            gameState.dice[i] = Math.floor(Math.random() * 6) + 1;
        }
    }

    renderDice();
    evaluateCombination();

    // Activer les boutons d'action
    btnAttack.disabled = false;
    document.getElementById('saveBtn').disabled = getCurrentPlayer().memory.filter(m => m === null).length === 0;
    document.getElementById('gaugeBtn').disabled = false;

    if (gameState.rollsLeft === 0) {
        document.getElementById('rollBtn').disabled = true;
    }
}

function renderDice() {
    const container = document.getElementById('diceContainer');
    container.innerHTML = '';

    gameState.dice.forEach((value, index) => {
        const die = document.createElement('div');
        die.className = 'die';
        die.dataset.value = value;
        die.dataset.index = index;

        if (gameState.lockedDice[index]) {
            die.classList.add('locked');
        }

        die.innerHTML = `<i class="bi bi-dice-${value}"></i>`;
        die.style.animationDelay = `${index * 0.1}s`;

        die.addEventListener('click', (e) => toggleLockDie(e, index));

        container.appendChild(die);
    });
}

function toggleLockDie(e, index) {

    gameState.lockedDice[index] = !gameState.lockedDice[index];
    if (gameState.lockedDice[index]) {
        e.currentTarget.classList.add('locked');
    } else {
        e.currentTarget.classList.remove('locked');
    }

}

function evaluateCombination() {
    const sorted = [...gameState.dice].sort((a, b) => a - b);
    const counts = {};
    sorted.forEach(d => counts[d] = (counts[d] || 0) + 1);
    const countValues = Object.values(counts).sort((a, b) => b - a);

    let combo = [];

    // Yatzy (5 identiques)

    countValues[0] === 5 && combo.push(COMBINATIONS.yatzy);
    // Carré (4 identiques)
    countValues[0] === 4 && combo.push(COMBINATIONS.carre);
    // Full (3 + 2)
    countValues[0] === 3 && countValues[1] === 2 && combo.push(COMBINATIONS.full);
    // Brelan (3 identiques)
    countValues[0] === 3 && combo.push(COMBINATIONS.brelan);
    // Double (2 paires)
    countValues[0] === 2 && countValues[1] === 2 && combo.push(COMBINATIONS.double);

    // Suite (1-2-3-4-5 ou 2-3-4-5-6)
    (sorted.join('') === '12345' || sorted.join('') === '23456') && combo.push(COMBINATIONS.suite);

    let noDoubleSorted = [...new Set(sorted)];
    // Petite suite (4 consécutifs)
    (noDoubleSorted.join('').includes('1234') || noDoubleSorted.join('').includes('2345') || noDoubleSorted.join('').includes('3456')) && combo.push(COMBINATIONS.petiteSuite);


    if (combo.length === 0) {
        gameState.currentCombination = COMBINATIONS.nada;
    } else {
        gameState.currentCombination = combo[0];
    }

    if (getCurrentPlayer().boost !== BOOST_STATE.NONE) { 
        document.getElementById('combinationInfo').innerHTML = `
            <strong>${gameState.currentCombination.name}</strong> - Force: ${gameState.currentCombination.force} + ${getCurrentPlayer().boost} (Boost) 
        `;
    } else {

        document.getElementById('combinationInfo').innerHTML = `
            <strong>${gameState.currentCombination.name}</strong> - Force: ${gameState.currentCombination.force} | Chance: +${gameState.currentCombination.chance}
        `;
    }
}



// Actions
btnAttack.addEventListener('click', attack);
document.getElementById('saveBtn').addEventListener('click', saveToMemory);
document.getElementById('gaugeBtn').addEventListener('click', addToGauge);

function attack() {
    if (!gameState.currentCombination) return;

    const player = getCurrentPlayer();
    const targetIndex = player.position;


    const terrain = gameState.path[targetIndex];
    let boostValue = player.boost;
    const force = gameState.currentCombination.force + boostValue;
    const resistance = terrain.currentResistance;
    player.gauge -= boostValue;
    let message = '';
    if (terrain.name === "Black Castle") {
        terrain.currentResistance -= force;
        if (terrain.currentResistance < 0) {
            // victoire
           victory();
           return;
        }else{
        terrain.currentResistance = Math.max(terrain.minResistance, terrain.currentResistance);

        }
        message = `${player.name} attaque le Black Castle ! Résistance restante: ${Math.floor(terrain.currentResistance)}.`;
        
    }
    else if (force > resistance) {
        // let terrainConquered = [terrain.name], terrainDamaged = 0;
        let terrainConquered = [], terrainDamaged = 0;


        // Excédent de force
        let excess = force ;
        

        // Vérifier si on peut franchir le ou les terrains suivants
        while (player.position < gameState.path.length && excess > gameState.path[player.position].currentResistance) {
            const nextTerrain = gameState.path[player.position];
            terrainConquered.push(nextTerrain.name);

            // Endommagement si excess >= 1.5x résistance
            if (excess > nextTerrain.currentResistance * 1.5) {
                terrainDamaged++
                nextTerrain.damaged = true;
                nextTerrain.damageTurns = 4;
                nextTerrain.currentResistance = Math.max(
                    Math.floor(nextTerrain.currentResistance * 0.8), nextTerrain.minResistance);
                // message += ' - Terrain supplémentaire endommagé !';
            }
            excess -= nextTerrain.currentResistance;
            player.position++;

            // message += ' - Franchit un terrain supplémentaire !';
        }

        message = `${player.name} a conquérit ${terrainConquered.length} terrain(s) (${terrainConquered.join(', ')}) ! - ${terrainDamaged} terrain(s) endommagé(s).`;
        // Vérifier victoire
        if (player.position >= gameState.path.length) {
           victory();
           return;
        }
        if ( gameState.path[player.position].name === "Black Castle") {
            gameState.path[player.position].currentResistance -= excess;
        }
    } else if (force == resistance) {
        message = "combat serré ! terrain endomagé !";
        // Terrain endommagé
        terrain.damaged = true;
        terrain.damageTurns = 3;
        terrain.currentResistance = Math.max(
            Math.floor(terrain.currentResistance * 0.8),
            terrain.minResistance
        );
    }
    else if (resistance >= force * 1.5) {
        // Recul
        if (player.position > 0) {
            player.position--;
            message = `défaite écrasante! ${player.name} recule d'un terrain ! (Force: ${force} vs ${Math.floor(resistance)})`;
        } else {
            message = `défaite écrasante!`;
        }
    } else {
        // Attaque échouée
        message = `${player.name} n'a pas assez de force (Force: ${force} vs ${Math.floor(resistance)})`;
    }

    // Mise à jour de la chance
    player.chance += gameState.currentCombination.chance;
    player.maxGauge = 30 + Math.floor(player.chance * 30 / 100);
    if (player.maxGauge > 45) player.maxGauge = 45;

    updateMessage(message);
    endTurn();
}

function saveToMemory() {
    if (!gameState.currentCombination) return;

    const player = getCurrentPlayer();
    const freeSlot = player.memory.findIndex(m => m === null);

    if (freeSlot === -1) {
        updateMessage('Plus d\'emplacement mémoire disponible !');
        return;
    }

    player.memory[freeSlot] = {
        code: gameState.currentCombination.code,
        combination: gameState.currentCombination,
        dice: [...gameState.dice]
    };

    updateMessage(`${player.name} sauvegarde ${gameState.currentCombination.name}`);
    endTurn();
}

function addToGauge() {
    if (!gameState.currentCombination) return;

    const player = getCurrentPlayer();
    const force = gameState.currentCombination.force;
    const chanceBonus = (Math.random() * 100 < player.chance) ? 2 : 0;
    player.gauge += force + chanceBonus;


    if (player.gauge > player.maxGauge) {
        player.gauge = player.maxGauge;
    }



    updateMessage(`${player.name} ajoute ${force} + ${chanceBonus} bonus à sa jauge (Total: ${player.gauge}/${player.maxGauge})`);
    endTurn();
}

// Gestion des cartes mémoire
document.querySelectorAll('.memory-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const playerNum = parseInt(card.dataset.player);
        const slot = parseInt(card.dataset.slot);

        if (playerNum - 1 !== gameState.currentPlayer) return;

        const player = getCurrentPlayer();
        const memory = player.memory[slot];

        if (!memory) return;

        // Utiliser la carte mémoire
        gameState.currentCombination = memory.combination;
        gameState.dice = [...memory.dice];
        renderDice();
        evaluateCombination()

        updateMessage(`${player.name} utilise la carte mémoire: ${memory.combination.name}`);

        // Réinitialiser la carte
        player.memory[slot] = null;

        // Activer les boutons d'action
        btnAttack.disabled = false;
        document.getElementById('gaugeBtn').disabled = false;
        document.getElementById('rollBtn').disabled = false;


        player.memory.forEach((mem, slot) => {
            const card = document.querySelector(`.memory-card[data-player="${playerNum}"][data-slot="${slot}"]`);
            if (mem) {
                card.textContent = mem.code;
                card.classList.add('filled');
            } else {
                card.innerHTML = '<i class="bi bi-plus-circle-dotted"></i>';
                card.classList.remove('filled');
            }
        });

        document.getElementById('combinationInfo').innerHTML = `
            <strong>${memory.combination.name}</strong> (de la mémoire) - Force: ${memory.combination.force}
        `;
    });
});

// Gestion de la carte boost
document.querySelectorAll('.boost-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const playerNum = parseInt(card.dataset.player);
        if (playerNum - 1 !== gameState.currentPlayer) return;

        const player = getCurrentPlayer();
        if (player.gauge < 10) {
            updateMessage('Pas assez de jauge pour utiliser le boost !');
            return;
        }
        // allouer le boost par 10.
        if (player.boost === BOOST_STATE.NONE) player.boost = BOOST_STATE.LEVEL1;
        else if (player.gauge < 20) player.boost = BOOST_STATE.NONE;
        else if (player.boost === BOOST_STATE.LEVEL1) player.boost = BOOST_STATE.LEVEL2;
        else if (player.gauge < 30) player.boost = BOOST_STATE.NONE;
        else if (player.boost === BOOST_STATE.LEVEL2) player.boost = BOOST_STATE.LEVEL3;
        else if (player.boost === BOOST_STATE.LEVEL3) player.boost = BOOST_STATE.NONE;
        
        if (player.boost === BOOST_STATE.NONE) {
            btnAttack.style.color = '#fff';
        }
        else {
            switch (player.boost) {
                case BOOST_STATE.LEVEL1:
                    btnAttack.style.color = '#ffcc00';
                    break;
                case BOOST_STATE.LEVEL2:
                    btnAttack.style.color = '#ff9900';
                    break;
                case BOOST_STATE.LEVEL3:
                    btnAttack.style.color = '#ff3300';
                    break;
            }
            console.log('Boost appliqué:', player.boost);
        }
        // updateMessage(`${player.name} utilise le boost: Niveau ${player.boost === BOOST_STATE.NONE ? '0' : player.boost / 10}`);
    });
});

// Gestion de fin de tour
function endTurn() {
    // Réduction des tours de dégâts
    gameState.path.forEach(terrain => {
        if (terrain.damaged && terrain.damageTurns > 0) {
            terrain.damageTurns--;
            if (terrain.damageTurns === 0) {
                terrain.damaged = false;
                terrain.currentResistance = terrain.resistance;
            }
        }
    });
    getCurrentPlayer().boost = BOOST_STATE.NONE;
    // Changer de joueur
    gameState.currentPlayer = 1 - gameState.currentPlayer;

    // Réinitialiser l'état des dés
    gameState.dice = [];
    gameState.lockedDice = [false, false, false, false, false];
    gameState.rollsLeft = 3;
    gameState.currentCombination = null;
    btnAttack.style.color = '#fff';

    // Réinitialiser l'UI
    document.getElementById('diceContainer').innerHTML = `
        <div class="dice-info">En attente que <span id="currentPlayerName">${getCurrentPlayer().name}</span> lance</div>
    `;
    document.getElementById('combinationInfo').innerHTML = '';
    document.getElementById('rollCount').textContent = '3';
    document.getElementById('rollBtn').disabled = false;
    btnAttack.disabled = true;
    document.getElementById('saveBtn').disabled = true;
    document.getElementById('gaugeBtn').disabled = true;

    updateUI();
}

function updateMessage(msg) {
    gameState.lastMessage = msg;
    document.getElementById('messageBox').textContent = msg;
}

function disableAllActions() {
    document.getElementById('rollBtn').disabled = true;
    btnAttack.disabled = true;
    document.getElementById('saveBtn').disabled = true;
    document.getElementById('gaugeBtn').disabled = true;
}

function getPlayerGauge() {
    const player = getCurrentPlayer();
    return player.gauge;
}

function victory() {
    disableAllActions();
    
    // Créer l'overlay de victoire
    const victoryOverlay = document.createElement('div');
    victoryOverlay.className = 'victory-overlay';
    
    const winner = getCurrentPlayer();
    const playerColor = gameState.currentPlayer === 0 ? '#ff6b6b' : '#4ecdc4';
    
    victoryOverlay.innerHTML = `
        <div class="victory-content">
            <div class="victory-castle">
                <i class="fa-solid fa-chess-rook"></i>
            </div>
          
            <h1 class="victory-title">🎉 Victoire ! 🎉</h1>
            <div class="winner-avatar" style="border-color: ${playerColor};">
                <div class="avatar-circle" style="background: linear-gradient(135deg, ${playerColor}, ${playerColor}dd);">
                    <span>${winner.name.substring(0, 2).toUpperCase()}</span>
                </div>
            </div>
            <h2 class="winner-name" style="color: ${playerColor};">${winner.name}</h2>
            <p class="victory-message">a conquis le Black Castle !</p>
            <div class="victory-stats">
                <div class="stat-item">
                    <i class="bi bi-star-fill"></i>
                    <span>Chance: ${winner.chance.toFixed(1)}</span>
                </div>
                <div class="stat-item">
                    <i class="bi bi-battery-charging"></i>
                    <span>Jauge: ${winner.gauge}/${winner.maxGauge}</span>
                </div>
                <div class="stat-item">
                    <i class="bi bi-flag-fill"></i>
                    <span>Position: ${winner.position + 1}/${gameState.path.length}</span>
                </div>
            </div>
            <div class="victory-buttons">
                <button class="btn-victory btn-replay" onclick="location.reload()">
                    <i class="bi bi-arrow-repeat"></i> Nouvelle Partie
                </button>
                <button class="btn-victory btn-rules" onclick="window.location.href='regledujeu.html'">
                    <i class="bi bi-book"></i> Règles
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(victoryOverlay);
    
    // Animation d'entrée
    setTimeout(() => {
        victoryOverlay.classList.add('show');
    }, 100);
   

    // Effet sonore (si disponible) et confettis
    playVictoryEffects();
}

function playVictoryEffects() {
    // Animation de confettis
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#a8e6cf', '#ff8e53', '#44a3d5'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 30);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = color;
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.animationDelay = (Math.random() * 0.5) + 's';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 500);
}