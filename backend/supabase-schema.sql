-- ==============================================================================
-- 🏥 HEALTH AI — SCHÉMA POSTGRESQL OFFICIEL SUPABASE
-- ==============================================================================

-- Activation des extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. TABLE : PROFILES (Utilisateurs et Rôles RBAC)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Utilisé si non géré par Supabase Auth direct
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (
        role IN (
            'patient', 
            'doctor', 
            'nurse', 
            'radiology', 
            'pharmacist', 
            'reception', 
            'cashier', 
            'admin_hospital', 
            'admin_pharmacy', 
            'superadmin'
        )
    ),
    phone TEXT,
    facility_id TEXT,
    suspended BOOLEAN DEFAULT FALSE,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_facility ON public.profiles(facility_id);

-- ------------------------------------------------------------------------------
-- 2. TABLE : FACILITIES (Hôpitaux, Centres et Postes de Santé)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.facilities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('hopital', 'centre_de_sante', 'poste_de_sante')),
    region TEXT NOT NULL,
    district TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_facilities_region ON public.facilities(region);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON public.facilities(type);

-- ------------------------------------------------------------------------------
-- 3. TABLE : FACILITY_SPECIALTIES (Services & Spécialités par structure)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.facility_specialties (
    id TEXT NOT NULL,
    facility_id TEXT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    ticket_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    available_days INTEGER[] NOT NULL DEFAULT '{1,2,3,4,5}', -- 1=Lundi ... 7=Dimanche
    start_time TEXT NOT NULL DEFAULT '08:00',
    end_time TEXT NOT NULL DEFAULT '16:00',
    slot_duration INTEGER NOT NULL DEFAULT 30, -- minutes
    max_patients_per_slot INTEGER NOT NULL DEFAULT 1,
    assigned_doctors TEXT[] DEFAULT '{}',
    doctor_assignments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (facility_id, id)
);

CREATE INDEX IF NOT EXISTS idx_specialties_facility ON public.facility_specialties(facility_id);

-- ------------------------------------------------------------------------------
-- 4. TABLE : APPOINTMENTS (Rendez-vous et Billetterie Médicale)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY, -- Format ex: RDV-7310
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    facility_id TEXT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    facility_name TEXT NOT NULL,
    facility_address TEXT,
    specialty_id TEXT NOT NULL,
    specialty_name TEXT NOT NULL,
    doctor_name TEXT,
    ticket_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    appointment_date DATE NOT NULL,
    time_slot TEXT NOT NULL, -- Format "09:00"
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (
        status IN (
            'confirmed', 
            'arrived', 
            'sent_to_cashier', 
            'ticket_paid', 
            'in_consultation', 
            'completed', 
            'cancelled'
        )
    ),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_facility_date ON public.appointments(facility_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_email ON public.appointments(patient_email);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- ------------------------------------------------------------------------------
-- 5. TABLE : PRESCRIPTIONS (Ordonnances Sécurisées & QR Code)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id TEXT PRIMARY KEY DEFAULT ('ORD-' || upper(substr(md5(random()::text), 1, 8))),
    patient_name TEXT NOT NULL,
    patient_email TEXT,
    doctor_name TEXT NOT NULL,
    facility_name TEXT,
    medications JSONB NOT NULL DEFAULT '[]'::jsonb,
    qr_code_hash TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'dispensed', 'expired', 'cancelled')),
    dispensed_at TIMESTAMPTZ,
    dispensed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_qr ON public.prescriptions(qr_code_hash);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON public.prescriptions(patient_email);

-- ------------------------------------------------------------------------------
-- 6. TABLE : MEDICAL_RECORDS & RADIOLOGY (Dossiers Médicaux et Médias Cloudinary)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_email TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    facility_id TEXT REFERENCES public.facilities(id),
    record_type TEXT NOT NULL DEFAULT 'consultation' CHECK (record_type IN ('consultation', 'radiology', 'lab_result', 'emergency')),
    title TEXT NOT NULL,
    notes TEXT,
    diagnosis TEXT,
    cloudinary_media_id TEXT, -- Référence de l'image/DICOM sur Cloudinary
    cloudinary_media_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_records_patient ON public.medical_records(patient_email);

