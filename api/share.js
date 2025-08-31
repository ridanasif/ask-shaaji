import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { query, uncle_opinion } = req.body;
    await supabase
      .from("shares")
      .insert([{ query: query, uncle_opinion: uncle_opinion }]);
    return res.status(200).end();
  } else {
    return res.status(405).end();
  }
}
