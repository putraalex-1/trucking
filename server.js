const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Untuk menangani base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (HTML frontend)
app.use(express.static('public'));

// Database setup
const dbPath = path.join(__dirname, 'database', 'inspections.db');

// Pastikan folder database ada
if (!fs.existsSync(path.join(__dirname, 'database'))) {
    fs.mkdirSync(path.join(__dirname, 'database'));
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('✅ Database connected successfully');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    db.serialize(() => {
        // Tabel utama inspection
        db.run(`
            CREATE TABLE IF NOT EXISTS inspections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tanggal TEXT NOT NULL,
                waktu TEXT NOT NULL,
                supplier TEXT NOT NULL,
                driver TEXT,
                nomorTruck TEXT NOT NULL,
                inspector TEXT,
                conclusion TEXT,
                overallNotes TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error('Error creating inspections table:', err);
            else console.log('✅ Table inspections ready');
        });

        // Tabel untuk item checklist
        db.run(`
            CREATE TABLE IF NOT EXISTS inspection_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                inspectionId INTEGER NOT NULL,
                itemId INTEGER NOT NULL,
                status TEXT NOT NULL,
                notes TEXT,
                FOREIGN KEY (inspectionId) REFERENCES inspections(id) ON DELETE CASCADE
            )
        `, (err) => {
            if (err) console.error('Error creating inspection_items table:', err);
            else console.log('✅ Table inspection_items ready');
        });

        // Tabel untuk foto
        db.run(`
            CREATE TABLE IF NOT EXISTS inspection_photos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                inspectionId INTEGER NOT NULL,
                itemId INTEGER NOT NULL,
                photoData TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (inspectionId) REFERENCES inspections(id) ON DELETE CASCADE
            )
        `, (err) => {
            if (err) console.error('Error creating inspection_photos table:', err);
            else console.log('✅ Table inspection_photos ready');
        });
    });
}

// ============ API ROUTES ============

// GET: Retrieve all inspections
app.get('/api/inspections', (req, res) => {
    const { startDate, endDate, supplier, nomorTruck } = req.query;
    
    let query = 'SELECT * FROM inspections WHERE 1=1';
    let params = [];

    if (startDate) {
        query += ' AND tanggal >= ?';
        params.push(startDate);
    }
    if (endDate) {
        query += ' AND tanggal <= ?';
        params.push(endDate);
    }
    if (supplier) {
        query += ' AND supplier LIKE ?';
        params.push(`%${supplier}%`);
    }
    if (nomorTruck) {
        query += ' AND nomorTruck LIKE ?';
        params.push(`%${nomorTruck}%`);
    }

    query += ' ORDER BY createdAt DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching inspections:', err);
            return res.status(500).json({ error: 'Failed to fetch inspections' });
        }
        res.json(rows);
    });
});

// GET: Retrieve single inspection with details
app.get('/api/inspections/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM inspections WHERE id = ?', [id], (err, inspection) => {
        if (err) {
            console.error('Error fetching inspection:', err);
            return res.status(500).json({ error: 'Failed to fetch inspection' });
        }

        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found' });
        }

        // Get items
        db.all('SELECT * FROM inspection_items WHERE inspectionId = ?', [id], (err, items) => {
            if (err) {
                console.error('Error fetching items:', err);
                return res.status(500).json({ error: 'Failed to fetch items' });
            }

            // Get photos
            db.all('SELECT * FROM inspection_photos WHERE inspectionId = ?', [id], (err, photos) => {
                if (err) {
                    console.error('Error fetching photos:', err);
                    return res.status(500).json({ error: 'Failed to fetch photos' });
                }

                // Format response
                const result = {
                    ...inspection,
                    items: items.reduce((acc, item) => {
                        acc[item.itemId] = item.status;
                        return acc;
                    }, {}),
                    notes: items.reduce((acc, item) => {
                        if (item.notes) acc[item.itemId] = item.notes;
                        return acc;
                    }, {}),
                    photos: photos.reduce((acc, photo) => {
                        if (!acc[photo.itemId]) acc[photo.itemId] = [];
                        acc[photo.itemId].push(photo.photoData);
                        return acc;
                    }, {})
                };

                res.json(result);
            });
        });
    });
});

// POST: Create new inspection
app.post('/api/inspections', (req, res) => {
    const {
        tanggal,
        waktu,
        supplier,
        driver,
        nomorTruck,
        inspector,
        conclusion,
        overallNotes,
        items,
        notes,
        photos
    } = req.body;

    // Validasi
    if (!tanggal || !waktu || !supplier || !nomorTruck) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Insert inspection
        db.run(`
            INSERT INTO inspections (tanggal, waktu, supplier, driver, nomorTruck, inspector, conclusion, overallNotes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [tanggal, waktu, supplier, driver, nomorTruck, inspector, conclusion, overallNotes],
        function(err) {
            if (err) {
                console.error('Error inserting inspection:', err);
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Failed to create inspection' });
            }

            const inspectionId = this.lastID;

            // Insert items
            if (items) {
                const itemStmt = db.prepare('INSERT INTO inspection_items (inspectionId, itemId, status, notes) VALUES (?, ?, ?, ?)');
                
                for (const [itemId, status] of Object.entries(items)) {
                    const itemNotes = notes && notes[itemId] ? notes[itemId] : null;
                    itemStmt.run([inspectionId, itemId, status, itemNotes]);
                }
                
                itemStmt.finalize();
            }

            // Insert photos
            if (photos) {
                const photoStmt = db.prepare('INSERT INTO inspection_photos (inspectionId, itemId, photoData) VALUES (?, ?, ?)');
                
                for (const [itemId, photoArray] of Object.entries(photos)) {
                    photoArray.forEach(photoData => {
                        photoStmt.run([inspectionId, itemId, photoData]);
                    });
                }
                
                photoStmt.finalize();
            }

            db.run('COMMIT', (err) => {
                if (err) {
                    console.error('Error committing transaction:', err);
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Failed to save inspection' });
                }

                res.status(201).json({
                    message: 'Inspection created successfully',
                    id: inspectionId
                });
            });
        });
    });
});

