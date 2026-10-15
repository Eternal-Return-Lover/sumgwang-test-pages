import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep,basename} from 'node:path';
import {repositoryRoot,loadSites} from './site-tools.mjs';
const sites=await loadSites(),selection=process.argv[2]||process.env.SITE_NUMBER;
const site=selection?sites.find(s=>String(s.number)===selection):sites.find(s=>s.project===basename(process.cwd()))||sites[0];
if(!site)throw Error('Unknown site number: '+selection);
const root=resolve(process.env.STATIC_ROOT||repositoryRoot),port=Number(process.env.PORT??site.port);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
const server=createServer(async(req,res)=>{
 try{
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=resolve(root,'.'+name);
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  if((await stat(file)).isDirectory())file=resolve(file,'index.html');
  const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('페이지를 찾을 수 없습니다.');}
});
server.listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+server.address().port+'/'));
