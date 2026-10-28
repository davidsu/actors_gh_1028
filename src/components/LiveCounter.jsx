import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function LiveCounter() {
  const [count, setCount] = useState(null);
  const roomRef = useRef(null);

  useEffect(() => {
    let connId = sessionStorage.getItem("connId");
    if (!connId) {
      connId = crypto.randomUUID();
      sessionStorage.setItem("connId", connId);
    }
    const room = base44.actors.Counter("main").connect({ id: connId });
    roomRef.current = room;
    const sub = room.subscribe((msg) => {
      if (msg?.type === "count") setCount(msg.count);
    });
    return () => {
      sub.unsubscribe();
      room.close();
    };
  }, []);

  return (
    <div className="flex items-center justify-between p-4 mb-8 bg-white rounded-xl border border-slate-100 shadow-sm">
      <div>
        <p className="text-xs text-slate-400">Shared counter</p>
        <p className="text-2xl font-semibold text-slate-900">{count ?? "…"}</p>
      </div>
      <Button
        onClick={() => roomRef.current?.send({ type: "increment" })}
        disabled={count === null}
        className="h-12 px-5 rounded-xl bg-slate-900 hover:bg-slate-800"
      >
        +1
      </Button>
    </div>
  );
}