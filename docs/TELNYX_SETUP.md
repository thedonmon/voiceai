# Telnyx Voice AI MCP Integration Guide

## 📦 What You Need

The complete MCP tool definitions are in:
```
docs/TELNYX_MCP_TOOLS.json
```

This file contains:
- ✅ All 7 autonomous tools
- ✅ Complete JSON schemas
- ✅ HTTP methods and endpoints
- ✅ Usage examples
- ✅ Best practices
- ✅ Color suggestions

## 🚀 Quick Setup

### Step 1: Deploy Your API

```bash
# Make sure your app is running
cd /Users/don/SourceCode/personal/voice-whiteboard
npm run dev

# Or deploy to Vercel:
vercel --prod
```

### Step 2: Update base_url in TELNYX_MCP_TOOLS.json

```json
{
  "base_url": "https://your-app.vercel.app/api",  // Change this
  ...
}
```

For local testing:
```json
{
  "base_url": "http://localhost:3000/api",
  ...
}
```

### Step 3: Add to Telnyx MCP

Upload or configure `TELNYX_MCP_TOOLS.json` in your Telnyx Voice AI MCP settings.

The exact process depends on Telnyx's interface, but typically:
1. Go to your Telnyx Voice AI dashboard
2. Navigate to MCP/Tools configuration
3. Import the JSON file or paste its contents
4. Save and enable the tools

## 🎯 Tools Summary

| Tool | When to Use | Example |
|------|-------------|---------|
| **create_whiteboard_session** | Start of conversation | "Let's design an API" |
| **create_diagram** | Initial layout | "I need Gateway, Service, DB" |
| **add_shapes** | Add more components | "Add a cache layer" |
| **add_arrows** | Show connections | "Connect them" |
| **get_canvas_snapshot** | Understand canvas | "What's on the canvas?" |
| **get_canvas_elements** | Advanced (rarely used) | Raw element access |
| **clear_canvas** | Start over | "Clear everything" |

## 💬 Example Conversation Flow

```
User: "Let's design a new API"

AI calls: create_whiteboard_session({name: "api-design"})
AI says: "I've created a whiteboard session called 'api-design'. What components should we include?"

---

User: "I need an API Gateway, Auth Service, and User Service"

AI calls: create_diagram({
  session_id: "api-design",
  nodes: [
    {label: "API Gateway", type: "rectangle"},
    {label: "Auth Service", type: "rectangle"},
    {label: "User Service", type: "rectangle"}
  ],
  connections: [
    {from: "API Gateway", to: "Auth Service"},
    {from: "API Gateway", to: "User Service"}
  ],
  layout: "horizontal"
})
AI says: "I've created your architecture with the three services connected through the API Gateway. You should see them on your screen now."

---

User: "Add Redis for caching"

AI calls: add_shapes({
  session_id: "api-design",
  shapes: [{
    label: "Redis Cache",
    type: "ellipse",
    x: 250,
    y: 350,
    backgroundColor: "#ffebee"
  }]
})
AI says: "I've added a Redis cache layer. Would you like me to connect it to any services?"

---

User: "Connect it to the User Service"

AI calls: add_arrows({
  session_id: "api-design",
  arrows: [{
    startX: 500,
    startY: 300,
    endX: 350,
    endY: 350,
    label: "caches"
  }]
})
AI says: "Connected! The User Service now has an arrow pointing to Redis."

---

User: "What does the architecture look like now?"

AI calls: get_canvas_snapshot({session_id: "api-design"})
AI says: "Your architecture now has 4 components:
- API Gateway (rectangle) routing requests
- Auth Service (rectangle) handling authentication
- User Service (rectangle) managing user data
- Redis Cache (ellipse) providing caching
The API Gateway connects to both services, and the User Service connects to Redis for caching."
```

## 🎨 Autonomous Features

The AI can work **completely autonomously** - no need to know Excalidraw internals:

### ✅ What AI Handles Automatically
- Element IDs (auto-generated)
- Positioning (via auto-layout)
- Sizing (smart defaults: 150x100)
- Colors (defaults or semantic suggestions)
- Stroke widths (consistent styling)
- Connections (automatic binding)

### 🎯 What AI Needs to Specify
- Component labels (e.g., "API Gateway")
- Component types (rectangle, ellipse, diamond)
- Relationships (which connects to what)
- Layout style (horizontal, vertical, grid)

## 🔧 Configuration Tips

### For Production
1. **Use HTTPS**: Telnyx requires secure endpoints
2. **Set CORS**: If needed (Next.js API routes handle this automatically)
3. **Rate limiting**: Consider adding if public
4. **Authentication**: Optional - add API keys if needed

### For Development
1. **Use ngrok**: To expose localhost to Telnyx
   ```bash
   ngrok http 3000
   # Then use: https://xyz.ngrok.io/api
   ```
2. **Check logs**: Watch `npm run dev` output for errors
3. **Test endpoints**: Use curl/Postman before Telnyx integration

## 📊 Testing Checklist

Before going live:

- [ ] Test `create_whiteboard_session` - creates session
- [ ] Test `create_diagram` - shapes appear on canvas
- [ ] Test `add_shapes` - additional shapes added
- [ ] Test `add_arrows` - connections drawn
- [ ] Test `get_canvas_snapshot` - returns description
- [ ] Test real-time sync - AI changes appear within 2 seconds
- [ ] Test persistence - session persists across calls
- [ ] Test by name - can reference session by name

## 🚨 Troubleshooting

### Issue: "Session not found"
**Solution**: Make sure you're using the same session_id or name from create_whiteboard_session

### Issue: "Shapes don't appear"
**Solution**: Check base_url is correct and API is running. Check browser console for errors.

### Issue: "Changes take too long"
**Solution**: Canvas polls every 2 seconds. This is normal. For instant updates, wait for future WebSocket support.

### Issue: "Connection refused"
**Solution**: Ensure your API is accessible from Telnyx. Use ngrok for local development.

## 📞 Support

- **API Documentation**: See `docs/API.md`
- **Examples**: See `docs/MCP_TOOLS_UPDATED.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`

## 🎉 You're Ready!

Your Voice AI can now:
- ✅ Create persistent whiteboard sessions
- ✅ Build complete diagrams autonomously
- ✅ Add components incrementally
- ✅ Connect elements with arrows
- ✅ Understand what's on the canvas
- ✅ Collaborate with users in real-time

**Just upload `TELNYX_MCP_TOOLS.json` to your Telnyx MCP configuration and start talking!** 🎨🤖
