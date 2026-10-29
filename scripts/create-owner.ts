import { existsSync } from "node:fs";
import { getBackend, provisionOwner } from "../src/lib/server/auth";

function readPassword(prompt: string): Promise<string> {
  if (!process.stdin.isTTY) {
    throw new Error("Use an interactive terminal, or set OWNER_PASSWORD for this command only.");
  }
  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.setEncoding("utf8");
  process.stdin.resume();

  return new Promise((resolve, reject) => {
    let password = "";
    const finish = (error?: Error) => {
      process.stdin.off("data", onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(password);
    };
    const onData = (chunk: string) => {
      for (const character of chunk) {
        if (character === "\r" || character === "\n") return finish();
        if (character === "\u0003") return finish(new Error("Owner creation cancelled."));
        if (character === "\u007f" || character === "\b") password = password.slice(0, -1);
        else if (character >= " ") password += character;
      }
    };
    process.stdin.on("data", onData);
  });
}

async function main() {
  if (existsSync(".env.local")) process.loadEnvFile(".env.local");
  if (!process.env.OWNER_EMAIL?.trim()) throw new Error("Set OWNER_EMAIL in .env.local first.");

  const password = process.env.OWNER_PASSWORD || await readPassword("Owner password (hidden): ");
  if (password.length < 8 || password.length > 128) {
    throw new Error("The owner password must contain 8–128 characters.");
  }
  if (!process.env.OWNER_PASSWORD) {
    const confirmation = await readPassword("Confirm password (hidden): ");
    if (password !== confirmation) throw new Error("The passwords do not match.");
  }

  const backend = await getBackend();
  try {
    await provisionOwner(process.env.OWNER_NAME || "Library owner", password);
    console.log("Owner account created. Sign in with the configured owner email and password.");
  } finally {
    backend.db.close();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Owner creation failed.");
  process.exitCode = 1;
});
