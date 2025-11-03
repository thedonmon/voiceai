# Voice Whiteboard API Documentation

This document describes the REST API endpoints for the Voice Whiteboard application, designed for integration with Voice AI systems.

## Base URL

```
http://localhost:3000/api
```

---

## Endpoints

### 1. Create Session

**POST** `/sessions`

Creates a new whiteboard session.

**Request Body:**
```json
{
  "name": "my-session-name"  // Optional: Unique session identifier
}
```

**Response (201):**
```json
{
  "id": "uuid-here",
  "name": "my-session-name",
  "url": "/canvas/uuid-here",
  "createdAt": "2025-10-29T12:00:00.000Z"
}
```

**Errors:**
- `409 Conflict`: Session with this name already exists
- `500 Internal Server Error`: Failed to create session

---

### 2. List Sessions

**GET** `/sessions`

Retrieves the 20 most recently updated sessions.

**Response (200):**
```json
[
  {
    "id": "uuid-here",
    "name": "my-session",
    "canvasState": [...],
    "createdAt": "2025-10-29T12:00:00.000Z",
    "updatedAt": "2025-10-29T12:30:00.000Z"
  }
]
```

---

### 3. Get Session

**GET** `/sessions/{sessionId}`

Retrieves a specific session by ID or name.

**Path Parameters:**
- `sessionId`: Session UUID or session name

**Response (200):**
```json
{
  "id": "uuid-here",
  "name": "my-session",
  "canvasState": [...],
  "createdAt": "2025-10-29T12:00:00.000Z",
  "updatedAt": "2025-10-29T12:30:00.000Z"
}
```

**Errors:**
- `404 Not Found`: Session not found

---

### 4. Get Canvas Elements

**GET** `/sessions/{sessionId}/elements`

Retrieves all elements on the canvas.

**Response (200):**
```json
{
  "elements": [
    {
      "id": "element-id",
      "type": "rectangle",
      "x": 100,
      "y": 200,
      "width": 150,
      "height": 100,
      "text": "API Gateway",
      "backgroundColor": "#ffffff",
      "strokeColor": "#000000"
    }
  ],
  "sessionId": "uuid-here",
  "sessionName": "my-session"
}
```

---

### 5. Add/Update Elements

**POST** `/sessions/{sessionId}/elements`

Adds new elements or updates existing ones (merge operation).

**Request Body:**
```json
{
  "elements": [
    {
      "id": "unique-element-id",
      "type": "rectangle",
      "x": 100,
      "y": 200,
      "width": 150,
      "height": 100,
      "text": "Database",
      "backgroundColor": "#e3f2fd",
      "strokeColor": "#1976d2"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "elements": [...]
}
```

---

### 6. Replace All Elements

**PUT** `/sessions/{sessionId}/elements`

Replaces the entire canvas with new elements.

**Request Body:**
```json
{
  "elements": [...]
}
```

**Response (200):**
```json
{
  "success": true,
  "elements": [...]
}
```

---

### 7. Get Canvas Snapshot (AI-Friendly)

**GET** `/sessions/{sessionId}/snapshot`

Returns an AI-friendly text description of the canvas state.

**Response (200):**
```json
{
  "sessionId": "uuid-here",
  "sessionName": "my-session",
  "description": "Canvas contains 5 element(s):\n\nShapes (3):\n- Rectangle labeled \"API Gateway\" at (100, 200)\n- Rectangle labeled \"Database\" at (300, 200)\n- Ellipse labeled \"Cache\" at (500, 200)\n\nConnections (2):\n- Arrow from (200, 250) to (300, 250)\n- Arrow from (450, 250) to (500, 250)",
  "elementCount": 5,
  "elements": [...]
}
```

---

## Common Workflows

### Workflow 1: AI Adds a Shape

1. **AI**: Calls `GET /sessions/{sessionId}/snapshot` to understand current state
2. **AI**: Determines where to place new element
3. **AI**: Calls `POST /sessions/{sessionId}/elements` with new rectangle/shape
4. **User**: Sees the element appear on their canvas

### Workflow 2: AI Creates Architecture Diagram

1. **User**: "Create an architecture diagram with API, Database, and Cache"
2. **AI**: Calls `POST /sessions/{sessionId}/elements` with:
   - Rectangle for "API Gateway"
   - Rectangle for "Database"
   - Ellipse for "Cache"
   - Arrows connecting them
3. **User**: Sees complete diagram rendered

### Workflow 3: AI Reads and Responds

1. **User**: Draws elements manually
2. **User**: "What's on the canvas?"
3. **AI**: Calls `GET /sessions/{sessionId}/snapshot`
4. **AI**: Responds: "I see three components: API Gateway, Database, and Cache, connected by arrows..."

---

## Excalidraw Element Schema

Elements follow the Excalidraw format. Key fields:

```typescript
{
  id: string;              // Unique identifier
  type: 'rectangle' | 'ellipse' | 'diamond' | 'arrow' | 'line' | 'text';
  x: number;               // X coordinate
  y: number;               // Y coordinate
  width: number;           // Width
  height: number;          // Height
  text?: string;           // Optional text label
  backgroundColor?: string; // Hex color
  strokeColor?: string;     // Hex color
  strokeWidth?: number;     // Line thickness
}
```

For arrows:
```typescript
{
  id: string;
  type: 'arrow';
  x: number;
  y: number;
  width: number;
  height: number;
  startBinding?: {
    elementId: string;     // ID of connected element
    focus: number;
    gap: number;
  };
  endBinding?: {
    elementId: string;
    focus: number;
    gap: number;
  };
}
```

---

## Best Practices

1. **Always use unique IDs**: Generate UUIDs for new elements
2. **Check snapshot first**: Call `/snapshot` before adding elements to understand context
3. **Use semantic names**: Label elements with clear, descriptive text
4. **Merge, don't replace**: Use `POST` to add elements, not `PUT` (unless clearing)
5. **Handle errors**: Check for 404s (session not found) and 409s (name conflicts)
