---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web and mobile. Includes 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, and check UI/UX code. Projects: website, landing page, dashboard, admin panel, e-commerce, SaaS, portfolio, blog, and mobile app. Elements: button, modal, navbar, sidebar, card, table, form, and chart. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode, responsive, skeuomorphism, and flat design. Topics: color systems, accessibility, animation, layout, typography, font pairing, spacing, interaction states, shadow, and gradient. Integrations: shadcn/ui MCP for component search and examples."
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design guide for web and mobile applications. Contains 50+ styles, 161 color palettes, 57 font pairings, 161 product types with reasoning rules, 99 UX guidelines, and 25 chart types across 10 technology stacks.

## When to Apply

This Skill should be used when the task involves **UI structure, visual design decisions, interaction patterns, or user experience quality control**.

### Must Use
- Designing new pages (Landing Page, Dashboard, Admin, SaaS, Mobile App)
- Creating or refactoring UI components (buttons, modals, forms, tables, charts, etc.)
- Choosing color schemes, typography systems, spacing standards, or layout systems
- Reviewing UI code for user experience, accessibility, or visual consistency
- Implementing navigation structures, animations, or responsive behavior
- Making product-level design decisions (style, information hierarchy, brand expression)
- Improving perceived quality, clarity, or usability of interfaces

### Skip
- Pure backend logic, API/database design, DevOps, non-visual scripts

**Decision criteria**: If the task will change how a feature **looks, feels, moves, or is interacted with**, this Skill should be used.

> NOTE (manual install in this project): the `scripts/` (Python search engine) and
> `data/` (CSV datasets) are NOT bundled in this copy because they are too large to
> transfer here (~1.5 MB). The Quick Reference rules below are COMPLETE and fully
> usable for design decisions as-is. To also enable the `search.py` reasoning engine
> and full datasets (161 palettes, 57 font pairings, 67 styles), run:
> `npm install -g uipro-cli && uipro init --ai claude --global`  (needs Python 3.x).

## Rule Categories by Priority

| Priority | Category | Impact | Key Checks (Must Have) | Anti-Patterns (Avoid) |
|----------|----------|--------|------------------------|------------------------|
| 1 | Accessibility | CRITICAL | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels | Removing focus rings, Icon-only buttons without labels |
| 2 | Touch & Interaction | CRITICAL | Min size 44x44px, 8px+ spacing, Loading feedback | Reliance on hover only, Instant state changes (0ms) |
| 3 | Performance | HIGH | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1) | Layout thrashing, Cumulative Layout Shift |
| 4 | Style Selection | HIGH | Match product type, Consistency, SVG icons (no emoji) | Mixing flat & skeuomorphic randomly, Emoji as icons |
| 5 | Layout & Responsive | HIGH | Mobile-first breakpoints, Viewport meta, No horizontal scroll | Horizontal scroll, Fixed px container widths, Disable zoom |
| 6 | Typography & Color | MEDIUM | Base 16px, Line-height 1.5, Semantic color tokens | Text < 12px body, Gray-on-gray, Raw hex in components |
| 7 | Animation | MEDIUM | Duration 150-300ms, Motion conveys meaning, Spatial continuity | Decorative-only animation, Animating width/height, No reduced-motion |
| 8 | Forms & Feedback | MEDIUM | Visible labels, Error near field, Helper text, Progressive disclosure | Placeholder-only label, Errors only at top, Overwhelm upfront |
| 9 | Navigation Patterns | HIGH | Predictable back, Bottom nav <=5, Deep linking | Overloaded nav, Broken back behavior, No deep links |
| 10 | Charts & Data | LOW | Legends, Tooltips, Accessible colors | Relying on color alone to convey meaning |

## Quick Reference

### 1. Accessibility (CRITICAL)
- `color-contrast` - Minimum 4.5:1 ratio for normal text (large text 3:1)
- `focus-states` - Visible focus rings on interactive elements (2-4px)
- `alt-text` - Descriptive alt text for meaningful images
- `aria-labels` - aria-label for icon-only buttons
- `keyboard-nav` - Tab order matches visual order; full keyboard support
- `form-labels` - Use label with for attribute
- `skip-links` - Skip to main content for keyboard users
- `heading-hierarchy` - Sequential h1->h6, no level skip
- `color-not-only` - Don't convey info by color alone (add icon/text)
- `reduced-motion` - Respect prefers-reduced-motion
- `escape-routes` - Provide cancel/back in modals and multi-step flows

