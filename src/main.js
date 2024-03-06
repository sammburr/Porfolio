var vertexShaderSource = 
[
'precision mediump float;',
'attribute vec2 vertPosition;',
'void main() {',
'   gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

var fragmentShaderSource =
[
'precision mediump float;',
'void main() {',
'   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
'}'
].join('\n');

var begin = function() {

    console.log('Starting up webGl...');

    const canvas = document.getElementById('surface');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('No webGL support!');
        return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    gl.clearColor(0.3, 0.23, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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
    [// x       y
        -1.0,    1.0,
        -1.0,   -1.0,
        0.0,    0.0, 
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

    var loop = function () {

        gl.useProgram(program);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        if(true) {
            requestAnimationFrame(loop);
        }
    }
    requestAnimationFrame(loop);

};