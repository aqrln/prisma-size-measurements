// import fs from "fs";
import { PrismaClient } from "@prisma/client";

console.log("Starting!");

// const qePath =
// "/var/task/node_modules/.prisma/client/libquery_engine-arm64-openssl-1.0.x.so.node";
// process.env.PRISMA_QUERY_ENGINE_LIBRARY = qePath;

// const stat = fs.statSync(qePath);

let coldstart = true;
const client = new PrismaClient();

export const handler = async (event) => {
  // console.log("cwd", process.cwd());
  // console.log("filename", import.meta.url);
  // console.log({ qePath, size: stat.size });
  const result = await client.$queryRaw`SELECT 'meowmeow'`;
  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
    coldstart,
  };
  coldstart = false;
  return response;
};
