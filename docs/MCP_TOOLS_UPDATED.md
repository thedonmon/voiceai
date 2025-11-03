# Voice Whiteboard MCP Tools - Autonomous Operations

These tools allow Voice AI to autonomously create diagrams and collaborate on the whiteboard.

## Quick Start Example

```javascript
// 1. Create a session
create_whiteboard_session({ name: "microservices-architecture" })

// 2. Create a complete diagram in one shot
create_diagram({
  session_id: "microservices-architecture",
  nodes: [
    { label: "API Gateway", type: "rectangle" },
    { label: "User Service", type: "rectangle" },
    { label: "Payment Service", type: "rectangle" },
    { label: "Database", type: "ellipse" }
  ],
  connections: [
    { from: "API Gateway", to: "User Service" },
    { from: "API Gateway", to: "Payment Service" },
    { from: "User Service", to: "Database" },
    { from: "Payment Service", to: "Database" }
  ],
  layout: "horizontal"
})

// 3. Get a description of what's on the canvas
get_canvas_snapshot({ session_id: "microservices-architecture" })
```

## Core Tools

### 1. create_whiteboard_session
Creates a new session.

**Request:**
```http
POST /api/sessions
Content-Type: application/json

{
  "name": "my-session"  // optional
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "my-session",
  "url": "/canvas/uuid"
}
```

---

### 2. create_diagram (AUTONOMOUS)
Creates complete diagrams with auto-layout in one operation.

**Request:**
```http
POST /api/sessions/{sessionId}/diagram
Content-Type: application/json

{
  "nodes": [
    {
      "label": "Frontend",
      "type": "rectangle",      // optional: rectangle | ellipse | diamond
      "color": "#e3f2fd"       // optional: hex color
    },
    {
      "label": "Backend API",
      "type": "rectangle"
    },
    {
      "label": "Database",
      "type": "ellipse",
      "color": "#fff3e0"
    }
  ],
  "connections": [
    {
      "from": "Frontend",
      "to": "Backend API",
      "label": "HTTP"           // optional
    },
    {
      "from": "Backend API",
      "to": "Database",
      "label": "SQL"
    }
  ],
  "layout": "horizontal"        // optional: horizontal | vertical | grid
}
```

**Use Cases:**
- Architecture diagrams
- Flowcharts
- Mind maps
- Process flows
- System designs

**Example Conversation:**
```
User: "Let's design a microservices architecture"
AI: [calls create_diagram with nodes: API Gateway, Auth Service, User Service, Data Service]
User: "Add caching between API Gateway and services"
AI: [calls add_shapes to add Redis node, then add_arrows to connect]
```

---

### 3. add_shapes (AUTONOMOUS)
Adds individual shapes with smart defaults.

**Request:**
```http
POST /api/sessions/{sessionId}/shapes
Content-Type: application/json

{
  "shapes": [
    {
      "label": "Load Balancer",
      "type": "diamond",
      "x": 400,                 // optional, defaults to 100
      "y": 150,                 // optional, defaults to 100
      "width": 150,             // optional, defaults to 150
      "height": 100,            // optional, defaults to 100
      "backgroundColor": "#ffebee",  // optional
      "strokeColor": "#c62828"       // optional
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "shapes": [...],
  "message": "Created 1 shape(s)"
}
```

---

### 4. add_arrows (AUTONOMOUS)
Creates arrows/connections between elements.

**Request:**
```http
POST /api/sessions/{sessionId}/arrows
Content-Type: application/json

{
  "arrows": [
    {
      "startX": 250,
      "startY": 150,
      "endX": 400,
      "endY": 150,
      "startElementId": "abc123",  // optional: binds to element
      "endElementId": "def456",    // optional: binds to element
      "label": "Data Flow",        // optional
      "strokeColor": "#1976d2"     // optional
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "arrows": [...],
  "message": "Created 1 arrow(s)"
}
```

---

### 5. get_canvas_snapshot
Gets AI-friendly description of the canvas.

**Request:**
```http
GET /api/sessions/{sessionId}/snapshot
```

**Response:**
```json
{
  "sessionId": "uuid",
  "sessionName": "my-session",
  "description": "Canvas contains 4 element(s):\n\nShapes (3):\n- Rectangle labeled \"API Gateway\" at (100, 200)\n- Rectangle labeled \"User Service\" at (350, 200)\n- Ellipse labeled \"Database\" at (600, 200)\n\nConnections (1):\n- Arrow from (250, 250) to (350, 250)",
  "elementCount": 4,
  "elements": [...]
}
```

