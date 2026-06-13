const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('disease_reports')
    .select('user_rating, user_feedback_image_url')
    .limit(1);

  if (error) {
    console.error("Database Error:", error.message);
  } else {
    console.log("Success! Columns exist. Data:", data);
  }
}

checkSchema();
