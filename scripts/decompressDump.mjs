#!/usr/bin/env node
// debug script to decompress nuxt content dump
// usage: node scripts/decompressDump.mjs path/to/dump.sql.html

import { promises as fs } from 'fs'
import * as path from 'path'
import minimist from 'minimist'

function decompressSQLDump(base64Str, compressionType = 'gzip'){
    // Decode Base64 to binary data
    const binaryData = Uint8Array.from(atob(base64Str), c => c.charCodeAt(0))

    // Create a Response from the Blob and use the DecompressionStream
    const response = new Response(new Blob([binaryData]))
    const decompressedStream = response.body?.pipeThrough(new DecompressionStream(compressionType))
    // Read the decompressed data as text
    return new Response(decompressedStream).text()
}

async function main(){
    const cwd = process.cwd()
    const params = minimist(process.argv.slice(2))
    const filePath = params._[0]
    const compressionType = params.compression || 'gzip'
    const finalCwd = filePath.startsWith('/') ? '' : cwd
    const fileContent = await fs.readFile(path.join(finalCwd, filePath), 'utf-8')
    const text = await decompressSQLDump(fileContent, compressionType)
    const outputPath = path.join(path.dirname(path.join(finalCwd, filePath)), 'decompressed.sql')
    await fs.writeFile(outputPath, text)
    return outputPath
}

main().then((outputPath) => console.log('Decompression completed', outputPath)).catch(console.error)
