
import { useEffect, useState } from "react";
import { getStatus, startBot, stopBot } from "../services/api";
import StatusCard from "../components/cards/StatusCard";

export default function Dashboard(){
  const [status,setStatus] = useState({status:"-",uptime:"-",action:"-"});

  useEffect(()=>{
    const tick = setInterval(()=>{
      getStatus().then(setStatus);
    },1000);
    return ()=>clearInterval(tick);
  },[]);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <StatusCard title="Bot Status" value={status.status} />
        <StatusCard title="Uptime" value={status.uptime} />
        <StatusCard title="Action" value={status.action} />
      </div>

      <div className="flex gap-4">
        <button className="btn" onClick={()=>startBot()}>Start Bot</button>
        <button className="btn" onClick={()=>stopBot()}>Stop Bot</button>
      </div>
    </div>
  );
}
