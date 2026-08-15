const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use('/admin', express.static(path.join(__dirname, '../admin')));
app.use(express.static(path.join(__dirname, '../frontend')));

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('ERROR: SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Routes

// Get all resources
app.get('/api/resources', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json({ resources: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single resource
app.get('/api/resources/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) throw error;
        res.json({ resource: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create resource
app.post('/api/resources', async (req, res) => {
    try {
        const { title, description, category, link, drive_link } = req.body;
        
        const { data, error } = await supabase
            .from('resources')
            .insert([{
                title,
                description,
                category,
                link,
                drive_link
            }])
            .select();
        
        if (error) throw error;
        res.json({ resource: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update resource
app.put('/api/resources/:id', async (req, res) => {
    try {
        const { title, description, category, link, drive_link } = req.body;
        
        const { data, error } = await supabase
            .from('resources')
            .update({ title, description, category, link, drive_link })
            .eq('id', req.params.id)
            .select();
        
        if (error) throw error;
        res.json({ resource: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete resource
app.delete('/api/resources/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('resources')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth routes
// Sign up
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        
        if (error) throw error;
        res.json({ user: data.user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sign in
app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        res.json({ 
            user: data.user,
            session: data.session
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sign out
app.post('/api/auth/signout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const { data, error } = await supabase.auth.getUser(token);
        if (error) throw error;
        
        res.json({ user: data.user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Supabase connected:', !!supabase);
});