### 2. Touch & Interaction (CRITICAL)
- `touch-target-size` - Min 44x44px; extend hit area beyond visual bounds if needed
- `touch-spacing` - Minimum 8px gap between touch targets
- `hover-vs-tap` - Use click/tap for primary interactions; don't rely on hover alone
- `loading-buttons` - Disable button during async operations; show spinner
- `error-feedback` - Clear error messages near problem
- `cursor-pointer` - Add cursor-pointer to clickable elements
- `press-feedback` - Visual feedback on press (ripple/highlight)
- `gesture-alternative` - Always provide visible controls for critical actions

### 3. Performance (HIGH)
- `image-optimization` - Use WebP/AVIF, responsive images, lazy load non-critical assets
- `image-dimension` - Declare width/height or aspect-ratio to prevent layout shift (CLS)
- `font-loading` - Use font-display: swap/optional to avoid invisible text
- `critical-css` - Prioritize above-the-fold CSS
- `lazy-loading` - Lazy load non-hero components via dynamic import
- `bundle-splitting` - Split code by route/feature (Next.js dynamic) to reduce initial load
- `content-jumping` - Reserve space for async content to avoid layout jumps
- `virtualize-lists` - Virtualize lists with 50+ items
- `progressive-loading` - Use skeleton screens instead of long blocking spinners
- `debounce-throttle` - Use debounce/throttle for scroll, resize, input

### 4. Style Selection (HIGH)
- `style-match` - Match style to product type
- `consistency` - Use same style across all pages
- `no-emoji-icons` - Use SVG icons (Heroicons, Lucide), not emojis
- `color-palette-from-product` - Choose palette from product/industry
- `effects-match-style` - Shadows, blur, radius aligned with chosen style
- `state-clarity` - Make hover/pressed/disabled states visually distinct
- `elevation-consistent` - Use a consistent elevation/shadow scale; avoid random shadows
- `dark-mode-pairing` - Design light/dark variants together
- `icon-style-consistent` - Use one icon set/visual language across the product
- `primary-action` - One primary CTA per screen; secondary actions subordinate

### 5. Layout & Responsive (HIGH)
- `viewport-meta` - width=device-width initial-scale=1 (never disable zoom)
- `mobile-first` - Design mobile-first, then scale up
- `breakpoint-consistency` - Use systematic breakpoints (375 / 768 / 1024 / 1440)
- `readable-font-size` - Minimum 16px body text on mobile
- `line-length-control` - Mobile 35-60 chars/line; desktop 60-75 chars
- `horizontal-scroll` - No horizontal scroll on mobile
- `spacing-scale` - Use 4/8px incremental spacing system
- `container-width` - Consistent max-width on desktop (max-w-6xl / 7xl)
- `z-index-management` - Define layered z-index scale
- `visual-hierarchy` - Establish hierarchy via size, spacing, contrast - not color alone

### 6. Typography & Color (MEDIUM)
- `line-height` - Use 1.5-1.75 for body text
- `line-length` - Limit to 65-75 characters per line
- `font-pairing` - Match heading/body font personalities
- `font-scale` - Consistent type scale (12 14 16 18 24 32)
- `contrast-readability` - Darker text on light backgrounds (slate-900 on white)
- `weight-hierarchy` - Bold headings (600-700), Regular body (400), Medium labels (500)
- `color-semantic` - Define semantic color tokens, not raw hex in components
- `color-dark-mode` - Dark mode uses desaturated/lighter variants, not inverted colors
- `color-accessible-pairs` - Foreground/background pairs meet 4.5:1 (AA) or 7:1 (AAA)
- `number-tabular` - Use tabular figures for data columns, prices, timers
- `whitespace-balance` - Use whitespace to group related items and separate sections

### 7. Animation (MEDIUM)
- `duration-timing` - 150-300ms for micro-interactions; complex <=400ms; avoid >500ms
- `transform-performance` - Use transform/opacity only; avoid animating width/height/top/left
- `loading-states` - Show skeleton/progress when loading exceeds 300ms
- `excessive-motion` - Animate 1-2 key elements per view max
- `easing` - ease-out for entering, ease-in for exiting; avoid linear for UI
- `motion-meaning` - Every animation expresses cause-effect, not just decoration
- `spring-physics` - Prefer spring/physics-based curves for natural feel
- `exit-faster-than-enter` - Exit ~60-70% of enter duration
- `stagger-sequence` - Stagger list/grid entrance by 30-50ms per item
- `interruptible` - Animations must be interruptible by user tap/gesture
- `scale-feedback` - Subtle scale (0.95-1.05) on press for tappable cards/buttons
- `layout-shift-avoid` - Animations must not cause layout reflow or CLS

