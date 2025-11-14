import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './services/supabase'

async function testSupabaseConnection() {
  console.log('🧠 Testing Supabase connection now...')

  const { data, error } = await supabase.from('projects').select('*').limit(1);
  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
  } else {
    console.log('✅ Supabase connection successful! Sample data:', data);
  }
}

testSupabaseConnection();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
