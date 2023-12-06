import React , {useRef, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import SideBar from "./components/sidebar";
import NavBar from "./components/navbar";
import Profile from "./components/userProfileIcone";
import {io} from 'socket.io-client';
import {Cube} from './cube';

import './game.css';

function rad2Degree(angle:number) : number
{
	return angle * 180/Math.PI;
}

const socket = io('http://localhost:1337');

let gl:WebGLRenderingContext | null;

function Game() 
{
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reff = useRef<Cube | null>(null);
  let [score1, setScore1] = useState(0);
  let [score2, setScore2] = useState(0);
  let [gameState, setState] = useState('Looking for partner :(');
  let [profileImage, setImage] = useState('');
  let foundMatch:boolean = false;
  const frameRef = useRef<number>(0);

  useEffect(() => 
  {
    const imageProfile = 
    axios.get('https://cdn.intra.42.fr/users/fa0c85ecf99eadafbf2aa7888b612b8a/smounir.jpg', 
    {
      responseType: "arraybuffer"
    }).then((res)=>
    {
      const base64 = btoa(
        new Uint8Array(res.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      )
      setImage(base64);
      console.log("Success")
    }).catch((e)=>
    {
      console.log("Error " + e)
    });
    if (canvasRef.current) 
    {
      gl = canvasRef.current.getContext("webgl");

      if (gl) 
      {
        gl.canvas.width = 800;
        gl.canvas.height = 400;
        frameRef.current = 
        requestAnimationFrame(() => renderGame(gl));
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
    ball.speed = 0.009;
    ball.prevPositions.x = first.vector3D.x + 0.5;
    ball.prevPositions.y = first.vector3D.y + 0.5;
    ball.prevPositions.z = -0.01;

    document.addEventListener('keydown', (e) => {
      if (e.code == 'Space')
      {
        if (!ballLaunched)
        {
              second.speed = 0.01;
              first.speed = 0.01;
              if (firstPlayerHasTheBall)
              {
                  ball.prevPositions.x = first.vector3D.x + 0.5;
                  ball.prevPositions.y = first.vector3D.y + 0.5;
              }
              if (secondPlayerHasTheBall)
              {
                  ball.prevPositions.x = second.vector3D.x - 0.5;
                  ball.prevPositions.y = second.vector3D.y - 0.5;
              }
              ball.velocityx =  ball.vector3D.x - ball.prevPositions.x;
              ball.velocityy =  ball.vector3D.y - ball.prevPositions.y;
              ball.prevPositions.x = ball.vector3D.x + 0.5;
              ball.prevPositions.y = ball.vector3D.y + 0.5;
              ballLaunched = true;
              ball.speed = 0.009;
            }
            socket.emit('balllaunch', ballLaunched);
        }
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
      let ar = w/h;
      let fov = rad2Degree(70);
      let n = 0.1;
      let f = 1000.0;
      let t = Math.tan(fov/2) * n;
      let r = t * ar;
      let len = f-n;
  
      let projection:number[] = 
      [
        2*n/r,  0.0,       0.0,  0.0,
        0.0, 2*n/t,         0.0,  0.0,
        0.0,  0.0,  -(f+n)/len, -1,
        0.0,  0.0, (-2*f*n)/len, 1.0
      ];

      let viewMatrix:number[] = 
      [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0,-3, 0,
        0, 0, 0, 1
      ];
      socket.on('matchFound', (v:boolean)=>{foundMatch = v;});

      // if (gl)
      // {
      //   gl.canvas.width = window.innerWidth - 900;
      //   gl.canvas.height = window.innerHeight - 400;

      // }
      if (!foundMatch)
       setState((gameState) => gameState = 'Looking for partner :(');
      else
        setState((gameState) => gameState = score1 + '      |     ' +score2);
      socket.emit('playing');
      if (foundMatch)
      {
        setScore1((score1));
        setScore2((score2));
        socket.on('score', (v:number, v1:number) => {
          score1 = v;
          score2 = v1;
        });
        socket.on('left', (v:number)=>{first.vector3D.y = v;});
        socket.on('right', (v:number)=>{second.vector3D.y = v;});
  
        if (gl)
        {
          gl.clearColor(0.35, 0.22, 0.35, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.enable(gl.DEPTH_TEST);
  
          socket.on('ballPosX', (v:number)=>{ball.vector3D.x = v;});
          socket.on('ballPosY', (v:number)=>{ball.vector3D.y = v;});
          socket.on('balllaunched', (v:boolean)=>{ballLaunched=v;});
          terrain.renderEntity(gl, 36);
          terrain.setColor(gl, [0.17, 0.0, 0.16]);
          terrain.rotateX(gl, rad2Degree(0.004));
          terrain.rotateY(gl, rad2Degree(0.0));
          terrain.setLightSource(gl, [0.0, 0.0, -0.6], [1.0, 1.0, 1.0]);
          terrain.set3DMatrices(gl, projection, viewMatrix);
  
          first.renderEntity(gl, 36);
          first.rotateX(gl, rad2Degree(0.004));
          first.rotateY(gl, rad2Degree(0.0));
          first.setColor(gl, [0.7, 0.6, 1.8]);
          first.setLightSource(gl, [0.0, 0.0, -0.1], [1.0, 1.0, 1.0]);
          first.set3DMatrices(gl, projection, viewMatrix);
          
          second.renderEntity(gl, 36);
          second.rotateX(gl, rad2Degree(0.004));
          second.rotateY(gl, rad2Degree(0.0));
          second.setColor(gl, [0.7, 0.6, 1.8]);
          second.setLightSource(gl, [0.0, 0.0, -0.1], [1.0, 1.0, 1.0]);
          second.set3DMatrices(gl, projection, viewMatrix);
  
          ball.renderEntity(gl, 36);
          ball.rotateX(gl, rad2Degree(0.004));
          ball.rotateY(gl, rad2Degree(0.0));
          ball.setColor(gl, [0.8, 0.1, 0.8]);
          ball.setLightSource(gl, [0.0, 0.0, -0.1], [1.0, 2.0, 1.0]);
          ball.set3DMatrices(gl, projection, viewMatrix);
        }
      }
    
      frameRef.current = requestAnimationFrame(() => renderGame(gl));
    }

    const handle = () =>
    {
      if (gl)
      {
        gl.canvas.width = 800;
        gl.canvas.height = 400;
      }
    };

    window.addEventListener("resize", handle);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (<div> 
          <div></div>
          <div style={{textAlign:"center",
                      font:"status-bar",
                      height: "100%"}}>
          {/* <h1>{gameState}</h1>s */}
          {<Profile score = {score1}
                    score2= {score2}
                    picSrc="https://cdn.intra.42.fr/users/fa0c85ecf99eadafbf2aa7888b612b8a/smounir.jpg"
                    picSrc2="https://cdn.intra.42.fr/users/7a035c468003e0971d7ca71378cfb0bb/msouiyeh.jpg"/>}
          <canvas style={{right:"300px",
                          width: "100%",
                          height: "100%"}} 
            ref={canvasRef}
          /></div>
          </div>
          );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export default Game
