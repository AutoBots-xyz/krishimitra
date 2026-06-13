CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE farmers (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name       TEXT,
    phone           TEXT UNIQUE,
    state           TEXT,                          
    district        TEXT,
    village         TEXT,
    land_size_acres NUMERIC(8, 2),
    soil_type       TEXT,                          
    primary_crop    TEXT,
    preferred_lang  TEXT DEFAULT 'hi',             
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers can view and update own profile"
    ON farmers FOR ALL USING (auth.uid() = id);

CREATE TABLE disease_reports (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id           UUID REFERENCES farmers(id),
    image_url           TEXT NOT NULL,             
    image_path          TEXT NOT NULL,             
    crop_type           TEXT,                      
    disease_name        TEXT,
    confidence_score    NUMERIC(5, 2),             
    severity_level      TEXT CHECK (severity_level IN ('low', 'moderate', 'high', 'critical')),
    symptoms_detected   JSONB,                     
    treatment_recs      JSONB,                     
    prevention_measures JSONB,                     
    disease_category    TEXT,                      
    raw_ai_response     JSONB,                     
    latitude            DOUBLE PRECISION,
    longitude           DOUBLE PRECISION,
    location            GEOGRAPHY(POINT, 4326),    
    consented_to_share  BOOLEAN DEFAULT FALSE,
    consent_method      TEXT CHECK (consent_method IN ('explicit', 'auto', 'declined')),
    consent_timestamp   TIMESTAMPTZ,
    is_verified         BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_disease_reports_location ON disease_reports USING GIST(location);
CREATE INDEX idx_disease_reports_created_at ON disease_reports(created_at DESC);
CREATE INDEX idx_disease_reports_disease_category ON disease_reports(disease_category);

CREATE OR REPLACE FUNCTION set_disease_report_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_location
    BEFORE INSERT OR UPDATE ON disease_reports
    FOR EACH ROW EXECUTE FUNCTION set_disease_report_location();

ALTER TABLE disease_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own disease reports"
    ON disease_reports FOR ALL USING (auth.uid() = farmer_id);
CREATE POLICY "Consented reports for CropWatch"
    ON disease_reports FOR SELECT USING (consented_to_share = TRUE);

CREATE TABLE chat_sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id   UUID REFERENCES farmers(id) ON DELETE CASCADE,
    title       TEXT,                              
    language    TEXT DEFAULT 'hi',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role        TEXT CHECK (role IN ('user', 'assistant')),
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, created_at ASC);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own chat sessions" ON chat_sessions FOR ALL USING (auth.uid() = farmer_id);
CREATE POLICY "Own chat messages" ON chat_messages FOR ALL
    USING (session_id IN (SELECT id FROM chat_sessions WHERE farmer_id = auth.uid()));

CREATE TABLE crop_recommendations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id           UUID REFERENCES farmers(id),
    input_params        JSONB NOT NULL,            
    recommendations     JSONB NOT NULL,            
    season              TEXT,                      
    generated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE crop_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own recommendations" ON crop_recommendations FOR ALL USING (auth.uid() = farmer_id);

CREATE TABLE climate_advisories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id       UUID REFERENCES farmers(id),
    latitude        DOUBLE PRECISION NOT NULL,
    longitude       DOUBLE PRECISION NOT NULL,
    crop_type       TEXT,
    weather_data    JSONB,                         
    advisory        JSONB NOT NULL,                
    valid_until     TIMESTAMPTZ,                   
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_climate_advisories_farmer ON climate_advisories(farmer_id, created_at DESC);
ALTER TABLE climate_advisories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own climate advisories" ON climate_advisories FOR ALL USING (auth.uid() = farmer_id);

CREATE TABLE msp_prices (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_name   TEXT NOT NULL,
    season      TEXT NOT NULL,                     
    msp_per_qtl NUMERIC(10, 2),                    
    announced_on DATE,
    valid_from  DATE,
    valid_until DATE,
    source_url  TEXT
);

CREATE INDEX idx_msp_prices_crop ON msp_prices(crop_name, season);
ALTER TABLE msp_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for msp" ON msp_prices FOR SELECT USING (true);

CREATE TABLE government_schemes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_name     TEXT NOT NULL,
    scheme_name_hi  TEXT,                          
    description     TEXT,
    description_hi  TEXT,
    eligible_crops  TEXT[],
    eligible_states TEXT[],
    benefits        TEXT,
    application_url TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE government_schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for schemes" ON government_schemes FOR SELECT USING (true);
