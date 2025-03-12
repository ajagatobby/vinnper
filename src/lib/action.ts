import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const totalDownloads = async () => {
  const allDownloads = await redis.dbsize();
  console.log(allDownloads);
  return allDownloads;
};
