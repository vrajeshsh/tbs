import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runDiagnostics() {
  console.log("🔍 STARTING BACKEND DIAGNOSTICS...");
  
  // 1. Env Var Check
  console.log("\n📦 Checking Environment Variables...");
  const keys = ['OPENROUTER_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY'];
  keys.forEach(key => {
    const val = process.env[key];
    if (val) {
      let displayVal = val.length > 8 ? `${val.substring(0, 4)}...${val.substring(val.length - 4)}` : "****";
      console.log(`✅ ${key} is set: ${displayVal}`);
    } else {
      console.error(`❌ ${key} is MISSING`);
    }
  });

  // 2. OpenRouter Connectivity Check
  console.log("\n📡 Testing OpenRouter Connectivity...");
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: "hi" }],
          max_tokens: 5
        })
      });
      
      if (response.ok) {
        console.log("✅ OpenRouter API is reachable and key is valid.");
      } else {
        const text = await response.text();
        console.error(`❌ OpenRouter API Error (${response.status}):`, text);
      }
    } catch (err: any) {
      console.error("❌ OpenRouter Fetch Failed:", err.message);
    }
  } else {
    console.log("⚠️ Skipping OpenRouter check due to missing key.");
  }

  // 3. Supabase Check
  console.log("\n🗄️ Testing Supabase Connectivity...");
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      
      // Test table access
      const tables = ['marketing_queries', 'marketing_blueprints', 'subscribers'];
      for (const table of tables) {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (error) {
          console.error(`❌ Supabase table '${table}' check failed:`, error.message);
          if (error.code === 'PGRST205') {
            console.log(`   💡 Tip: This means the table '${table}' was not found in the 'public' schema of the project at ${process.env.SUPABASE_URL}`);
          }
        } else {
          console.log(`✅ Supabase table '${table}' is accessible.`);
        }
      }
    } catch (err: any) {
      console.error("❌ Supabase connection failed:", err.message);
    }
  } else {
    console.log("⚠️ Skipping Supabase check due to missing credentials.");
  }

  // 4. Local SQLite Check
  console.log("\n📁 Testing Local SQLite Connectivity...");
  try {
    const { default: Database } = await import('better-sqlite3');
    const dbPath = path.join(__dirname, "blueprints.db");
    const db = new Database(dbPath);
    
    const tables = ['marketing_queries', 'marketing_blueprints', 'subscribers'];
    for (const table of tables) {
      const result = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}';`).get();
      if (result) {
        console.log(`✅ Local SQLite table '${table}' exists.`);
      } else {
        console.error(`❌ Local SQLite table '${table}' is MISSING.`);
      }
    }
    db.close();
  } catch (err: any) {
    console.error("❌ Local SQLite check failed:", err.message);
  }

  console.log("\n🚀 DIAGNOSTICS COMPLETE.");
}

runDiagnostics();
