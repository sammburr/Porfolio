// Make the DIV element draggable:
dragElement(document.getElementById("proj1"));
dragElement(document.getElementById("proj2"));
dragElement(document.getElementById("glWin"));
dragElement(document.getElementById("name"));
dragElement(document.getElementById("cv"));
dragElement(document.getElementById("fire"));

var lastTouchX = .0;
var lastTouchY = .0;

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    document.getElementById(elmnt.id + "header").addEventListener('touchstart', dragMouseDown, {passive:false});

  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
    elmnt.addEventListener('touchstart', dragMouseDown, {passive:false});
  }

  function dragMouseDown(e) {
    console.log('1');
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    elmnt.addEventListener('touchend', closeDragElement, {passive:false});

    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    document.addEventListener('touchmove', elementDrag, {passive:false});
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    if(e.touches) {

        if(e.touches.length == 1) {
            var touch = e.touches[0];
            mouseAccelX += lastTouchX - touch.pageX;
            mouseAccelY += lastTouchY - touch.pageY;

            mousePosY = touch.pageY;

            lastTouchX = touch.pageX;
            lastTouchY = touch.pageY;

            // calculate the new cursor position:
            pos1 = pos3 - touch.pageX;
            pos2 = pos4 - touch.pageY;
            pos3 = touch.pageX;
            pos4 = touch.pageY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

    }

    else {
        mouseAccelX += e.movementX;
        mouseAccelY += e.movementY;

        mousePosY = e.clientY;

        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    }

  }

  function closeDragElement() {
    console.log('hello');
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    resetMouseListen();
  }
}