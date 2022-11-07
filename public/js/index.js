import Mokepon from "./mokepon.js"

const HOST                      = 'http://localhost:3009'
const MOKEPON_SIZE = 40

const mokeponContainer          = document.getElementById('mokeponContainer')
const selectPetBtn              = document.getElementById('selectPetBtn')
const attacksContainer          = document.getElementById('attacksContainer')
const canvasMap                 = document.getElementById('map')
const petSelectionSection       = document.getElementById('petSelectionSection')
const showMapSection            = document.getElementById('showMapSection')
const attackSelectionSection    = document.getElementById('attackSelectionSection')
const playerPetSpan             = document.getElementById('playerPetSpan')
const playerLifes               = document.getElementById('playerLifes')
const enemyLifes                = document.getElementById('enemyLifes')
const enemyPet                  = document.getElementById('enemyPet')
const result                    = document.getElementById('result')
const attacksOfPlayer           = document.getElementById('attacksOfPlayer')
const attacksOfEnemy            = document.getElementById('attacksOfEnemy')
const petSelected               = document.getElementById('petSelected')
const username                  = document.getElementById('username')
const cup                       = document.getElementById('cup')
const resetButton               = document.getElementById('resetButton')
const attcksbtn                 = document.getElementById('attcksbtn')

let playerId
let enemyId
let interval
let intervalo
let playerPetObject
let mokepones       = []
let enemyMokepones  = []
let attackButtons   = []
let playerAttacks   = []
let attackEnemy     = []
let playerVictory   = 0
let enemyVictory    = 0
let indexPlayer     = 0
let indexEnemy      = 0

let lienzo          = canvasMap.getContext("2d")
let backgroundMap   = new Image()
backgroundMap.src   = './assets/mokemap.png'
let mapWidth        = window.innerWidth - 20
const maxWidthMap   = 350

if (mapWidth > maxWidthMap) mapWidth = maxWidthMap - 20
canvasMap.width     = mapWidth
canvasMap.height    = mapWidth * 600 / 800

let hipodoge    = new Mokepon({
    name: 'Hipodoge',
    photo: './assets/mokepons_mokepon_hipodoge_attack.png',
    photoMapSrc: './assets/hipodoge.png',
    id: null,
    isInBattle: false,
    x: random(0, map.width - MOKEPON_SIZE),
    y: random(0, map.height - MOKEPON_SIZE),
    attacks: [
        { name: '💧', id: 'btn-water' },
        { name: '💧', id: 'btn-water' },
        { name: '💧', id: 'btn-water' },
        { name: '🔥', id: 'btn-fire' },
        { name: '🌱', id: 'btn-dirt' },
    ],
})

let capipepo    = new Mokepon({
    name: 'Capipepo',
    photo: './assets/mokepons_mokepon_capipepo_attack.png',
    photoMapSrc: './assets/capipepo.png',
    id: null,
    isInBattle: false,
    x: random(0, map.width - MOKEPON_SIZE),
    y: random(0, map.height - MOKEPON_SIZE),
    attacks: [
        { name: '🌱', id: 'btn-dirt' },
        { name: '🌱', id: 'btn-dirt' },
        { name: '🌱', id: 'btn-dirt' },
        { name: '💧', id: 'btn-water' },
        { name: '🔥', id: 'btn-fire' },
    ],
})

let ratigueya    = new Mokepon({
    name: 'Ratigueya',
    photo: './assets/mokepons_mokepon_ratigueya_attack.png',
    photoMapSrc: './assets/ratigueya.png',
    id: null,
    isInBattle: false,
    x: random(0, map.width - MOKEPON_SIZE),
    y: random(0, map.height - MOKEPON_SIZE),
    attacks: [
        { name: '🔥', id: 'btn-fire' },
        { name: '🔥', id: 'btn-fire' },
        { name: '🔥', id: 'btn-fire' },
        { name: '💧', id: 'btn-water' },
        { name: '🌱', id: 'btn-dirt' },
    ],
})

mokepones.push(hipodoge, capipepo, ratigueya)

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 * @description return a random number between min and max
 * @example random(1, 10)
 *
 * @returns {number}
 * */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * @description init the game
 */
function initGame() {

    let playerIdLocalStorage = localStorage.getItem('playerId')

    fetch(`${HOST}/mokepon/${playerIdLocalStorage}/eliminar`, { method: "delete" })

    mokepones.forEach((mokepon) => {
        mokeponContainer.innerHTML += `
        <input type="radio" name="mokepon" id=${mokepon.name} value=${mokepon.name} />
        <label class="mokepon-card" for=${mokepon.name}>
            <p>${mokepon.name}</p>
            <img src=${mokepon.photo} alt=${mokepon.name}>
        </label>
        `
    })

    selectPetBtn.addEventListener('click', selectPetPlayer)

    resetButton.addEventListener('click', reset)

    username.value = 'Player_' + random(100, 10000)

   joinToGame()
}

/**
 * @description join to game on server
 */
