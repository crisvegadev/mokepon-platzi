const HOST                      = 'http://localhost:3050'

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

let enemyDataId
let playerId
let enemyId
let interval
let intervalo
let playerPetObject
let mokepones       = []
let enemyMokepones  = []
let attackButtons   = []
let playerAttacks   = []
let enemyAttacks    = []
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

class Mokepon {
    constructor(name, photo, life, photoMapSrc, id = null, attacks, isInBattle = false) {
        this.id = id
        this.name = name
        this.photo = photo
        this.life = life
        this.attacks = attacks
        this.width = 40
        this.height = 40
        this.x = random(0, map.width - this.width)
        this.y = random(0, map.height - this.height)
        this.photoMap = new Image()
        this.photoMap.src = photoMapSrc
        this.speedX = 0
        this.speedY = 0
        this.isInBattle = isInBattle
    }

    drawInCanvas() {
        lienzo.drawImage(
            this.photoMap,
            this.x,
            this.y,
            this.width,
            this.height
        )
        lienzo.fillStyle = '#eeeeee'
        lienzo.fillRect(this.x - 2, this.y - 14, this.width + 23, 11)
        
        var gradient = lienzo.createLinearGradient(0, 0, canvasMap.width , 0);
        gradient.addColorStop("0"," magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");

        lienzo.fillStyle = gradient
        lienzo.font = '10px Arial bold'
        lienzo.fillText(username.value, this.x + 5, this.y - 5)

        // preven out of map
        if (this.x < 0) this.x = 0
        if (this.x > map.width - this.width) this.x = map.width - this.width
        if (this.y < 0) this.y = 0
        if (this.y > map.height - this.height) this.y = map.height - this.height


    }
}

let hipodoge    = new Mokepon('Hipodoge', './assets/mokepons_mokepon_hipodoge_attack.png', 5, './assets/hipodoge.png', null, [
    { name: '💧', id: 'btn-water' },
    { name: '💧', id: 'btn-water' },
    { name: '💧', id: 'btn-water' },
    { name: '🔥', id: 'btn-fire' },
    { name: '🌱', id: 'btn-dirt' },
])

let capipepo    = new Mokepon('Capipepo', './assets/mokepons_mokepon_capipepo_attack.png', 5, './assets/capipepo.png', null, [
    { name: '🌱', id: 'btn-dirt' },
    { name: '🌱', id: 'btn-dirt' },
    { name: '🌱', id: 'btn-dirt' },
    { name: '💧', id: 'btn-water' },
    { name: '🔥', id: 'btn-fire' },
])

let ratigueya   = new Mokepon('Ratigueya', './assets/mokepons_mokepon_ratigueya_attack.png', 5, './assets/ratigueya.png', null, [
    { name: '🔥', id: 'btn-fire' },
    { name: '🔥', id: 'btn-fire' },
    { name: '🔥', id: 'btn-fire' },
    { name: '💧', id: 'btn-water' },
    { name: '🌱', id: 'btn-dirt' },
])

mokepones.push(hipodoge, capipepo, ratigueya)

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function initGame() {

    plyrId = localStorage.getItem('playerId')

    fetch(`${HOST}/mokepon/${plyrId}/eliminar`, { method: "delete" })

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

        playerPetObject = getMokeponObjectByName(mokeponSelected.value)
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

function getMokeponObjectByName(name) {
    return mokepones.find((mokepon) => mokepon.name === name)
}

function getMokeponAttacks(pet) {
    mokepones.filter((mokepon) => {
        if (mokepon.name === pet.name) showMokeponAttacks(mokepon.attacks)
    })
}

function showMokeponAttacks(attacks) {
    attacksContainer.innerHTML = ''
    attacks.forEach((attack) => {
        attacksContainer.innerHTML += `
            <button id=${attack.id} class="attack-button">${attack.name}</button>
        `
    })

    attackButtons = document.querySelectorAll('.attack-button')
}

function initMap() {

    petSelectionSection.style.display = 'none'
    showMapSection.style.display = 'flex'

    interval = setInterval(drawCanvas, 50)

    window.addEventListener('keydown', handleKeyPress)

    window.addEventListener('keyup', stopMoving)
}

function drawCanvas() {

    playerPetObject.x += playerPetObject.speedX
    playerPetObject.y += playerPetObject.speedY

    lienzo.clearRect(0, 0, canvasMap.width, canvasMap.height)
    lienzo.drawImage(backgroundMap, 0, 0, canvasMap.width, canvasMap.height)

    playerPetObject.drawInCanvas()
    
    sendPosition(playerPetObject.x, playerPetObject.y)
    
    enemyMokepones.forEach((enemy) => {
        if (enemy !== undefined) {
            checkCollision(enemy)
            enemy.drawInCanvas()
        }
    })
}

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

                            let enemyMokepon = new Mokepon(
                                `${enemyName}`,
                                `./assets/mokepons_mokepon_${enemyName}_attack.png`,
                                5,
                                `./assets/${enemyName}.png`,
                                 enemy.id,
                                 [],
                                 enemy.isInBattle
                            )
        
                            enemyMokepon.x = enemy.x
                            enemyMokepon.y = enemy.y

                            return enemyMokepon
                        }
                    })
                }
            })
        }
    })
}

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
                    
            selectEnemyPet(enemy)
            
    }
}

