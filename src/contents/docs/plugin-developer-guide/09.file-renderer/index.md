---
title: Develop a Kestra File Renderer Plugin
h1: How to Build a Custom File Preview Renderer for Kestra
sidebarTitle: Develop a File Renderer
icon: /src/contents/docs/icons/dev.svg
description: Learn how to implement the FileRenderer interface to add custom file preview support for the Kestra UI Outputs tab.
---

Kestra previews output files directly in the **Outputs** tab. This preview is powered by `FileRenderer` implementations — one per file type. Implement `FileRenderer` to add preview support for file formats your plugin produces.

## What is a `FileRenderer`

`FileRenderer` is a Java interface (`io.kestra.core.preview.FileRenderer`) annotated with `@Plugin`. Kestra's plugin scanner automatically discovers every `FileRenderer` implementation on the classpath — implement the interface, package it with your plugin, and Kestra picks it up at startup.

Built-in renderers in `io.kestra.plugin.core.preview` cover text, ION, image, and PDF formats. When your plugin produces files in a format not covered by those — such as CSV, Parquet, Avro, or a domain-specific binary — implement a `FileRenderer` to give those files a meaningful preview.

## The `FileRenderer` interface

```java
@io.kestra.core.models.annotations.Plugin
public interface FileRenderer extends Plugin {

    boolean supports(String extension);

    FilePreview render(
        String extension,
        InputStream inputStream,
        Optional<Charset> charset,
        int maxRows
    ) throws IOException;
}
```

Implement both methods:

- `supports(String extension)` — return `true` if this renderer handles the given extension. The extension is always lowercase with no leading dot (e.g., `"csv"`, `"parquet"`).
- `render(...)` — read the `InputStream` and return a `FilePreview`. Throw `IllegalArgumentException` at the top of `render()` when `supports(extension)` returns `false`.

## The `FilePreview` return type

```java
@Getter
@Builder
public class FilePreview {
    private String extension;
    private Type type;
    private Object content;
    @Builder.Default
    private boolean truncated = false;

    public enum Type {
        TEXT, LIST, IMAGE, MARKDOWN, PDF
    }
}
```

The `type` field controls how the UI renders `content`:

| Type | Content format | UI rendering |
|---|---|---|
| `TEXT` | `String` | Plain text, monospace |
| `MARKDOWN` | `String` | Rendered markdown |
| `LIST` | `List<Object>` | Interactive data table |
| `IMAGE` | `String` (base64) | Inline image |
| `PDF` | `String` (base64) | Embedded PDF viewer |

Set `truncated = true` when you capped reading at `maxRows` (or a byte limit) and the file contains more content.

## Implement a plain text or markdown renderer

For formats where content is best shown as-is — XML, YAML configuration, log files — use `Type.TEXT`. For formats that produce markdown-formatted text — generated reports, notebook summaries — use `Type.MARKDOWN`. The implementation is identical; only the type constant changes.

Use a byte cap rather than a row count — row boundaries don't apply to most text formats.

```java
@SuperBuilder
@ToString
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Schema(
    title = "XML file renderer",
    description = "Preview XML files as plain text inside the Kestra UI."
)
public class XmlFileRenderer implements FileRenderer {

    private static final int MAX_BYTES = 2 * 1024 * 1024; // 2 MB cap

    @Override
    public boolean supports(String extension) {
        return "xml".equals(extension);
    }

    @Override
    public FilePreview render(
        String extension,
        InputStream inputStream,
        Optional<Charset> charset,
        int maxRows
    ) throws IOException {
        if (!supports(extension)) {
            throw new IllegalArgumentException("Unsupported extension: " + extension);
        }
        Charset cs = charset.orElse(StandardCharsets.UTF_8);
        byte[] bytes = inputStream.readNBytes(MAX_BYTES);
        boolean truncated = inputStream.read() != -1;
        return FilePreview.builder()
            .content(new String(bytes, cs))
            .truncated(truncated)
            .extension(extension)
            .type(FilePreview.Type.TEXT)
            .build();
    }
}
```

`readNBytes(MAX_BYTES)` reads up to the cap, then `inputStream.read() != -1` detects whether the file had more content. To render as markdown instead, replace `.type(FilePreview.Type.TEXT)` with `.type(FilePreview.Type.MARKDOWN)` — the content format and truncation logic stay the same.

## Implement a tabular renderer

For formats that produce rows of data, use `Type.LIST` and return a `List<Object>` as `content`. Each element represents one row and can be a `Map`, a POJO, or a primitive. The UI automatically prepends a `#` row-index column — do not include it in your row maps.

The `maxRows` parameter defaults to `100` (matching the **Row count** control visible in the preview panel). Your renderer receives whatever value the user selects.

