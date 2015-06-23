"use strict";
var MNDRN = {
  timer:{
    startTime:0,
    currentTime:0,
    endTime:0
  },
  lastLoop: new Date,
  thisLoop:null,
  screenWidth:function()
  {
    return w.innerWidth || e.clientWidth || g.clientWidth;
  },
  screenHeight:function()
  {
    return w.innerHeight|| e.clientHeight|| g.clientHeight;
  }
};

