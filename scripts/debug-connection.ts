import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('Checking Supabase connection...');
console.log('SUPABASE_URL:', supabaseUrl ? 'Defined (' + supabaseUrl.substring(0, 8) + '...)' : 'MISSING');
console.log('SUPABASE_KEY:', supabaseKey ? 'Defined (' + supabaseKey.substring(0, 5) + '...)' : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Attempting to fetch categories...');
    const start = Date.now();
    const { data, error, status, statusText } = await supabase
      .from('categories')
      .select('id, name')
      .limit(1);
    
    const duration = Date.now() - start;
    console.log(`Request took ${duration}ms`);

    if (error) {
      console.error('❌ Supabase Error:', error);
      console.error('Status:', status, statusText);
    } else {
      console.log('✅ Connection successful!');
      console.log('Data received:', data);
    }
  } catch (error) {
    console.error('❌ Exception during fetch:', error);
    if (error instanceof TypeError && error.message === 'fetch failed') {
        console.error('This often indicates a network issue, DNS problem, or invalid URL protocol.');
    }
  }
}

testConnection();
