/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
(function (canvas) {

    // Because many of these variables are best initialized then immediately
    // used in context, we merely name them here.  Read on to see how they
    // are used.
    var gl, // The WebGL context.

        // This variable stores 3D model information.
        objectsToDraw,

        // The function that passes the shape vertices to WebGL
        passVertices,

        // The shader program to use.
        shaderProgram,

        // Utility variable indicating whether some fatal has occurred.
        abort = false,

        // Important state variables.
        currentRotation = 0.0,
        currentInterval,
        rotationMatrix,
        projectionMatrix,
        vertexPosition,
        vertexColor,

        // An individual "draw object" function.
        drawObject,

        // The big "draw scene" function.
        drawScene;

    // Grab the WebGL rendering context.
    gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Build the objects to display.
    objectsToDraw = [
        {
            color: {r: 1, g: 0, b: 0},
            vertices: Shapes.toRawTriangleArray(Shapes.triangularPrism()),
            mode: gl.TRIANGLES,
            children: [
                {
                    color: {r: 0, g: 1, b: 0.5},
                    vertices: Shapes.toRawLineArray(Shapes.cube()),
                    mode: gl.LINES
                }
            ],
            instanceTransform: {
                tx:0.1,
                ty:0,
                tz:0,
                sx:1,
                sy:1,
                sz:1,
                angle:0,
                rx:0,
                ry:0,
                rz:1
            }
        },

        {
            color: {r: 0.6, g: 0, b: 1},
            vertices: Shapes.toRawTriangleArray(Shapes.sphere(0.5)),
            mode: gl.TRIANGLES,
            children: [
                {
                    color: {r: 0.8, g: 1, b: 0},
                    vertices: Shapes.toRawLineArray(Shapes.sphere(false)),
                    mode: gl.LINES
                }
            ]
        }
    ];

    // Pass the vertices to WebGL.
    passVertices = function (shapes) {
        var i,
            maxi,
            j,
            maxj;

        for (i = 0, maxi = shapes.length; i < maxi; i += 1) {
            shapes[i].buffer = GLSLUtilities.initVertexBuffer(gl,
                    shapes[i].vertices);

            if (!shapes[i].colors) {
                // If we have a single color, we expand that into an array
                // of the same color over and over.
                shapes[i].colors = [];

                for (j = 0, maxj = shapes[i].vertices.length / 3;
                        j < maxj; j += 1) {
                    shapes[i].colors = shapes[i].colors.concat(
                        shapes[i].color.r,
                        shapes[i].color.g,
                        shapes[i].color.b
                    );
                }
            }
            shapes[i].colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                    shapes[i].colors);

            // Look for nested shapes' vertices to pass. Also checks to make
            // sure the children array isn't empty
            if (shapes[i].children && shapes[i].children.length !== 0) {
                passVertices(shapes[i].children);
            }
        }
    };

    // Initialize the shaders.
    shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        function (shader) {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        function (shaderProgram) {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);

    // Hold on to the important variables within the shaders.
    vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(vertexColor);
    rotationMatrix = gl.getUniformLocation(shaderProgram, "rotationMatrix");
    projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");

    /*
     * Displays an individual object.
     */
    drawObject = function (object) {
        var i;

        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(object.mode, 0, object.vertices.length / 3);

        if (object.children) {
            for (i = 0; i < object.children.length; i += 1) {
                drawObject(object.children[i]);
            }
        }
        if (object.instanceTransform) {
            Matrix4x4.getInstanceTransform(object.instanceTransform);
        }
    };

    /*
     * Displays the scene.
     */
    drawScene = function () {
        var i,
            maxi;

        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set up the rotation matrix.
        gl.uniformMatrix4fv(rotationMatrix, gl.FALSE, new Float32Array(
            Matrix4x4.getColumnMajorOrder(Matrix4x4.getRotationMatrix4x4(currentRotation, 0, 1, 0).elements).elements
        ));

        // Display the objects.
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            drawObject(objectsToDraw[i]);
        }

        // All done.
        gl.flush();
    };

    // Set up the projection matrix.
    gl.uniformMatrix4fv(projectionMatrix,
        gl.FALSE, new Float32Array(
            Matrix4x4.getColumnMajorOrder(Matrix4x4.getOrthoMatrix4x4(-150, 150, -150, 150, 5, 10000).elements).elements
        )
    );

    // Draw the initial scene.
    passVertices(objectsToDraw);
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
    $(canvas).click(function () {
        if (currentInterval) {
            clearInterval(currentInterval);
            currentInterval = null;
        } else {
            currentInterval = setInterval(function () {
                currentRotation += 1.0;
                drawScene();
                if (currentRotation >= 360.0) {
                    currentRotation -= 360.0;
                }
            }, 30);
        }
    });

}(document.getElementById("upHouse")));