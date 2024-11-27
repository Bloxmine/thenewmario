// Mario platformer code
// Authors: Maikel Putman, Hein Dijstelbloem.
// Date: 2024-11-27

const marioElement = document.querySelector("#mario");
const containerElement = document.querySelector("#container");
const groundElement = document.querySelector("#ground");
let keysBeingPressed = [];
let didMarioJump = false;
let backgroundPosition = 0;
let groundPosition = 0;
let distanceWalked = 0;

// sounds for mario
const backgroundMusic = new Audio("music/athletic.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

const marioSpeaking = new Audio("music/mama.mp3");
marioSpeaking.loop = false;
marioSpeaking.volume = 0.5;
// make sure the background music plays in every browser
document.body.addEventListener("keydown", (event) => {
    backgroundMusic.play();
    if (!keysBeingPressed.includes(event.key)) {
        keysBeingPressed.push(event.key);
    }
});

document.body.addEventListener("keyup", (event) => {
    keysBeingPressed = keysBeingPressed.filter(key => key !== event.key);
});
setInterval(() => {
    // get the current position of Mario
    const computedStyleOfMario = getComputedStyle(marioElement);
    let locationOfMario = parseInt(computedStyleOfMario.getPropertyValue("--mario_position"));

    if (locationOfMario < -55) locationOfMario = window.innerWidth;
    if (locationOfMario > window.innerWidth) locationOfMario = -55;

    let speed = keysBeingPressed.includes("Shift") ? 15 : 5;
    let isRunning = keysBeingPressed.includes("Shift");
    // move Mario to the left or right
    if (keysBeingPressed.includes("ArrowLeft")) {
        marioElement.classList.add("walking", "left");
        marioElement.classList.remove("right", "standing");
        if (isRunning) marioElement.classList.add("running");
        else marioElement.classList.remove("running");
        marioElement.style.setProperty("--mario_position", locationOfMario - speed + "px");
        backgroundPosition += speed; // move background in the opposite direction
        containerElement.style.backgroundPosition = `${backgroundPosition}px bottom`;
        groundPosition += speed * 1.5; // move ground in the opposite direction
        distanceWalked += speed;
        groundElement.style.backgroundPosition = `${groundPosition}px bottom`;
    } else if (keysBeingPressed.includes("ArrowRight")) {
        marioElement.classList.add("walking", "right");
        marioElement.classList.remove("left", "standing");
        if (isRunning) marioElement.classList.add("running");
        else marioElement.classList.remove("running");
        marioElement.style.setProperty("--mario_position", locationOfMario + speed + "px");
        backgroundPosition -= speed; // move background in the opposite direction
        containerElement.style.backgroundPosition = `${backgroundPosition}px bottom`;
        groundPosition -= speed * 1.5; // move ground in the opposite direction
        distanceWalked += speed;
        groundElement.style.backgroundPosition = `${groundPosition}px bottom`;
    } else {
        marioElement.classList.remove("walking", "right", "left", "running");
        marioElement.classList.add("standing");
    }
    // play sound when space is pressed
    if (keysBeingPressed.includes(" ")) marioSpeaking.play();

    // make Mario jump
    if (keysBeingPressed.includes("ArrowUp")) {
        marioElement.classList.add("jump");
        marioElement.classList.remove("standing");
        if (!didMarioJump) {
            didMarioJump = true;
            setTimeout(() => marioElement.classList.remove("jump"), 500);
        }
    } else {
        didMarioJump = false;
    }

    // update Mario's position
    marioElement.style.setProperty("--mario_position", `${locationOfMario}px`);
}, 1000 / 60);


// luigi spawner system
// when the arrowRight is pressed for 3 seconds, luigi's div will spawn and move to the left of the screen like the background. It will use the #luigi div located in the css file.
let luigiElement = document.querySelector("#luigi");
let luigiPosition = 0;
let luigiSpawned = false;
let luigiSpawnTime = 0;

setInterval(() => {
    if (keysBeingPressed.includes("ArrowRight")) {
        luigiSpawnTime++;
        if (luigiSpawnTime >= 100 && !luigiSpawned) {
            luigiElement.style.display = "block";
            luigiSpawned = true;
        }
    } else {
        luigiSpawnTime = 0;
    }

    let luigiSpeed = keysBeingPressed.includes("Shift") ? 10 : 5;

    if (luigiSpawned && keysBeingPressed.includes("ArrowRight")) {
        luigiElement.style.setProperty("--luigi_position", luigiPosition + "px");
        luigiPosition += luigiSpeed;
    }
}, 1000 / 60);

// when the luigi div reaches the end of the screen, it will be reset to the left side of the screen.
setInterval(() => {
    if (luigiPosition > window.innerWidth) {
        luigiElement.style.display = "none";
        luigiPosition = 0;
        luigiSpawned = false;
    }
}, 1000 / 60);

// move Luigi to the right when the left arrow is pressed and make him go faster when the shift key is pressed
setInterval(() => {
    let luigiSpeed = keysBeingPressed.includes("Shift") ? 10 : 5;

    if (luigiSpawned && keysBeingPressed.includes("ArrowLeft")) {
        luigiElement.style.setProperty("--luigi_position", luigiPosition + "px");
        luigiPosition -= luigiSpeed;
    }
}, 1000 / 60);