function joinToGame() {
    fetch(`${HOST}/unirse`)
        .then((res) => {
            if (res.ok) {
                res.text().then((respuesta) => { 
                    localStorage.setItem('playerId', respuesta)
                    playerId = respuesta
                 })
                
            }
        }
    )
}

/**
 * @description select pet player and send to server
 */
function selectPetPlayer() {
    const mokeponSelected = document.querySelector('input[name="mokepon"]:checked');

    if (username.value === '' || !/^[a-zA-Z0-9_]+$/.test(username.value)) {
        alert('El nombre de usuario no puede estar vacío y solo puede contener letras y números')
        return
    }

    if (username.value.length < 3 || username.value.length > 11) {
        alert('El nombre de usuario debe tener entre 3 y 11 caracteres')
        return
    }

    if (mokeponSelected != null) {

        playerPetObject = mokepones.find((mokepon) => mokepon.name === mokeponSelected.value)

        // join to game
        playerPetObject.id = `${playerId}`

        playerPetSpan.innerHTML = `
            <img src=${playerPetObject.photo} alt=${playerPetObject.name} width=${playerPetObject.width} height=${playerPetObject.height}>
            <p>${playerPetObject.name}</p>
            <p>(YOU)</p>
        `
        
        petSelected.innerHTML = `
            <img src=${playerPetObject.photo} alt=${playerPetObject.name} width=${playerPetObject.width} height=${playerPetObject.height}>
            <span class="subtitle">${playerPetObject.name}</span>
        `

        setPlayerMokepon(playerPetObject)

        getMokeponAttacks(playerPetObject)

        initMap()

        return true
    }

    alert('You must select a pet')

}

/**
 * @description send player pet to server
 * 
 * @param {Mokepon} mokepon 
 */
function setPlayerMokepon(mokepon) {
    fetch(`${HOST}/mokepon/${playerId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mokepon.name
        })
    })
}

/**
 * @description get mokepon attacks from the object and show them on the screen
 * 
 * @param {Mokepon} pet 
 */
function getMokeponAttacks(pet) {
    mokepones.filter((mokepon) => {
        if (mokepon.name === pet.name) {
            attacksContainer.innerHTML = ''
            mokepon.attacks.forEach((attack) => {
                attacksContainer.innerHTML += `
                    <button id=${attack.id} class="attack-button">${attack.name}</button>
                `
            })
            attackButtons = document.querySelectorAll('.attack-button')
        }
    })
}

/**
 * @description Start drawing the map and start the game
 */
function initMap() {

    petSelectionSection.style.display = 'none'
    showMapSection.style.display = 'flex'

    interval = setInterval(drawCanvas, 50)

    window.addEventListener('keydown', handleKeyPress)

    window.addEventListener('keyup', stopMoving)
}

/**
 * @description move the player in the direction
 */
function drawCanvas() {

    playerPetObject.x += playerPetObject.speedX
    playerPetObject.y += playerPetObject.speedY

    lienzo.clearRect(0, 0, canvasMap.width, canvasMap.height)
    lienzo.drawImage(backgroundMap, 0, 0, canvasMap.width, canvasMap.height)

    playerPetObject.drawInCanvas({ 
        lienzo: lienzo, 
        canvasWidth: canvasMap.width, 
        username: username.value, 
    })
    
    sendPosition(playerPetObject.x, playerPetObject.y)
    
    enemyMokepones.forEach((enemy) => {
        if (enemy !== undefined) {
            checkCollision(enemy)
            enemy.drawInCanvas({ 
                lienzo: lienzo, 
                canvasWidth: canvasMap.width, 
                username: username, 
            })
        }
    })
}

/**
 * @description send the position of the player to the server
 * 
 * @param {number} x 
 * @param {number} y
 */
function sendPosition(x, y) {
    fetch(`${HOST}/mokepon/${playerId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    }).then(function (res) {
        if (res.ok) {
            res.json()
            .then(function ({ enemies }) {

                if (enemies !== undefined) {

                    if ( enemies.length < 1 ) return

                    enemyMokepones = enemies.map(function (enemy) {

                        if (enemy.mokepon !== undefined) {
                            let enemyName = enemy.mokepon.nombre.toLowerCase()

                            let enemyMokepon = new Mokepon({
                                name: enemyName,
                                photo: `./assets/mokepons_mokepon_${enemyName}_attack.png`,
                                photoMapSrc: `./assets/${enemyName}.png`,
                                id: enemy.id,
                                isInBattle: false,
                                x: enemy.x,
                                y: enemy.y,
                                attacks: []
                            })

                            return enemyMokepon
                        }
                    })
                }
            })
        }
    })
}

/**
 * @description check if the player is in the same position as the enemy
 *
 * @param {Mokepon} enemy
 */
function checkCollision(enemy) {
    if (playerPetObject.x < enemy.x + enemy.width &&
        playerPetObject.x + playerPetObject.width > enemy.x &&
        playerPetObject.y < enemy.y + enemy.height &&
        playerPetObject.y + playerPetObject.height > enemy.y) {

            enemyId = enemy.id

            showMapSection.style.display = 'none'
            attackSelectionSection.style.display = 'flex'

            stopMoving()

            clearInterval(interval)
                    
            localStorage.setItem('enemyId', enemyId)
                    
            showEnemyPet(enemy)

            attackSequence()
    }
}

