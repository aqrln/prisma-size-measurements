// import fs from "fs";
import { PrismaClient } from "@prisma/client";

// import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
// import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
// import { registerInstrumentations } from "@opentelemetry/instrumentation";
// import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
// import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
// import { PrismaInstrumentation } from "@prisma/instrumentation";
// import { Resource } from "@opentelemetry/resources";
// import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
// import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
// import { NodeSDK } from "@opentelemetry/sdk-node";

console.log("Starting!");

// const qePath =
// "/var/task/node_modules/.prisma/client/libquery_engine-arm64-openssl-1.0.x.so.node";
// process.env.PRISMA_QUERY_ENGINE_LIBRARY = qePath;

// const stat = fs.statSync(qePath);

// otelSetup();

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

// function otelSetup() {
//   // Configure the trace provider
//   const provider = new NodeTracerProvider({
//     resource: new Resource({
//       [SemanticResourceAttributes.SERVICE_NAME]: "example application",
//     }),
//   });

//   // Configure how spans are processed and exported. In this case we're sending spans
//   // as we receive them to an OTLP-compatible collector (e.g. Jaeger).
//   provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));

//   // Register your auto-instrumentors
//   registerInstrumentations({
//     tracerProvider: provider,
//     instrumentations: [new PrismaInstrumentation()],
//   });

//   // Register the provider globally
//   provider.register();

//   // const traceExporter = new ConsoleSpanExporter();
//   // const sdk = new NodeSDK({
//   //   resource: new Resource({
//   //     [SemanticResourceAttributes.SERVICE_NAME]: "my-service",
//   //   }),
//   //   traceExporter,
//   //   instrumentations: [
//   //     getNodeAutoInstrumentations(),
//   //     new PrismaInstrumentation(),
//   //   ],
//   // });

//   // sdk
//   //   .start()
//   //   .then(() => console.log("Tracing initialized"))
//   //   .catch((error) => console.log("Error initializing tracing", error));

//   // process.on("SIGTERM", () => {
//   //   sdk
//   //     .shutdown()
//   //     .then(() => console.log("Tracing terminated"))
//   //     .catch((error) => console.log("Error terminating tracing", error))
//   //     .finally(() => process.exit(0));
//   // });
// }
