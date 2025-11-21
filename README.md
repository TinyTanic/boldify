# Text Boldify

Apply bold formatting to selected text based on file type. This VS Code extension automatically detects your file type and wraps selected text with the appropriate bold syntax.

## Features

- **Automatic file type detection** - Works with Markdown, HTML, LaTeX, reStructuredText, TypeScript, and JavaScript
- **Smart formatting** - Applies the correct bold syntax for each file type
- **Quick keyboard shortcut** - Use `Ctrl+B Ctrl+B` (or `Cmd+B Cmd+B` on Mac) to boldify selected text
- **Multi-line support** - Works seamlessly with multi-line selections
- **Graceful error handling** - Clear feedback when text isn't selected or file type isn't supported

## Supported File Types

| File Type               | Bold Syntax     | Example              |
| ----------------------- | --------------- | -------------------- |
| Markdown                | `**text**`      | `**bold text**`      |
| HTML                    | `<b>text</b>`   | `<b>bold text</b>`   |
| LaTeX                   | `\textbf{text}` | `\textbf{bold text}` |
| reStructuredText        | `**text**`      | `**bold text**`      |
| TypeScript / JavaScript | `<b>text</b>`   | `<b>bold text</b>`   |
| TSX / JSX               | `<b>text</b>`   | `<b>bold text</b>`   |

## Usage

### Using the Keyboard Shortcut

1. Select the text you want to make bold
2. Press `Ctrl+B Ctrl+B` (Windows/Linux) or `Cmd+B Cmd+B` (Mac)
3. The selected text will be wrapped with the appropriate bold syntax

### Using the Command Palette

1. Select the text you want to make bold
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Type "Boldify Selected Text" and press Enter
4. The selected text will be wrapped with the appropriate bold syntax

## Examples

### Markdown

```markdown
Before: This is regular text
Select: regular
After: This is **regular** text
```

### HTML

```html
Before:
<p>This is regular text</p>
Select: regular After:
<p>This is <b>regular</b> text</p>
```

### LaTeX

```latex
Before: This is regular text
Select: regular
After: This is \textbf{regular} text
```

### reStructuredText

```rst
Before: This is regular text
Select: regular
After: This is **regular** text
```

### TypeScript / JavaScript

```typescript
Before: const message = "This is regular text";
Select: regular;
After: const message = "This is <b>regular</b> text";
```

## Requirements

- Visual Studio Code version 1.80.0 or higher

## Known Limitations

- If text already contains bold syntax, additional formatting will be applied (nested bold)
- Only works with the supported file types listed above
- Requires text to be selected before invoking the command

## Feedback and Contributions

Found a bug or have a feature request? Please open an issue on the GitHub repository.

## License

This extension is provided as-is without warranty.
