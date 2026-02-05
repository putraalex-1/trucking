const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'inspections.db');
const schemaPath = path.join(__dirname, 'database_schema.sql');

// Pastikan folder database ada
if (!fs.existsSync(path.join(__dirname, 'database'))) {
    fs.mkdirSync(path.join(__dirname, 'database'));
    console.log('✅ Folder database dibuat');
}

// Baca schema SQL
const schema = fs.readFileSync(schemaPath, 'utf8');

// Buat atau buka database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err);
        process.exit(1);
    }
    console.log('✅ Database connection established');
});

// Execute schema
db.exec(schema, (err) => {
    if (err) {
        console.error('❌ Error executing schema:', err);
        db.close();
        process.exit(1);
    }
    
    console.log('✅ Database schema created successfully');
    console.log('✅ Sample data inserted');
    
    // Verify data
    db.get('SELECT COUNT(*) as count FROM inspections', (err, row) => {
        if (err) {
            console.error('❌ Error counting inspections:', err);
        } else {
            console.log(`📊 Total inspections: ${row.count}`);
        }
        
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err);
            } else {
                console.log('✅ Database closed');
                console.log('\n🎉 Setup complete! You can now run: npm start');
            }
        });
    });
});
