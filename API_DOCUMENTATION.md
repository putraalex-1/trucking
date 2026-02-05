# 📡 API Documentation - Truck Inspection System

Base URL: `http://localhost:3000/api`

## 📋 Table of Contents
- [Authentication](#authentication)
- [Inspections](#inspections)
- [Statistics](#statistics)
- [Error Handling](#error-handling)

---

## 🔐 Authentication

Saat ini API tidak memerlukan authentication. Untuk production, disarankan menambahkan:
- JWT Token
- API Keys
- OAuth 2.0

---

## 🚚 Inspections

### 1. Get All Inspections

Mengambil semua data inspeksi dengan optional filtering.

**Endpoint:**
```
GET /api/inspections
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | String | No | Filter mulai tanggal (YYYY-MM-DD) |
| endDate | String | No | Filter sampai tanggal (YYYY-MM-DD) |
| supplier | String | No | Filter berdasarkan nama supplier |
| nomorTruck | String | No | Filter berdasarkan nomor truck |

**Example Request:**
```bash
# Get all inspections
curl http://localhost:3000/api/inspections

# Filter by date range
curl "http://localhost:3000/api/inspections?startDate=2024-01-01&endDate=2024-12-31"

# Filter by supplier
curl "http://localhost:3000/api/inspections?supplier=PT%20ABC"

# Combine filters
curl "http://localhost:3000/api/inspections?startDate=2024-02-01&supplier=PT%20ABC"
```

**Example Response:**
```json
[
  {
    "id": 1,
    "tanggal": "2024-02-05",
    "waktu": "08:30",
    "supplier": "PT Maju Jaya",
    "driver": "Budi Santoso",
    "nomorTruck": "B 1234 ABC",
    "inspector": "John Doe",
    "conclusion": "approved",
    "overallNotes": "Semua kondisi baik",
    "createdAt": "2024-02-05 08:35:00",
    "updatedAt": "2024-02-05 08:35:00"
  },
  {
    "id": 2,
    "tanggal": "2024-02-05",
    "waktu": "10:15",
    "supplier": "PT Sukses Makmur",
    "driver": "Agus Wijaya",
    "nomorTruck": "D 5678 XYZ",
    "inspector": "Jane Smith",
    "conclusion": "conditional",
    "overallNotes": "Beberapa item perlu perbaikan",
    "createdAt": "2024-02-05 10:20:00",
    "updatedAt": "2024-02-05 10:20:00"
  }
]
```

---

### 2. Get Single Inspection

Mengambil detail lengkap satu inspeksi termasuk items dan photos.

**Endpoint:**
```
GET /api/inspections/:id
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Integer | Yes | ID inspeksi |

**Example Request:**
```bash
curl http://localhost:3000/api/inspections/1
```

**Example Response:**
```json
{
  "id": 1,
  "tanggal": "2024-02-05",
  "waktu": "08:30",
  "supplier": "PT Maju Jaya",
  "driver": "Budi Santoso",
  "nomorTruck": "B 1234 ABC",
  "inspector": "John Doe",
  "conclusion": "approved",
  "overallNotes": "Semua kondisi baik",
  "createdAt": "2024-02-05 08:35:00",
  "updatedAt": "2024-02-05 08:35:00",
  "items": {
    "1": "ok",
    "2": "ok",
    "3": "not-ok",
    "4": "ok"
  },
  "notes": {
    "3": "Ban perlu diganti"
  },
  "photos": {
    "3": [
      "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    ]
  }
}
```

---

### 3. Create Inspection

Membuat inspeksi baru.

**Endpoint:**
```
POST /api/inspections
```

**Request Body:**
```json
{
  "tanggal": "2024-02-05",
  "waktu": "15:30",
  "supplier": "PT ABC",
  "driver": "John Doe",
  "nomorTruck": "B 1234 XYZ",
  "inspector": "Jane Smith",
  "conclusion": "approved",
  "overallNotes": "Semua kondisi baik",
  "items": {
    "1": "ok",
    "2": "ok",
    "3": "not-ok",
    "4": "ok",
    "5": "na"
  },
  "notes": {
    "3": "Ban perlu diganti sebelum trip berikutnya"
  },
  "photos": {
    "3": [
      "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    ]
  }
}
```

**Required Fields:**
- `tanggal` (String, format: YYYY-MM-DD)
- `waktu` (String, format: HH:MM)
- `supplier` (String)
- `nomorTruck` (String)

**Optional Fields:**
- `driver` (String)
- `inspector` (String)
- `conclusion` (String: "approved", "conditional", "rejected")
- `overallNotes` (String)
- `items` (Object: itemId -> status)
- `notes` (Object: itemId -> note)
- `photos` (Object: itemId -> array of base64 images)

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/inspections \
  -H "Content-Type: application/json" \
  -d '{
    "tanggal": "2024-02-05",
    "waktu": "15:30",
    "supplier": "PT ABC",
    "driver": "John Doe",
    "nomorTruck": "B 1234 XYZ",
    "inspector": "Jane Smith",
    "conclusion": "approved",
    "overallNotes": "Semua kondisi baik",
    "items": {
      "1": "ok",
      "2": "ok"
    }
  }'
```

**Success Response:**
```json
{
  "message": "Inspection created successfully",
  "id": 5
}
```

**Error Response (400):**
```json
{
  "error": "Missing required fields"
}
```

---

### 4. Update Inspection

Update inspeksi yang sudah ada.

**Endpoint:**
```
PUT /api/inspections/:id
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Integer | Yes | ID inspeksi yang akan diupdate |

**Request Body:**
Same as Create Inspection

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/inspections/1 \
  -H "Content-Type: application/json" \
  -d '{
    "tanggal": "2024-02-05",
    "waktu": "15:30",
    "supplier": "PT ABC Updated",
    "driver": "John Doe",
    "nomorTruck": "B 1234 XYZ",
    "inspector": "Jane Smith",
    "conclusion": "conditional",
    "overallNotes": "Updated notes",
    "items": {
      "1": "ok",
      "2": "not-ok"
    },
    "notes": {
      "2": "Perlu perbaikan"
    }
  }'
```

**Success Response:**
```json
{
  "message": "Inspection updated successfully"
}
```

---

### 5. Delete Inspection

Hapus inspeksi (termasuk items dan photos).

**Endpoint:**
```
DELETE /api/inspections/:id
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Integer | Yes | ID inspeksi yang akan dihapus |

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/inspections/1
```

**Success Response:**
```json
{
  "message": "Inspection deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Inspection not found"
}
```

---

## 📊 Statistics

### Get Statistics

Mendapatkan statistik inspeksi.

**Endpoint:**
```
GET /api/statistics
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | String | No | Filter mulai tanggal (YYYY-MM-DD) |
| endDate | String | No | Filter sampai tanggal (YYYY-MM-DD) |

**Example Request:**
```bash
# All time statistics
curl http://localhost:3000/api/statistics

# Statistics for date range
curl "http://localhost:3000/api/statistics?startDate=2024-01-01&endDate=2024-12-31"
```

**Example Response:**
```json
{
  "total": 150,
  "approved": 120,
  "conditional": 25,
  "rejected": 5
}
```

---

## ❌ Error Handling

### Error Response Format

Semua error akan mengembalikan JSON dengan format:
```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

### Common Errors

**Missing Required Fields:**
```json
{
  "error": "Missing required fields"
}
```

**Resource Not Found:**
```json
{
  "error": "Inspection not found"
}
```

**Database Error:**
```json
{
  "error": "Failed to create inspection"
}
```

---

## 🔧 Rate Limiting

Saat ini tidak ada rate limiting. Untuk production, disarankan menambahkan:
- Request limit per IP
- Request limit per user/API key
- Throttling untuk heavy operations

---

## 📝 Notes

1. **Photo Storage:**
   - Photos disimpan sebagai base64 strings
   - Recommended max size per photo: 5MB
   - Server limit payload: 50MB

2. **Date Format:**
   - Gunakan format ISO: YYYY-MM-DD untuk tanggal
   - Gunakan format HH:MM (24-hour) untuk waktu

3. **Cascade Delete:**
   - Menghapus inspection akan otomatis menghapus semua items dan photos terkait

4. **Indexing:**
   - Database sudah diindex untuk tanggal, supplier, dan nomorTruck
   - Query dengan filter akan lebih cepat

---

## 🧪 Testing

Gunakan test script untuk verify semua endpoints:
```bash
npm test
```

Atau manual testing dengan tools:
- cURL (command line)
- Postman (GUI)
- Insomnia (GUI)

---

## 📞 Support

Untuk pertanyaan atau issue:
- Email: support@wjf.com
- GitHub Issues: [link]
