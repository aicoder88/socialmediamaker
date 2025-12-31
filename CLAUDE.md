# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application for social media content creation and management. The app provides a unified interface for creating and previewing content across multiple social platforms (Facebook, LinkedIn, Twitter, Instagram, and Blog).

## Development Commands

### Running the application
```bash
npm run dev           # Start development server with Vite HMR
npm run preview       # Preview production build locally
```

### Building
```bash
npm run build         # TypeScript compilation + Vite production build
npm run build-no-errors  # Same as build (allows TypeScript errors)
```

### Code Quality
```bash
npm run lint          # Run ESLint on TypeScript/TSX files
```

### Supabase Type Generation
```bash
npm run types:supabase  # Generate TypeScript types from Supabase schema
```
**Note**: Requires `SUPABASE_PROJECT_ID` environment variable to be set.

## Architecture

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6 with SWC plugin for fast refresh
- **Styling**: Tailwind CSS 3.4 with CSS variables for theming
- **UI Components**: shadcn/ui (Radix UI primitives) with custom theme
- **Routing**: React Router 6
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Backend**: Supabase (@supabase/supabase-js)
- **Dev Tools**: Tempo Devtools for component development

### Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (Radix-based)
│   ├── Dashboard/       # Main app components
│   │   ├── ContentCreator.tsx      # Multi-platform content creation UI
│   │   ├── RecentSubmissions.tsx   # Submission history view
│   │   └── PlatformPreviewCard.tsx # Platform-specific preview cards
│   └── home.tsx         # Main layout with sidebar and navigation
├── lib/
│   └── utils.ts         # Utility functions (cn() for className merging)
├── stories/             # Tempo storybook files for UI components
├── tempobook/           # Dynamic Tempo assets (gitignored)
├── types/
│   └── supabase.ts      # Auto-generated Supabase types
├── App.tsx              # Root component with routing
├── main.tsx             # Entry point
└── index.css            # Global styles and Tailwind directives
```

### Key Architecture Patterns

1. **Path Aliases**: Use `@/` prefix for imports (maps to `./src/`)
   ```typescript
   import { Button } from "@/components/ui/button"
   import { cn } from "@/lib/utils"
   ```

2. **UI Component System**:
   - All UI components are in `src/components/ui/`
   - Built on Radix UI primitives with Tailwind styling
   - Uses shadcn/ui "new-york" style with slate base color
   - Configured via `components.json`

3. **Theming**:
   - CSS variables defined in `index.css` for colors
   - Dark mode support via class strategy
   - Custom Tailwind theme extensions in `tailwind.config.js`

4. **Tempo Integration**:
   - Tempo devtools enabled via `tempo-devtools` package
   - Component stories in `src/stories/` for isolated development
   - Tempo routes conditionally loaded when `VITE_TEMPO=true`
   - Typography system defined in `tempo.config.json`

5. **State Management**:
   - Local component state with React hooks
   - No global state management library (uses React Context if needed)

6. **Styling Utilities**:
   - `cn()` helper combines clsx and tailwind-merge for conditional classes
   - Framer Motion for animations and transitions

### Configuration Notes

- **TypeScript**:
  - `noEmitOnError: false` - builds continue despite type errors
  - `strict: true` but `noUnusedLocals` and `noUnusedParameters` disabled
  - Module resolution: "bundler" mode

- **Vite**:
  - Base path configurable via `VITE_BASE_PATH` env var
  - Path aliasing for `@/*` imports
  - Tempo devtools plugin integrated
  - SWC used for React fast refresh (faster than Babel)

- **Supabase**:
  - Types must be regenerated when database schema changes
  - Project ID required in environment for type generation

### Component Development with Tempo

The project uses Tempo Devtools for isolated component development:

1. Stories are located in `src/stories/` with `.stories.tsx` extension
2. Tempo UI is conditionally loaded in production based on `VITE_TEMPO` env var
3. Run `npm run dev` and access Tempo routes when enabled
4. Dynamic Tempo assets are gitignored (`tempobook/dynamic/`, `tempobook/storyboards/`)

### Styling Conventions

- Use Tailwind utility classes
- Extract repeated patterns into reusable components
- Use CSS variables for theme colors (e.g., `hsl(var(--primary))`)
- Responsive design with Tailwind breakpoints
- Dark mode variants with `dark:` prefix when needed

### Form Handling

- Use React Hook Form for form state management
- Zod for schema validation via `@hookform/resolvers`
- Form component wrapper from shadcn/ui (`src/components/ui/form.tsx`)

### Social Platform Integration

The app supports content creation for:
- Facebook (character limit handling)
- LinkedIn (professional formatting)
- Twitter (tweet optimization)
- Instagram (visual-first content)
- Blog (long-form content)

Each platform has custom preview cards with platform-specific styling and character limits.