-- ------------------------------------------------------------------------------
-- 7. TABLE : AUDIT_LOGS (Traçabilité et Conformité Données de Santé)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email TEXT,
    actor_role TEXT,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 8. POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les structures et spécialités (annuaire santé)
CREATE POLICY "Lecture publique des structures" ON public.facilities 
    FOR SELECT USING (true);

CREATE POLICY "Lecture publique des spécialités" ON public.facility_specialties 
    FOR SELECT USING (true);

-- Le service role (backend) a accès complet à toutes les tables
CREATE POLICY "Backend service full access profiles" ON public.profiles 
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR current_user = 'postgres');

CREATE POLICY "Backend service full access appointments" ON public.appointments 
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR current_user = 'postgres');

CREATE POLICY "Backend service full access prescriptions" ON public.prescriptions 
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR current_user = 'postgres');

CREATE POLICY "Backend service full access facilities" ON public.facilities 
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR current_user = 'postgres');

CREATE POLICY "Backend service full access specialties" ON public.facility_specialties 
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR current_user = 'postgres');

-- ------------------------------------------------------------------------------
-- 9. INJECTION DES DONNÉES DE BASE (Établissements de Santé au Sénégal)
-- ------------------------------------------------------------------------------
INSERT INTO public.facilities (id, name, type, region, district, address, phone)
VALUES 
    ('hopital-principal-dakar', 'Hôpital Principal de Dakar', 'hopital', 'Dakar', 'Dakar Centre', '1 Avenue Nelson Mandela, Dakar Plateau', '+221 33 839 50 50'),
    ('chu-fann', 'Centre Hospitalier National Universitaire de Fann', 'hopital', 'Dakar', 'Fann-Point E-Amitié', 'Avenue Cheikh Anta Diop, Dakar', '+221 33 869 18 18'),
    ('hopital-dalal-jamm', 'Hôpital Général Dalal Jamm', 'hopital', 'Dakar', 'Guédiawaye', 'Golf Sud, Guédiawaye, Dakar', '+221 33 879 20 00'),
    ('centre-sante-ouakam', 'Centre de Santé de Ouakam', 'centre_de_sante', 'Dakar', 'Almadies / Ouakam', 'Route du Monument de la Renaissance, Ouakam', '+221 33 820 12 34')
ON CONFLICT (id) DO NOTHING;

-- Spécialités pour Hôpital Principal
INSERT INTO public.facility_specialties 
    (id, facility_id, name, is_active, ticket_price, available_days, start_time, end_time, slot_duration, max_patients_per_slot, assigned_doctors)
VALUES
    ('general', 'hopital-principal-dakar', 'Médecine Générale', true, 1500, '{1,2,3,4,5}', '08:00', '16:00', 20, 2, '{"Dr. Abdoulaye Diallo", "Dr. Ibrahima Seck"}'),
    ('dentisterie', 'hopital-principal-dakar', 'Dentisterie & Odontologie', true, 2000, '{2,4}', '08:00', '13:00', 30, 1, '{"Dr. Oumy Aidara", "Dr. Cheikh Tidiane Diop"}'),
    ('cardiologie', 'hopital-principal-dakar', 'Cardiologie', true, 5000, '{1,3}', '09:00', '14:00', 30, 2, '{"Dr. Awa Ndiaye"}'),
    ('ophtalmologie', 'hopital-principal-dakar', 'Ophtalmologie', true, 3500, '{5}', '08:30', '13:00', 30, 1, '{"Dr. Cheikh Anta Wade"}')
ON CONFLICT (facility_id, id) DO NOTHING;

-- Spécialités pour Dalal Jamm
INSERT INTO public.facility_specialties 
    (id, facility_id, name, is_active, ticket_price, available_days, start_time, end_time, slot_duration, max_patients_per_slot, assigned_doctors)
VALUES
    ('general', 'hopital-dalal-jamm', 'Médecine Générale', true, 1500, '{1,2,3,4,5}', '08:00', '16:00', 20, 2, '{"Dr. Ousmane Ly"}'),
    ('pediatrie', 'hopital-dalal-jamm', 'Pédiatrie & Santé Néonatale', true, 2000, '{1,2,3,4,5}', '08:30', '14:30', 20, 2, '{"Dr. Mariama Ba", "Dr. Khady Diagne"}')
ON CONFLICT (facility_id, id) DO NOTHING;
