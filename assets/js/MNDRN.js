"use strict";
var MNDRN = {
  timer:{
    startTime:0,
    currentTime:0,
    endTime:0
  },
  lastLoop: new Date,
  thisLoop:null,
  frameTime: 0,
  getFps:function()
  {
    var thisFrameTime = (this.thisLoop=new Date) - this.lastLoop;
    this.frameTime+= (thisFrameTime - this.frameTime) / 20;
    this.lastLoop = this.thisLoop;
    return (1000/this.frameTime).toFixed(0);
  },
  screenWidth:function()
  {
    return w.innerWidth || e.clientWidth || g.clientWidth;
  },
  screenHeight:function()
  {
    return w.innerHeight|| e.clientHeight|| g.clientHeight;
  }
};

