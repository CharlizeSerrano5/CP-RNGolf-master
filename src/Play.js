class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
        
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10,  'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setBounce(1, 0)
        wallB.body.setCollideWorldBounds(true)
        wallB.setVelocityX(200)
        //wallB.setImmovable(true)
        


        this.walls = this.add.group([wallA, wallB])

        // setting a collider to the walls group to allow for bouncing
        //this.walls.body.setCollideWorldBounds(true)


        // add one-way
        this.oneWay = this.physics.add.sprite(width/2, height/4*3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false


        this.shotCount = 0        
        // collecting shots every hit

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1
            let shotDirection_x = pointer.x <= this.ball.x ? 1 : -1

            // adding shot Direction to the proper direction 
            //let shotDirection_x = pointer.x <= this.ball.x ? 1: -1
            
            
            this.ball.body.setVelocityX(this.SHOT_VELOCITY_X * shotDirection_x)
            // based on shotDirection_x, the velocity will output to left or right
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
            // set the velocity to the opposite position
            
            this.shotCount += 1
        })

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }



        this.shotCounter = this.add.text(70, 25,  this.shotCount, scoreConfig)

        this.p1Score = 0
        this.scoreLeft = this.add.text(270, 25, this.p1Score, scoreConfig)


        this.shotRate = 0
        // shot rate = successful shots / all shots

        this.successRate = this.add.text(450, 25, this.shotRate, scoreConfig)
        
        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            //ball.destroy()

            // resetting the ball
            ball.setPosition(width / 2, height - height / 10)
            this.ball.body.setVelocityX(0)
            this.ball.body.setVelocityY(0)
                // reset the velocity
            
            
            this.p1Score += 1
            
            // check if the shot is successful
            // when the ball collides with the cup destroy the ball
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
        this.shotCounter.text = this.shotCount
        this.scoreLeft.text = this.p1Score

        this.shotRate = this.p1Score / this.shotCount
        
        
        this.successRate.text = Math.floor(100 * this.shotRate) + '%'


        //this.wallB.x 
    }

    

}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[ ] Add ball reset logic on successful shot
[ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/