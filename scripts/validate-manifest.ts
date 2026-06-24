#!/usr/bin/env bun
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { PluginManifest } from "@ericsanchezok/synergy-plugin"

const manifestPath = join(import.meta.dir, "..", "plugin.json")
PluginManifest.parse(JSON.parse(readFileSync(manifestPath, "utf-8")))
console.log("plugin.json schema ok")
