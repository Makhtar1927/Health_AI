const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://snysddnktlgavloosmvi.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNueXNkZG5rdGxnYXZsb29zbXZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjAwODQwMSwiZXhwIjoyMTA3NTg0NDAxfQ.sZYIW6ENkD2dXNwVxEaqHEia0zRuN2tbmQCdhKb4yeA";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkUsers() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Erreur listUsers:", error);
    return;
  }
  console.log("Total utilisateurs dans Supabase Auth:", users.length);
  users.forEach(u => {
    console.log(`- Email: [${u.email}] | Confirmé: ${!!u.email_confirmed_at} | Created: ${u.created_at} | LastSignIn: ${u.last_sign_in_at}`);
  });
}

checkUsers();