/**
 * @description Show pet enemy it in the screen
 * 
 * @param {Mokepon} enemy 
 */
function showEnemyPet(enemy) {
    enemyPet.innerHTML = `
        <img src=${enemy.photo} alt=${enemy.name} width=${enemy.width} height=${enemy.height}>
        <p>${enemy.name}</p>
        <p>(ENEMY)</p>
    `
}

/**
 * @description store the attack selected by the player
 */
function attackSequence() {

    let attks = {
        '🔥': 'FUEGO',
        '💧': 'AGUA',
        '🌱': 'PLANTA'
    }

    attackButtons.forEach((button) => {

        button.addEventListener('click', (e) => {
            button.style.background = '#112f58'
            button.disavbled = true

            playerAttacks.push(attks[e.target.textContent])

            if (playerAttacks.length === 5) { 
                sendAttacks() 

                intervalo = setInterval(getAttacks, 50)
            }
        })

        
    })
}

/**
 * @description send the attacks to the server
 */
function sendAttacks() {
    fetch(`${HOST}/mokepon/${playerId}/ataques`, 
        {   
            method: "post", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ ataques: playerAttacks })
        }
    )
}

/**
 * @description get the attacks of the enemy
 */
function getAttacks(){
    fetch(`${HOST}/mokepon/${enemyId}/ataques`)
    .then(function (res) {
        if (res.ok) {
            
            res.json().then(function ({ ataques }) {
                if (ataques.length === 5) {
                    
                    clearInterval(intervalo)

                    attackEnemy = ataques

                    setTimeout(() => {
                        fight()
                    }, 1000)
                }
            })
        }
    })
}

/**
 * @description verify the winner of the fight based on the attacks of the player and the enemy
 */
function fight(){
    clearInterval(intervalo)

    for (let index = 0; index < playerAttacks.length; index++){

        if (
            (playerAttacks[index] === 'FUEGO' && attackEnemy[index] === 'PLANTA') ||
            (playerAttacks[index] === 'AGUA' && attackEnemy[index] === 'FUEGO') ||
            (playerAttacks[index] === 'PLANTA' && attackEnemy[index] === 'AGUA')
        ) {
            playerVictory++
            indexTwo(index, index)
            createMessage()
        }else if (playerAttacks[index] === attackEnemy[index]) {
            indexTwo(index, index)
            createMessage()
        } else {
            enemyVictory++
            indexTwo(index, index)
            createMessage()
        }
        
        playerLifes.innerHTML = playerVictory
        enemyLifes.innerHTML = enemyVictory
    }
    
    checkLifes()
}

/**
 * @description Show the attack of the player and the enemy
 */
function createMessage(){

    let nap = document.createElement('p')
    nap.innerHTML = indexPlayer
    attacksOfPlayer.appendChild(nap)

    let nae = document.createElement('p')
    nae.innerHTML = indexEnemy
    attacksOfEnemy.appendChild(nae)
}

/**
 * Store the attack name of the player and the enemy
 *
 * @param {Mokepon} player
 * @param {Mokepon} enemy
 */
function indexTwo(player, enemy){
    indexPlayer =  playerAttacks[player]
    indexEnemy = attackEnemy[enemy]
}

/**
 * @description check if the player or the enemy has won the fight
 */
function checkLifes(){

    attcksbtn.style.display = 'none'

    if (playerVictory === enemyVictory) {
        result.innerHTML = 'This is a tie!'
    } else if (playerVictory > enemyVictory) {
        cup.style.display = 'block'
        playerPetSpan.style.transform = 'scale(1.5)'
        result.innerHTML = 'YOU WON!'
    } else {
        result.innerHTML = 'YOU LOST!'
    }

    setTimeout(() => {
        deleteData()
    }, 1000)
    
}

/**
 *  @description delete the data of the player and enemy on the server
 */
function deleteData(){
    fetch(`${HOST}/mokepon/${playerId}/eliminar`, { method: "delete" })
    fetch(`${HOST}/mokepon/${enemyId}/eliminar`, { method: "delete" })
}

/**
 * @description capture the keydown event and move the player
 *  
 * @param {Event}
 */
function handleKeyPress(e) {
    switch (e.keyCode) {
        case 37:
            playerPetObject.speedX = -5
            break;
        case 38:
            playerPetObject.speedY = -5
            break;
        case 39:
            playerPetObject.speedX = 5
            break;
        case 40:
            playerPetObject.speedY = 5
            break;
        default:
            break;
    }
}

/**
 * @description stop the player movement
 */
function stopMoving() {
    playerPetObject.speedX = 0
    playerPetObject.speedY = 0
}

/** 
 * @description reset the game
 */
async function reset(){
    location.reload()
}

window.addEventListener('load', initGame)