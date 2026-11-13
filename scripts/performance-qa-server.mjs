// Disposable, in-memory API for verifying production assets and offline export.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {PGlite} from '@electric-sql/pglite';
import {handleRequest} from '../server/api.js';
const db=new PGlite();await db.exec(await fs.readFile('server/schema.sql','utf8'));
const sql=async(strings,...values)=>(await db.query(strings.reduce((s,p,i)=>s+p+(i<values.length?'$'+(i+1):''),''),values)).rows;
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.mp3':'audio/mpeg'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1:8778');
  if(url.pathname.startsWith('/api/')){
   const chunks=[];for await(const chunk of req)chunks.push(chunk);
   const request=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
   const response=await handleRequest(request,{HOST_PASSWORD:'qa-performance-test',SESSION_SECRET:'isolated-performance-fixture-secret-for-tests'},sql);
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;
  }
  const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const bytes=await fs.readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':url.pathname.startsWith('/media/')?'public,max-age=31536000,immutable':'no-cache'});res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(8778,'127.0.0.1',()=>console.log('Isolated production QA ready on http://127.0.0.1:8778 (in-memory database).'));
