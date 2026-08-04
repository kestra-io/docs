import {type HighlighterCore, createHighlighterCore as shikiCreateHighlighterCore} from "shiki/core"
import {createJavaScriptRegexEngine} from "shiki/engine/javascript"
import githubLight from "shiki/themes/github-light.mjs"
import githubDark from "shiki/themes/github-dark.mjs"
import githubLightDefault from "shiki/themes/github-light-default.mjs"
import githubDarkDefault from "shiki/themes/github-dark-default.mjs"
import yaml from "shiki/langs/yaml.mjs"
import python from "shiki/langs/python.mjs"
import javascript from "shiki/langs/javascript.mjs"
import bash from "shiki/langs/bash.mjs"
import json from "shiki/langs/json.mjs"
// Languages that show up in API-sourced markdown (plugin docs, blueprint
// descriptions): SQL for the JDBC plugins, Groovy/Java for script tasks,
// HCL for Terraform, plus common config/output formats. Each grammar is
// 4-32 KB raw; TypeScript (~190 KB) is deliberately left out — fences in an
// unregistered language render as plain text rather than breaking.
import sql from "shiki/langs/sql.mjs"
import java from "shiki/langs/java.mjs"
import groovy from "shiki/langs/groovy.mjs"
import hcl from "shiki/langs/hcl.mjs"
import dockerfile from "shiki/langs/dockerfile.mjs"
import properties from "shiki/langs/properties.mjs"
import ini from "shiki/langs/ini.mjs"
import xml from "shiki/langs/xml.mjs"
import shellsession from "shiki/langs/shellsession.mjs"
import terraform from "shiki/langs/terraform.mjs"

let highlighterCoreCache: HighlighterCore | null = null

export const getHighlighterCore = async () => {
    if (highlighterCoreCache) {
        return highlighterCoreCache
    }
    const highlighterCore = await shikiCreateHighlighterCore({
        themes: [githubDark, githubLight, githubDarkDefault, githubLightDefault],
        langs: [
            yaml,
            python,
            javascript,
            bash,
            json,
            sql,
            java,
            groovy,
            hcl,
            dockerfile,
            properties,
            ini,
            xml,
            shellsession,
            terraform,
        ],
        engine: createJavaScriptRegexEngine(),
    })
    highlighterCoreCache = highlighterCore
    return highlighterCore
}
