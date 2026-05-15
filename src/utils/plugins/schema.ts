export interface JSONProperty {
    type: string
    name?: string
    unit?: string
    $dynamic?: boolean
    $ref?: string
    $required?: boolean
    $beta?: boolean
    $deprecated?: boolean
    $internalStorageURI?: boolean
    allOf?: JSONProperty[]
    anyOf?: JSONProperty[]
    items?: JSONProperty
    additionalProperties?: JSONProperty
    title?: string
    description?: string
    default?: string
    pattern?: string
    minLength?: number
    maxLength?: number
    minItems?: number
    maxItems?: number
    minimum?: number
    exclusiveMinimum?: number
    maximum?: number
    exclusiveMaximum?: number
    format?: string
    enum?: string[]
}

export interface JSONSchema {
    title?: string
    description?: string
    $deprecated?: boolean | string
    definitions?: Record<string, JSONSchema>
    $examples?: {
        title?: string
        code: string
        lang?: string
        full?: boolean
    }[]
    outputs?: {
        properties: Record<string, JSONProperty>
    }
    properties?: Record<string, JSONProperty> & {
        title?: string
        description?: string
        length?: number
        properties?: Record<string, JSONProperty>
        $beta?: boolean
        $examples?: {
            title?: string
            code: string
            lang?: string
            full?: boolean
        }[]
        $metrics?: JSONProperty[]
    }
}

type ExtractedTypes = { types: string[]; subType?: string }

function extractTypesOrRef(propType: JSONProperty): string[] | undefined {
    if (propType.type) {
        return Array.isArray(propType.type) ? propType.type : [propType.type]
    }

    if (propType.$ref) {
        const ref = propType.$ref
        const parts = ref.split("/")
        const key = parts[parts.length - 1]
        return ["#" + key]
    }

    return undefined
}

// Can take a "#full.class.Name" format
export function className(anchor: string): string {
    const noGenericType = anchor.split("_")[0]
    return noGenericType.substring(noGenericType.lastIndexOf(".") + 1)
}

export function extractEnumValues(property: JSONProperty): string[] | undefined {
    if (property.enum) {
        return property.enum
    }

    if (property.items?.enum) {
        return property.items.enum
    }

    if (property.additionalProperties?.enum) {
        return property.additionalProperties.enum
    }

    return undefined
}

export function aggregateAllOf(property: JSONProperty): JSONProperty {
    if (property.allOf) {
        property = property.allOf.reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            { ...property },
        )

        delete property.allOf
    }

    return property
}

export function extractTypeInfo(property: JSONProperty): ExtractedTypes {
    const result: ExtractedTypes = {} as ExtractedTypes

    const getTypes = (property: JSONProperty) => {
        const types = extractTypesOrRef(property)
        if (types && types.length > 0) {
            return types
        }
        if (property.anyOf) {
            return property.anyOf
                .flatMap(extractTypesOrRef)
                .filter((o): o is string => o !== undefined)
                .filter((v, i, a) => a.indexOf(v) === i)
        }
        return undefined
    }

    const extractedType = getTypes(property)
    if (extractedType) {
        result.types = extractedType
    } else {
        result.types = ["object"]
    }

    if (result.types.includes("array") && property.items) {
        const typesToAdd = getTypes(property.items)
        if (typesToAdd && property.items.anyOf) {
            result.types = result.types.filter((type) => type !== "array").concat(typesToAdd)
        }
    }

    if (property.additionalProperties) {
        result.subType = extractTypesOrRef(property.additionalProperties)?.[0]
    } else if (property.items) {
        result.subType = extractTypesOrRef(property.items)?.[0]
    }

    return result
}

export function isDeprecated(schema?: JSONSchema): boolean {
    return schema?.$deprecated === true || schema?.$deprecated === "true"
}

export function extractReferencedDefinitions(
    property: JSONProperty,
    definitions: Record<string, JSONSchema> | undefined,
    visitedKeys: Set<string> = new Set(),
): Array<{ key: string; title: string; properties: Record<string, JSONProperty> }> {
    if (!definitions) return []

    const typeInfo = extractTypeInfo(property)
    const defKeys: string[] = []

    typeInfo.types.forEach((type) => {
        if (type.startsWith("#")) {
            const key = type.slice(1)
            if (definitions[key] && !visitedKeys.has(key) && !defKeys.includes(key)) {
                defKeys.push(key)
            }
        }
    })

    if (typeInfo.subType?.startsWith("#")) {
        const key = typeInfo.subType.slice(1)
        if (definitions[key] && !visitedKeys.has(key) && !defKeys.includes(key)) {
            defKeys.push(key)
        }
    }

    return defKeys
        .filter((key) => !isDeprecated(definitions[key]))
        .map((key) => {
            const def = definitions[key]
            const properties = def?.properties ? { ...def.properties } : {}
            const examples = def?.["$examples"] || properties["$examples"]

            return {
                key,
                title: def?.title ?? key.split("_")[0],
                description: def?.description,
                properties,
                $examples: examples,
            }
        })
}

export function isDynamic(property: JSONProperty): boolean {
    if (property["$dynamic"] === true) return true
    if (property["$dynamic"] === false) return false
    return property.anyOf?.some((prop) => prop["$dynamic"] === true) ?? false
}
