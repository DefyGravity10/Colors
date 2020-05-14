function Start_Game()
{
  document.getElementById("game_name").style.display="none";
  document.getElementById("start_screen").style.display="none";
  document.getElementById("canvas").style.display="block";
}

function game_lost()
{
  document.getElementById("canvas").style.display="none";
  clearInterval(myvar);
  t_value='false';
  document.getElementById("score").innerHTML=score;
  document.getElementById("hours").innerHTML=minutes;
  document.getElementById("sec").innerHTML=seconds;
  document.getElementById("end").style.display="block";
}

document.getElementById("end").style.display="none";


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var error_check_sec=0;

canvas.style.display="none"; 

var origin_x=0,origin_y=0;
var change_y=0.75*innerHeight-500;

var dif,p;
var score=0;
var t_value='true';
var truth=undefined;
var j=0;
var mx=undefined,my=undefined,temp=(0.75*innerHeight);
var seconds=0,minutes=0;

canvas.addEventListener("click",timing);
canvas.addEventListener("click",function(e){
  mx=e.clientX;
  my=e.clientY;
  ball.vy=30;
  ball.gravity=2;
  temp=ball.y;
  error_check_sec=0;
});

function getDistance(x1,y1,x2,y2)
{
    let xD=x1-x2;
    let yD=y1-y2;

    return Math.sqrt(xD**2 + yD**2);
}

var ball = {
    x: innerWidth/2,
    y: 0.75*innerHeight,
    vx: 0,
    vy: 30,
    radius: 25,
    color: "red",
    gravity: 2,
    draw: function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    },
    update: function(){
  
      this.vy-=this.gravity;
      this.y-=this.vy; 
      if(this.y>temp)
      {
        this.vy=0;
        this.gravity=0;
      }

      if(seconds>7 && this.y==756.75)      
      {
        game_lost();
      }

      for(var d=0;d<wheelArray.length;d++)
      { 
      var distance=getDistance(this.x,this.y,wheelArray[d].x,wheelArray[d].y);
      if(distance<=this.radius+wheelArray[d].radius2)
      {
        if(this.color==wheelArray[d].color)
        {
        console.log("hit me");
        }
        else{
          game_lost();         
        }
      }
      }
      this.draw();
    }
  };

  class wheel {
    constructor(){
      this.x= innerWidth/2;
      this.y= change_y-500;
      this.dy= 0.2;
      this.radius2= 120;
      this.color= undefined;
    }
      draw(){
          ctx.beginPath();
          ctx.fillStyle="yellow";
          ctx.arc(this.x,this.y,this.radius2,315*Math.PI/180,45*Math.PI/180,false);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle="blue";
          ctx.arc(this.x,this.y,this.radius2,45*Math.PI/180,135*Math.PI/180,false);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle="green";
          ctx.arc(this.x,this.y,this.radius2,135*Math.PI/180,225*Math.PI/180,false);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle="red";
          ctx.arc(this.x,this.y,this.radius2,225*Math.PI/180,315*Math.PI/180,false);
          ctx.fill();
          ctx.restore();  
      }
      update(){
        this.y+=this.dy;
        ctx.translate(this.x,this.y);
        ctx.rotate(j*Math.PI/180);
        ctx.translate(-this.x,-this.y);
        j+=0.5;
        if(j==360)
          j=0;
        
        if(j>=225-90 && j<=315-90)
        {
           this.color="red";
        }  
        else{
            this.color=undefined;
        }
        this.draw();
      }
  }

  var wheelArray=[];

  function timing()
  {                                                           
    myvar=setInterval(ttiming, 1000);
  }
  
  function ttiming()
  {
      seconds++;
      error_check_sec++;
      if(seconds==60)
      {
          seconds=0;
          minutes++;
      }
      if(seconds==1 || seconds%10==0){
        change_y=ball.y;
        wheelArray.push(new wheel());
      }

      if(error_check_sec==10)
      {
        game_lost();
      }
      canvas.removeEventListener("click",timing);
  } 

  var b=0;

  function animate() {
    ctx.clearRect(origin_x--,origin_y--,canvas.width+b,canvas.height+b);
    b++;
    if(mx>0 && mx<innerWidth && my>0 && my<innerHeight)
    {
      ball.update();
    }
    for(let i=0;i<wheelArray.length;i++)
    {
        ctx.save();
        wheelArray[i].update();
    }

    if(seconds>=1 && t_value=='true'){        
      ctx.translate(0,1);
      score+=0.05;
    }
    requestAnimationFrame(animate);
  }

  animate();