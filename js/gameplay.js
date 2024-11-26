// mario gameplay logic
const mario = new Mario();

document.bodyaddEventListener('keydown', function(e) {
    // jump
    if (e.key==='ArrowUp') {
        mario.jump();
    }
} );