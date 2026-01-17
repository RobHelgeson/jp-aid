# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JP-Aid is a Japanese kanji learning application with interactive graph visualization, search, and text parsing. Built as an Nx monorepo with Angular 20 frontend and planned NestJS backend.

## Commands

```bash
# Development
npx nx serve jp-aid              # Dev server at localhost:4200
tilt up                          # Full K8s stack with Tilt

# Build
npx nx build jp-aid              # Production build
npx nx build shared-interfaces   # Build shared library

# Testing
npx nx test jp-aid               # Unit tests (Jest)
npx nx test jp-aid --watch       # Watch mode
npx nx e2e jp-aid-e2e            # E2E tests (Playwright)

# Linting & Formatting
npx nx lint jp-aid               # ESLint
npx prettier --write .           # Format all files

# CI equivalent
npx nx affected -t lint test build e2e
```

## Architecture

```
apps/
  jp-aid/          # Angular frontend
  jp-aid-e2e/      # Playwright E2E tests
  api/             # NestJS backend (planned)
libs/
  shared-interfaces/  # Shared TypeScript types (graph, kanji interfaces)
kubernetes/        # Helm charts
docs/              # Architecture, PRD, stories
```

**Routes** (`apps/jp-aid/src/app/app.routes.ts`):
- `/` → SearchPage
- `/search` → ResultsPage
- `/kanji/:id` → KanjiDetail

**Key Technologies**: Angular 20, Sigma.js + Graphology (graph viz), Angular Material, Jest, Playwright, Memgraph (planned)

## Angular Conventions

**Component generation** (use this exact pattern):
```bash
npx nx generate @nx/angular:component \
  --path=apps/jp-aid/src/app/component-name/component-name \
  --standalone=true --changeDetection=OnPush --style=scss --prefix=kl
```

**Required patterns**:
- OnPush change detection always
- Signals for state (not RxJS subjects)
- `inject()` for DI (not constructor injection)
- Modern control flow: `@if`, `@for` (not `*ngIf`, `*ngFor`)
- SCSS only, `rem` units (borders and media queries use `px`)
- Selector prefix: `kl-`

**Template attribute order**: ids → class → inputs → outputs
```html
<button #myButton mat-button class="back-button" [text]="value" (click)="handler()">
```

## Testing

Jest for unit tests. Use Jest mocking syntax (not Jasmine):
```typescript
const mockService = {method: jest.fn()};
mockService.method.mockReturnValue(data);
```

Always call `fixture.detectChanges()` after interactions. Include `NoopAnimationsModule` for Material components.

## Shared Interfaces

Import from `@jp-aid/shared-interfaces`:
- Graph types: `GraphNode`, `GraphEdge`, `KanjiNode`, `RadicalNode`, `NodeType`
- Navigation: `BreadcrumbItem`, `NavigationState`
- Kanji data models

Create fixtures for interfaces in `testing/*.fixtures.ts` files.

## AI-Assisted Development

This project uses BMAD Method for structured AI-assisted development, plus MCP servers and skills for enhanced assistance.

### BMAD Method (`_bmad/`)

BMAD (Breakthrough Method for Agile AI-Assisted Development) provides specialized agents and workflows for the full software development lifecycle. Configuration in `_bmad/_config/`.

**Agents** - Invoke via `/bmad:bmm:agents:<name>`:
- `analyst` (Mary) - Business analysis, requirements elicitation
- `architect` (Winston) - System design, technical decisions
- `dev` (Amelia) - Story implementation with strict AC adherence
- `pm` (John) - PRD creation, user interviews
- `sm` (Bob) - Story preparation, sprint management
- `tea` (Murat) - Test architecture, quality gates
- `ux-designer` (Sally) - UX patterns, interaction design

**Key Workflows** - Invoke via `/bmad:bmm:workflows:<name>`:
- `quick-spec` → `quick-dev` - Fast path for smaller features
- `create-product-brief` → `prd` → `create-architecture` → `create-epics-and-stories` - Full planning path
- `sprint-planning` → `create-story` → `dev-story` → `code-review` - Implementation cycle
- `testarch-*` - Test framework, ATDD, automation, CI

**Project artifacts** in `docs/`:
- `prd.md` - Product requirements
- `architecture.md` - Technical decisions
- `stories/*.story.md` - User stories with acceptance criteria

### MCP Servers (`.mcp.json`)

**NX MCP** - Provides workspace intelligence:
- Project structure and dependencies
- Available Nx tasks and generators
- Affected project detection

**Angular CLI MCP** - Provides Angular-specific guidance:
- Current Angular best practices and coding standards
- Real-time documentation search from angular.dev
- Workspace analysis

### Browser Automation

Use `agent-browser` CLI for browser-based development tasks:

```bash
# Test the running app
agent-browser open http://localhost:4200
agent-browser snapshot -i              # Get interactive elements
agent-browser click @e5                # Click by element ref
agent-browser fill @e3 "search term"   # Fill input fields
agent-browser screenshot --full        # Capture full page

# Debug frontend issues
agent-browser console                  # View console logs
agent-browser errors                   # View page errors
agent-browser network requests         # View network activity
```

Common workflows:
- **Visual testing**: Open app, set viewport, capture screenshots
- **Form testing**: Fill inputs, submit, verify results
- **Debug**: Check console logs, network requests, page errors
