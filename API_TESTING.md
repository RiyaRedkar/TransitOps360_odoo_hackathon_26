# API Testing Guide

## Using cURL

### 1. Health Check
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{"status":"healthy"}
```

---

### 2. Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "admin",
    "email": "admin@transit.com",
    "first_name": "Admin",
    "last_name": "User",
    "is_active": true,
    "role": "fleet_manager",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Save token for next requests:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. Get Current User

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/auth/me
```

---

### 4. List Vehicles

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/vehicles?limit=10"
```

**Query Parameters:**
- `status`: Filter by status (available, on_trip, maintenance, retired)
- `search`: Search in plate, make, model, VIN
- `skip`: Pagination offset (default: 0)
- `limit`: Page size (default: 100, max: 1000)

---

### 5. Get Vehicle Details

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/vehicles/550e8400-e29b-41d4-a716-446655440000
```

---

### 6. Create Vehicle

```bash
curl -X POST http://localhost:8000/api/v1/vehicles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plate": "MH12AB1234",
    "make": "Tata",
    "model": "Ace",
    "year": 2023,
    "vin": "WBAHE5147GE123456",
    "fuel_type": "diesel",
    "capacity": 1000
  }'
```

---

### 7. Update Vehicle

```bash
curl -X PUT http://localhost:8000/api/v1/vehicles/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fuel_level": 75,
    "current_mileage": 5000
  }'
```

---

### 8. Update Vehicle Status

```bash
curl -X PATCH http://localhost:8000/api/v1/vehicles/550e8400-e29b-41d4-a716-446655440000/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "maintenance"
  }'
```

**Valid statuses:**
- available
- on_trip
- maintenance
- retired

---

### 9. Delete Vehicle

```bash
curl -X DELETE http://localhost:8000/api/v1/vehicles/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 10. List Drivers

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/drivers?status=active&limit=10"
```

---

### 11. Create Driver

```bash
curl -X POST http://localhost:8000/api/v1/drivers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "license_number": "DL123456789",
    "license_expiry": "2025-12-31",
    "experience_years": 5
  }'
```

---

### 12. List Trips

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/trips?status=in_progress"
```

---

### 13. Create Trip

```bash
curl -X POST http://localhost:8000/api/v1/trips \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "550e8400-e29b-41d4-a716-446655440000",
    "driver_id": "550e8400-e29b-41d4-a716-446655440001",
    "origin": "Mumbai",
    "destination": "Pune"
  }'
```

---

### 14. Update Trip Status

```bash
curl -X PATCH http://localhost:8000/api/v1/trips/550e8400-e29b-41d4-a716-446655440002/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

**Valid statuses:**
- pending
- in_progress
- completed
- cancelled

---

## Using Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Paste the JSON below
4. Create environment variable for `base_url`: `http://localhost:8000`
5. Create environment variable for `token`: (leave empty, will be set after login)

### Postman Collection JSON

