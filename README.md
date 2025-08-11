# Evolve Engine

A sophisticated AI-powered startup journey management platform that transforms dreams into reality through intelligent task management, goal tracking, and progress visualization.

## 🚀 About

Evolve Engine is a comprehensive productivity platform designed specifically for entrepreneurs and startup founders. It combines AI-powered task generation, goal management, daily journaling, and intelligent progress tracking to help you build your startup systematically.

### Key Features

- **🎯 AI-Powered Task Management**: Generate daily tasks based on your energy levels and current startup phase
- **📊 Goal Tracking**: Set and track yearly, quarterly, monthly, and weekly goals with progress visualization
- **📝 Daily Journaling**: Capture your journey with mood tracking and location-based entries
- **🤖 AI Assistant**: Get personalized guidance and motivation through intelligent chat
- **📈 Progress Analytics**: Visualize your startup journey with comprehensive statistics
- **🎨 Beautiful UI**: Modern glass morphism design with fluid animations and dark theme

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion + React Spring
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **API Client**: Auto-generated from OpenAPI specification
- **Notifications**: Sonner + Native browser notifications

## 🎨 Design System

Built with a sophisticated design system featuring:
- **Liquid Glass Effects**: Custom glass morphism components with fluid animations
- **Dark Theme**: Professional dark color scheme optimized for productivity
- **Brand Colors**: Indigo primary with motivation pink accents
- **Responsive Design**: Mobile-first approach with bottom tab navigation
- **Accessibility**: WCAG AA compliant with proper focus states

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API server running (see configuration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd evolve-engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root:
   ```env
   VITE_USER_ID=your_user_id_here
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Features Overview

### Dashboard
- **Weekly Roadmap**: Visualize your startup journey timeline
- **Stats Cards**: Quick overview of tasks, goals, and progress
- **Today's Tasks**: Focus on immediate priorities
- **Motivation Card**: AI-powered encouragement and insights

### Task Management
- **Smart Task Creation**: AI-generated tasks based on your startup phase
- **Bulk Operations**: Create multiple tasks efficiently
- **Priority & Energy Management**: Match tasks to your energy levels
- **Progress Tracking**: Visual completion status and time tracking

### Goal Setting
- **Multi-level Goals**: Yearly, quarterly, monthly, and weekly objectives
- **Progress Visualization**: Track completion with visual indicators
- **Phase-based Planning**: Align goals with startup development phases

### Daily Journaling
- **Mood Tracking**: Record your emotional state and energy levels
- **Location-based Entries**: Capture where your journey takes you
- **Rich Text Support**: Detailed entries with formatting

### AI Assistant
- **Personalized Guidance**: Get startup-specific advice and motivation
- **Task Generation**: AI-powered daily task suggestions
- **Progress Analysis**: Intelligent insights about your journey

### Statistics & Analytics
- **Progress Visualization**: Charts and graphs showing your growth
- **Time Tracking**: Monitor how you spend your time
- **Goal Achievement**: Track success rates and patterns

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_USER_ID` | Your user identifier | `"5976080378"` |
| `VITE_API_BASE_URL` | Backend API endpoint | `"http://localhost:8000"` |

### API Integration

The app uses auto-generated TypeScript clients from OpenAPI specifications. To regenerate the client:

```bash
npm run generate-client
```

## 🎯 Startup Phases

Evolve Engine is designed around startup development phases:

1. **Research**: Market analysis and idea validation
2. **Planning**: Business model and strategy development
3. **Development**: Product building and MVP creation
4. **Launch**: Go-to-market and initial user acquisition
5. **Growth**: Scaling and optimization
6. **Scale**: Expansion and market leadership

## 🎨 Custom Components

### Liquid Glass System
- `LiquidGlass`: Fluid background containers with customizable intensity
- `LiquidCard`: Structured cards with glass morphism effects
- `GlassIconButton`: Specialized buttons with water-drop styling

### Design Tokens
All colors, spacing, and animations are defined in the design system and available as CSS custom properties and Tailwind utilities.

## 📱 Mobile Experience

Optimized for mobile with:
- Bottom tab navigation
- Touch-friendly interactions
- Responsive layouts
- Native notifications support
- Offline-ready architecture

## 🔒 Security & Privacy

- Environment-based configuration
- Secure API communication
- User data isolation
- No hardcoded credentials

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Check the documentation in the `docs/` folder
- Review the brand guidelines for design consistency
- Examine the component library for UI patterns

---

**Transform your startup dreams into reality with Evolve Engine** 🚀
