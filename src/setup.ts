import type { PluginCLICommand, PluginInput } from "@ericsanchezok/synergy-plugin"

export const PINNED_TOOL_VERSIONS = {
  shadcn: "4.11.0",
  layoutContext: "0.15.3",
  playwrightMcp: "0.0.76",
  playwright: "1.61.1",
} as const

export interface SetupArgs {
  "skip-shadcn"?: boolean
  "skip-layout"?: boolean
  "skip-playwright"?: boolean
  "dry-run"?: boolean
  json?: boolean
}

export interface SetupStepResult {
  id: string
  label: string
  command: string[]
  fallback: string
  skipped: boolean
  ok: boolean
  error?: string
}

interface SetupStep {
  id: string
  label: string
  skipFlag: keyof SetupArgs
  command: string[]
  fallback: string
}

const SETUP_STEPS: SetupStep[] = [
  {
    id: "shadcn",
    label: "Initialize shadcn/ui",
    skipFlag: "skip-shadcn",
    command: ["npx", "-y", `shadcn@${PINNED_TOOL_VERSIONS.shadcn}`, "init", "-d"],
    fallback: `npx shadcn@${PINNED_TOOL_VERSIONS.shadcn} init -d`,
  },
  {
    id: "layout-context",
    label: "Initialize layout.design",
    skipFlag: "skip-layout",
    command: ["npx", "-y", `@layoutdesign/context@${PINNED_TOOL_VERSIONS.layoutContext}`, "init"],
    fallback: `npx @layoutdesign/context@${PINNED_TOOL_VERSIONS.layoutContext} init`,
  },
  {
    id: "playwright",
    label: "Install Playwright Chromium",
    skipFlag: "skip-playwright",
    command: ["npx", "-y", `playwright@${PINNED_TOOL_VERSIONS.playwright}`, "install", "--with-deps", "chromium"],
    fallback: `npx playwright@${PINNED_TOOL_VERSIONS.playwright} install --with-deps chromium`,
  },
]

function commandText(command: string[]): string {
  return command.join(" ")
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export async function runSetup(ctx: PluginInput, args: SetupArgs): Promise<SetupStepResult[]> {
  const results: SetupStepResult[] = []

  for (const step of SETUP_STEPS) {
    const skipped = Boolean(args[step.skipFlag])
    const result: SetupStepResult = {
      id: step.id,
      label: step.label,
      command: step.command,
      fallback: step.fallback,
      skipped,
      ok: skipped,
    }

    if (skipped || args["dry-run"]) {
      result.ok = true
      results.push(result)
      continue
    }

    try {
      await ctx.$`${step.command}`.quiet()
      result.ok = true
    } catch (error) {
      result.ok = false
      result.error = formatError(error)
    }

    results.push(result)
  }

  return results
}

export function renderSetupResult(results: SetupStepResult[], args: SetupArgs): string {
  if (args.json) {
    return JSON.stringify(
      {
        plugin: "synergy-frontend-kit",
        dryRun: Boolean(args["dry-run"]),
        ok: results.every((result) => result.ok),
        versions: PINNED_TOOL_VERSIONS,
        steps: results,
      },
      null,
      2,
    )
  }

  const lines: string[] = ["Synergy Frontend Kit setup", ""]

  for (const result of results) {
    const prefix = result.skipped ? "SKIP" : result.ok ? "OK" : "FAIL"
    lines.push(`[${prefix}] ${result.label}`)
    lines.push(`      ${commandText(result.command)}`)

    if (args["dry-run"]) {
      lines.push("      dry run only; no command was executed")
    } else if (!result.ok) {
      lines.push(`      ${result.error ?? "Command failed"}`)
      lines.push(`      Run manually: ${result.fallback}`)
    }

    lines.push("")
  }

  lines.push("Next steps")
  lines.push(`  - Add shadcn components: npx shadcn@${PINNED_TOOL_VERSIONS.shadcn} add button card dialog`)
  lines.push("  - Review .layout/kit.json if layout.design initialized it")
  lines.push("  - Run with --json for machine-readable setup status")

  return lines.join("\n")
}

export function setupCommand(ctx: PluginInput): PluginCLICommand {
  return {
    description: "Initialize frontend tooling in the current project (shadcn/ui, layout.design, Playwright browsers)",
    options: {
      "skip-shadcn": {
        type: "boolean",
        description: "Skip shadcn/ui component library initialization",
      },
      "skip-layout": {
        type: "boolean",
        description: "Skip layout.design design system initialization",
      },
      "skip-playwright": {
        type: "boolean",
        description: "Skip Playwright browser installation for visual testing",
      },
      "dry-run": {
        type: "boolean",
        description: "Print the setup plan without running shell commands",
      },
      json: {
        type: "boolean",
        description: "Return machine-readable JSON output",
      },
    } as const,
    async execute(input) {
      const args = input as SetupArgs
      const results = await runSetup(ctx, args)
      return renderSetupResult(results, args)
    },
  }
}
