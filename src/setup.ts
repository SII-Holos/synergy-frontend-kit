import type { PluginCLICommand, PluginInput } from "@ericsanchezok/synergy-plugin"

interface SetupArgs {
  "skip-shadcn"?: boolean
  "skip-layout"?: boolean
  "skip-playwright"?: boolean
}

interface UpdateArgs {
  "dry-run"?: boolean
}

async function execStep(
  ctx: PluginInput,
  label: string,
  command: string[],
  fallback: string,
): Promise<string[]> {
  const results: string[] = []
  results.push(`▸ ${label}...`)
  try {
    await ctx.$`${command[0]} ${command.slice(1)}`.quiet()
    results.push(`  ✓ ${label.split("(")[0].trim()} complete`)
  } catch (err) {
    results.push(`  ✗ ${label.split("(")[0].trim()} failed: ${err instanceof Error ? err.message : String(err)}`)
    results.push(`  Run manually: ${fallback}`)
  }
  results.push("")
  return results
}

export function setupCommand(ctx: PluginInput): PluginCLICommand {
  return {
    description:
      "Initialize frontend tooling in the current project (shadcn/ui, layout.design, Playwright browsers)",
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
    } as const,
    async execute(args: SetupArgs) {
      const lines: string[] = ["🎨 Synergy Frontend Kit — Setup", ""]

      if (!args["skip-shadcn"]) {
        for (const line of await execStep(
          ctx,
          "Initializing shadcn/ui...",
          ["npx", "shadcn@latest", "init", "-d"],
          "npx shadcn@latest init",
        )) {
          lines.push(line)
        }
      }

      if (!args["skip-layout"]) {
        for (const line of await execStep(
          ctx,
          "Initializing layout.design...",
          ["npx", "@layoutdesign/context", "init"],
          "npx @layoutdesign/context init",
        )) {
          lines.push(line)
        }
      }

      if (!args["skip-playwright"]) {
        for (const line of await execStep(
          ctx,
          "Installing Playwright browsers (this may take a while)...",
          ["npx", "playwright", "install", "--with-deps", "chromium"],
          "npx playwright install --with-deps chromium",
        )) {
          lines.push(line)
        }
      }

      lines.push("─────────────────────────────────────")
      lines.push("Setup complete!")
      lines.push("")
      lines.push("Next steps:")
      lines.push("  • Add shadcn components:    npx shadcn@latest add button card dialog")
      lines.push("  • Customize design tokens:  edit .layout/kit.json")
      lines.push("  • The frontend-designer agent is now available — try delegating a UI task!")
      lines.push("")
      lines.push("Tip: run 'synergy frontend-kit update' to sync skills with upstream repos.")
      lines.push("─────────────────────────────────────")

      return lines.join("\n")
    },
  }
}

export function updateCommand(ctx: PluginInput): PluginCLICommand {
  return {
    description: "Sync bundled design skills with upstream source repositories",
    options: {
      "dry-run": {
        type: "boolean",
        description: "Preview which skills would be updated without applying changes",
      },
    } as const,
    async execute(args: UpdateArgs) {
      const scriptPath = `${ctx.pluginDir}/scripts/update.sh`
      const flags = args["dry-run"] ? "--dry-run" : ""

      try {
        const result = await ctx.$`bash ${scriptPath} ${flags}`.text()
        return result
      } catch (err) {
        return `✗ Update failed: ${err instanceof Error ? err.message : String(err)}\nMake sure scripts/update.sh exists and is executable.`
      }
    },
  }
}
