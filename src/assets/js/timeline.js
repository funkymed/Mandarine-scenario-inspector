var w = window,
  d = document,
  g = d.getElementsByTagName('body')[0];
var abcd = 1;
var durationSequence=0;
if(!sequence)
{
  var sequence = [
    {start: 0,end:10,name:"ok1",getTypeName:function(){return "scene";}},
    {start:10,end:20,name:"ok2",getTypeName:function(){return "transition";}},
    {start:20,end:30,name:"ok3",getTypeName:function(){return "scene";}},
    {start:30,end:40,name:"ok4",getTypeName:function(){return "transition";}},
    {start:12,end:14,name:"ok6",getTypeName:function(){return "effect";}},
    {start:22,end:25,name:"ok7",getTypeName:function(){return "effect";}},
    {start:35,end:45,name:"ok8",getTypeName:function(){return "scene";}}
  ];
}

var debugTimeline = false;
var timelineItems={};
var cursorTimeline = null;

function updatetimeline()
{
  if(cursorTimeline)
    cursorTimeline.style.left = 10+((getTimer()/durationSequence*90))+"%";
}

function getTimer()
{
  return MNDRN.timer.currentTime;
}

function getSequence()
{
  return sequence ? sequence : sequence;
}

function timeline()
{
  var end = 0;
  var t = getSequence();
  t.forEach(function(b)
  {
    if(!timelineItems[b.getTypeName()]) timelineItems[b.getTypeName()]=[];

    timelineItems[b.getTypeName()].push({
      name: b.name,
      type: b.getTypeName(),
      start: b.start,
      end: b.end
    });

    if(b.end>end)
      end = b.end;
  });

  MNDRN.timer.endTime = end;
  MNDRN.timeline = timelineItems;

  var containerTimeline = d.createElement('div');
  containerTimeline.style.width="100%";
  containerTimeline.style.position="relative";
  containerTimeline.style.height="auto";
  containerTimeline.style.fontFamily="Helvetica";
  containerTimeline.style.fontSize=".65em";

  var blockH    = 20;
  var blockLeft = 10;
  var blockRight = 100-blockLeft;
  var blockName = d.createElement('div');
  blockName.style.background="gray";
  blockName.style.width=blockLeft+"%";
  blockName.style.float="left";
  containerTimeline.appendChild(blockName);

  var blockDuration = d.createElement('div');

  blockDuration.style.background="gray";
  blockDuration.style.width=blockRight+"%";
  blockDuration.style.float="left";
  containerTimeline.appendChild(blockDuration);

  var itemName = d.createElement('div');
  itemName.appendChild(document.createTextNode("time"));
  itemName.style.height=(blockH-blockH/3)+"px";
  itemName.style.paddingTop=blockH/3+"px";
  itemName.style.paddingLeft="4px";
  itemName.style.background="#333";
  itemName.style.color="white";
  blockName.appendChild(itemName);

  var itemDuration = d.createElement('div');
  itemDuration.style.height=blockH+"px";
  itemDuration.style.background="#555";
  itemDuration.style.color="white";
  blockDuration.appendChild(itemDuration);

  $(itemDuration).click( function(e) {
    var scrW = $('#center').width();
    var posX = e.clientX-((scrW*10)/100);
    var seekTime = (posX/scrW)*durationSequence;

    //Send to page
    console.log(seekTime);
  });

  var stepper = Math.ceil(end*.05);
  var l= 0;
  for(var tt=0;tt<=end;tt+=stepper)
  {
    var item = d.createElement('div');
    item.appendChild(document.createTextNode(tt));
    item.style.paddingTop="4px";
    item.style.display ="inline-block";
    item.style.position = "absolute";
    item.style.height=blockH-blockH/3+"px";
    item.style.paddingTop=blockH/3+"px";
    item.style.left = (tt/end*blockRight) +blockLeft+"%";
    item.style.top = l*blockH-2+"px";
    item.style.textAlign = "left";
    itemDuration.appendChild(item);
  }
  l++;
  for(var c in timelineItems)
  {
    var itemName = d.createElement('div');
    itemName.style.paddingTop="4px";
    itemName.style.paddingLeft="4px";
    itemName.appendChild(document.createTextNode(c));
    itemName.style.height=blockH-blockH/3+"px";
    itemName.style.paddingTop=blockH/3+"px";
    itemName.style.background=(l%2==0) ? "#efefef" : "#cdcdcd";
    blockName.appendChild(itemName);

    var itemDuration = d.createElement('div');
    itemDuration.style.background=(l%2==0) ? "#cdcdcd" : "#efefef";
    itemDuration.style.height=blockH+"px";

    blockDuration.appendChild(itemDuration);
    var cc=0;
    timelineItems[c].forEach(function(i)
    {
      var item = d.createElement('div');

      item.appendChild(document.createTextNode(i.name));
      if(c=="scene")
      {
        var color = cc%2==0 ? "#ffbb00" : "#eeaa00";
      }else if(c=="transition")
      {
        var color = cc%2==0 ? "#ff5555" : "#ffaaaa";
      }else if(c=="scene secondary")
      {
        var color = cc%2==0 ? "#eeaaee" : "#ffbbff";
      }else if(c=="effect")
      {
        var color = cc%2==0 ? "#ff5555" : "#ffaaaa";
      }else if(c=="title")
      {
        var color = cc%2==0 ? "#00BBFF" : "#55CCFF";
      }else if(c=="default")
      {
        var color = cc%2==0 ? "#55FF55" : "#AAFFAA";
      }
      item.style.background=color;
      item.style.display ="inline-block";
      item.style.position = "absolute";
      item.style.height=blockH+"px";
      item.style.paddingTop=blockH/3+"px";
      item.style.height=blockH-blockH/3+"px";
      item.style.overflow="hidden";
      item.className="item-duration";
      item.style.textAlign="center";
      item.style.cursor="pointer";
      item.style.left = (i.start/end*blockRight)+blockLeft+"%";
      item.style.top = l*blockH+"px";
      item.style.width = ((i.end-i.start)/end*blockRight)+"%";

      $(item).data('info',i);
      $(item).click(function()
      {
        $('#east').html("");
        var table = $.makeTable($(this).data('info'));
        $(table).appendTo("#east");

      });
      $(item).mouseover(function()
      {
        $(this).data('background',$(this).css('background'));
        $(this).css('background','#00bbff');
      });
      $(item).mouseout(function()
      {
        $(this).css('background',$(this).data('background'));
      });
      itemDuration.appendChild(item);
      cc++;
    });
    l++;
  }

  cursorTimeline = d.createElement('div');
  cursorTimeline.style.zIndex=100;
  cursorTimeline.style.height=blockH*l+"px";
  cursorTimeline.style.background="red";
  cursorTimeline.style.width="2px";
  cursorTimeline.style.position="relative";
  cursorTimeline.style.top=0;
  cursorTimeline.style.left="10%";
  containerTimeline.appendChild(cursorTimeline);
  blockDuration.style.height=blockH*l+"px";

  durationSequence= end;
  $('#center').append(containerTimeline);
  $('#duration').html(durationSequence);
}