function selectEnemyPet(enemy) {
    enemyPet.innerHTML = `
        <img src=${enemy.photo} alt=${enemy.name} width=${enemy.width} height=${enemy.height}>
        <p>${enemy.name}</p>
        <p>(ENEMY)</p>
    `
    attackSequence()
}

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

            if (playerAttacks.length === 5) { sendAttacks() }
        })

        
    })
}

function sendAttacks() {
    fetch(`${HOST}/mokepon/${playerId}/ataques`, 
        {   
            method: "post", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ ataques: playerAttacks })
        }
    )
    
    intervalo = setInterval(getAttacks, 50)
}

function getAttacks(){

    
    fetch(`${HOST}/mokepon/${enemyId}/ataques`)
    .then(function (res) {
        if (res.ok) {
            
            res.json().then(function ({ ataques }) {
                if (ataques.length === 5) {
                    
                    clearInterval(intervalo)

                    attackEnemy = ataques
                    fight()
                }
            })
        }
    })
}

function fight(){
    clearInterval(intervalo)

    for (let index = 0; index < playerAttacks.length; index++){

        if (
            (playerAttacks[index] === 'FUEGO' && attackEnemy[index] === 'PLANTA') ||
            (playerAttacks[index] === 'AGUA' && attackEnemy[index] === 'FUEGO') ||
            (playerAttacks[index] === 'PLANTA' && attackEnemy[index] === 'AGUA')
        ) {
            playerVictory++
        }else if (playerAttacks[index] === attackEnemy[index]) {
           
        } else {
            enemyVictory++
        }

        indexTwo(index, index)
        
        createMessage()

        playerLifes.innerHTML = playerVictory
        enemyLifes.innerHTML = enemyVictory
    }
    
    checkLifes()
}

function createMessage(){
    let nap = document.createElement('p')
    let nae = document.createElement('p')

    nap.innerHTML = indexPlayer
    nae.innerHTML = indexEnemy

    attacksOfPlayer.appendChild(nap)
    attacksOfEnemy.appendChild(nae)

}

function indexTwo(player, enemy){
    indexPlayer =  playerAttacks[player]
    indexEnemy = attackEnemy[enemy]
}

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


    // delay
    setTimeout(() => {
        deleteData()
    }, 1000)
    
}

function deleteData(){
    fetch(`${HOST}/mokepon/${playerId}/eliminar`, { method: "delete" })
    fetch(`${HOST}/mokepon/${enemyId}/eliminar`, { method: "delete" })
}

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

function stopMoving() {
    playerPetObject.speedX = 0
    playerPetObject.speedY = 0
}

function movePlayer(moveTo) {
    switch (moveTo) {
        case 'left':
            playerPetObject.speedX = -5
            break;
        case 'up':
            playerPetObject.speedY = -5
            break;
        case 'right':
            playerPetObject.speedX = 5
            break;
        case 'down':
            playerPetObject.speedY = 5
            break;
        default:
            break;
    }

}

async function reset(){
    location.reload()
}

window.addEventListener('load', initGame)