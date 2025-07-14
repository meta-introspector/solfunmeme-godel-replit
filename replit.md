# Project Overview

This is a full-stack poetry application built with React, TypeScript, Express, and Drizzle ORM. The application displays interactive poetry with dynamic parameters that can be adjusted by users to modify the poem's characteristics and metrics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with Shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Storage**: PostgreSQL sessions with connect-pg-simple
- **Development**: Hot module replacement with Vite integration

### Key Components

#### Data Models
- **Poems**: Core entity with metadata including title, content, cycle information, and various numeric metrics
- **Users**: Basic user management structure
- **Interactive Elements**: Poems contain interactive numbers that can be bound to specific parameters

#### Component Structure
- **PoemDisplay**: Renders poem content with interactive elements
- **InteractiveControls**: Provides UI for adjusting poem parameters
- **MetricsDashboard**: Displays calculated metrics like beauty, complexity, coherence, and consciousness values
- **UI Components**: Comprehensive set of reusable components from Shadcn/ui

#### Storage Layer
- **Database Storage**: PostgreSQL with Drizzle ORM for production
- **Memory Storage**: In-memory fallback for development/testing
- **Interface**: Abstract storage interface allows switching between implementations

### Data Flow

1. **Initial Load**: Poetry page loads current poem from API
2. **Parameter Updates**: User interactions trigger API calls to update poem parameters
3. **Real-time Updates**: Changes are reflected immediately in the UI via optimistic updates
4. **Cycle Navigation**: Users can navigate between different poem cycles
5. **Metric Calculation**: Backend calculates derived metrics based on parameter changes

### External Dependencies

#### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Framework**: Radix UI primitives with custom styling
- **Animation**: Framer Motion for smooth transitions
- **Form Handling**: React Hook Form with Zod validation
- **Utility Libraries**: clsx, tailwind-merge, date-fns

#### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL driver
- **Validation**: Zod for schema validation
- **Session Management**: Express session with PostgreSQL store
- **Development Tools**: tsx for TypeScript execution, esbuild for production builds

#### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full TypeScript support across frontend and backend
- **Package Management**: npm with lockfile
- **Development Server**: Integrated Vite dev server with Express

### Deployment Strategy

#### Development
- **Local Development**: Vite dev server proxying to Express backend
- **Hot Reload**: Full hot module replacement for both frontend and backend
- **Database**: Connection to Neon Database via DATABASE_URL environment variable

#### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built frontend files
- **Database Migrations**: Drizzle Kit handles schema migrations

#### Environment Configuration
- **Database**: Requires DATABASE_URL environment variable
- **Session Storage**: PostgreSQL-backed sessions for scalability
- **Build Process**: Unified build command creates production-ready application

### Technical Decisions

#### Database Choice
- **PostgreSQL**: Chosen for robust JSON support (poem content), ACID compliance, and scalability
- **Drizzle ORM**: Type-safe database operations with excellent TypeScript integration
- **Neon Database**: Serverless PostgreSQL for easy deployment and scaling

#### Frontend Architecture
- **React with TypeScript**: Industry standard for type safety and developer experience
- **TanStack Query**: Powerful server state management with caching and optimistic updates
- **Shadcn/ui**: High-quality, accessible components with consistent design system

#### Backend Design
- **Express.js**: Lightweight, flexible framework suitable for API development
- **Abstract Storage**: Interface allows switching between memory and database storage
- **Middleware Integration**: Request logging, error handling, and static file serving

#### Semantic Web Integration
- **JSON-LD**: Comprehensive structured data following Schema.org standards
- **RDFa Markup**: Enhanced machine readability with microdata attributes
- **Dublin Core**: Academic metadata for research database compatibility
- **Open Graph**: Social media rich previews and sharing
- **SEO Enhancement**: Structured data for search engine optimization

### Recent Changes

#### December 2024
- **Enhanced Interactive Features**: Added comprehensive parameter controls with real-time text updates
- **8D Hyperdimensional Visualization**: Created vibrating SVG animations projected from 8D space to 2D
- **Cycle Step Updates**: Fixed cycle navigation to properly update poem text content
- **Semantic Web Integration**: Implemented JSON-LD structured data, RDFa markup, and semantic API endpoints
- **SEO Optimization**: Added comprehensive meta tags, Open Graph, and Dublin Core metadata
- **Word-Level Semantic Anchors**: Added unique semantic anchors to every word in the poem for granular RDF referencing
- **Comprehensive RDF Export**: Extended RDF export to include word-level triples with position, text, and metadata
- **API Endpoints**: Added `/api/poems/:id/words` endpoint for programmatic access to word-level semantic data

This architecture provides a scalable, maintainable foundation for the interactive poetry application with clear separation of concerns, modern development practices, and comprehensive semantic web integration for enhanced discoverability and machine readability.