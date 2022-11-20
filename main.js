let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 500;
document.body.appendChild(canvas);

let backgroundImage, bulletImage, enemyImage, gameoverImage, manImage;
let gameOver = false
let score = 0;

//man
let manX = canvas.width/2 - 32;
let manY = canvas.height - 64;

//bullet
let bulletListup = []
let bulletListdown = []
let bulletListL = []
let bulletListR = []


function bulletup(){
    this.x=0;
    this.y=0;
    this.alive = true //살아있는 총알
    this.initup=function(){
        this.x = manX +20;
        this.y = manY;
        bulletListup.push(this);
    };
    this.updatebulletup = function(){
        this.y -=5;
    };
    this.check=function(){
        for(let i=0; i < enemylist.length; i++){
            if( this.y <= enemylist[i].y && 
                this.x >= enemylist[i].x && 
                this.x <= enemylist[i].x + 40)
               {
                score++;
                this.alive = false //죽은 총알
                enemylist.splice(i,1);
            }
        }
    }
}
// function bulletdown(){
//     this.x=0;
//     this.y=0;
//     this.initdown=function(){
//         this.x = manX;
//         this.y = manY;

//         bulletListdown.push(this);
//     };
//     this.updatebulletdown = function(){
//         this.y +=7;
//     };
// }
// function bulletL(){
//     this.x=0;
//     this.y=0;
//     this.initL=function(){
//         this.x = manX;
//         this.y = manY;

//         bulletListL.push(this);
//     };
//     this.updatebulletL = function(){
//         this.x -=7;
//     };
// }
// function bulletR(){
//     this.x=0;
//     this.y=0;
//     this.initR=function(){
//         this.x = manX;
//         this.y = manY;

//         bulletListR.push(this);
//     };
//     this.updatebulletR = function(){
//         this.x +=7;
//     };
// }

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src ="images/background.gif";
    bulletImage = new Image();
    bulletImage.src ="images/bullet.png";
    enemyImage = new Image();
    enemyImage.src ="images/enemy.png";
    gameoverImage = new Image();
    gameoverImage.src ="images/gameover.png";
    manImage = new Image();
    manImage.src ="images/man.png";
}


let KeyDown={}
function setupkey(){
    document.addEventListener("keydown",function(event){
        KeyDown[event.keyCode] =true;
        
    });
    document.addEventListener("keyup",function(){
        delete KeyDown[event.keyCode];
        

        if(event.keyCode == 32){
        createBulletup();
        }
        // if(event.keyCode == 32 & 38 in KeyDown){
        // createBulletup();
        // }
        // if(event.keyCode == 32 & 40 in KeyDown){
        // createBulletdown();
        // }
        // if(event.keyCode == 32 & 37 in KeyDown){
        // createBulletL();
        // }
        // if(event.keyCode == 32 & 39 in KeyDown){
        // createBulletR();
        // }
    });
}
function createBulletup(){
    let b = new bulletup();
    b.initup();
}
// function createBulletdown(){
//     let b = new bulletdown();
//     b.initdown();
// }
// function createBulletL(){
//     let b = new bulletL();
//     b.initL();
// }
// function createBulletR(){
//     let b = new bulletR();
//     b.initR();
// }

//사람 오른쪽 x증가 
//사람 왼쪽 x감소
function update(){
    if( 39 in KeyDown){
        manX +=3;             //오른쪽
    }                           
    if( 37 in KeyDown){  //왼쪽
        manX -=3;
    }  
    if( 38 in KeyDown){  //위
        manY -=4;
    }
    if( 40 in KeyDown){  //아래
        manY +=4;
    }    
    //경기장 제한
    if (manX <=0){
        manX = 0;
    }
    if(manX >= canvas.width - 50){
        manX = canvas.width - 50;
    } 
    if (manY <= 0){
        manY = 0;
    }
    if (manY >= canvas.height - 50){
        manY = canvas.height - 50;
    }

    //총알 업데이트 함수 호출
    for(let i=0; i<bulletListup.length; i++){
       if(bulletListup[i].alive){
        bulletListup[i].updatebulletup();
        bulletListup[i].check();
       }
    }
    // for(let i=0; i<bulletListdown.length; i++){
    //     bulletListdown[i].updatebulletdown();
    // }
    // for(let i=0; i<bulletListL.length; i++){
    //     bulletListL[i].updatebulletL();
    // }
    // for(let i=0; i<bulletListR.length; i++){
    //     bulletListR[i].updatebulletR();
    // }

    for(let i=0; i<enemylist.length; i++){
        enemylist[i].update();
    }
}
    //적군호출
    function randomvalue(min,max){
        let reandomNum = Math.floor(Math.random()*(max-min+1))+min
        return reandomNum
    }
    let enemylist=[];
    function Enemy(){
        this.x = 0;
        this.y = 0;
        this.init = function(){
            this.y = 0;
            this.x =randomvalue(0,canvas.width - 50);
            enemylist.push(this);
        };
        this.update=function(){
            if(score<20){             //난이도 설정
            this.y +=1;}
            else if(20<=score<70){
            this.y +=2;}
            
            if(this.y >= canvas.height -48){
                gameOver = true;
            }
        }

    }
    function createEnemy(){
        const interval = setInterval(function(){
            let e = new Enemy()
            e.init()
        },1000) //1.5초마다 부르기
    }

function render(){
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);   
        ctx.drawImage(manImage, manX, manY);    
        ctx.fillText(`score:${score}`, 20, 20);
        ctx.fillstyle= "black";
        ctx.font = "20px Arial";
        for(let i=0; i<bulletListup.length; i++){
            if(bulletListup[i].alive){
            ctx.drawImage(bulletImage,bulletListup[i].x,bulletListup[i].y);
            }
        }
        // for(let i=0; i<bulletListdown.length; i++){
        //     ctx.drawImage(bulletImage,bulletListdown[i].x,bulletListdown[i].y);
        // }
        // for(let i=0; i<bulletListL.length; i++){
        //     ctx.drawImage(bulletImage,bulletListL[i].x,bulletListL[i].y);
        // }
        // for(let i=0; i<bulletListR.length; i++){
        //     ctx.drawImage(bulletImage,bulletListR[i].x,bulletListR[i].y);
        // }
        for(let i=0; i<enemylist.length; i++){
            ctx.drawImage(enemyImage,enemylist[i].x,enemylist[i].y);
        }
    }
function main(){
    if(gameOver != true){
    render();
    update();
    requestAnimationFrame(main);
    }
    else{
        ctx.drawImage(gameoverImage,50, 100, 300, 300)
    }
}

loadImage();
setupkey();
createEnemy();
main();