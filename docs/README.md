# Voice Whiteboard - Documentation Index

## 🚀 Quick Start for Telnyx Integration

**Start here:** 👉 [`TELNYX_MCP_TOOLS.json`](./TELNYX_MCP_TOOLS.json)

This file contains everything you need to add Voice Whiteboard to your Telnyx Voice AI.

## 📚 Documentation Files

### For Telnyx Integration
| File | Purpose | Use When |
|------|---------|----------|
| **[TELNYX_MCP_TOOLS.json](./TELNYX_MCP_TOOLS.json)** | ⭐ **Upload this to Telnyx** | Setting up MCP tools |
| **[TELNYX_SETUP.md](./TELNYX_SETUP.md)** | Setup guide | Configuring Telnyx integration |

### For Developers
| File | Purpose | Use When |
|------|---------|----------|
| **[MCP_TOOLS_UPDATED.md](./MCP_TOOLS_UPDATED.md)** | Autonomous tools guide with examples | Understanding autonomous operations |
| **[API.md](./API.md)** | Complete REST API reference | Building custom integrations |
| **[MCP_TOOLS.json](./MCP_TOOLS.json)** | Original MCP schemas | Reference (use TELNYX version instead) |
| **[README_VOICE_AI.md](./README_VOICE_AI.md)** | General Voice AI integration guide | Understanding the system |

### Project Overview
| File | Purpose |
|------|---------|
| **[../IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)** | Technical overview and design decisions |

## 🎯 What You Need to Know

### 1. For Setting Up Telnyx (2 minutes)
```bash
1. Open: docs/TELNYX_MCP_TOOLS.json
2. Update base_url to your deployed URL
3. Upload to Telnyx MCP configuration
4. Done! Start talking to your Voice AI
```

### 2. For Understanding How It Works (5 minutes)
```bash
Read: docs/TELNYX_SETUP.md
```

### 3. For Deep Dive (15 minutes)
```bash
Read: docs/MCP_TOOLS_UPDATED.md
Read: ../IMPLEMENTATION_SUMMARY.md
```

## 🛠️ Tool Quick Reference

### Core Tools (Use These)

1. **create_whiteboard_session**
   - Creates a new session
   - Example: `{name: "api-design"}`

2. **create_diagram** (AUTONOMOUS)
   - Creates complete diagram with auto-layout
   - Best for: Initial designs, architecture diagrams
   - Example:
     ```json
     {
       "session_id": "api-design",
       "nodes": [
         {"label": "API Gateway", "type": "rectangle"},
         {"label": "Database", "type": "ellipse"}
       ],
       "connections": [
         {"from": "API Gateway", "to": "Database"}
       ],
       "layout": "horizontal"
     }
     ```

3. **add_shapes** (AUTONOMOUS)
   - Adds individual shapes
   - Best for: Incremental additions
   - Example:
     ```json
     {
       "session_id": "api-design",
       "shapes": [{"label": "Redis Cache", "type": "ellipse"}]
     }
     ```

4. **add_arrows** (AUTONOMOUS)
   - Creates connections
   - Best for: Showing relationships, data flow
   - Example:
     ```json
     {
       "session_id": "api-design",
       "arrows": [{
         "startX": 250, "startY": 150,
         "endX": 400, "endY": 150,
         "label": "HTTP"
       }]
     }
     ```

5. **get_canvas_snapshot**
   - Gets AI-friendly description
   - Best for: Understanding current state
   - Example: `{session_id: "api-design"}`

## 🎨 Shape Types

| Type | When to Use | Example |
|------|-------------|---------|
| `rectangle` | Services, components, APIs | "API Gateway", "User Service" |
| `ellipse` | Databases, storage, caches | "PostgreSQL", "Redis", "S3" |
| `diamond` | Decisions, gateways, branching | "Auth Check", "Load Balancer" |

## 📐 Layout Types

| Layout | Flow | Best For |
|--------|------|----------|
| `horizontal` | Left → Right | Data flows, pipelines, sequences |
| `vertical` | Top → Bottom | Hierarchies, processes, dependencies |
| `grid` | Evenly spaced | Brainstorming, feature lists, components |

## 🎨 Color Palette (Optional)

Semantic colors for better visuals:

```javascript
{
  "frontend": "#e3f2fd",    // Light blue
  "backend": "#fff3e0",     // Light orange
  "database": "#f3e5f5",    // Light purple
  "external": "#e8f5e9",    // Light green
  "cache": "#ffebee"        // Light red
}
```

## 💡 Usage Patterns

### Pattern 1: Architecture Design
```
User: "Design a microservices architecture"
AI: create_diagram with Gateway, Services, DBs
User: "Add caching"
AI: add_shapes (Redis) + add_arrows
```

### Pattern 2: Iterative Brainstorming
```
User: "Let's brainstorm app features"
AI: create_diagram with features in grid layout
User: "Which ones are MVP?"
AI: get_snapshot, then adds arrows showing priorities
```

### Pattern 3: Process Mapping
```
User: "Map our deployment process"
AI: create_diagram with vertical flow
User: "Add error handling"
AI: add_shapes (error nodes) + add_arrows (failure paths)
```

## 🔗 Useful Links

- **Canvas URL**: `http://localhost:3000/canvas/{sessionId}`
- **API Base**: `http://localhost:3000/api`
- **Create Session**: `POST /api/sessions`
- **Canvas Page**: `http://localhost:3000`

## 🎯 Next Steps

1. ✅ Read this file (you're here!)
2. ⬜ Open [`TELNYX_MCP_TOOLS.json`](./TELNYX_MCP_TOOLS.json)
3. ⬜ Update `base_url` to your deployment
4. ⬜ Upload to Telnyx MCP
5. ⬜ Read [`TELNYX_SETUP.md`](./TELNYX_SETUP.md) for details
6. ⬜ Start talking to your Voice AI!

---

**Built with ❤️ for Voice AI collaboration**
