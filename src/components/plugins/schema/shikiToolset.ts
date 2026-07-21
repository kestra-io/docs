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

let highlighterCoreCache: HighlighterCore | null = null

export const getHighlighterCore = async () => {
    if (highlighterCoreCache) {
        return highlighterCoreCache
    }
    const highlighterCore = await shikiCreateHighlighterCore({
        themes: [githubDark, githubLight, githubDarkDefault, githubLightDefault],
        langs: [yaml, python, javascript, bash, json],
        engine: createJavaScriptRegexEngine(),
    })
    highlighterCoreCache = highlighterCore
    return highlighterCore
}
