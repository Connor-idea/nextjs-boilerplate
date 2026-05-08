# UI Change Spec

## Plan

### Goal
- All UI changes must start from the highest-leverage shared abstraction instead of page-level patching.
- For table-related changes, use the shared Tailwind table layer before touching one-off page markup.
- Keep visual updates aligned with the approved enterprise console style: flat surfaces, clear borders, restrained accent color, dense data presentation, and consistent interaction states.

### Required workflow
1. Identify the real owning layer before editing.
2. Confirm whether the change belongs in `tailwind.config.js`, `src/index.css`, a shared component, or a page-local component.
3. State one local hypothesis before the first edit.
4. Make the smallest shared change that can cover the target surface.
5. Run a focused validation immediately after the first substantive edit.
6. Only then continue to adjacent follow-up edits.

### Scope rules
- Content, data, chart values, and table columns must not be changed unless the task explicitly requires it.
- If the request is visual, change style structure only.
- If more than one page shares the same pattern, do not solve it only in one page.

## Design

### Global direction
- Use the Tailwind console theme tokens defined in `tailwind.config.js`.
- Prefer semantic component classes in `src/index.css` for repeated UI patterns.
- Keep the visual language close to enterprise cloud-console products:
  - light neutral background
  - flat white data surfaces
  - thin grey borders
  - restrained blue highlight
  - dense but readable tables
  - minimal shadow usage

### Table design rules
- All data tables must use the shared `table-shell` container.
- All standard tables must use `console-table`.
- Wide or high-density tables must use `console-table-dense` or `table-shell-dense` when needed.
- Sticky action columns must use `console-table-sticky-right` to avoid broken hover/background states.
- Table actions should use shared button classes such as `console-table-action`, `console-table-action-primary`, and `console-table-action-danger`.
- Inline table inputs/selects must use `console-table-input` and `console-table-select`.

### Design mistakes that must not happen again
- Do not rely on large ad hoc selector patches before checking whether a shared Tailwind class should own the change.
- Do not mix a new visual system with multiple unrelated button, border, or radius styles in the same table.
- Do not reintroduce large numbers of `var(--md-...)` usages in JSX for shared UI.
- Do not keep old utility bundles like `rounded-2xl border border-slate-200 bg-white` when a shared semantic class already exists.

## Code

### Source of truth order
1. `tailwind.config.js` for tokens
2. `src/index.css` component layer for shared semantics
3. shared React helper/component
4. page-local JSX only when the pattern is truly unique

### Required code conventions
- Prefer shared semantic classes over long utility chains for reusable UI.
- If a pattern appears in 2 or more places, promote it to a shared class or helper.
- Preserve existing component APIs unless the task explicitly needs an API change.
- Keep edits minimal and local to the requested change.
- Avoid adding one-off arbitrary values when a theme token already exists.

### Table implementation checklist
- wrapper uses `table-shell`
- table uses `console-table`
- dense tables use the dense variant
- sticky columns use shared sticky class
- action buttons use shared table action styles
- empty state rows use the shared empty-state style or equivalent semantics

## Test

### Minimum validation
- Run `npm run build` after shared UI or theme changes.
- If a change touches only a few files, also run a targeted error check on those files.
- For table changes, visually inspect at least:
  - one normal data table
  - one dense wide table
  - one table with sticky action column
  - one table with inline form fields or batch actions

### Regression checks
- Confirm headers, borders, hover states, selected rows, and sticky columns still read clearly.
- Confirm row density remains usable on desktop and does not collapse on smaller screens.
- Confirm no table loses horizontal scroll when min-width is required.
- Confirm action buttons remain readable and clickable after style refactor.

### Search checks
- After shared style migration, search the touched area for leftover legacy patterns when relevant.
- Typical cleanup checks:
  - repeated old wrapper utility bundles
  - direct `var(--md-...)` usage in shared JSX
  - duplicated table-specific utility stacks that should now be shared

## Review

### Pre-merge review checklist
- Was the real owning abstraction changed first?
- Was the first edit followed by immediate validation?
- Did the change reduce style duplication instead of adding more?
- Does the new code follow the shared Tailwind theme and semantic class layer?
- Are table states consistent across normal, selected, hover, empty, and sticky-column variants?
- Is the update documented in the `updates/` folder?

### Rejection conditions
- A page-level visual patch was added where a shared class should have been updated.
- A shared table changed visually but `npm run build` was not rerun.
- A new style system was introduced without updating the shared token/component layer.
- The change increases reliance on compatibility hacks instead of reducing them.
