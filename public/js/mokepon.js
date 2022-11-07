export default class Mokepon {
    constructor({name, photo, photoMapSrc, id = null, attacks, isInBattle = false, x, y}) {
        this.id = id
        this.name = name
        this.photo = photo
        this.attacks = attacks
        this.width = 40
        this.height = 40
        this.x = x
        this.y = y
        this.photoMap = new Image()
        this.photoMap.src = photoMapSrc
        this.speedX = 0
        this.speedY = 0
        this.isInBattle = isInBattle
    }

    drawInCanvas({lienzo, canvasWidth, username}) {
        lienzo.drawImage(
            this.photoMap,
            this.x,
            this.y,
            this.width,
            this.height
        )
        lienzo.fillStyle = '#eeeeee'
        lienzo.fillRect(this.x - 2, this.y - 14, this.width + 23, 11)
        
        var gradient = lienzo.createLinearGradient(0, 0, canvasWidth, 0)
        gradient.addColorStop("0"," magenta")
        gradient.addColorStop("0.5", "blue")
        gradient.addColorStop("1.0", "red")

        lienzo.fillStyle = gradient
        lienzo.font = '10px Arial bold'
        lienzo.fillText(username, this.x + 5, this.y - 5)

        if (this.x < 0) this.x = 0
        if (this.x > map.width - this.width) this.x = map.width - this.width
        if (this.y < 0) this.y = 0
        if (this.y > map.height - this.height) this.y = map.height - this.height
    }
}