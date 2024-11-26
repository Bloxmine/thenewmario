class Mario {
    constructor() {
        this.marioElement = document.getElementById('mario');
        this.bottom = 0;
        this.left = 0;
        this.isJumping = false;
    }

    jump() {
        if (this.isJumping) return;
        this.isJumping = true;
        let jumpHeight = 150;
        let jumpSpeed = 20;
        let jumpInterval = setInterval(() => {
            if (jumpHeight > 0) {
                this.bottom += jumpSpeed;
                jumpHeight -= jumpSpeed;
            } else {
                clearInterval(jumpInterval);
                this.fall();
            }
            this.updatePosition();
        }, 20);
    }

    fall() {
        let fallSpeed = 20;
        let fallInterval = setInterval(() => {
            if (this.bottom > 0) {
                this.bottom -= fallSpeed;
            } else {
                clearInterval(fallInterval);
                this.isJumping = false;
                this.bottom = 0;
            }
            this.updatePosition();
        }, 20);
    }

    moveLeft() {
        this.left -= 20;
        this.updatePosition();
    }

    moveRight() {
        this.left += 20;
        this.updatePosition();
    }

    updatePosition() {
        this.marioElement.style.setProperty('--mario-bottom', `${this.bottom}px`);
        this.marioElement.style.setProperty('--mario-left', `${this.left}px`);
    }

    speak() {
        let audio = new Audio('../music/mama.mp3');
        audio.play();
    }
}
// creating a new instance of Mario
const mario = new Mario();

document.body.addEventListener('keydown', function(e) {
    // jump
    if (e.key === 'ArrowUp') {
        mario.jump();
    }
    // move left
    if (e.key === 'ArrowLeft') {
        mario.moveLeft();
    }
    // move right
    if (e.key === 'ArrowRight') {
        mario.moveRight();
    }
    // speak with audio
    if (e.key === 'Space') {
        mario.speak();
    }
});