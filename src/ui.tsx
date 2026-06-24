import { For, Show, createMemo } from "solid-js"
import type { Component, JSX } from "solid-js"
import type { PluginPanelProps, PluginSettingsProps } from "@ericsanchezok/synergy-plugin/ui"

const SKILL_COUNT = 10

const MCP_SERVERS = [
  { id: "shadcn", label: "shadcn/ui", version: "4.11.0", purpose: "Component registry and code generation" },
  { id: "layoutContext", label: "layout.design", version: "0.15.3", purpose: "Design-system context and linting" },
  { id: "playwright", label: "Playwright MCP", version: "0.0.76", purpose: "Screenshots and browser verification" },
] as const

const STATUS_ROWS = [
  { label: "Runtime contract", value: "Synergy PluginDescriptor 2.2", state: "ready" },
  { label: "Skill bundles", value: `${SKILL_COUNT} registered skills with bundle verification`, state: "ready" },
  { label: "MCP startup", value: "Lazy by default, version pinned", state: "ready" },
  { label: "Setup command", value: "synergy synergy-frontend-kit setup --json", state: "watch" },
] as const

const styles: Record<string, JSX.CSSProperties> = {
  root: {
    "box-sizing": "border-box",
    color: "oklch(0.18 0.018 230)",
    background: "oklch(1 0 0)",
    "font-family":
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    "font-size": "13px",
    "line-height": "1.45",
    padding: "16px",
    width: "100%",
  },
  header: {
    display: "flex",
    "align-items": "flex-start",
    "justify-content": "space-between",
    gap: "12px",
    "border-bottom": "1px solid oklch(0.86 0.012 220)",
    "padding-bottom": "12px",
    "margin-bottom": "14px",
  },
  title: {
    margin: 0,
    "font-size": "16px",
    "font-weight": 650,
    "letter-spacing": "0",
    "line-height": "1.25",
  },
  subtitle: {
    margin: "4px 0 0",
    color: "oklch(0.46 0.026 225)",
    "max-width": "65ch",
  },
  badge: {
    display: "inline-flex",
    "align-items": "center",
    "border-radius": "999px",
    border: "1px solid oklch(0.76 0.055 180)",
    background: "oklch(0.92 0.04 180)",
    color: "oklch(0.27 0.07 180)",
    padding: "2px 8px",
    "font-size": "12px",
    "font-weight": 600,
    "white-space": "nowrap",
  },
  section: {
    "border-top": "1px solid oklch(0.90 0.009 220)",
    padding: "14px 0",
  },
  sectionTitle: {
    margin: "0 0 8px",
    "font-size": "13px",
    "font-weight": 650,
  },
  row: {
    display: "flex",
    "align-items": "center",
    "justify-content": "space-between",
    gap: "12px",
    padding: "9px 0",
  },
  stack: {
    display: "grid",
    gap: "8px",
  },
  rowLabel: {
    display: "grid",
    gap: "2px",
    "min-width": 0,
  },
  strong: {
    "font-weight": 600,
  },
  muted: {
    color: "oklch(0.46 0.026 225)",
  },
  control: {
    border: "1px solid oklch(0.78 0.015 220)",
    "border-radius": "8px",
    background: "oklch(1 0 0)",
    color: "oklch(0.18 0.018 230)",
    padding: "6px 8px",
    "font-size": "13px",
    "min-width": "128px",
  },
  input: {
    border: "1px solid oklch(0.78 0.015 220)",
    "border-radius": "8px",
    background: "oklch(1 0 0)",
    color: "oklch(0.18 0.018 230)",
    padding: "6px 8px",
    "font-size": "13px",
    width: "112px",
  },
  code: {
    display: "block",
    "border-radius": "8px",
    background: "oklch(0.936 0.01 180)",
    border: "1px solid oklch(0.86 0.012 220)",
    padding: "8px 10px",
    "font-family": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    "font-size": "12px",
    color: "oklch(0.22 0.024 230)",
    overflow: "auto",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    "border-radius": "999px",
    "flex-shrink": 0,
  },
  statusRow: {
    display: "grid",
    "grid-template-columns": "8px minmax(0, 1fr)",
    gap: "10px",
    "align-items": "start",
    padding: "9px 0",
  },
  divider: {
    height: "1px",
    background: "oklch(0.90 0.009 220)",
    margin: "6px 0",
  },
}

function styleSheet() {
  return `
    *, *::before, *::after { box-sizing: border-box; }
    button, input, select { font: inherit; }
    input:focus-visible, select:focus-visible {
      outline: 2px solid oklch(0.48 0.095 180);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
      }
    }
  `
}

function readSection(values: Record<string, unknown>, key: string): Record<string, unknown> {
  const section = values[key]
  return section && typeof section === "object" && !Array.isArray(section)
    ? (section as Record<string, unknown>)
    : {}
}

function readBool(section: Record<string, unknown>, key: string, fallback: boolean): boolean {
  return typeof section[key] === "boolean" ? Boolean(section[key]) : fallback
}

function readString(section: Record<string, unknown>, key: string, fallback: string): string {
  return typeof section[key] === "string" ? String(section[key]) : fallback
}

function readNumber(section: Record<string, unknown>, key: string, fallback: number): number {
  return typeof section[key] === "number" ? Number(section[key]) : fallback
}

function statusColor(state: string) {
  if (state === "ready") return "oklch(0.50 0.11 155)"
  if (state === "watch") return "oklch(0.64 0.12 75)"
  return "oklch(0.56 0.16 30)"
}

