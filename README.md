# Voice Whiteboard - Voice AI Integration Guide

A collaborative whiteboard application designed to work seamlessly with Voice AI systems like Telnyx Voice AI. Draw, design, and architect together with your AI assistant.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Start the database:**
   ```bash
   docker compose up -d
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 📋 Usage

### For Humans

1. Navigate to `http://localhost:3000`
2. Create a new session (optionally give it a memorable name)
3. Start drawing on the Excalidraw canvas
4. Share the session name with your Voice AI

### For Voice AI

Your Voice AI can interact with the whiteboard using these API endpoints:

**Base URL:** `http://localhost:3000/api`

#### Common Operations

1. **Start a conversation:**
   ```
   User: "Create a new whiteboard session called 'api-design'"
   AI: POST /sessions with {"name": "api-design"}
   ```

2. **See what's on the canvas:**
   ```
   User: "What's currently on the whiteboard?"
   AI: GET /sessions/api-design/snapshot
   AI: "The canvas shows three components: API Gateway, Database, and Cache..."
   ```

3. **Add elements:**
   ```
   User: "Add a rectangle labeled 'User Service' at position 100, 200"
   AI: POST /sessions/api-design/elements with element data
   ```

## 🛠️ API Documentation

See [docs/API.md](docs/API.md) for complete API reference.

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sessions` | POST | Create new session |
| `/sessions/{id}` | GET | Get session details |
| `/sessions/{id}/elements` | GET | Get all canvas elements |
| `/sessions/{id}/elements` | POST | Add/update elements |
| `/sessions/{id}/snapshot` | GET | Get AI-friendly description |

## 🎯 MCP Tool Integration

For Telnyx Voice AI or other MCP-compatible systems, use the tool definitions in [docs/MCP_TOOLS.json](docs/MCP_TOOLS.json).

Example tools:
- `create_whiteboard_session`
- `get_canvas_snapshot`
- `add_canvas_elements`
- `create_rectangle`
- `create_arrow`

## 💡 Example Conversations

### Architecture Diagram

```
User: "Let's design a microservices architecture"
AI: [Creates session]
User: "Add three services: API Gateway, User Service, and Payment Service"
AI: [Creates three rectangles]
User: "Connect them with arrows"
AI: [Adds arrows between services]
User: "Add a database for each service"
AI: [Adds database shapes and connections]
```

### Brainstorming Session

```
User: "Help me brainstorm features for a new app"
AI: [Creates session]
User: "Add 'User Authentication' as a feature"
AI: [Creates text element]
User: "What else should we consider?"
AI: [Reads canvas, suggests related features, adds them]
```

## 🔧 Technical Details

### Stack

- **Frontend:** Next.js 14+ (App Router), React, TypeScript
- **Canvas:** Excalidraw React component
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Docker)
- **ORM:** Prisma

### Database Schema

```prisma
model Session {
  id          String   @id @default(uuid())
  name        String?  @unique
  canvasState Json     @default("[]")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Canvas State

Canvas state is stored as a JSON array of Excalidraw elements. Each element has:
- `id`: Unique identifier
- `type`: Shape type (rectangle, ellipse, arrow, etc.)
- `x, y`: Position
- `width, height`: Dimensions
- `text`: Optional label
- Colors, stroke width, etc.

## 🔄 Real-time Updates

The canvas polls for updates every 2 seconds, allowing:
- AI to add elements while user is viewing
- Multiple users to collaborate (future enhancement)
- Changes to sync automatically

## 🎨 Customization

### Adding New Shapes

Extend the API to support custom shapes:
1. Add to Excalidraw element types
2. Update API validation
3. Add helper MCP tool

### Styling

Modify Tailwind classes in:
- `app/page.tsx` - Home page
- `components/ExcalidrawCanvas.tsx` - Canvas wrapper

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables:
   - `DATABASE_URL` - Your production Postgres URL
4. Deploy

### Docker

```bash
# Build
docker build -t voice-whiteboard .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  voice-whiteboard
```

## 📚 Resources

- [Excalidraw Documentation](https://docs.excalidraw.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Telnyx Voice AI](https://telnyx.com/)

## 🐛 Troubleshooting

### Port 5432 already in use
The docker-compose.yml uses port 5433 by default. Update `DATABASE_URL` in `.env` if needed.

### Canvas not loading
Excalidraw is client-side only. Ensure dynamic import with `ssr: false` is working.

### Elements not syncing
Check the polling interval in `ExcalidrawCanvas.tsx`. Increase/decrease as needed.

## 🤝 Contributing

This is a proof of concept. Feel free to:
- Add WebSocket support for real-time sync
- Implement collaborative cursors
- Add authentication
- Support image uploads
- Export diagrams as PNG/SVG

## 📝 License

MIT
