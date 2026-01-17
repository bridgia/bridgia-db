import { getDb, setAdminPassword } from "./server/db.ts";
import bcrypt from "bcryptjs";

const adminPassword = "bd@@bridgia@Hfkhha";

async function initializeAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await setAdminPassword(hashedPassword);
    console.log("✅ Admin password initialized successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to initialize admin password:", error);
    process.exit(1);
  }
}

initializeAdmin();
