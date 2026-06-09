import React, { useEffect, useState } from "react";
import { api, formatMoney, formatDate } from "@/lib/api";
import { Copy, Check, Users, Coins } from "lucide-react";

export default function Referrals() {
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { api.get("/referrals/me").then((r) => setData(r.data)); }, []);

  if (!data) return <div className="text-muted-foreground">Loading…</div>;

  const link = `${window.location.origin}/register?ref=${data.referral_code}`;
  const copy = () => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-8" data-testid="referrals-root">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Affiliate</div>
        <h1 className="font-serif text-4xl mt-2">Referrals</h1>
        <p className="text-muted-foreground mt-2">Earn <span className="text-accent">5%</span> on every investment your referrals make. No cap.</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your referral link</div>
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <input readOnly value={link} data-testid="referral-link"
            className="flex-1 px-4 py-3 bg-secondary border border-border rounded-md font-mono-fin text-sm" />
          <button onClick={copy} data-testid="copy-referral"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
          </button>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">Code: <span className="font-mono-fin text-foreground">{data.referral_code}</span></div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5 elev-hover" data-testid="ref-count">
          <Users className="w-5 h-5 text-accent" />
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-3">Total referrals</div>
          <div className="mt-1 font-mono-fin text-3xl">{data.referral_count}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 elev-hover" data-testid="ref-earnings">
          <Coins className="w-5 h-5 text-accent" />
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-3">Total earnings</div>
          <div className="mt-1 font-mono-fin text-3xl">{formatMoney(data.total_earnings)}</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-serif text-xl mb-4">Referred investors</h3>
        {data.referred_users.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">No referrals yet — share your link to start earning.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2">Name</th><th className="py-2">Joined</th><th className="py-2">Invested</th><th className="py-2 text-right">Your earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.referred_users.map((u) => (
                <tr key={u.id} data-testid={`ref-row-${u.id}`}>
                  <td className="py-3">{u.name}</td>
                  <td className="py-3 text-muted-foreground">{formatDate(u.joined)}</td>
                  <td className="py-3 font-mono-fin">{formatMoney(u.invested)}</td>
                  <td className="py-3 text-right font-mono-fin text-accent">{formatMoney(u.earned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
