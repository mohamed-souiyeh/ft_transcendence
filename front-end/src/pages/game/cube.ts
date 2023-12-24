

export class vec3
{
  x:number = 0;
  y:number = 0;
  z:number = 0;
}

export class Cube
{
    vector3D:vec3 = new vec3();
    prevPositions:vec3 = new vec3();
    color:vec3 = new vec3();
    vertexBuffer:WebGLBuffer | null = null;
    normalsBuffer:WebGLBuffer | null = null;
    elementBuffer:WebGLBuffer | null = null;
    width:number;
    height:number;
    depth:number;
    vertexShaderSource:string;
    fragementShaderSource:string;
    shaderProgram:WebGLProgram | null = null;
    speed:number = 0;
    velocityy:number = 0;
    velocityx:number = 0;  

    constructor(gl:WebGLRenderingContext | null, width:number, height:number, depth:number)
    { 
      const normals:number[] = 
        [
            0.0,  0.0,   -1.0,
            0.0,  0.0,   -1.0,
            0.0,  0.0,   -1.0,
            0.0,  0.0,   -1.0,
            0.0,  0.0,   -1.0,
            0.0,  0.0,   -1.0,
            0.0,  0.0,    1.0,
            0.0,  0.0,    1.0,
            0.0,  0.0,    1.0,
            0.0,  0.0,    1.0,
            0.0,  0.0,    1.0,
            0.0,  0.0,    1.0,
            -1.0,   0.0,   0.0,
            -1.0,   0.0,   0.0,
            -1.0,   0.0,   0.0,
            -1.0,   0.0,   0.0,
            -1.0,   0.0,   0.0,
            -1.0,   0.0,   0.0,
            1.0,   0.0,   0.0,
            1.0,   0.0,   0.0,
            1.0,   0.0,   0.0,
            1.0,   0.0,   0.0,
            1.0,   0.0,   0.0,
            1.0,   0.0,   0.0,
            0.0,  -1.0,    0.0,
            0.0,  -1.0,    0.0,
            0.0,  -1.0,    0.0,
            0.0,  -1.0,    0.0,
            0.0,  -1.0,    0.0,
            0.0,  -1.0,    0.0,
            0.0,  1.0,    0.0,
            0.0,  1.0,    0.0,
            0.0,  1.0,    0.0,
            0.0,  1.0,    0.0,
            0.0,  1.0,    0.0,
            0.0,  1.0,    0.0
        ];
      const vertecies:number[] = 
      [
            -0.1, -0.1, -0.01,
          0.1, -0.1, -0.01,
          0.1,  0.1, -0.01,
          0.1,  0.1, -0.01,
		    -0.1,  0.1, -0.01,
		    -0.1, -0.1, -0.01,

		    -0.1, -0.1,  0.01,
			0.1, -0.1,  0.01,
			0.1,  0.1,  0.01,
			0.1,  0.1,  0.01,
		    -0.1,  0.1,  0.01,
		    -0.1, -0.1,  0.01,

		    -0.1,  0.1,  0.01,
            -0.1,  0.1, -0.01,
            -0.1, -0.1, -0.01,
            -0.1, -0.1, -0.01,
            -0.1, -0.1,  0.01,
		    -0.1,  0.1,  0.01,

			0.1,  0.1,  0.01,
			0.1,  0.1, -0.01,
			0.1, -0.1, -0.01,
			0.1, -0.1, -0.01,
			0.1, -0.1,  0.01,
			0.1,  0.1,  0.01,

		    -0.1, -0.1, -0.01,
			0.1, -0.1, -0.01,
			0.1, -0.1,  0.01,
			0.1, -0.1,  0.01,
            -0.1, -0.1,  0.01,
            -0.1, -0.1, -0.01,

		    -0.1,  0.1, -0.01,
			  0.1,  0.1, -0.01,
			  0.1,  0.1,  0.01,
			  0.1,  0.1,  0.01,
		    -0.1,  0.1,  0.01,
		    -0.1,  0.1, -0.01
      ];
      
      this.width = width;
      this.height = height;
      this.depth = depth;
      for (let i = 0; i < vertecies.length; i++)
      {
        vertecies[i] *= width;
        vertecies[i + 1] *= height;
        vertecies[i + 2] *= depth;
        i += 2;
      }

      this.vertexShaderSource =
      "uniform mat4 view;" +
      "uniform vec3 translation;" +
      "uniform vec3 lightPos;" +        
      "uniform mat4 projection;" +
      "uniform float angleX;" +
      "uniform float angleY;" +
      "attribute vec3 pos;" +
      "attribute vec3 normal;" +
      "varying highp vec3 ppos;" +
      "varying highp vec3 lightpos;" +
      "varying highp vec3 norm;" +
      "mat4 model;" +
      "mat4 rotation = " +
      "mat4" +
      "(" +
      "1, 0, 0, 0," +
      "0, cos(angleX), -sin(angleX), 0," +
      "0, sin(angleX), cos(angleX), 0," +
      "0, 0, 0, 1" +
      ");"+
      "mat4 rotationY = " +
      "mat4" +
      "(" +
      "cos(angleY), 0, sin(angleY), 0," +
      "0, 1, 0, 0," +
      "-sin(angleY), 0, cos(angleY), 0," +
      "0, 0, 0, 1" +
      ");"+
      "mat4 rotationYinv = " +
      "mat4" +
      "(" +
      "-cos(angleY),  0,  -sin(angleY), 0," +
      "0,            1,            0, 0," +
      "sin(angleY), 0,  -cos(angleY), 0," +
      "           0, 0,            0, 1" +
      ");"+
      "mat4 rotationInv = " +
      "mat4" +
      "(" +
      "1, 0, 0, 0," +
      "0, -cos(angleX), sin(angleX), 0," +
      "0,  -sin(angleX), -cos(angleX), 0," +
      "0, 0, 0, 1" +
      ");"+
      "void main()" +
      "{" +
      "mat4 model = rotationY * rotation;" +
      "gl_Position =  projection * model * view * vec4(pos + translation, 1.0);" +
      "norm = normal;" +
      "ppos = vec3(model * vec4(pos, 1.0));" +
      "lightpos = lightPos;" +
      "}";

      this.fragementShaderSource =
      "precision highp float;" +
      "uniform vec3 color;" +
      "uniform vec3 lightColor;" +
      "varying highp vec3 norm;" +
      "varying highp vec3 ppos;" +
      "varying highp vec3 lightpos;" +
      "void main()" +
      "{" +
      "vec3 ambient = lightColor * 0.4;" +
      "vec3 normal = normalize(norm);" +
      "vec3 lightDirection = normalize(lightpos - ppos);" +
      "vec3 diffuse = max(vec3(dot(normal,lightDirection)), 0.0) * lightColor;" +
      "vec3 finalColor = (diffuse + ambient) * color;" +
      "gl_FragColor = vec4(finalColor, 1.0);" +
      "}";

      if (gl)
      {
        this.vertexBuffer = gl.createBuffer();
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertecies), gl.STATIC_DRAW);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vertexShader, this.vertexShaderSource);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fragmentShader, this.fragementShaderSource);
        gl.compileShader(fragmentShader);

        this.normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);


        this.shaderProgram = gl.createProgram()!;
        gl.attachShader(this.shaderProgram, vertexShader);
        gl.attachShader(this.shaderProgram, fragmentShader);
        gl.linkProgram(this.shaderProgram);
        gl.useProgram(this.shaderProgram);
      }
    }
    setColor(gl:WebGLRenderingContext ,color:number[])
    {
      if (gl)
      {
        if (this.shaderProgram)
        {
          gl.uniform3fv(gl.getUniformLocation(this.shaderProgram, "color"), color);
        }
      }
    }
    setLightSource(gl:WebGLRenderingContext ,lightPosition:number[], lightColor:number[])
    {
      if (gl)
      {
        if (this.shaderProgram)
        {
          gl.uniform3fv(gl.getUniformLocation(this.shaderProgram, "lightPos"), lightPosition);
          gl.uniform3fv(gl.getUniformLocation(this.shaderProgram, "lightColor"), lightColor);
        }
      }
    }
    rotateX(gl:WebGLRenderingContext ,angle:number)
    {
      if (gl)
      {
        if (this.shaderProgram)
        {
          gl.uniform1f(gl.getUniformLocation(this.shaderProgram, "angleX"), angle);
        }
      }
    }
    rotateY(gl:WebGLRenderingContext ,angle:number)
    {
      if (gl)
      {
        if (this.shaderProgram)
        gl.uniform1f(gl.getUniformLocation(this.shaderProgram, "angleY"), angle);
      }
    }
    set3DMatrices(gl:WebGLRenderingContext ,projection:number[], viewMatrix:number[])
    {
      if (gl)
      {
        if (this.shaderProgram)
        {
          gl.uniform3fv(gl.getUniformLocation(this.shaderProgram, "translation"), [this.vector3D.x, this.vector3D.y, this.vector3D.z]);
          gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "projection"), false, projection);
          gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "view"), false, viewMatrix);
        }
      }
    }
    renderEntity(gl:WebGLRenderingContext ,number:number)
    {
      if (gl)
      {
        gl.useProgram(this.shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);
        
        gl.drawArrays(gl.TRIANGLES, 0, 36);
			}
    }
  }
