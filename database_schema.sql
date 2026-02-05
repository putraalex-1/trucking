-- ============================================
-- DATABASE SCHEMA untuk Truck Inspection System
-- ============================================

-- Tabel utama: inspections
CREATE TABLE IF NOT EXISTS inspections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tanggal TEXT NOT NULL,                    -- Format: YYYY-MM-DD
    waktu TEXT NOT NULL,                      -- Format: HH:MM
    supplier TEXT NOT NULL,                   -- Nama supplier
    driver TEXT,                              -- Nama driver
    nomorTruck TEXT NOT NULL,                 -- Nomor polisi truck
    inspector TEXT,                           -- Nama checker
    conclusion TEXT,                          -- approved, conditional, rejected
    overallNotes TEXT,                        -- Catatan keseluruhan
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_inspections_tanggal ON inspections(tanggal);
CREATE INDEX IF NOT EXISTS idx_inspections_supplier ON inspections(supplier);
CREATE INDEX IF NOT EXISTS idx_inspections_nomorTruck ON inspections(nomorTruck);

-- Tabel checklist items
CREATE TABLE IF NOT EXISTS inspection_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inspectionId INTEGER NOT NULL,            -- FK ke inspections
    itemId INTEGER NOT NULL,                  -- ID item checklist (1-20)
    status TEXT NOT NULL,                     -- ok, not-ok, na
    notes TEXT,                               -- Catatan per item
    FOREIGN KEY (inspectionId) REFERENCES inspections(id) ON DELETE CASCADE
);

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_items_inspectionId ON inspection_items(inspectionId);

-- Tabel photos
CREATE TABLE IF NOT EXISTS inspection_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inspectionId INTEGER NOT NULL,            -- FK ke inspections
    itemId INTEGER NOT NULL,                  -- ID item yang difoto
    photoData TEXT NOT NULL,                  -- Base64 encoded image
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inspectionId) REFERENCES inspections(id) ON DELETE CASCADE
);

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_photos_inspectionId ON inspection_photos(inspectionId);
CREATE INDEX IF NOT EXISTS idx_photos_itemId ON inspection_photos(itemId);

-- ============================================
-- SAMPLE DATA untuk Testing
-- ============================================

-- Sample Inspection 1: APPROVED
INSERT INTO inspections (tanggal, waktu, supplier, driver, nomorTruck, inspector, conclusion, overallNotes)
VALUES ('2024-02-05', '08:30', 'PT Maju Jaya', 'Budi Santoso', 'B 1234 ABC', 'John Doe', 'approved', 'Semua kondisi truck dalam keadaan sangat baik. Tidak ada masalah yang ditemukan.');

INSERT INTO inspection_items (inspectionId, itemId, status, notes)
VALUES 
    (1, 1, 'ok', 'Kondisi fisik excellent'),
    (1, 2, 'ok', 'Sangat bersih'),
    (1, 3, 'ok', 'Ban dalam kondisi bagus'),
    (1, 4, 'ok', NULL),
    (1, 5, 'ok', NULL),
    (1, 6, 'ok', NULL),
    (1, 7, 'ok', NULL),
    (1, 8, 'ok', NULL),
    (1, 9, 'ok', NULL),
    (1, 10, 'ok', NULL),
    (1, 11, 'ok', NULL),
    (1, 12, 'ok', NULL),
    (1, 13, 'ok', NULL),
    (1, 14, 'ok', NULL),
    (1, 15, 'ok', NULL),
    (1, 16, 'ok', NULL),
    (1, 17, 'ok', NULL),
    (1, 18, 'ok', NULL),
    (1, 19, 'ok', NULL),
    (1, 20, 'ok', NULL);

-- Sample Inspection 2: CONDITIONAL (ada beberapa masalah minor)
INSERT INTO inspections (tanggal, waktu, supplier, driver, nomorTruck, inspector, conclusion, overallNotes)
VALUES ('2024-02-05', '10:15', 'PT Sukses Makmur', 'Agus Wijaya', 'D 5678 XYZ', 'Jane Smith', 'conditional', 'Beberapa item perlu perbaikan minor. Disetujui dengan catatan untuk diperbaiki sebelum pengiriman berikutnya.');

INSERT INTO inspection_items (inspectionId, itemId, status, notes)
VALUES 
    (2, 1, 'ok', NULL),
    (2, 2, 'not-ok', 'Perlu dibersihkan lebih lanjut, ada noda oli'),
    (2, 3, 'ok', NULL),
    (2, 4, 'not-ok', 'Lampu belakang kiri redup, perlu diganti'),
    (2, 5, 'ok', NULL),
    (2, 6, 'ok', NULL),
    (2, 7, 'ok', NULL),
    (2, 8, 'ok', NULL),
    (2, 9, 'ok', NULL),
    (2, 10, 'na', 'Truck kecil, tidak memerlukan KIR'),
    (2, 11, 'not-ok', 'Perlu dibersihkan'),
    (2, 12, 'ok', NULL),
    (2, 13, 'ok', NULL),
    (2, 14, 'ok', NULL),
    (2, 15, 'ok', NULL),
    (2, 16, 'ok', NULL),
    (2, 17, 'ok', NULL),
    (2, 18, 'ok', NULL),
    (2, 19, 'ok', NULL),
    (2, 20, 'ok', NULL);

