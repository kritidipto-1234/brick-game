
const canvas=document.querySelector('canvas');
const leftBtn=document.querySelector('.left');
const rightBtn=document.querySelector('.right');
const buttonTray=document.querySelector('.buttons');
const message=document.querySelector('.message');
///////////////////////////////////////////////////////////////////////////////////
let ctx,bricks,bar,ball,lives,score,gameStarted,frameRenderer,row=7,column=9;
///////////////////////////////////////////////////////////////////////////////////

class rectangle
{
    constructor(x,y,w,h,type="brick",dx=0,speed=5)
    {
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.display=true;
        this.dx=dx;
        this.speed=speed;
        this.type=type;
        this.displayRectangle();
    }
    displayRectangle()
    {    
        ctx.fillStyle='teal';
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.w,this.h);
        ctx.fill();
        ctx.closePath();
    }
    checkCollision(direction)//check for collision of this rect with wall
    {
        if (this.x+this.w>=canvas.width && this.dx>0)//moving to right
            this.dx=0;
        if (this.x<=0 && this.dx<0)//moving to left
            this.dx=0;
    }
    static displayAllBricks()
    {
        for(let i=0;i<row;i++)
        {
            for(let j=0;j<column;j++)
                if (bricks[i][j].display) bricks[i][j].displayRectangle();
        }
    }
    static checkRectCircCollision(b,ball)//check for collison of a rect and a circle
    {
        if (!((b.x+b.w<ball.x-ball.radius)||(b.x>ball.x+ball.radius)||(b.y+b.h<ball.y-ball.radius)||(ball.y+ball.radius<b.y)) && b.display)//actually here ball is treated as square
        {
            b.display=false;
            if (b.type==="brick") score.value++;
            if (score.value==row*column)
            {
                lives.value=1;
                reset("CONGRATS U WON!");
            }
            const prev={x:ball.x-ball.dx,y:ball.y-ball.dy};
            if (prev.x<b.x || prev.x> b.x+b.w)
                ball.dx=-ball.dx;
            if (prev.y<b.y || prev.y>b.y+b.h)
                ball.dy=-ball.dy;
            
            if (b.type==='bar')
            {
                ball.dx+=(b.dx/b.speed)*2;
            }
        }
    }
}

class circle
{
    constructor(x,y,radius,dx,dy,speed=3)
    {
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.dx=dx;
        this.dy=dy;
        this.speed=speed;
        this.drawCircle();
    }
    drawCircle()
    {
        ctx.fillStyle='white';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
    checkCollision()//check for collision of this ball with all other physical objects
    {
        for(let i=0;i<row;i++)//for all the bricks
        {
            for(let j=0;j<column;j++)
                rectangle.checkRectCircCollision(bricks[i][j],this);
        }

        if(this.x+this.radius>canvas.width || this.x-this.radius<0)//right left wall
            this.dx=-this.dx;
        if(this.y-this.radius<0)//bottom top wall
            this.dy=-this.dy;
        if (this.y+this.radius>canvas.height)//ball has fallen
            reset("OOPS GAME OVER");
    
        rectangle.checkRectCircCollision(bar,this);
        bar.display=true;
    }
    circleLaunch(direction)
    {
        gameStarted=true;
        if (direction==='left')
            this.dx=-this.speed;
        if (direction==='right')
            this.dx=this.speed;
        this.dy=-this.speed;
        this.dx+=Math.round(Math.random());
    }
}

class text
{
    constructor(content,value,x,y)
    {
        this.x=x;
        this.y=y;
        this.content=content;
        this.value=value;
        this.makeText();
    }
    makeText()
    {
        ctx.font = '20px Arial';
        ctx.fillStyle='teal';
        ctx.fillText(`${this.content} : ${this.value}`,this.x,this.y);
    }
}

function init()//starter
{
    gameStarted=false;
    ctx=canvas.getContext('2d');
    canvas.width=880;
    canvas.height=700;
    canvas.style.background='aqua';
    ctx.fillStyle='teal';
    bricks=new Array(6);
    for(let i=0;i<row;i++)
        bricks[i]=new Array(column);
    for(let i=0;i<row;i++)
    {
        for(let j=0;j<column;j++)
            bricks[i][j]=new rectangle(60+(1+j)*10+j*70,60+(1+i)*10+i*20,70,20);
    }
    rectangle.displayAllBricks();
    bar=new rectangle(canvas.width/2-90/2,canvas.height-40,90,8,"bar");
    ball=new circle(canvas.width/2,canvas.height-48,7,0,0);
    score=new text('Score',0,750,40);
    lives=new text('Lives',2,600,40);
    frameRenderer=setInterval(updateCanvas,10);
    buttonTray.addEventListener('mousedown',updateBar);
    buttonTray.addEventListener('mouseup',updateBar);
    window.addEventListener('keydown',updateBar);
    window.addEventListener('keyup',updateBar);
}
init();

function updateCanvas()//the main runner which renders canvas continously in real time
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ball.x+=ball.dx;
    ball.y+=ball.dy;
    ball.drawCircle();
    ball.checkCollision();
    bar.checkCollision();
    bar.x+=bar.dx;
    rectangle.displayAllBricks();
    score.makeText();
    lives.makeText();
    bar.displayRectangle();
}

function updateBar(e)//updating the catcher bar below the ball
{
    let direction=undefined;
    const parentBtn=e.target.closest('.button');
    if ((e.type==='mousedown' || e.type==='mouseup')&&!parentBtn)
        return;
    if ((e.type==='mousedown' && parentBtn===leftBtn) || (e.type==='keydown'&&e.key==='ArrowLeft'))
    {
        bar.dx=-bar.speed;
        direction='left';
    }
    if ((e.type==='mousedown' && parentBtn===rightBtn) || (e.type==='keydown')&&e.key==='ArrowRight')
    {
        bar.dx=bar.speed;
        direction='right';
    }
    if ((e.type==='mouseup' && parentBtn===leftBtn) || (e.type==='keyup'&&e.key==='ArrowLeft'))
        bar.dx=0;
    if ((e.type==='mouseup' && parentBtn===rightBtn) || (e.type==='keyup'&&e.key==='ArrowRight'))
        bar.dx=0;
    if (direction && !gameStarted)
        ball.circleLaunch(direction);
}

function reset(displayMessage)//resets canvas based on given conditions
{
    lives.value--;
    if (lives.value===0)//game over or won
    {
        message.textContent=displayMessage;
        message.style.opacity=1;
        setTimeout(function(){message.style.opacity=0;},1500);
        lives.value=2;
        score.value=0;
        for(let i=0;i<row;i++)
        {
            for(let j=0;j<column;j++)
                bricks[i][j].display=true;
        }
    }
    gameStarted=false;
    ball.dx=0;
    ball.dy=0;
    bar.x=canvas.width/2-80/2;
    bar.y=canvas.height-40;
    ball.x=canvas.width/2;
    ball.y=canvas.height-48;
    const mouseUpEvent = new Event("mouseup", {"bubbles":true, "cancelable":false});
    leftBtn.dispatchEvent(mouseUpEvent);
}

//works for all keys
//fix respawnt


console.log();