```json
{
  "info": {
    "name": "TransitOps360 API",
    "description": "Fleet Management API Collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "  var jsonData = pm.response.json();",
                  "  pm.environment.set('token', jsonData.access_token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"username\": \"admin\", \"password\": \"admin123\"}"
            },
            "url": {
              "raw": "{{base_url}}/api/v1/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "auth", "login"]
            }
          }
        },
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/auth/me",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "auth", "me"]
            }
          }
        },
        {
          "name": "Refresh Token",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/auth/refresh",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "auth", "refresh"]
            }
          }
        }
      ]
    },
    {
      "name": "Vehicles",
      "item": [
        {
          "name": "List Vehicles",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/vehicles?limit=10",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "vehicles"],
              "query": [
                {"key": "limit", "value": "10"},
                {"key": "status", "value": "available", "disabled": true}
              ]
            }
          }
        },
        {
          "name": "Get Available Vehicles",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/vehicles/available",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "vehicles", "available"]
            }
          }
        },
        {
          "name": "Get Vehicle",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/vehicles/550e8400-e29b-41d4-a716-446655440000",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "vehicles", "550e8400-e29b-41d4-a716-446655440000"]
            }
          }
        },
        {
          "name": "Create Vehicle",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"plate\": \"MH12AB1234\", \"make\": \"Tata\", \"model\": \"Ace\", \"year\": 2023, \"vin\": \"VIN123456\", \"fuel_type\": \"diesel\", \"capacity\": 1000}"
            },
            "url": {
              "raw": "{{base_url}}/api/v1/vehicles",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "vehicles"]
            }
          }
        },
        {
          "name": "Update Vehicle",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"fuel_level\": 75}"
            },
            "url": {
              "raw": "{{base_url}}/api/v1/vehicles/550e8400-e29b-41d4-a716-446655440000",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "vehicles", "550e8400-e29b-41d4-a716-446655440000"]
            }
          }
        },
        {
          "name": "Update Vehicle Status",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"status\": \"maintenance\"}"
            },
            "url": {
              "raw": "{{base_url}}/api/v1/vehicles/550e8400-e29b-41d4-a716-446655440000/status",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "vehicles", "550e8400-e29b-41d4-a716-446655440000", "status"]
            }
          }
        },
        {
          "name": "Delete Vehicle",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/vehicles/550e8400-e29b-41d4-a716-446655440000",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "vehicles", "550e8400-e29b-41d4-a716-446655440000"]
            }
          }
        }
      ]
    },
    {
      "name": "Drivers",
      "item": [
        {
          "name": "List Drivers",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/drivers?limit=10",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "drivers"],
              "query": [{"key": "limit", "value": "10"}]
            }
          }
        },
        {
          "name": "Create Driver",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"first_name\": \"John\", \"last_name\": \"Doe\", \"email\": \"john@example.com\", \"phone\": \"+91 98765 43210\", \"license_number\": \"DL123456\", \"license_expiry\": \"2025-12-31\", \"experience_years\": 5}"
            },
            "url": {
              "raw": "{{base_url}}/api/v1/drivers",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "drivers"]
            }
          }
        }
      ]
    },
    {
      "name": "Trips",
      "item": [
        {
          "name": "List Trips",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/trips?limit=10",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "trips"],
              "query": [{"key": "limit", "value": "10"}]
            }
          }
        },
        {
          "name": "Create Trip",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"vehicle_id\": \"550e8400-e29b-41d4-a716-446655440000\", \"driver_id\": \"550e8400-e29b-41d4-a716-446655440001\", \"origin\": \"Mumbai\", \"destination\": \"Pune\"}"
            },
            "url": {
              "raw": "{{base_url}}/api/v1/trips",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "trips"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Python Requests

```python
import requests

BASE_URL = "http://localhost:8000"
API_V1 = f"{BASE_URL}/api/v1"

# Login
response = requests.post(f"{API_V1}/auth/login", json={
    "username": "admin",
    "password": "admin123"
})
token = response.json()["access_token"]

headers = {"Authorization": f"Bearer {token}"}

# Get vehicles
response = requests.get(f"{API_V1}/vehicles", headers=headers, params={"limit": 10})
vehicles = response.json()
print(f"Vehicles: {len(vehicles)} found")

# Create vehicle
response = requests.post(f"{API_V1}/vehicles", headers=headers, json={
    "plate": "MH12AB1234",
    "make": "Tata",
    "model": "Ace",
    "year": 2023,
    "vin": "VIN123456",
    "fuel_type": "diesel",
    "capacity": 1000
})
new_vehicle = response.json()
print(f"Created vehicle: {new_vehicle['plate']}")

# Get drivers
response = requests.get(f"{API_V1}/drivers", headers=headers)
drivers = response.json()
print(f"Drivers: {len(drivers)} found")

# Create trip
vehicle_id = new_vehicle["id"]
driver_id = drivers[0]["id"] if drivers else None

if driver_id:
    response = requests.post(f"{API_V1}/trips", headers=headers, json={
        "vehicle_id": vehicle_id,
        "driver_id": driver_id,
        "origin": "Mumbai",
        "destination": "Pune"
    })
    trip = response.json()
    print(f"Created trip: {trip['id']}")
```

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 204 | No Content - Success with no response body |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Server Error |

---

## Error Response Format

```json
{
  "detail": "Error message explaining what went wrong"
}
```

---

## Testing Workflow

1. **Health Check**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Login**
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```
   → Save `access_token`

3. **Test Protected Endpoints**
   ```bash
   curl -H "Authorization: Bearer {token}" \
     http://localhost:8000/api/v1/vehicles
   ```

4. **Create Resources**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{...}' \
     http://localhost:8000/api/v1/{resource}
   ```

5. **Update Resources**
   ```bash
   curl -X PUT/PATCH \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{...}' \
     http://localhost:8000/api/v1/{resource}/{id}
   ```

6. **Delete Resources**
   ```bash
   curl -X DELETE \
     -H "Authorization: Bearer {token}" \
     http://localhost:8000/api/v1/{resource}/{id}
   ```

---

## Success!

All endpoints are ready for testing. Integrate with frontend pages as needed.
