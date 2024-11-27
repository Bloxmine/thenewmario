// Mario platformer code
// Authors: Maikel Putman, Hein Dijstelbloem.
// Date: 2024-11-27

const marioElement = document.querySelector("#mario");
const containerElement = document.querySelector("#container");
const groundElement = document.querySelector("#ground");
const luigiElement = document.querySelector("#luigi");
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
    const computedStyleOfMario = getComputedStyle(marioElement);
    let locationOfMario = parseInt(computedStyleOfMario.getPropertyValue("--mario_position"));

    const computedStyleOfLuigi = getComputedStyle(luigiElement);
    let locationOfLuigi = parseInt(computedStyleOfLuigi.getPropertyValue("--luigi_position"));

    if (locationOfMario < -55) locationOfMario = window.innerWidth;
    if (locationOfMario > window.innerWidth) locationOfMario = -55;

    let speed = keysBeingPressed.includes("Shift") ? 15 : 5;
    // making the code more compact by combining the if statements when possible
    if (keysBeingPressed.includes("ArrowLeft")) {
        marioElement.classList.add("walking", "left");
        marioElement.classList.remove("right", "standing");
        marioElement.style.setProperty("--mario_position", locationOfMario - speed + "px");
        backgroundPosition += speed; // move background in the opposite direction
        containerElement.style.backgroundPosition = `${backgroundPosition}px 0`;
        groundPosition += speed * 1.5; // move ground in the opposite direction
        distanceWalked += speed;
        groundElement.style.backgroundPosition = `${groundPosition}px 0`;
    } else if (keysBeingPressed.includes("ArrowRight")) {
        marioElement.classList.add("walking", "right");
        marioElement.classList.remove("left", "standing");
        marioElement.style.setProperty("--mario_position", locationOfMario + speed + "px");
        backgroundPosition -= speed; // move background in the opposite direction
        containerElement.style.backgroundPosition = `${backgroundPosition}px 0`;
        groundPosition -= speed * 1.5; // move ground in the opposite direction
        distanceWalked += speed;
        groundElement.style.backgroundPosition = `${groundPosition}px 0`;

        if (distanceWalked > 100) {
            luigiElement.style.display = "block";
            luigiElement.style.setProperty("--luigi_position", locationOfLuigi - speed + "px");
        }
    } else {
        marioElement.classList.remove("walking", "right", "left");
        marioElement.classList.add("standing");
    }

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

    // Update Mario's position
    marioElement.style.setProperty("--mario_position", `${locationOfMario}px`);
}, 1000 / 60);