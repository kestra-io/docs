---
title: ION Output Files Are Now Binary
sidebarTitle: ION Binary Format
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: Kestra 2.0 writes ION task output files in binary format. Expressions that call read() on an ION output and then perform string operations will fail. Wrap with fromIon() to fix.
---

Kestra 2.0 stores ION task output files in **binary format** instead of text format, reducing storage by ~20–40% and improving serialization speed. The `read()` Pebble function now returns `byte[]` instead of a String when it reads a binary ION file. Expressions that perform string operations directly on the result of `read()` — such as `contains`, string embedding in log messages, or raw text comparison — will fail or display binary data.

:::alert{type="warning"}
Any expression that calls `read()` on an ION task output URI and then performs string operations must be updated before upgrading to 2.0.0. Affected expressions silently produce incorrect results or throw type errors at runtime.
:::

## What changed

Before 2.0, Kestra stored ION data as human-readable text. The `read()` function decoded every file to a UTF-8 `String`, so `{{ read(outputs.task.uri) contains 'value' }}` worked as expected.

In 2.0, ION data is stored in binary format. The `read()` function detects binary ION by inspecting the file header and returns `byte[]` instead of `String`. String operations on `byte[]` either throw a type error or compare against raw bytes — neither produces the expected result.

`fromIon()` now accepts both `String` and `byte[]`, so `{{ fromIon(read(outputs.task.uri)) }}` works correctly across both versions.

## Affected expressions

| Expression | 1.x | 2.0 | Action |
|---|---|---|---|
| `{{ read(outputs.x.uri) contains 'value' }}` | ✅ works | ❌ fails | Wrap with `fromIon()` |
| `{{ read(outputs.x.uri) }}` in a log/message | ✅ human-readable text | ❌ binary bytes | Wrap with `fromIon()` |
| `{{ fromIon(read(outputs.x.uri)) }}` | ✅ works | ✅ works | No change needed |
| `{{ fromIon(read(outputs.x.uri), allRows=true) }}` | ✅ works | ✅ works | No change needed |
| `{{ read(outputs.x.outputFiles['file.csv']) }}` | ✅ works | ✅ works | Not ION — no change |
| `{{ read(outputs.x.outputFiles['file.json']) }}` | ✅ works | ✅ works | Not ION — no change |

Only URIs pointing to ION-format files are affected. Files in CSV, JSON, XML, YAML, or any other non-ION format continue to be returned as `String` by `read()`, unchanged.

Tasks that produce ION output URIs include: `FileTransform` (Nashorn, Groovy, Python, and other script runtimes), query tasks with `fetchType: FETCH` or `fetchType: FETCH_ONE`, `io.kestra.plugin.core.storage.Write` with `.ion` extension, `Split`, and `Concat` when producing `.ion` output.

## Patterns and fixes

### Assert conditions

**Before**

```yaml
- id: assert
  type: io.kestra.plugin.core.execution.Assert
  conditions:
    - "{{ read(outputs.transform.uri) contains 'jane' }}"
```

**After**

```yaml
- id: assert
  type: io.kestra.plugin.core.execution.Assert
  conditions:
    - "{{ fromIon(read(outputs.transform.uri), allRows=true) | length == 1 }}"
    - "{{ fromIon(read(outputs.transform.uri), allRows=true) | first | values | first contains 'jane' }}"
```

For simpler single-field checks, access the field directly on the deserialized row:

```yaml
conditions:
  - "{{ fromIon(read(outputs.transform.uri)).name == 'jane' }}"
```

### Log messages with ION outputs

**Before**

```yaml
- id: log
  type: io.kestra.plugin.core.log.Log
  message: "Row content: {{ read(outputs.transform.uri) }}"
```

**After**

```yaml
- id: log
  type: io.kestra.plugin.core.log.Log
  message: "Row content: {{ fromIon(read(outputs.transform.uri), allRows=true) }}"
```

### Checking row count

**Before**

```yaml
condition: "{{ read(outputs.query.uri) | length > 0 }}"
```

**After**

```yaml
condition: "{{ fromIon(read(outputs.query.uri), allRows=true) | length > 0 }}"
```

## Backup compatibility

Backups created by Kestra 2.0 are stored in binary ION format. Kestra 2.0 can restore backups created by 1.x (auto-detection handles the format difference). Kestra 1.x **cannot** restore backups created by 2.0. If you need to roll back to 1.x after upgrading, use a backup taken before the upgrade.

## Existing stored files

ION files already stored in internal storage from a 1.x instance are in text format. Kestra 2.0 reads both formats automatically — no data migration is needed for existing files.

## Migration steps

1. Search all flows for expressions matching `read(outputs.` that perform string operations: `contains`, direct string embedding in messages, or string comparison.
2. For each match, confirm the task referenced by the output URI produces ION format (FileTransform, query FETCH tasks, Write with `.ion` extension).
3. Replace `read(outputs.x.uri)` with `fromIon(read(outputs.x.uri))` to get the first row deserialized, or `fromIon(read(outputs.x.uri), allRows=true)` to get all rows as a list.
4. Update Assert conditions, log messages, and any downstream expressions that operated on the raw string content.
5. Validate updated flows in a 2.0 environment before promoting to production.