---

## Autonomous Workflow Examples

### Example 1: Creating Architecture Diagram
```
User: "Design a three-tier web application"

AI calls create_diagram:
{
  "session_id": "web-app",
  "nodes": [
    { "label": "Web Browser", "type": "rectangle" },
    { "label": "Application Server", "type": "rectangle" },
    { "label": "Database", "type": "ellipse" }
  ],
  "connections": [
    { "from": "Web Browser", "to": "Application Server", "label": "HTTPS" },
    { "from": "Application Server", "to": "Database", "label": "SQL" }
  ],
  "layout": "vertical"
}

User: "Add a cache layer"

AI calls add_shapes:
{
  "session_id": "web-app",
  "shapes": [
    { "label": "Redis Cache", "type": "ellipse", "x": 250, "y": 300, "backgroundColor": "#ffebee" }
  ]
}

Then add_arrows to connect it.
```

### Example 2: Brainstorming Features
```
User: "Let's brainstorm features for our mobile app"

AI calls create_diagram:
{
  "session_id": "app-features",
  "nodes": [
    { "label": "User Auth", "type": "rectangle" },
    { "label": "Social Sharing", "type": "rectangle" },
    { "label": "Push Notifications", "type": "rectangle" },
    { "label": "Offline Mode", "type": "rectangle" }
  ],
  "layout": "grid"
}

User: "Which features depend on each other?"

AI calls get_canvas_snapshot, analyzes, then add_arrows to show dependencies.
```

### Example 3: Process Flow
```
User: "Map out our deployment process"

AI calls create_diagram:
{
  "session_id": "deployment",
  "nodes": [
    { "label": "Code Push", "type": "rectangle" },
    { "label": "CI Pipeline", "type": "rectangle" },
    { "label": "Tests Pass?", "type": "diamond" },
    { "label": "Deploy Staging", "type": "rectangle" },
    { "label": "Deploy Prod", "type": "rectangle" }
  ],
  "connections": [
    { "from": "Code Push", "to": "CI Pipeline" },
    { "from": "CI Pipeline", "to": "Tests Pass?" },
    { "from": "Tests Pass?", "to": "Deploy Staging", "label": "Yes" },
    { "from": "Deploy Staging", "to": "Deploy Prod" }
  ],
  "layout": "vertical"
}
```

---

## Best Practices for Autonomous Operation

1. **Start with create_diagram** for initial layouts
2. **Use add_shapes** for incremental additions
3. **Call get_canvas_snapshot** before modifying to understand current state
4. **Use meaningful labels** that describe the component/concept
5. **Choose appropriate shapes**:
   - Rectangles: Services, components, processes
   - Ellipses: Databases, data stores, external systems
   - Diamonds: Decision points, gateways, branching logic

6. **Layout options**:
   - `horizontal`: Left-to-right flow (data flow, pipelines)
   - `vertical`: Top-to-bottom flow (hierarchies, processes)
   - `grid`: Evenly spaced (brainstorming, feature lists)

7. **Color coding** (optional but helpful):
   - `#e3f2fd`: Frontend/UI components (light blue)
   - `#fff3e0`: Backend services (light orange)
   - `#f3e5f5`: Databases/storage (light purple)
   - `#e8f5e9`: External systems (light green)

---

## API Endpoint Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/sessions` | POST | Create session |
| `/api/sessions/{id}/diagram` | POST | Create complete diagram (autonomous) |
| `/api/sessions/{id}/shapes` | POST | Add individual shapes (autonomous) |
| `/api/sessions/{id}/arrows` | POST | Add connections (autonomous) |
| `/api/sessions/{id}/snapshot` | GET | Get AI-friendly description |
| `/api/sessions/{id}/elements` | GET | Get raw elements |
| `/api/sessions/{id}/elements` | POST | Add/update raw elements (advanced) |
| `/api/sessions/{id}/elements` | PUT | Replace all elements |

**Recommendation:** Use the autonomous endpoints (`diagram`, `shapes`, `arrows`) for 90% of Voice AI operations. These handle all the complexity of Excalidraw element creation.
