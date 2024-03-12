var vertexShaderSource = 
[
'precision mediump float;',
'attribute vec2 vertPosition;',
'void main() {',
'   gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

var mouseAccelX = 0.;
var mouseAccelY = 0.;
var mousePosX = 0.;
var mousePosY = 0.;

var scrollAmount = 0.;

var startWindowCanvas = function() {

    const canvas = document.getElementById('windowSurface');
    var gl = canvas.getContext('webgl');

    if (checkGL(gl) == null) {
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.3, 0.23, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var program = compileProgram(gl);

    var timeUniformLoc = gl.getUniformLocation(program, "time");
    var resoultionUniformLoc = gl.getUniformLocation(program, "resolution");
    var mouseUniformLoc = gl.getUniformLocation(program, "mousePos");
    var presetUniformLoc = gl.getUniformLocation(program, "preset");

    gl.useProgram(program);

    var t = 0;

    gl.uniform1i(timeUniformLoc, t);
    gl.uniform2f(resoultionUniformLoc, window.innerWidth, window.innerHeight);
    gl.uniform2f(mouseUniformLoc, mousePosX, mousePosY);
    gl.uniform1i(presetUniformLoc, 1);


    var loop = function () {

        mouseAccelX = mouseAccelX*0.9;
        mouseAccelX += 0.1;

        mousePosX += mouseAccelX;

        t += 1;
   
        gl.clearColor(0.3, 0.23, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniform1i(timeUniformLoc, t);
        gl.uniform2f(resoultionUniformLoc, canvas.width, canvas.height);
        gl.uniform2f(mouseUniformLoc, mousePosX, mousePosY);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(loop);

    }
    requestAnimationFrame(loop);

}

var checkGL = function(gl) {

    if (!gl) {
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('No webGL support!');
        return null;
    }

    return gl;

}

var compileProgram = function(gl) {

    var fragmentShaderSource = document.getElementById("fragment-shader").textContent;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!\n', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!\n', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking shader program!\n', gl.getProgramInfoLog(fragmentShader));
        return;
    }

    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating shader program!\n', gl.getProgramInfoLog(fragmentShader));
        return;
    }

    var vertices = 
    [
        -1.0,    1.0,
        -1.0,   -1.0,
         1.0,    1.0, 
         1.0,    1.0,
         1.0,   -1.0,
        -1.0,   -1.0
    ];

    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var posAttrib = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttrib,
        2,
        gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.enableVertexAttribArray(posAttrib);

    return program;

}

var begin = function() {

    console.log('Starting up webGl...');

    startWindowCanvas();

    const canvas = document.getElementById('surface');
    var gl = canvas.getContext('webgl');

    if (checkGL(gl) == null) {
        return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    gl.clearColor(0.3, 0.23, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var program = compileProgram(gl);

    var timeUniformLoc = gl.getUniformLocation(program, "time");
    var resoultionUniformLoc = gl.getUniformLocation(program, "resolution");
    var mouseUniformLoc = gl.getUniformLocation(program, "mousePos");
    var presetUniformLoc = gl.getUniformLocation(program, "preset");

    gl.useProgram(program);

    var t = 0;

    gl.uniform1i(timeUniformLoc, t);
    gl.uniform2f(resoultionUniformLoc, window.innerWidth, window.innerHeight);
    gl.uniform2f(mouseUniformLoc, mousePosX, mousePosY);
    gl.uniform1i(presetUniformLoc, 0);


    var loop = function () {

        mouseAccelX = mouseAccelX*0.9;
        mouseAccelX += 0.1;

        mousePosX += mouseAccelX;

        t += 1;

        w = 700;
        h = w * (window.innerHeight / window.innerWidth);

        if(window.innerHeight > window.innerWidth) {
            h = 700;
            w = h * (window.innerWidth / window.innerHeight);
        }

        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
    
        gl.clearColor(0.3, 0.23, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniform1i(timeUniformLoc, t);
        gl.uniform2f(resoultionUniformLoc, w, h);
        gl.uniform2f(mouseUniformLoc, mousePosX, mousePosY);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(loop);

    }
    requestAnimationFrame(loop);

};

var resetMouseListen =  function() {

    document.onmousemove = handleMouse;
    document.addEventListener('touchmove', handleMouse, {passive:false});

    function handleMouse(event) {

        if(event.touches) {

            if(event.touches.length == 1) {
                var touch = event.touches[0];
                mouseAccelX += lastTouchX - touch.pageX;
                mouseAccelY += lastTouchY - touch.pageY;
    
                mousePosY = touch.pageY;
    
                lastTouchX = touch.pageX;
                lastTouchY = touch.pageY;
            }
    
        }

        else {

            mouseAccelX += event.movementX;
            mouseAccelY += event.movementY;
    
            mousePosY = event.clientY;
        
        }

    }

};
resetMouseListen();

window.addEventListener('scroll', function() {
    var scrollHeight = document.documentElement.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;
    var scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    var scrollPercent = (scrollTop / (scrollHeight - clientHeight));

    scrollAmount = scrollPercent;
});