export const SettingsPanel: Component<PluginSettingsProps> = (props) => {
  const mcp = createMemo(() => readSection(props.values, "mcp"))
  const setup = createMemo(() => readSection(props.values, "setup"))

  const patch = (sectionName: "mcp" | "setup", key: string, value: unknown) => {
    const current = readSection(props.values, sectionName)
    props.onChange({
      ...props.values,
      [sectionName]: {
        ...current,
        [key]: value,
      },
    })
  }

  return (
    <section style={styles.root} aria-label="Synergy Frontend Kit settings">
      <style>{styleSheet()}</style>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Frontend Kit</h2>
          <p style={styles.subtitle}>Configure official design skills, pinned MCP servers, and setup behavior.</p>
        </div>
        <span style={styles.badge}>official</span>
      </header>

      <section style={styles.section} aria-labelledby="mcp-settings-title">
        <h3 id="mcp-settings-title" style={styles.sectionTitle}>
          MCP Servers
        </h3>
        <div style={styles.stack}>
          <For each={MCP_SERVERS}>
            {(server) => (
              <label style={styles.row}>
                <span style={styles.rowLabel}>
                  <span style={styles.strong}>{server.label}</span>
                  <span style={styles.muted}>
                    {server.purpose} - {server.version}
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={readBool(mcp(), server.id, true)}
                  onInput={(event) => patch("mcp", server.id, event.currentTarget.checked)}
                />
              </label>
            )}
          </For>
        </div>
      </section>

      <section style={styles.section} aria-labelledby="runtime-settings-title">
        <h3 id="runtime-settings-title" style={styles.sectionTitle}>
          Runtime
        </h3>
        <label style={styles.row}>
          <span style={styles.rowLabel}>
            <span style={styles.strong}>Startup mode</span>
            <span style={styles.muted}>Lazy avoids package downloads until a server is used.</span>
          </span>
          <select
            style={styles.control}
            value={readString(mcp(), "startup", "lazy")}
            onInput={(event) => patch("mcp", "startup", event.currentTarget.value)}
          >
            <option value="lazy">Lazy</option>
            <option value="manual">Manual</option>
          </select>
        </label>
        <label style={styles.row}>
          <span style={styles.rowLabel}>
            <span style={styles.strong}>Timeout</span>
            <span style={styles.muted}>Maximum setup/MCP wait in milliseconds.</span>
          </span>
          <input
            style={styles.input}
            type="number"
            min="5000"
            step="5000"
            value={readNumber(mcp(), "timeoutMs", 120000)}
            onInput={(event) => patch("mcp", "timeoutMs", Number(event.currentTarget.value))}
          />
        </label>
      </section>

      <section style={styles.section} aria-labelledby="setup-settings-title">
        <h3 id="setup-settings-title" style={styles.sectionTitle}>
          Setup
        </h3>
        <label style={styles.row}>
          <span style={styles.rowLabel}>
            <span style={styles.strong}>Prompt when project tooling is missing</span>
            <span style={styles.muted}>Agents should ask before running shell setup commands.</span>
          </span>
          <input
            type="checkbox"
            checked={readBool(setup(), "autoPrompt", true)}
            onInput={(event) => patch("setup", "autoPrompt", event.currentTarget.checked)}
          />
        </label>
        <label style={styles.row}>
          <span style={styles.rowLabel}>
            <span style={styles.strong}>Visual verification</span>
            <span style={styles.muted}>How strongly frontend tasks should prefer screenshots and browser checks.</span>
          </span>
          <select
            style={styles.control}
            value={readString(setup(), "visualVerification", "smoke")}
            onInput={(event) => patch("setup", "visualVerification", event.currentTarget.value)}
          >
            <option value="off">Off</option>
            <option value="smoke">Smoke</option>
            <option value="strict">Strict</option>
          </select>
        </label>
      </section>
    </section>
  )
}

export const DesignReadinessPanel: Component<PluginPanelProps> = (props) => {
  return (
    <aside style={styles.root} aria-label="Design readiness">
      <style>{styleSheet()}</style>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Design Readiness</h2>
          <p style={styles.subtitle}>A compact check of the official frontend stack for this workspace.</p>
        </div>
        <span style={styles.badge}>2.2</span>
      </header>

      <section style={styles.section} aria-labelledby="readiness-status-title">
        <h3 id="readiness-status-title" style={styles.sectionTitle}>
          Status
        </h3>
        <For each={STATUS_ROWS}>
          {(row) => (
            <div style={styles.statusRow}>
              <span style={{ ...styles.statusDot, background: statusColor(row.state) }} aria-hidden="true" />
              <span style={styles.rowLabel}>
                <span style={styles.strong}>{row.label}</span>
                <span style={styles.muted}>{row.value}</span>
              </span>
            </div>
          )}
        </For>
      </section>

      <section style={styles.section} aria-labelledby="readiness-commands-title">
        <h3 id="readiness-commands-title" style={styles.sectionTitle}>
          Commands
        </h3>
        <div style={styles.stack}>
          <code style={styles.code}>bash scripts/update.sh --dry-run</code>
          <code style={styles.code}>bun run verify:skills</code>
          <code style={styles.code}>synergy synergy-frontend-kit setup --dry-run --json</code>
        </div>
      </section>

      <section style={styles.section} aria-labelledby="readiness-scope-title">
        <h3 id="readiness-scope-title" style={styles.sectionTitle}>
          Workspace
        </h3>
        <p style={styles.subtitle}>
          <Show when={props.scopeId} fallback="No active workspace scope was provided by the host.">
            Scope: {props.scopeId}
          </Show>
        </p>
      </section>
    </aside>
  )
}

export default DesignReadinessPanel
