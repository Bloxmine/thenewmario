//HTML references
const mario_element=document.querySelector("#mario")
//Array that keeps the keys being pressed
let keys_being_pressed=[]
//Sounds
const background_music=new Audio("sound/music_repeat.mp3")
background_music.loop=true
background_music.volume=0.25

let did_mario_say_hello=false
const sound_mario_hello=new Audio("sound/hello_short.mp3")
sound_mario_hello.loop=false
sound_mario_hello.volume=0.75

let timeout_jumping
let did_mario_jump=false
const sound_mario_jump=new Audio("sound/jump.wav")
sound_mario_jump.loop=false
sound_mario_jump.volume=0.75

//Add 
document.body.addEventListener("keydown",(event)=>{    
    background_music.play()
    if(!keys_being_pressed.includes(event.key)){
        keys_being_pressed.push(event.key)
    }   
})

//Take keys being released out of our array
document.body.addEventListener("keyup",(event)=>{
    keys_being_pressed=keys_being_pressed.filter(key=>key!==event.key)
})

window.addEventListener("gamepadconnected", (e) => {
    console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length,
    );
});



setInterval(()=>{

    //Get the controller in a variable and take over the keys_being_pressed if a controller is connected
    const gamepad=navigator.getGamepads()[0]
    if(gamepad){
        //Empty the array
        keys_being_pressed.length=0
        //Controller walking and running on trashhold
        if(gamepad.axes[0]>0.2){
            keys_being_pressed.push("ArrowRight")
            if(gamepad.axes[0]>0.95){
                keys_being_pressed.push("Shift")
            } 
        } 
        if(gamepad.axes[0]<-0.2){
            keys_being_pressed.push("ArrowLeft")
            if(gamepad.axes[0]<-0.95){
                keys_being_pressed.push("Shift")
            } 
        } 
        //Gamepad jumping on A button (nintendo)
        if(gamepad.buttons[1].pressed){
            keys_being_pressed.push("ArrowUp")
        }
        //Gamepad jumping on A button (nintendo)
        if(gamepad.buttons[0].pressed){
            keys_being_pressed.push("Control")
        }
    }



    //Get the position of Mario
    const computed_style_of_mario=getComputedStyle(mario_element)
    let location_of_mario=parseInt(computed_style_of_mario.getPropertyValue("--mario_position"))
    let speed_of_mario=5

    //Make mario bound to our window (no escape!)
    if(location_of_mario<-55){
        location_of_mario=window.innerWidth
    }
    if(location_of_mario>window.innerWidth){
        location_of_mario=-55
    }

    //Check what button is pressed and move Mario accordingly
    if(keys_being_pressed.includes("Shift")){
        mario_element.classList.add("running")
        speed_of_mario=15
        background_music.playbackRate=1.5
    } else {
        mario_element.classList.remove("running")
        speed_of_mario=5
        background_music.playbackRate=1.0
    }

    //Walk to the left and right
    if(keys_being_pressed.includes("ArrowLeft")){
        mario_element.classList.add("walking")
        mario_element.classList.add("left")        
        mario_element.classList.remove("right")
        mario_element.style.setProperty("--mario_position",location_of_mario-speed_of_mario+"px")
    } else if(keys_being_pressed.includes("ArrowRight")){
        mario_element.classList.add("walking")
        mario_element.classList.remove("left")
        mario_element.classList.add("right")
        mario_element.style.setProperty("--mario_position",location_of_mario+speed_of_mario+"px")
    } else {
        mario_element.classList.remove("walking")
        mario_element.classList.remove("right") 
        mario_element.classList.remove("left") 
    }
    

    if(keys_being_pressed.includes("Control")){
        mario_element.classList.add("hi")
        if(!did_mario_say_hello){
            sound_mario_hello.play()
            did_mario_say_hello=true
        }        
    } else {
        mario_element.classList.remove("hi")
        did_mario_say_hello=false
    }

    if(keys_being_pressed.includes("ArrowUp")){         
        if(!did_mario_jump){               
            sound_mario_jump.play()
            mario_element.classList.add("jump")         
            did_mario_jump=true
            clearTimeout(timeout_jumping)
            timeout_jumping=setTimeout(()=>{
                mario_element.classList.remove("jump")
            },500)
        }
    } else {
        did_mario_jump=false        
    }

    


},1000/60)
