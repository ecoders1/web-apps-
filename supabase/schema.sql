-- Exit Exam Ethiopia - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- DEPARTMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default departments
INSERT INTO departments (name, code, description) VALUES
  ('Computer Science', 'CS', 'Bachelor of Science in Computer Science'),
  ('Software Engineering', 'SE', 'Bachelor of Science in Software Engineering'),
  ('Information Technology', 'IT', 'Bachelor of Science in Information Technology'),
  ('Nursing', 'NUR', 'Bachelor of Science in Nursing'),
  ('Midwifery', 'MID', 'Bachelor of Science in Midwifery'),
  ('Accounting and Finance', 'AF', 'Bachelor of Science in Accounting and Finance'),
  ('Economics', 'ECON', 'Bachelor of Arts in Economics'),
  ('Management', 'MGT', 'Bachelor of Business Administration in Management'),
  ('Civil Engineering', 'CE', 'Bachelor of Science in Civil Engineering'),
  ('Mechanical Engineering', 'ME', 'Bachelor of Science in Mechanical Engineering'),
  ('Electrical Engineering', 'EE', 'Bachelor of Science in Electrical Engineering'),
  ('Public Health', 'PH', 'Bachelor of Science in Public Health'),
  ('Law', 'LAW', 'Bachelor of Laws'),
  ('English', 'ENG', 'Bachelor of Arts in English Language and Literature'),
  ('Mathematics', 'MATH', 'Bachelor of Science in Mathematics')
ON CONFLICT DO NOTHING;

-- ==========================================
-- PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  university TEXT,
  department_id UUID REFERENCES departments(id),
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SUBJECTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PRACTICE QUESTIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS practice_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  topic TEXT,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- MOCK TESTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS mock_tests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  total_questions INTEGER NOT NULL DEFAULT 50,
  passing_score INTEGER NOT NULL DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- MOCK TEST QUESTIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS mock_test_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mock_test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES practice_questions(id) ON DELETE CASCADE NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mock_test_id, question_id)
);

-- ==========================================
-- RESULTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mock_test_id UUID REFERENCES mock_tests(id) ON DELETE SET NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('practice', 'mock')),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  wrong_answers INTEGER NOT NULL DEFAULT 0,
  score_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  time_taken_minutes INTEGER,
  passed BOOLEAN,
  answers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- RESOURCES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx', 'pptx', 'xlsx', 'image')),
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ANNOUNCEMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- NOTIFICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ACTIVITY LOGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE USING (is_admin());

-- Departments policies (public read)
CREATE POLICY "Anyone can view departments" ON departments
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage departments" ON departments
  FOR ALL USING (is_admin());

-- Subjects policies (public read)
CREATE POLICY "Anyone can view subjects" ON subjects
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage subjects" ON subjects
  FOR ALL USING (is_admin());

-- Practice questions policies
CREATE POLICY "Authenticated users can view questions" ON practice_questions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage questions" ON practice_questions
  FOR ALL USING (is_admin());

-- Mock tests policies
CREATE POLICY "Authenticated users can view active mock tests" ON mock_tests
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = TRUE);

CREATE POLICY "Admins can manage mock tests" ON mock_tests
  FOR ALL USING (is_admin());

-- Mock test questions policies
CREATE POLICY "Authenticated users can view mock test questions" ON mock_test_questions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage mock test questions" ON mock_test_questions
  FOR ALL USING (is_admin());

-- Results policies
CREATE POLICY "Users can view own results" ON results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results" ON results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all results" ON results
  FOR SELECT USING (is_admin());

-- Resources policies
CREATE POLICY "Authenticated users can view resources" ON resources
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage resources" ON resources
  FOR ALL USING (is_admin());

-- Announcements policies
CREATE POLICY "Anyone can view active announcements" ON announcements
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage announcements" ON announcements
  FOR ALL USING (is_admin());

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Users can view own activity" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" ON activity_logs
  FOR SELECT USING (is_admin());

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- STORAGE BUCKETS
-- ==========================================

-- Create storage buckets (run in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', TRUE);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', TRUE);

-- Storage policies for avatars
-- CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
-- CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==========================================
-- ADMIN USER SETUP
-- ==========================================
-- After running the schema, create admin user via Supabase Auth:
-- 1. Go to Authentication > Users > Add User
-- 2. Email: iyasu4313@gmail.com
-- 3. Then update their profile role to 'admin':
-- UPDATE profiles SET role = 'admin' WHERE email = 'iyasu4313@gmail.com';
