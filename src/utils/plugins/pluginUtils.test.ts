import { describe, expect, it } from "vitest"
import { isElementNameRedundant } from "~/utils/plugins/pluginUtils"

describe("isElementNameRedundant", () => {
    it("returns true when spaces stripped match (CLI tasks)", () => {
        expect(isElementNameRedundant("Terraform CLI", "TerraformCLI")).toBe(true)
        expect(isElementNameRedundant("AWS CLI", "AwsCLI")).toBe(true)
        expect(isElementNameRedundant("Dbt CLI", "DbtCLI")).toBe(true)
    })

    it("returns true when element name is contained as whole words in container title", () => {
        expect(isElementNameRedundant("Kubernetes Runner", "Kubernetes")).toBe(true)
        expect(isElementNameRedundant("Docker Task Runner", "Docker")).toBe(true)
        expect(isElementNameRedundant("Monday Query", "Query")).toBe(true)
        expect(isElementNameRedundant("Log", "Log")).toBe(true)
    })

    it("returns false for non-matching tasks and substring traps", () => {
        expect(isElementNameRedundant("Google Compute", "Put")).toBe(false)
        expect(isElementNameRedundant("AWS S3", "Upload")).toBe(false)
        expect(isElementNameRedundant("Core", "Pause")).toBe(false)
    })
})
