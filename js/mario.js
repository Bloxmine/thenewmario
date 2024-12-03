// Mario platformer code
// Authors: Maikel Putman, Hein Dijstelbloem.
// Date: 2024-11-27
// Updated: 2024-12-03

const marioElement = document.querySelector("#mario");
const containerElement = document.querySelector("#container");
const groundElement = document.querySelector("#ground");
const luigiElement = document.querySelector("#luigi");
let keysBeingPressed = [];
let didMarioJump = false;
let backgroundPosition = 0;
let groundPosition = 0;
let distanceWalked = 0;
let luigiPosition = 0;
let luigiSpawned = false;
let luigiSpawnTime = 0;

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
    backgroundMusic.playbackRate = keysBeingPressed.includes("Shift") ? 1.5 : 1;
});

document.body.addEventListener("keyup", (event) => {
    keysBeingPressed = keysBeingPressed.filter(key => key !== event.key);
    backgroundMusic.playbackRate = keysBeingPressed.includes("Shift") ? 1.5 : 1;
});

window.addEventListener("gamepadconnected", (e) => {
    console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length,
    );
});


setInterval(() => {
    //Get the controller in a variable and take over the keys_being_pressed if a controller is connected
    const gamepad=navigator.getGamepads()[0]
    if (gamepad) {
        //Empty the array
        keysBeingPressed.length = 0;
        //Controller walking and running on threshold
        if (gamepad.axes[0] > 0.2) {
            keysBeingPressed.push("ArrowRight");
            if (gamepad.axes[0] > 0.95) {
                keysBeingPressed.push("Shift");
            }
        }
        if (gamepad.axes[0] < -0.2) {
            keysBeingPressed.push("ArrowLeft");
            if (gamepad.axes[0] < -0.95) {
                keysBeingPressed.push("Shift");
            }
        }
        //Gamepad jumping on A button (nintendo)
        if (gamepad.buttons[1].pressed) {
            keysBeingPressed.push(" ");
        }
        //Gamepad jumping on A button (nintendo)
        if (gamepad.buttons[0].pressed) {
            keysBeingPressed.push("Control");
        }
    }
    // Mario movement
    const computedStyleOfMario = getComputedStyle(marioElement);
    let locationOfMario = parseInt(computedStyleOfMario.getPropertyValue("--mario_position"));
    // if mario is out of the screen, reset his position
    if (locationOfMario < -55) locationOfMario = window.innerWidth;
    if (locationOfMario > window.innerWidth) locationOfMario = -55;
    // mario can run when shift is pressed
    let speed = keysBeingPressed.includes("Shift") ? 15 : 5;
    let isRunning = keysBeingPressed.includes("Shift");
    // mario can walk left or right
    if (keysBeingPressed.includes("ArrowLeft")) {
        marioElement.classList.add("walking", "left");
        marioElement.classList.remove("right", "standing");
        if (isRunning) marioElement.classList.add("running");
        else marioElement.classList.remove("running");
        marioElement.style.setProperty("--mario_position", locationOfMario - speed + "px");
        backgroundPosition += speed;
        containerElement.style.backgroundPosition = `${backgroundPosition}px bottom`;
        groundPosition += speed * 1.5;
        distanceWalked += speed;
        groundElement.style.backgroundPosition = `${groundPosition}px bottom`;
    } else if (keysBeingPressed.includes("ArrowRight")) {
        marioElement.classList.add("walking", "right");
        marioElement.classList.remove("left", "standing");
        if (isRunning) marioElement.classList.add("running");
        else marioElement.classList.remove("running");
        marioElement.style.setProperty("--mario_position", locationOfMario + speed + "px");
        backgroundPosition -= speed;
        containerElement.style.backgroundPosition = `${backgroundPosition}px bottom`;
        groundPosition -= speed * 1.5;
        distanceWalked += speed;
        groundElement.style.backgroundPosition = `${groundPosition}px bottom`;
    } else {
        marioElement.classList.remove("walking", "right", "left", "running");
        marioElement.classList.add("standing");
    }
    // mario can speak when space is pressed
    if (keysBeingPressed.includes(" ")) marioSpeaking.play();

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

    marioElement.style.setProperty("--mario_position", `${locationOfMario}px`);

    // Luigi spawner system
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

    if (luigiPosition > window.innerWidth) {
        luigiElement.style.display = "none";
        luigiPosition = 0;
        luigiSpawned = false;
    }

    if (luigiSpawned && keysBeingPressed.includes("ArrowLeft")) {
        luigiElement.style.setProperty("--luigi_position", luigiPosition + "px");
        luigiPosition -= luigiSpeed;
    }
}, 1000 / 60);
