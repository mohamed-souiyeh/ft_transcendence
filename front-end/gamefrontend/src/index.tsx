import React , {useRef, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {io} from 'socket.io-client'
import {Cube} from './cube'

import './index.css';

function rad2Degree(angle:number) : number
{
	return angle * 180/Math.PI;
}

const socket = io();

let gl:WebGLRenderingContext | null;

function App() 
{
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reff = useRef<Cube | null>(null);
  const [score, setScore] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => 
  {
    if (canvasRef.current) 
    {
      gl = canvasRef.current.getContext("webgl");

      if (gl) 
      {
        gl.canvas.width = 900;
        gl.canvas.height = 400;
        frameRef.current = requestAnimationFrame(() => renderGame(gl));
      }
    }
    
    if (!gl)
    {
      return;
    }
    let w = 0, h = 0;
    if (gl)
    {
        w = gl.canvas.width;
        h = gl.canvas.height;
    }
    let ar = w/h;
    let fov = rad2Degree(45.0);
    let n = 0.1;
    let f = 1000.0;
    let t = Math.tan(fov/2) * n;
    let r = t * ar;
    let len = f-n;

    let projection:number[] = 
    [
      2*n/r,  0.0,       0.0,  0.0,
      0.0, 2*n/t,         0.0,  0.0,
      0.0,  0.0,  -(f+n)/len, -1.0,
      0.0,  0.0,(-2*f*n)/len,  1.0
    ];

    let viewMatrix:number[] = 
    [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0,-3, 0,
      0, 0, 0, 1
    ];

    let terrain:Cube = new Cube(gl, 9.8, 7, 1);
    let first:Cube = new Cube(gl, 0.18, 1, 0.3);
    let second:Cube = new Cube(gl, 0.18, 1, 0.3);
    let ball:Cube = new Cube(gl, 0.2, 0.2, 0.5);

    first.vector3D.x = 0.97;
    first.vector3D.y =  0.0;
    first.vector3D.z =  -0.02;
    first.velocityy =  0.0;
    first.speed =  0.01;

    second.vector3D.x = -0.97;
    second.vector3D.y = 0.0;
    second.vector3D.z = -0.02;
    second.velocityy = 0.0;
    second.speed =  0.01;

    ball.vector3D.x =  first.vector3D.x - 0.05;
    ball.vector3D.y =  first.vector3D.y;
    ball.vector3D.z =  -0.02;
    ball.prevPositions.x = first.vector3D.x + 0.5;
    ball.prevPositions.y = first.vector3D.y + 0.5;
    ball.prevPositions.z = -0.01;

    document.addEventListener('keydown', (e) => {
      if (e.code == 'KeyW')
      {
        socket.emit('right', 1);
        socket.emit('left', 1);
      }
      if (e.code == 'KeyS')
      {
        socket.emit('right', -1);
        socket.emit('left', -1);
      }
    })

    document.addEventListener('keyup', (e) => {
      if (e.code == 'KeyW')
      {
        socket.emit('right', 0);
        socket.emit('left', 0);
      }
      if (e.code == 'KeyS')
      {
        socket.emit('right', 0);
        socket.emit('left', 0);
      }
    })
    
    let firstPlayerHasTheBall:boolean = true;
    let secondPlayerHasTheBall:boolean = false;
    let ballLaunched:boolean = false;

    function renderGame(gl: WebGLRenderingContext | null)
    {
      socket.on('left', (v:number)=>{first.velocityy = v;});
	    socket.on('right', (v:number)=>{second.velocityy = v;});
      if (gl)
      {
        gl.clearColor(0.38, 0.0, 0.15, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        if (!ballLaunched)
        {
          if (firstPlayerHasTheBall)
          {
            ball.vector3D.x =  first.vector3D.x - 0.05;
            ball.vector3D.y =  first.vector3D.y;
          }
          if (secondPlayerHasTheBall)
          {
            ball.vector3D.x =  second.vector3D.x + 0.05;
            ball.vector3D.y =  second.vector3D.y;
          }
        }
        else
        {
        }
        if (first.vector3D.y + first.speed * first.velocityy < terrain.height/10 - first.height/10
          && first.vector3D.y + first.speed * first.velocityy > -terrain.height/10 + first.height/10)
          first.vector3D.y += first.speed * first.velocityy;
        if (second.vector3D.y + second.speed * second.velocityy < terrain.height/10 - second.height/10
          && second.vector3D.y + second.speed * second.velocityy > -terrain.height/10 + second.height/10)
          second.vector3D.y += second.speed * second.velocityy;

        terrain.renderEntity(gl, 36);
        terrain.setColor(gl, [0.17, 0.0, 0.16]);
        terrain.rotateX(gl, rad2Degree(0.004));
        terrain.rotateY(gl, rad2Degree(0.0));
        terrain.set3DMatrices(gl, projection, viewMatrix);
        
        first.renderEntity(gl, 36);
        first.rotateX(gl, rad2Degree(0.004));
        first.rotateY(gl, rad2Degree(0.0));
        first.setColor(gl, [0.4, 0.6, 1.8]);
        first.setLightSource(gl, [0.0, 0.0, -0.1], [1.0, 1.0, 1.0]);
        first.set3DMatrices(gl, projection, viewMatrix);
        
        second.renderEntity(gl, 36);
        second.rotateX(gl, rad2Degree(0.004));
        second.rotateY(gl, rad2Degree(0.0));
        second.setColor(gl, [0.4, 0.6, 1.8]);
        second.setLightSource(gl, [0.0, 0.0, -0.1], [1.0, 1.0, 1.0]);
        second.set3DMatrices(gl, projection, viewMatrix);

        ball.renderEntity(gl, 36);
        ball.rotateX(gl, rad2Degree(0.004));
        ball.rotateY(gl, rad2Degree(0.0));
        ball.setColor(gl, [1.0, 0.8, 0.1]);
        ball.setLightSource(gl, [0.0, 0.0, -0.1], [1.0, 1.0, 1.0]);
        ball.set3DMatrices(gl, projection, viewMatrix);

        frameRef.current = requestAnimationFrame(() => renderGame(gl));
      }
    }

    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (<div style={{textAlign:"center"}}>
          <h1>{score}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{score}</h1>
          <canvas ref={canvasRef}
          /></div>);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
