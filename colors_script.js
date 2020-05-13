var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var j=0;
var mx=undefined,my=undefined,temp=(0.75*innerHeight);
var seconds=0,minutes=0;

canvas.addEventListener("click",timing);
canvas.addEventListener("click",function(e){
  mx=e.clientX;
  my=e.clientY;
  ball.vy=30;
  ball.gravity=2;
});

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
      this.draw();
    }
  };

  class wheel {
    constructor(){
      this.x= innerWidth/2,
      this.y= 0
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
      if(seconds==60)
      {
          seconds=0;
          minutes++;
      }
      if(seconds==1 || seconds%30==0){
      wheelArray.push(new wheel());
      }
      canvas.removeEventListener("click",timing);
  } 


  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(mx>0 && mx<innerWidth && my>0 && my<innerHeight)
    {
      ball.update();
    }
    for(let i=0;i<wheelArray.length;i++)
    {
        ctx.save();
        wheelArray[i].update();
    }
    requestAnimationFrame(animate);
  }

  animate();