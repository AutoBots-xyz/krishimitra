-- Seed Mock Data for MSP Prices
INSERT INTO msp_prices (crop_name, season, msp_per_qtl, announced_on, valid_from, valid_until, source_url)
VALUES 
('Wheat', 'rabi_2024-25', 2275.00, '2023-10-18', '2024-04-01', '2025-03-31', 'https://pib.gov.in'),
('Paddy (Common)', 'kharif_2024', 2183.00, '2023-06-07', '2024-07-01', '2025-06-30', 'https://pib.gov.in'),
('Soybean', 'kharif_2024', 4600.00, '2023-06-07', '2024-07-01', '2025-06-30', 'https://pib.gov.in');

-- Seed Mock Data for Government Schemes
INSERT INTO government_schemes (scheme_name, scheme_name_hi, description, description_hi, eligible_crops, eligible_states, benefits, application_url)
VALUES 
('PM-KISAN', 'पीएम-किसान', 'Pradhan Mantri Kisan Samman Nidhi', 'प्रधानमंत्री किसान सम्मान निधि', ARRAY['All'], ARRAY['All'], '₹6,000 per year in three equal installments', 'https://pmkisan.gov.in/'),
('PMFBY', 'पीएमएफबीवाई', 'Pradhan Mantri Fasal Bima Yojana', 'प्रधानमंत्री फसल बीमा योजना', ARRAY['All'], ARRAY['All'], 'Crop insurance against non-preventable natural risks', 'https://pmfby.gov.in/');
