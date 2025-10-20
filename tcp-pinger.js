// tcp-pinger.js
const net = require('net');
const host = process.argv[2];
const port = 80;
const N = 20;

(async () => {
  const times = [];
  for (let i=0;i<N;i++) {
    const start = process.hrtime.bigint();
    await new Promise((resolve, reject) => {
      const sock = net.connect({host, port, timeout: 3000}, () => {
        const end = process.hrtime.bigint();
        times.push(Number(end - start)/1e6); // ms
        sock.destroy(); resolve();
      });
      sock.on('error', reject);
      sock.on('timeout', ()=>{ sock.destroy(); reject(new Error('timeout')); });
    }).catch(()=>{ /* count as loss */ });
  }
  const ok = times.length;
  const avg = ok ? (times.reduce((a,b)=>a+b,0)/ok).toFixed(2) : 'n/a';
  console.log({host, port, sent:N, ok, avg_ms:avg});
})();
