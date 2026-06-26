import "./dns-init";
import mongoose from "mongoose";

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
  }
  return uri;
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  // Fix Node.js DNS resolution issue on Windows/some local networks by fallback to public DNS
  if (typeof window === "undefined") {
    try {
      const dns = require("dns");
      const currentServers = dns.getServers();
      console.log("connectDB check passed. currentServers:", currentServers);
      if (currentServers.includes("127.0.0.1") || currentServers.length === 0) {
        console.log("dns.setServers to Google DNS");
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
      }
      dns.resolveSrv("_mongodb._tcp.dent-istdb.sgpypnc.mongodb.net", (err: NodeJS.ErrnoException | null, addresses: any[]) => {
        console.log("dns.resolveSrv result inside Next.js:", err, addresses);
      });
      dns.promises.resolve("_mongodb._tcp.dent-istdb.sgpypnc.mongodb.net", "SRV")
        .then((res: unknown) => console.log("dns.promises.resolve result inside Next.js:", res))
        .catch((err: unknown) => console.error("dns.promises.resolve failed inside Next.js:", err));
    } catch (e) {
      console.error("connectDB check failed:", e);
    }
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri(), {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Clear cache on failure so we can retry on next request
    throw error;
  }
  return cached.conn;
}

