# Change Log

All notable changes to the "Boldify" extension will be documented in this file.

## [0.0.1] - 2024-11-21

### Added

- Initial release of Boldify extension
- Support for Markdown bold formatting with `**text**` syntax
- Support for HTML bold formatting with `<b>text</b>` tags
- Support for LaTeX bold formatting with `\textbf{text}` command
- Support for reStructuredText bold formatting with `**text**` syntax
- Keyboard shortcut: `Ctrl+B Ctrl+B` (Windows/Linux) or `Cmd+B Cmd+B` (Mac)
- Command Palette command: "Boldify Selected Text"
- Automatic file type detection based on VS Code language mode
- Multi-line text selection support
- User feedback messages for edge cases:
  - No text selected
  - No active editor
  - Unsupported file type
  - Text replacement failures
- Graceful handling of non-text editors (diff views, output panels, etc.)

### Features

- Maintains cursor position after applying bold formatting
- Preserves original text content
- Marks document as modified after formatting
- Handles already-bolded text by adding additional formatting

## [Unreleased]

### Added

- Support for TypeScript files (`.ts`) using HTML `<b>` tags
- Support for JavaScript files (`.js`) using HTML `<b>` tags
- Support for TSX files (`.tsx`) using HTML `<b>` tags
- Support for JSX files (`.jsx`) using HTML `<b>` tags
- Configuration setting `boldify.customFormats` to customize bold formatting per language
- Support for custom format templates using `{text}` placeholder
- Ability to override default formatters with custom templates
- Ability to add support for additional languages via custom formats

### Changed

- HTML formatter now uses `<b>` tags instead of `<strong>` tags

### Planned

- Additional file type support (AsciiDoc, Textile, etc.)
- Configuration options for custom bold syntax
- Toggle bold formatting (remove bold if already applied)
- Support for other text formatting (italic, underline, etc.)
