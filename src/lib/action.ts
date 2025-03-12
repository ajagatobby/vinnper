import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const trackDownloads = async () => {
  const allDownloads = await redis.hgetall("counts");
  console.log(allDownloads);
  return allDownloads;
};
