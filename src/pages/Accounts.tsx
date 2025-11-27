
import { useEffect, useState } from "react";
import { getAccounts } from "../services/api";

export default function Accounts(){
  const [acc,setAcc] = useState([]);

  useEffect(()=>{
    getAccounts().then(d=>setAcc(d.accounts));
  },[]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Accounts</h1>
      <div className="glass">
        {acc.map(a=>(
          <p key={a.id}>{a.email}</p>
        ))}
      </div>
    </div>
  );
}
