// API Configuration
const API_BASE_URL = (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL)
    || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : `${window.location.origin}/api`);

// Supabase Configuration (for client-side)
const SUPABASE_URL = 'https://kodlilfruuuqyjfbokfc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SUo6wxdOcohS-s2RhkaLmw_SxuTEife';

// Export for use
window.CONFIG = {
    API_BASE_URL,
    SUPABASE_URL,
    SUPABASE_ANON_KEY
};
