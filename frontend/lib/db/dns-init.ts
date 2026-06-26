import dns from "dns";

if (typeof window === "undefined") {
  try {
    const currentServers = dns.getServers();
    if (currentServers.includes("127.0.0.1") || currentServers.length === 0) {
      dns.setServers(["8.8.8.8", "8.8.4.4"]);
    }
  } catch (e) {
    // Ignore
  }

  // Intercept and patch dns.promises.resolve to bypass c-ares channel destruction/EDESTRUCTION issues in Next.js dev server
  try {
    const originalResolve = dns.promises.resolve;
    dns.promises.resolve = function (address: string, rrtype: string) {
      if (rrtype === "SRV") {
        return new Promise((resolve, reject) => {
          dns.resolveSrv(address, (err, addresses) => {
            if (err) reject(err);
            else resolve(addresses);
          });
        });
      }
      if (rrtype === "TXT") {
        return new Promise((resolve, reject) => {
          dns.resolveTxt(address, (err, addresses) => {
            if (err) reject(err);
            else resolve(addresses);
          });
        });
      }
      return originalResolve.apply(originalResolve, [address, rrtype] as Parameters<typeof originalResolve>);
    } as any;
    console.log("SUCCESS: Patched dns.promises.resolve for SRV/TXT records.");
  } catch (err) {
    console.error("Failed to patch dns.promises.resolve:", err);
  }
}
