// Canvas

const cvs = document.getElementById("flappy");
const ctx = cvs.getContext("2d");

let frames = 0;
const degree = Math.PI / 180;

// Load Game Image Collection
const img = new Image();
img.src = "images/collection.png";

// LOAD SOUNDS
const SCORE_S = new Audio();
SCORE_S.src = "musics/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "musics/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "musics/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "musics/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "musics/sfx_die.wav";
let soundFlag = true;


startX = cvs.width / 2 - 225 / 2;

/**
 * GAME STATE
 */

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

// START BUTTON COORD
const startBtn = {
    x : startX+80,
    y : 263,
    w : 83,
    h : 29
}


/**
 * To Control The Game
 * 
 */

cvs.addEventListener("click", function (e) {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            bird.flap();
            FLAP.play();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = e.clientX - rect.left;
            let clickY = e.clientY - rect.top;
            
            // CHECK IF WE CLICK ON THE START BUTTON
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
                soundFlag = true;
            }
            break;

    }
})


/**
 * PROPERTIES
 * 
 * */

// Background

const bg = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: cvs.height - 226,

    draw: function () {
        ctx.drawImage(img, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(img, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        ctx.drawImage(img, this.sX, this.sY, this.w, this.h, this.x + this.w + this.w, this.y, this.w, this.h);
    }
}

// Foreground
const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,
    dx: 2,

    draw: function () {
        ctx.drawImage(img, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(img, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        ctx.drawImage(img, this.sX, this.sY, this.w, this.h, this.x + this.w + this.w, this.y, this.w, this.h);
        ctx.drawImage(img, this.sX, this.sY, this.w, this.h, this.x + this.w + this.w + this.w, this.y, this.w, this.h);
    },

    update: function () {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2);
        }
    }
}

// BIRD
const bird = {
    animation: [
        { sX: 276, sY: 112 },
        { sX: 276, sY: 139 },
        { sX: 276, sY: 164 },
        { sX: 276, sY: 139 }
    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,

    frame: 0,
    gravity: 0.25,
    jump: 4.6,
    radius : 12,
    speed: 0,
    rotation: 0,


    draw: function () {
        let bird = this.animation[this.frame];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(img, bird.sX, bird.sY, this.w, this.h, - this.w / 2, - this.h / 2, this.w, this.h);
        ctx.restore();
    },

    flap: function () {
        this.speed = - this.jump;

    },

    update: function () {
        // If game state is ready, then bird flaps slower
        // higher the period, slower the flap
        this.period = state.current == state.getReady ? 10 : 5;

        // Increment by 1 on each period
        this.frame += frames % this.period == 0 ? 1 : 0;

        // If frame gos from 0 to 4, then we need to get back to 0
        this.frame = this.frame % this.animation.length;


        if (state.current == state.getReady) {
            this.y = 150;
            this.rotation = 0 * degree;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.h / 2 >= cvs.height - fg.h) {
                this.y = cvs.height - fg.h - this.h / 2;
                if (state.current = state.game) {
                    state.current = state.over;
                    if(soundFlag){
                        DIE.play();
                        soundFlag = false;
                    }
                }
            }

            // If the speed is greater than the jump means, the bird is falling down
            if (this.speed >= this.jump) {
                this.rotation = 90 * degree;
                this.frame = 1;
            }
            else {
                this.rotation = -25 * degree;
            }
        }
    },
    speedReset : function(){
        this.speed = 0;
    }
}


// Get Ready object

const getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: cvs.width / 2 - 173 / 2,
    y: 80,

    draw: function () {
        if (state.current == state.getReady) {
            ctx.drawImage(img, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }

}

// Game Over

const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: startX,
    y: 90,

    draw: function () {
        if (state.current == state.over) {
            ctx.drawImage(img, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }

}

// Pipes

const pipes = {
    position: [],
    top: {
        sX: 553,
        sY: 0
    },
    bottom: {
        sX: 502,
        sY: 0
    },
    w: 53,
    h: 400,
    gap : 85,
    maxYPos: -150,
    dx: 2,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            // top pipe
            ctx.drawImage(img, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

            // bottom pipe
            ctx.drawImage(img, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
        }
    },
    update: function () {
        if (state.current !== state.game) return;

        if (frames % 100 == 0) {
            this.position.push({
                x: cvs.width,
                y: this.maxYPos * (Math.random() + 1)
            });
        }
        for (let i = 0; i <this.position.length; i++){
            let p = this.position[i];
            let bottomPipeYPos = p.y + this.h + this.gap;

            // COLLISION DETECTION
            // TOP PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over;
                HIT.play();
            }
            // BOTTOM PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                HIT.play();
            }

            p.x -= this.dx;

            // if the pipes goes beyond the canvas, remove it
            if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1;
                SCORE_S.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);

            }
        }
    },
    reset : function(){
        this.position = [];
    }
}

// Score
const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);
            
        }else if(state.current == state.over){
            // SCORE VALUE
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 225, 186);
            ctx.strokeText(this.value, 225, 186);
            // BEST SCORE
            ctx.fillText(this.best, 225, 228);
            ctx.strokeText(this.best, 225, 228);
        }
    },
    
    reset : function(){
        this.value = 0;
    }
}

// Draw
const draw = () => {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

// Update

const update = () => {
    bird.update();
    fg.update();
    pipes.update();
}

// Loop

const loop = () => {
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}


loop();