$.makeTable = function (mydata) {
  var table = $('<table id="editor-table">');

  var tblHeader = "<thead><tr>" +
    "<th>variable</th>" +
    "<th>value</th>" +
    "</tr></thead>";
  $(tblHeader).appendTo(table);
  $("<tbody>").appendTo(table);

  var fields = ['name','type','start','end'];
  $(fields).each(function(a,d)
  {
    if(mydata[d])
    {
      var tblHeader = "<tr>" +
        "<td>"+d+"</td>" +
        "<td>"+mydata[d]+"</td>" +
        "</tr>";
      $(tblHeader).appendTo(table);
    }
  });
  $("</tbody>").appendTo(table);

  return ($(table));
};

function updater()
{
  //requestAnimationFrame(updater);
  if(MNDRN.timer.currentTime<=durationSequence)
  {
    MNDRN.timer.currentTime=(new Date().getTime()-sss)/1000;
    $('#time').html(MNDRN.timer.currentTime);
    $('#fps').html(MNDRN.getFps());
    updatetimeline();
  }
  setTimeout(updater,600/10);
}

var sss =new Date().getTime();

$(function()
{
  //sss =new Date().getTime();
  //timeline();
  //$('body').layout({ applyDefaultStyles: true });
  //updater();

  $('#reload').click(function( e ) {
    chrome.devtools.inspectedWindow.reload({
      ignoreCache: true
      //injectedScript: '(' + f.toString() + ')()'
    });
  });

});

function init()
{
  sss =new Date().getTime();
  timeline();
  $('body').layout({ applyDefaultStyles: true });
  updater();
  //window.postMessage( { source: 'WebGLShaderEditor', method: 'setVSSource', code: program.vertexShaderSource }, '*');

}

var backgroundPageConnection = chrome.runtime.connect({
  name: "mandarine-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
  // Handle responses from the background page, if any
});

//Relay the tab ID to the background page
//chrome.runtime.sendMessage({
//  tabId: chrome.devtools.inspectedWindow.tabId,
//  scriptToInject: "assets/js/content.js"
//});