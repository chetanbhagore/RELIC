# Contributing to RELIC

Thank you for your interest in contributing to **RELIC: Your Life, In Receipts**!

## Development Workflow

1. **Prerequisites**: Node.js v18+ and npm installed.
2. **Clone & Install**:
   ```bash
   git clone https://github.com/chetanbhagore/RELIC.git
   cd RELIC
   npm install
   ```
3. **Start Development Server**:
   ```bash
   npm run dev
   ```
4. **Execute Test Suite**:
   ```bash
   npm test
   ```
5. **Verify Production Build**:
   ```bash
   npm run build
   ```

## Architecture Principles

- **Separation of Concerns**: Spatial rendering is kept strictly isolated in `src/components/canvas/`, UI overlays live in `src/components/ui/`, and unsupervised clustering engines reside in `src/lib/engine/`.
- **Zero-Dependency Audio**: All acoustic feedback is procedurally synthesized via Web Audio API. Do not introduce heavy audio assets.
- **Strict Typing**: All schemas adhere to interfaces defined in `src/types/relic.ts`.
