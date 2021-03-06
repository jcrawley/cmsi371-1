var Matrix4x4 = (function () {
    // Define the constructor.
    var matrix4x4 = function () {
        this.elements = arguments.length ?
                [].slice.call(arguments) :
                [1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                    ];
    };

    matrix4x4.prototype.getMultiplicationMatrix4x4 = function (m2) {
        var mMultiplied = [];
        mMultiplied[0] = this.elements[0] * m2[0] + this.elements[1] *
            m2[4] + this.elements[2] * m2[8] + this.elements[3] * m2[12];
        mMultiplied[1] = this.elements[0] * m2[1] + this.elements[1] *
            m2[5] + this.elements[2] * m2[9] + this.elements[3] * m2[13];
        mMultiplied[2] = this.elements[0] * m2[2] + this.elements[1] *
            m2[6] + this.elements[2] * m2[10] + this.elements[3] * m2[14];
        mMultiplied[3] = this.elements[0] * m2[3] + this.elements[1] *
            m2[7] + this.elements[2] * m2[11] + this.elements[3] * m2[15];

        mMultiplied[4] = this.elements[4] * m2[0] + this.elements[5] *
            m2[4] + this.elements[6] * m2[8] + this.elements[7] * m2[12];
        mMultiplied[5] = this.elements[4] * m2[1] + this.elements[5] *
            m2[5] + this.elements[6] * m2[9] + this.elements[7] * m2[13];
        mMultiplied[6] = this.elements[4] * m2[2] + this.elements[5] *
            m2[6] + this.elements[6] * m2[10] + this.elements[7] * m2[14];
        mMultiplied[7] = this.elements[4] * m2[3] + this.elements[5] *
            m2[7] + this.elements[6] * m2[11] + this.elements[7] * m2[15];

        mMultiplied[8] = this.elements[8] * m2[0] + this.elements[9] *
            m2[4] + this.elements[10] * m2[8] + this.elements[11] * m2[12];
        mMultiplied[9] = this.elements[8] * m2[1] + this.elements[9] *
            m2[5] + this.elements[10] * m2[9] + this.elements[11] * m2[13];
        mMultiplied[10] = this.elements[8] * m2[2] + this.elements[9] *
            m2[6] + this.elements[10] * m2[10] + this.elements[11] * m2[14];
        mMultiplied[11] = this.elements[8] * m2[3] + this.elements[9] *
            m2[7] + this.elements[10] * m2[11] + this.elements[11] * m2[15];

        mMultiplied[12] = this.elements[12] * m2[0] + this.elements[13] *
            m2[4] + this.elements[14] * m2[8] + this.elements[15] * m2[12];
        mMultiplied[13] = this.elements[12] * m2[1] + this.elements[13] *
            m2[5] + this.elements[14] * m2[9] + this.elements[15] * m2[13];
        mMultiplied[14] = this.elements[12] * m2[2] + this.elements[13] *
            m2[6] + this.elements[14] * m2[10] + this.elements[15] * m2[14];
        mMultiplied[15] = this.elements[12] * m2[3] + this.elements[13] *
            m2[7] + this.elements[14] * m2[11] + this.elements[15] * m2[15];

        return new Matrix4x4(
            mMultiplied[0],
            mMultiplied[1],
            mMultiplied[2],
            mMultiplied[3],

            mMultiplied[4],
            mMultiplied[5],
            mMultiplied[6],
            mMultiplied[7],

            mMultiplied[8],
            mMultiplied[9],
            mMultiplied[10],
            mMultiplied[11],

            mMultiplied[12],
            mMultiplied[13],
            mMultiplied[14],
            mMultiplied[15]
        );
    };

    matrix4x4.getTranslationMatrix4x4 = function (tx, ty, tz) {
        return new Matrix4x4(
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1
        );
    };

    matrix4x4.getScaleMatrix4x4 = function (sx, sy, sz) {
        return new Matrix4x4(
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        );
    };

    matrix4x4.getRotationMatrix4x4 = function (angle, x, y, z) {
        // In production code, this function should be associated
        // with a Matrix4x4 object with associated functions.
        var axisLength = Math.sqrt((x * x) + (y * y) + (z * z)),
            s = Math.sin(angle * Math.PI / 180.0),
            c = Math.cos(angle * Math.PI / 180.0),
            oneMinusC = 1.0 - c,

            // We can't calculate this until we have normalized
            // the axis vector of rotation.
            x2, // "2" for "squared."
            y2,
            z2,
            xy,
            yz,
            xz,
            xs,
            ys,
            zs;

        // Normalize the axis vector of rotation.
        x /= axisLength;
        y /= axisLength;
        z /= axisLength;

        // *Now* we can calculate the other terms.
        x2 = x * x;
        y2 = y * y;
        z2 = z * z;
        xy = x * y;
        yz = y * z;
        xz = x * z;
        xs = x * s;
        ys = y * s;
        zs = z * s;

        // Matrix4x4 in row major order.
        return new Matrix4x4(
            (x2 * oneMinusC) + c,
            (xy * oneMinusC) - zs,
            (xz * oneMinusC) + ys,
            0.0,

            (xy * oneMinusC) + zs,
            (y2 * oneMinusC) + c,
            (yz * oneMinusC) - xs,
            0.0,

            (xz * oneMinusC) - ys,
            (yz * oneMinusC) + xs,
            (z2 * oneMinusC) + c,
            0.0,

            0.0,
            0.0,
            0.0,
            1.0
        );
    };

    matrix4x4.getOrthoMatrix4x4 = function (left, right, bottom, top, zNear, zFar) {
        var width = right - left,
            height = top - bottom,
            depth = zFar - zNear;

        // Matrix4x4 in row major order.
        return new Matrix4x4(
            2.0 / width,
            0.0,
            0.0,
            -(right + left) / width,

            0.0,
            2.0 / height,
            0.0,
            -(top + bottom) / height,

            0.0,
            0.0,
            -2.0 / depth,
            -(zFar + zNear) / depth,

            0.0,
            0.0,
            0.0,
            1.0
        );
    };

    matrix4x4.getFrustumMatrix4x4 = function (left, right, bottom, top, zNear, zFar) {
        var width = right - left,
            height = top - bottom,
            depth = zFar - zNear;

        return new Matrix4x4(
            2.0 * zNear / width,
            0.0,
            (right + left) / width,
            0.0,

            0.0,
            2.0 * zNear / height,
            (top + bottom) / height,
            0.0,

            0.0,
            0.0,
            -(zFar + zNear) / depth,
            -2.0 * zFar * zNear / depth,

            0.0,
            0.0,
            -1.0,
            0.0
        );
    };

    matrix4x4.prototype.getColumnMajorOrder = function () {
        return new Matrix4x4(
            this.elements[0],
            this.elements[4],
            this.elements[8],
            this.elements[12],

            this.elements[1],
            this.elements[5],
            this.elements[9],
            this.elements[13],

            this.elements[2],
            this.elements[6],
            this.elements[10],
            this.elements[14],

            this.elements[3],
            this.elements[7],
            this.elements[11],
            this.elements[15]
        );
    };

    matrix4x4.getInstanceTransform = function (transforms) {
        var translate = new Matrix4x4();
            scale = new Matrix4x4();
            rotate = new Matrix4x4();
            rotateSetup = new Matrix4x4();

        translate = Matrix4x4.getTranslationMatrix4x4(
                transforms.tx || 0,
                transforms.ty || 0,
                transforms.tz || 0
            );

        scale = Matrix4x4.getScaleMatrix4x4(
                transforms.sx || 1,
                transforms.sy || 1,
                transforms.sz || 1
            );

        //  If the user specifies an invalid axis (0, 0, 0), then we assume the
        //  axis to be (1, 1, 1). If some dimension is not specified, then it is
        //  a default value of 1, therefore making sure a (0, 0, 0) vector is not
        //  possible.

        // Initialize setupRotation.rx, setupRotation.ry, and setupRotation.rz to 1
        // if they're undefined, also initialize setupRotation if it's not defined

        // JD: OK, I expected many of these changes because I talked you
        //     through them; what I don't get is why you have two rotation
        //     matrices---rotateSetup then rotate?
        if (transforms.setupRotation === undefined) {
            transforms.setupRotation = {
                angle: 0
            };
        }

        if (transforms.setupRotation.rx === undefined) {
            transforms.setupRotation.rx = 1;
        }
        if (transforms.setupRotation.ry === undefined) {
            transforms.setupRotation.ry = 1;
        }
        if (transforms.setupRotation.rz === undefined) {
            transforms.setupRotation.rz = 1;
        }

        if (transforms.setupRotation.rx === 0 && transforms.setupRotation.ry === 0 && transforms.setupRotation.rz === 0) {
            rotateSetup = Matrix4x4.getRotationMatrix4x4(
                    transforms.setupRotation.angle || 0, 1, 1, 1
                );
        } else {
            rotateSetup = Matrix4x4.getRotationMatrix4x4(
                transforms.setupRotation.angle,
                transforms.setupRotation.rx,
                transforms.setupRotation.ry,
                transforms.setupRotation.rz
            );
        }

        // JD: Now, assuming that you do keep the two matrices, notice
        //     here that you have roughly the same logic for setting up
        //     an object with angle, rx, ry, and rz properties.  You can
        //     pull this out into a function.  And better yet, once that
        //     is pulled out into a function, you can write a unit test
        //     for *just that*, thus ensuring that your undefined-handling
        //     logic stays on-function even as you make future changes.

        // Initialize rx, ry, and rz to 1 if they're undefined
        if (transforms.rx === undefined) {
            transforms.rx = 1;
        }
        if (transforms.ry === undefined) {
            transforms.ry = 1;
        }
        if (transforms.rz === undefined) {
            transforms.rz = 1;
        }

        if (transforms.rx === 0 && transforms.ry === 0 && transforms.rz === 0) {
            rotate = Matrix4x4.getRotationMatrix4x4(
                    transforms.angle || 0, 1, 1, 1
                );
        } else {
            rotate = Matrix4x4.getRotationMatrix4x4(
                    transforms.angle || 0,
                    transforms.rx,
                    transforms.ry,
                    transforms.rz
                );
        }

        // Rotation has to be done first so that the object is rotated around the origin
        return translate.getMultiplicationMatrix4x4(scale.getMultiplicationMatrix4x4(
            rotate.getMultiplicationMatrix4x4(rotateSetup.elements).elements).elements);
    };

    // p, q, and up are expected to be vectors
    matrix4x4.getLookAtMatrix = function (p, q, up){
        var ze = (p.subtract(q)).unit(),
            ye = (up.subtract(up.projection(ze))).unit(),
            xe = ye.cross(ze);

        return new Matrix4x4(
            xe.x(), xe.y(), xe.z(), -(p.dot(xe)),
            ye.x(), ye.y(), ye.z(), -(p.dot(ye)),
            ze.x(), ze.y(), ze.z(), -(p.dot(ze)),
            0,0,0,1
        );
    };

    return matrix4x4;
})();