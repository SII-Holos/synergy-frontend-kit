import { readFileSync } from "node:fs"
import type { Plugin } from "@ericsanchezok/synergy-plugin"
import { setupCommand } from "./setup"

function loadAgentPrompt(pluginDir: string): string {
  const filePath = `${pluginDir}/agents/frontend-designer.md`
  try {
    return readFileSync(filePath, "utf-8")
  } catch {
    throw new Error(
      `[synergy-frontend-kit] Missing required file: ${filePath}. The plugin installation may be incomplete.`,
    )
  }
}

export const FrontendKitPlugin: Plugin = {
  id: "synergy-frontend-kit",
  name: "Synergy Frontend Kit",

  async init(ctx) {
    const prompt = loadAgentPrompt(ctx.pluginDir)

    return {
      skills: [
        {
          name: "project-init",
          description:
            "Teaches the agent to self-diagnose and auto-initialize frontend tooling (shadcn/ui, layout.design, Playwright) when MCP tools return configuration-missing errors. Use before starting any frontend design work. Triggers: 'new project', 'init', 'setup', 'MCP error', 'tool not available'.",
          dir: "skills/project-init",
        },
        {
          name: "frontend-design",
          description:
            "Anthropic's frontend design methodology: plan-before-code, declarative-first, atomic refinement. Use when building or redesigning frontend UIs. Triggers: 'frontend', 'design', 'UI', 'component', 'layout', 'styling', 'CSS'.",
          dir: "skills/frontend-design",
        },
        {
          name: "taste-frontend",
          description:
            "Taste Skill v2: systematic design sensibility for frontend. Covers typography, spacing, color theory, and visual hierarchy. Use for design critique and refinement.",
          dir: "skills/taste-frontend",
        },
        {
          name: "color-expert",
          description:
            "Color science expertise: OKLCH color spaces, palette generation algorithms, APCA/WCAG contrast, color harmony theory, and CSS Color 4/5 syntax. Use for any color selection, palette generation, or accessibility contrast work. Triggers: 'color', 'palette', 'OKLCH', 'hex', 'contrast', 'APCA', 'WCAG'.",
          dir: "skills/color-expert",
        },
        {
          name: "typography",
          description:
            "Typography grounded in Bringhurst principles: font pairing methodology, 6 modular type scales, variable fonts, CJK/RTL internationalization, OpenType features, and web font loading strategies. Use for typeface selection, type system design, or font pairing. Triggers: 'font', 'type', 'typography', 'serif', 'sans', 'heading', 'body text'.",
          dir: "skills/typography",
        },
        {
          name: "motion-design",
          description:
            "Universal motion design principles (LottieFiles official): Disney's 12 principles adapted for UI, emotion-to-motion mapping, motion personality archetypes, duration/easing tables, and quality checklist. Use when planning animations or motion systems. Triggers: 'animation', 'motion', 'transition', 'easing', 'GSAP', 'Framer Motion'.",
          dir: "skills/motion-design",
        },
        {
          name: "implementation-rules",
          description:
            "24 deterministic anti-slop coding rules to prevent AI-generated frontend anti-patterns. Covers color, typography, layout, motion, and accessibility. Standing orders for all frontend code. Triggers: 'CSS', 'style', 'component', 'layout', 'Tailwind', 'animation', 'font', 'color', 'spacing', 'accessibility'.",
          dir: "skills/implementation-rules",
        },
        {
          name: "a11y-audit",
          description:
            "Run accessibility audits on web projects combining automated scanning (axe-core, Lighthouse) with WCAG 2.1 AA compliance mapping, manual check guidance, and structured reporting. Triggers: 'accessibility audit', 'a11y audit', 'WCAG audit', 'accessibility check', 'compliance scan'.",
          dir: "skills/a11y-audit",
        },
        {
          name: "soft-design",
          description:
            "Taste soft-skill: design language for gentle, approachable interfaces. Rounded corners, soft shadows, warm palettes, generous whitespace.",
          dir: "skills/soft-design",
        },
        {
          name: "minimalist-design",
          description:
            "Taste minimalist-skill: reductive design principles. Essential elements only, negative space as a feature, typography-driven layouts.",
          dir: "skills/minimalist-design",
        },
      ],

      agents: {
        "frontend-designer": {
          name: "frontend-designer",
          description:
            "Frontend design specialist. Produces visually polished, accessible UIs using React, Tailwind CSS, and shadcn/ui. Applies design methodology from loaded skills. Use for any task where visual quality and design decisions matter — layouts, component selection, styling, design systems, or UI refinement.",
          prompt,
          mode: "subagent" as const,
        },
      },

      cli: {
        setup: setupCommand(ctx),
      },
    }
  },
}

export default FrontendKitPlugin