### 8. Forms & Feedback (MEDIUM)
- `input-labels` - Visible label per input (not placeholder-only)
- `error-placement` - Show error below the related field
- `submit-feedback` - Loading then success/error state on submit
- `required-indicators` - Mark required fields (asterisk)
- `empty-states` - Helpful message and action when no content
- `toast-dismiss` - Auto-dismiss toasts in 3-5s
- `confirmation-dialogs` - Confirm before destructive actions
- `disabled-states` - Reduced opacity (0.38-0.5) + cursor change + semantic attribute
- `progressive-disclosure` - Reveal complex options progressively
- `inline-validation` - Validate on blur (not keystroke)
- `error-clarity` - Error messages state cause + how to fix (not just "Invalid input")
- `focus-management` - After submit error, auto-focus the first invalid field
- `destructive-emphasis` - Destructive actions use semantic danger color, separated from primary

### 9. Navigation Patterns (HIGH)
- `bottom-nav-limit` - Bottom navigation max 5 items; labels with icons
- `drawer-usage` - Use drawer/sidebar for secondary navigation, not primary actions
- `back-behavior` - Back navigation predictable and consistent; preserve scroll/state
- `deep-linking` - Key screens reachable via deep link / URL
- `nav-label-icon` - Navigation items have both icon and text label
- `nav-state-active` - Current location visually highlighted
- `breadcrumb-web` - Web: breadcrumbs for 3+ level deep hierarchies
- `state-preservation` - Back restores scroll position, filter state, input
- `adaptive-navigation` - Large screens (>=1024px) prefer sidebar; small screens bottom/top nav
- `navigation-consistency` - Navigation placement stays the same across all pages
- `persistent-nav` - Core navigation reachable from deep pages

### 10. Charts & Data (LOW)
- `chart-type` - Match chart type to data (trend->line, comparison->bar, proportion->pie/donut)
- `color-guidance` - Accessible palettes; avoid red/green only pairs
- `data-table` - Provide table alternative for accessibility
- `legend-visible` - Always show legend near the chart
- `tooltip-on-interact` - Tooltips/data labels on hover (web) or tap (mobile)
- `axis-labels` - Label axes with units and readable scale
- `responsive-chart` - Charts reflow or simplify on small screens
- `empty-data-state` - Meaningful empty state when no data ("No data yet" + guidance)
- `no-pie-overuse` - Avoid pie/donut for >5 categories; switch to bar
- `gridline-subtle` - Grid lines low-contrast (gray-200) so they don't compete with data

## Workflow

1. **Analyze requirements** - product type, audience, style keywords, stack (this project: Next.js + React + Tailwind).
2. **Pick a style + palette + type scale** that matches the product type (see priority §4, §6).
3. **Build** following CRITICAL/HIGH rules (§1-§5) first.
4. **Pre-delivery review** - run through the checklist below.

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis used as icons (use SVG instead)
- [ ] Icons from a consistent family/style
- [ ] Pressed-state visuals do not shift layout bounds
- [ ] Semantic theme tokens used consistently (no per-screen hardcoded colors)

### Interaction
- [ ] All clickable elements provide clear pressed feedback
- [ ] Touch targets >=44x44px
- [ ] `cursor-pointer` on all clickable elements
- [ ] Micro-interaction timing 150-300ms with smooth easing
- [ ] Disabled states visually clear and non-interactive
- [ ] Focus states visible for keyboard navigation

### Light/Dark Mode
- [ ] Primary text contrast >=4.5:1 in both modes
- [ ] Secondary text contrast >=3:1 in both modes
- [ ] Dividers/borders and interaction states distinguishable in both modes
- [ ] Both themes tested before delivery

### Layout
- [ ] Responsive verified at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile
- [ ] 4/8px spacing rhythm maintained
- [ ] Long-form text measure readable on larger devices

### Accessibility
- [ ] Meaningful images/icons have alt text
- [ ] Form fields have labels, hints, clear error messages
- [ ] Color is not the only indicator
- [ ] prefers-reduced-motion respected