// PUT: Update inspection
app.put('/api/inspections/:id', (req, res) => {
    const { id } = req.params;
    const {
        tanggal,
        waktu,
        supplier,
        driver,
        nomorTruck,
        inspector,
        conclusion,
        overallNotes,
        items,
        notes,
        photos
    } = req.body;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Update inspection
        db.run(`
            UPDATE inspections 
            SET tanggal = ?, waktu = ?, supplier = ?, driver = ?, 
                nomorTruck = ?, inspector = ?, conclusion = ?, 
                overallNotes = ?, updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [tanggal, waktu, supplier, driver, nomorTruck, inspector, conclusion, overallNotes, id],
        function(err) {
            if (err) {
                console.error('Error updating inspection:', err);
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Failed to update inspection' });
            }

            // Delete existing items and photos
            db.run('DELETE FROM inspection_items WHERE inspectionId = ?', [id]);
            db.run('DELETE FROM inspection_photos WHERE inspectionId = ?', [id]);

            // Re-insert items
            if (items) {
                const itemStmt = db.prepare('INSERT INTO inspection_items (inspectionId, itemId, status, notes) VALUES (?, ?, ?, ?)');
                
                for (const [itemId, status] of Object.entries(items)) {
                    const itemNotes = notes && notes[itemId] ? notes[itemId] : null;
                    itemStmt.run([id, itemId, status, itemNotes]);
                }
                
                itemStmt.finalize();
            }

            // Re-insert photos
            if (photos) {
                const photoStmt = db.prepare('INSERT INTO inspection_photos (inspectionId, itemId, photoData) VALUES (?, ?, ?)');
                
                for (const [itemId, photoArray] of Object.entries(photos)) {
                    photoArray.forEach(photoData => {
                        photoStmt.run([id, itemId, photoData]);
                    });
                }
                
                photoStmt.finalize();
            }

            db.run('COMMIT', (err) => {
                if (err) {
                    console.error('Error committing transaction:', err);
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Failed to update inspection' });
                }

                res.json({ message: 'Inspection updated successfully' });
            });
        });
    });
});

// DELETE: Delete inspection
app.delete('/api/inspections/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM inspections WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error deleting inspection:', err);
            return res.status(500).json({ error: 'Failed to delete inspection' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Inspection not found' });
        }

        res.json({ message: 'Inspection deleted successfully' });
    });
});

// GET: Statistics
app.get('/api/statistics', (req, res) => {
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT conclusion, COUNT(*) as count FROM inspections WHERE 1=1';
    let params = [];

    if (startDate) {
        query += ' AND tanggal >= ?';
        params.push(startDate);
    }
    if (endDate) {
        query += ' AND tanggal <= ?';
        params.push(endDate);
    }

    query += ' GROUP BY conclusion';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching statistics:', err);
            return res.status(500).json({ error: 'Failed to fetch statistics' });
        }

        const stats = {
            total: 0,
            approved: 0,
            conditional: 0,
            rejected: 0
        };

        rows.forEach(row => {
            stats.total += row.count;
            if (row.conclusion === 'approved') stats.approved = row.count;
            else if (row.conclusion === 'conditional') stats.conditional = row.count;
            else if (row.conclusion === 'rejected') stats.rejected = row.count;
        });

        res.json(stats);
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║  🚚 Truck Inspection System Server                ║
║  📡 Server running on http://localhost:${PORT}     ║
║  📊 Database: ${dbPath}                            ║
║  ✅ Ready to accept connections                   ║
╚═══════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});
