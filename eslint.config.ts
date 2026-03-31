import vue from "eslint-plugin-vue"
import astro from "eslint-plugin-astro"
import vueParser from "vue-eslint-parser"
import astroParser from "astro-eslint-parser"
import tsParser from "@typescript-eslint/parser"
import { defineConfig } from "eslint/config"

const dynamicCSSClassMessage =
    "Avoid dynamic class names in class bindings. Use explicit class names instead for compatibility with PurgeCSS."

export default defineConfig([
    {
        files: ["**/*.vue"],
        plugins: { vue },
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
                extraFileExtensions: [".vue"],
                sourceType: "module",
            },
        },
        rules: {
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        'VAttribute[directive=true][key.argument.name="class"] TemplateLiteral[expressions.length>0]',
                    message: dynamicCSSClassMessage,
                },
                {
                    selector:
                        'VAttribute[directive=true][key.argument.name="class"] BinaryExpression[operator="+"]',
                    message: dynamicCSSClassMessage,
                },
                {
                    selector:
                        'VAttribute[directive=true][key.argument.name="class"] ArrayExpression > :not(Literal)',
                    message: dynamicCSSClassMessage,
                },
            ],
        },
    },
    {
        files: ["**/*.astro"],
        plugins: { astro },
        languageOptions: {
            parser: astroParser,
            parserOptions: {
                parser: tsParser,
                extraFileExtensions: [".astro"],
                sourceType: "module",
            },
        },
        rules: {
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        'JSXAttribute[name.name="class"] TemplateLiteral[expressions.length>0]',
                    message: dynamicCSSClassMessage,
                },
                {
                    selector:
                        'JSXAttribute[name.name="class"] BinaryExpression[operator="+"]',
                    message: dynamicCSSClassMessage,
                },
                {
                    selector:
                        'JSXAttribute[name.name="class:list"] ArrayExpression > :not(Literal)',
                    message: dynamicCSSClassMessage,
                },
            ],
        },
    },
])