:::alert{type="info"}
The example below uses Apache Commons CSV. Add the dependency to your plugin's `build.gradle`:

```groovy
implementation 'org.apache.commons:commons-csv:1.10.0'
```
:::

:::collapse{title="CSV renderer example"}

```java
@SuperBuilder
@ToString
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Schema(
    title = "CSV file renderer",
    description = "Preview CSV files inside the Kestra UI."
)
public class CsvFileRenderer implements FileRenderer {

    @Override
    public boolean supports(String extension) {
        return "csv".equals(extension);
    }

    @Override
    public FilePreview render(
        String extension,
        InputStream inputStream,
        Optional<Charset> charset,
        int maxRows
    ) throws IOException {
        if (!supports(extension)) {
            throw new IllegalArgumentException("Unsupported extension: " + extension);
        }

        Charset cs = charset.orElse(StandardCharsets.UTF_8);
        List<Object> rows = new ArrayList<>();
        boolean truncated = false;

        try (
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, cs));
            CSVParser parser = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .build()
                .parse(reader)
        ) {
            List<String> headers = parser.getHeaderNames();
            for (CSVRecord record : parser) {
                if (rows.size() >= maxRows) {
                    truncated = true;
                    break;
                }
                Map<String, String> row = new LinkedHashMap<>();
                for (String header : headers) {
                    row.put(header, record.get(header));
                }
                rows.add(row);
            }
        }

        return FilePreview.builder()
            .content(rows)
            .truncated(truncated)
            .extension(extension)
            .type(FilePreview.Type.LIST)
            .build();
    }
}
```
:::

## Implement a binary renderer

For binary formats, base64-encode the full `InputStream` and return it as a `String`. Use `Type.IMAGE` to display inline; use `Type.PDF` to open in the embedded PDF viewer. Binary renderers always return `truncated = false` — the entire file is encoded.

```java
@SuperBuilder
@ToString
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Schema(
    title = "TIFF image renderer",
    description = "Preview TIFF image files inside the Kestra UI."
)
public class TiffFileRenderer implements FileRenderer {

    @Override
    public boolean supports(String extension) {
        return "tif".equals(extension) || "tiff".equals(extension);
    }

    @Override
    public FilePreview render(
        String extension,
        InputStream inputStream,
        Optional<Charset> charset,
        int maxRows
    ) throws IOException {
        if (!supports(extension)) {
            throw new IllegalArgumentException("Unsupported extension: " + extension);
        }
        String content = Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        return FilePreview.builder()
            .content(content)
            .truncated(false)
            .extension(extension)
            .type(FilePreview.Type.IMAGE)
            .build();
    }
}
```

For a PDF renderer, replace `.type(FilePreview.Type.IMAGE)` with `.type(FilePreview.Type.PDF)` — the rest of the implementation is identical.

## Required annotations

Every `FileRenderer` implementation needs the standard Lombok and `@Schema` annotations used across Kestra plugins:

```java
@SuperBuilder
@ToString
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Schema(
    title = "Short UI-facing name",
    description = "Shown in plugin documentation."
)
public class MyFileRenderer implements FileRenderer {
    // implementation
}
```

The `@Plugin` annotation is declared on the `FileRenderer` interface itself — do not repeat it on your implementation class.

## `supports()` contract

- The extension is always lowercase with no leading dot. A simple `equals()` check is sufficient; `equalsIgnoreCase()` is also accepted.
- Match the extension only — never the full filename or MIME type.
- Kestra calls `supports()` before `render()` to select a renderer. Every file with a matching extension in the **Outputs** tab calls your `render()` method.
- When two renderers both return `true` for the same extension, the first one found wins. Avoid overlapping with built-in renderers unless you intend to replace them.

## `maxRows` and truncation

`maxRows` limits how many rows to read. The UI defaults this to `100` via the **Row count** control in the preview panel. Always respect it for tabular formats:

1. Stop reading once you have collected `maxRows` rows.
2. Check whether more data remains.
3. If it does, set `truncated = true` in the builder.

For non-tabular formats, use a byte cap instead and set `truncated` accordingly — `maxRows` is advisory for text and binary renderers. Binary renderers always return `truncated = false` because they encode the full file.

## Plugin scanner discovery

Kestra's `PluginScanner` discovers every `FileRenderer` on the classpath at startup. No YAML registration, no `META-INF` service loader entry, and no user configuration is needed. Package your renderer in the same JAR as your plugin tasks.

## Documentation

Document your file renderer using `@Schema` annotations, the same way you document tasks and conditions. See [Document each plugin](../07.document/index.md) for the full annotation reference and manifest attributes.
