function Start_Game()                                                                       //Function links to game page from start page
{
  document.getElementById("game_name").style.display="none";
  document.getElementById("start_screen").style.display="none";
  document.getElementById("canvas").style.display="block";
}

function game_lost()                                                                        //Function links to end game screen from game
{
  lose.play();
  document.getElementById("canvas").style.display="none";
  clearInterval(myvar);
  t_value='false';
  score_check=localStorage.getItem("highscore");
  
  if(score>score_check)                                                                   //To update highscore
  {
    highscore=score;
    score_check=score;
    localStorage.setItem("highscore",score);
  }
  else{
    highscore=score_check;
  }
  
  document.getElementById("highscore").innerHTML=highscore;
  document.getElementById("score").innerHTML=score;
  document.getElementById("hours").innerHTML=minutes;
  document.getElementById("sec").innerHTML=seconds;
  document.getElementById("end").style.display="block";
}

document.getElementById("end").style.display="none";

var sound=new Audio();                                                                    //Creating audio elements for sound effects in the game
sound.src="sound.mp3";
var lose=new Audio();
lose.src="youlose.mp3";

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.display="none"; 

var origin_x=0,origin_y=0;                                                                //Variables to reference origin
var change_y=0.75*innerHeight-500;                                                        //Variable to reference position of wheel
var error_check_sec=0;                                                                    //Variable to start a background timer caused due to inactivity from the player

var dif,p;
var score=0;                                                                              //Variable to hold score
var t_value='true';                                                                       //Variable when holds true if the player has not lost
var j=0;                                                                                  //Variable to adjust rotation of wheel
var mx=undefined,my=undefined,temp=(0.75*innerHeight);                                    //Variables mx and my hold position of mouse click, temp stores position of ball when it starts the bounce
var seconds=0,minutes=0;                                                                  //Variables to store seconds and minute values for the background timer

/*localStorage.setItem("highscore",score);*/
var score_check=0;
var highscore;

canvas.addEventListener("click",timing);                                                  //Starts the timer
canvas.addEventListener("click",function(e){                                              //Initial settings before every bounce
  mx=e.clientX;
  my=e.clientY;
  ball.vy=30;
  ball.gravity=2;
  temp=ball.y;
  error_check_sec=0;
  sound.play();
});

function getDistance(x1,y1,x2,y2)                                                         //Function to return distance between the ball and a wheel
{
    let xD=x1-x2;
    let yD=y1-y2;

    return Math.sqrt(xD**2 + yD**2);
}

var ball = {                                                                              //Ball object
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
    update: function(){                                                                    //To update the animation with specific conditions
  
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

  class wheel {                                                                         //Wheel object
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
      update(){                                                                         //Function takes care or rotation and hit region
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

  var wheelArray=[];                                                                    //List to store all wheel objects

  function timing()
  {                                                                                     //Sets interval for timer to 1 sec
    myvar=setInterval(ttiming, 1000);
  }
  
  function ttiming()                                                                    //Function to increment seconds, minutes variable, and to check for inactivity
  {
      seconds++;
      error_check_sec++;
      if(seconds==60)
      {
          seconds=0;
          minutes++;
      }
      if(seconds==1 || seconds%10==0){                                                  //Also, a new wheel appears every 10 seconds
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

  function animate() {                                                                  //Function called again and again which provides necessary frames for animation
    ctx.clearRect(origin_x--,origin_y--,canvas.width+b,canvas.height+b);                //Canvas is cleared before every frame
    b++;
    if(mx>0 && mx<innerWidth && my>0 && my<innerHeight)                                 //Condition check for click on canvas
    {
      ball.update();                                                                    //Updates ball animation
    }
    for(let i=0;i<wheelArray.length;i++)                                                //Updates wheel animation
    {
        ctx.save();
        wheelArray[i].update();
    }

    if(seconds>=1 && t_value=='true'){                                                  //The game screen keeps moving down, to make game interesting
      ctx.translate(0,1);
      score+=0.05;
    }
    requestAnimationFrame(animate);
  }

  animate();