-- Sample Inspection 3: REJECTED
INSERT INTO inspections (tanggal, waktu, supplier, driver, nomorTruck, inspector, conclusion, overallNotes)
VALUES ('2024-02-04', '14:45', 'PT Karya Utama', 'Slamet Riyadi', 'B 9999 DEF', 'Bob Wilson', 'rejected', 'Truck tidak memenuhi standar keselamatan. Terdapat beberapa masalah serius yang harus diperbaiki sebelum dapat diterima.');

INSERT INTO inspection_items (inspectionId, itemId, status, notes)
VALUES 
    (3, 1, 'not-ok', 'Ada penyok besar di bagian samping'),
    (3, 2, 'not-ok', 'Sangat kotor, banyak sampah di dalam cargo'),
    (3, 3, 'not-ok', 'Ban depan kanan sudah aus dan perlu diganti'),
    (3, 4, 'not-ok', 'Beberapa lampu tidak berfungsi'),
    (3, 5, 'not-ok', 'Rem kurang responsive, berbahaya'),
    (3, 6, 'ok', NULL),
    (3, 7, 'not-ok', 'Spion kanan pecah'),
    (3, 8, 'ok', NULL),
    (3, 9, 'not-ok', 'STNK sudah expired'),
    (3, 10, 'not-ok', 'KIR sudah habis masa berlaku'),
    (3, 11, 'not-ok', 'Kabin kotor dan berbau'),
    (3, 12, 'ok', NULL),
    (3, 13, 'not-ok', 'Lantai cargo basah dan berlumpur'),
    (3, 14, 'not-ok', 'Bau menyengat di area cargo'),
    (3, 15, 'not-ok', 'Tali pengaman rusak'),
    (3, 16, 'not-ok', 'APAR tidak tersedia'),
    (3, 17, 'ok', NULL),
    (3, 18, 'not-ok', 'P3K tidak tersedia'),
    (3, 19, 'ok', NULL),
    (3, 20, 'ok', NULL);

-- ============================================
-- USEFUL QUERIES untuk Reporting
-- ============================================

-- Query 1: Lihat semua inspection dengan summary
-- SELECT 
--     i.id,
--     i.tanggal,
--     i.supplier,
--     i.nomorTruck,
--     i.conclusion,
--     COUNT(CASE WHEN it.status = 'ok' THEN 1 END) as total_ok,
--     COUNT(CASE WHEN it.status = 'not-ok' THEN 1 END) as total_not_ok,
--     COUNT(CASE WHEN it.status = 'na' THEN 1 END) as total_na
-- FROM inspections i
-- LEFT JOIN inspection_items it ON i.id = it.inspectionId
-- GROUP BY i.id
-- ORDER BY i.createdAt DESC;

-- Query 2: Statistik per supplier
-- SELECT 
--     supplier,
--     COUNT(*) as total_inspections,
--     SUM(CASE WHEN conclusion = 'approved' THEN 1 ELSE 0 END) as approved,
--     SUM(CASE WHEN conclusion = 'conditional' THEN 1 ELSE 0 END) as conditional,
--     SUM(CASE WHEN conclusion = 'rejected' THEN 1 ELSE 0 END) as rejected
-- FROM inspections
-- GROUP BY supplier
-- ORDER BY total_inspections DESC;

-- Query 3: Item yang paling sering bermasalah
-- SELECT 
--     itemId,
--     COUNT(*) as total_not_ok
-- FROM inspection_items
-- WHERE status = 'not-ok'
-- GROUP BY itemId
-- ORDER BY total_not_ok DESC
-- LIMIT 10;

-- Query 4: Inspection dengan foto terbanyak
-- SELECT 
--     i.id,
--     i.tanggal,
--     i.supplier,
--     i.nomorTruck,
--     COUNT(p.id) as total_photos
-- FROM inspections i
-- LEFT JOIN inspection_photos p ON i.id = p.inspectionId
-- GROUP BY i.id
-- ORDER BY total_photos DESC;

-- Query 5: Daily inspection summary
-- SELECT 
--     tanggal,
--     COUNT(*) as total_inspections,
--     SUM(CASE WHEN conclusion = 'approved' THEN 1 ELSE 0 END) as approved,
--     SUM(CASE WHEN conclusion = 'conditional' THEN 1 ELSE 0 END) as conditional,
--     SUM(CASE WHEN conclusion = 'rejected' THEN 1 ELSE 0 END) as rejected
-- FROM inspections
-- GROUP BY tanggal
-- ORDER BY tanggal DESC;
