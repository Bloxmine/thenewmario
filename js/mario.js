const mario_element=document.querySelector("#mario")
let keys_being_pressed=[]
let did_mario_jump = false
// sounds for mario
const background_music=new Audio("music/athletic.mp3")
background_music.loop=true
background_music.volume=0.5
console.log(mario_element)

const mariospeaking=new Audio("music/mama.mp3")
mariospeaking.loop=false
mariospeaking.volume=0.5

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


setInterval(()=>{


    //Get the position of Mario
    const computed_style_of_mario=getComputedStyle(mario_element)
    const location_of_mario=parseInt(computed_style_of_mario.getPropertyValue("--mario_position"))

    if(location_of_mario<-55){
        location_of_mario=window.innerWidth
    }
    if(location_of_mario>window.innerWidth){
        location_of_mario=-55
    }


    console.log(keys_being_pressed)
    //Check what button is pressed and move Mario accordingly
    //Walk to the left and right
    if(keys_being_pressed.includes("ArrowLeft")){
        mario_element.classList.add("walking")
        mario_element.classList.add("left")        
        mario_element.classList.remove("right")
        mario_element.classList.remove("standing")
        mario_element.style.setProperty("--mario_position",location_of_mario-5+"px")
    } else if(keys_being_pressed.includes("ArrowRight")){
        mario_element.classList.add("walking")
        mario_element.classList.remove("left")
        mario_element.classList.add("right")
        mario_element.classList.remove("standing")
        mario_element.style.setProperty("--mario_position",location_of_mario+5+"px")
    } else {
        mario_element.classList.remove("walking")
        mario_element.classList.remove("right") 
        mario_element.classList.remove("left") 
        mario_element.classList.add("standing")
    }
    if (keys_being_pressed.includes(" ")){
        // mario makes a sound
        mariospeaking.play()
    }

    //jump

    if(keys_being_pressed.includes("ArrowUp")){
        mario_element.classList.add("jump")
        mario_element.classList.remove("standing")
        if(!did_mario_jump){
            did_mario_jump=true
            setTimeout(()=>{
                mario_element.classList.remove("jump")
            },500)
        }
    } else {
        did_mario_jump=false        
    }


},1000/60)
