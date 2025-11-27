
import { useEffect, useState } from "react";
import { getLogs } from "../services/api";

export default function Logs(){
  const [logs,setLogs] = useState([]);

  useEffect(()=>{
    const tick = setInterval(()=>{
      getLogs().then(d=>setLogs(d.logs));
    },1000);
    return ()=>clearInterval(tick);
  },[]);

  return (
    <div className="">
      <h1 className="text-4xl font-bold mb-4">Logs</h1>
      <div className="glass">
        {logs.map((l,i)=>(
          <p key={i}>• {l}</p>
        ))}
      </div>
    </div>
  );
}
