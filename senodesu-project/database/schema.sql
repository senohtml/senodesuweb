-- Enable authentication (managed by Supabase automatically)
-- CREATE EXTENSION IF NOT EXISTS "auth" SCHEMA public;

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    link VARCHAR(500),
    drive_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    user_id VARCHAR(255),
    page_url TEXT,
    referrer TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on event_type for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for resources
-- Anyone can read resources
CREATE POLICY "Resources are readable by everyone" ON resources
    FOR SELECT USING (true);

-- Only authenticated admin users can insert/update/delete
CREATE POLICY "Resources are insertable by authenticated users" ON resources
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Resources are updatable by authenticated users" ON resources
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Resources are deletable by authenticated users" ON resources
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for settings
CREATE POLICY "Settings are readable by everyone" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Settings are updatable by authenticated users" ON settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for analytics
CREATE POLICY "Analytics are insertable by everyone" ON analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Analytics are readable by authenticated users" ON analytics
    FOR SELECT USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO settings (key, value) VALUES 
    ('site_title', 'Senodesu'),
    ('site_description', 'Learning Japanese & Tech'),
    ('contact_email', 'senohtml@gmail.com'),
    ('tiktok_username', 'senodesuu'),
    ('instagram_username', 'agil.dss')
ON CONFLICT (key) DO NOTHING;

-- Insert default resources
INSERT INTO resources (title, description, category, drive_link) VALUES
    (
        'Bahasa Jepang Dasar',
        'Grammar dasar, daftar kosakata, penjelasan kanji, dan tips percakapan praktis.',
        'language',
        'https://drive.google.com'
    ),
    (
        'Bekerja di Jepang',
        'Budaya perusahaan Jepang, etiket kerja, gaya rapat, dan ekspektasi untuk engineer.',
        'work',
        'https://drive.google.com'
    ),
    (
        'Budaya & Masyarakat',
        'Memahami tradisi Jepang, adat istiadat, norma sosial, dan navigasi perbedaan budaya.',
        'culture',
        'https://drive.google.com'
    ),
    (
        'Panduan Perjalanan',
        'Tempat tersembunyi, pengalaman lokal, dan tips dari seseorang yang tinggal di sini.',
        'travel',
        'https://drive.google.com'
    ),
    (
        'Dunia Tech',
        'Ekosistem tech Jepang, budaya startup, komunitas engineer, dan peluang developer.',
        'tech',
        'https://drive.google.com'
    ),
    (
        'Full-Stack Dev',
        'Proyek, tutorial, dan code snippet dari perjalanan engineer full-stack saya.',
        'dev',
        'https://drive.google.com'
    )
ON CONFLICT DO NOTHING;
