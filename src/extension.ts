import * as vscode from "vscode";

// Selection Validator Component

/**
 * Checks if an active text editor exists
 * @returns The active text editor or undefined if none exists
 */
export function getActiveEditor(): vscode.TextEditor | undefined {
  return vscode.window.activeTextEditor;
}

/**
 * Validates that the editor has a non-empty text selection
 * @param editor The text editor to check
 * @returns True if text is selected, false otherwise
 */
export function hasValidSelection(editor: vscode.TextEditor): boolean {
  return !editor.selection.isEmpty;
}

/**
 * Retrieves the selected text from the editor
 * @param editor The text editor to get selection from
 * @returns The selected text or null if no selection
 */
export function getSelectedText(editor: vscode.TextEditor): string | null {
  if (!hasValidSelection(editor)) {
    return null;
  }
  return editor.document.getText(editor.selection);
}

/**
 * Validates that the editor is a text editor (not a diff editor or other special editor)
 * Edge case handler for Requirement 5.3
 * @param editor The editor to validate
 * @returns True if it's a valid text editor
 */
export function isTextEditor(editor: vscode.TextEditor): boolean {
  // Check if the document has a valid URI scheme (file, untitled, etc.)
  // This helps filter out special editors like diff views, output panels, etc.
  // Supported schemes: 'file' (saved files) and 'untitled' (new unsaved files)
  return (
    editor.document.uri.scheme === "file" ||
    editor.document.uri.scheme === "untitled"
  );
}

// Language Detection Component

/**
 * Supported language types for bold formatting
 */
export type SupportedLanguage =
  | "markdown"
  | "html"
  | "latex"
  | "restructuredtext";

/**
 * Mapping between VS Code language IDs and internal language types
 */
const LANGUAGE_ID_MAP: Record<string, SupportedLanguage> = {
  markdown: "markdown",
  html: "html",
  latex: "latex",
  tex: "latex", // Alternative language ID for LaTeX
  restructuredtext: "restructuredtext",
  rst: "restructuredtext", // Alternative language ID for reStructuredText
  typescript: "html", // TypeScript uses HTML bold syntax
  javascript: "html", // JavaScript uses HTML bold syntax
  typescriptreact: "html", // TSX uses HTML bold syntax
  javascriptreact: "html", // JSX uses HTML bold syntax
};

/**
 * Extracts the language ID from the active editor
 * @param editor The text editor to extract language from
 * @returns The VS Code language ID or null if undefined
 */
export function getLanguageId(editor: vscode.TextEditor): string | null {
  const languageId = editor.document.languageId;
  return languageId || null;
}

/**
 * Detects the language type and maps it to a supported language
 * @param editor The text editor to detect language from
 * @returns The supported language type or null if unsupported/undefined
 */
export function detectLanguage(
  editor: vscode.TextEditor
): SupportedLanguage | null {
  const languageId = getLanguageId(editor);

  if (!languageId) {
    return null;
  }

  return LANGUAGE_ID_MAP[languageId] || null;
}

// Formatter Strategy Component

/**
 * Interface for bold formatters
 */
export interface BoldFormatter {
  languageId: string;
  format(text: string): string;
}

/**
 * Markdown formatter - wraps text with double asterisks
 * Handles edge cases:
 * - Multi-line text: Wraps entire selection including newlines (Requirement 5.2)
 * - Already bold text: Adds additional formatting (Requirement 5.1)
 */
const markdownFormatter: BoldFormatter = {
  languageId: "markdown",
  format: (text: string) => `**${text}**`,
};

/**
 * HTML formatter - wraps text with b tags
 * Handles edge cases:
 * - Multi-line text: Wraps entire selection including newlines (Requirement 5.2)
 * - Already bold text: Adds additional formatting (Requirement 5.1)
 */
const htmlFormatter: BoldFormatter = {
  languageId: "html",
  format: (text: string) => `<b>${text}</b>`,
};

/**
 * LaTeX formatter - wraps text with textbf command
 * Handles edge cases:
 * - Multi-line text: Wraps entire selection including newlines (Requirement 5.2)
 * - Already bold text: Adds additional formatting (Requirement 5.1)
 */
const latexFormatter: BoldFormatter = {
  languageId: "latex",
  format: (text: string) => `\\textbf{${text}}`,
};

/**
 * reStructuredText formatter - wraps text with double asterisks
 * Handles edge cases:
 * - Multi-line text: Wraps entire selection including newlines (Requirement 5.2)
 * - Already bold text: Adds additional formatting (Requirement 5.1)
 */
const restructuredtextFormatter: BoldFormatter = {
  languageId: "restructuredtext",
  format: (text: string) => `**${text}**`,
};

/**
 * Map of supported languages to their formatters
 */
const FORMATTERS: Record<SupportedLanguage, BoldFormatter> = {
  markdown: markdownFormatter,
  html: htmlFormatter,
  latex: latexFormatter,
  restructuredtext: restructuredtextFormatter,
};

/**
 * Retrieves the appropriate formatter for a given language ID
 * @param languageId The language identifier
 * @returns The formatter for the language or null if unsupported
 */
export function getFormatter(
  languageId: SupportedLanguage | null
): BoldFormatter | null {
  if (!languageId) {
    return null;
  }
  return FORMATTERS[languageId] || null;
}

/**
 * Gets custom format template from settings for a specific language
 * @param actualLanguageId The actual VS Code language ID (e.g., "typescript", "javascript")
 * @returns Custom format template or null if not configured
 */
export function getCustomFormat(actualLanguageId: string): string | null {
  const config = vscode.workspace.getConfiguration("textBoldify");
  const customFormats = config.get<Record<string, string>>("customFormats", {});
  return customFormats[actualLanguageId] || null;
}

/**
 * Applies custom format template to text
 * @param text The text to format
 * @param template The format template with {text} placeholder
 * @returns The formatted text
 */
export function applyCustomFormat(text: string, template: string): string {
  return template.replace(/\{text\}/g, text);
}

/**
 * Applies bold formatting to text using the appropriate formatter
 * @param text The text to format
 * @param languageId The language identifier
 * @param actualLanguageId The actual VS Code language ID for custom format lookup
 * @returns The formatted text or null if language is unsupported
 */
export function formatText(
  text: string,
  languageId: SupportedLanguage | null,
  actualLanguageId: string | null
): string | null {
  // Check for custom format first
  if (actualLanguageId) {
    const customFormat = getCustomFormat(actualLanguageId);
    if (customFormat) {
      return applyCustomFormat(text, customFormat);
    }
  }

  // Fall back to default formatter
  const formatter = getFormatter(languageId);
  if (!formatter) {
    return null;
  }
  return formatter.format(text);
}

// Text Replacement Component

/**
 * Replaces the selected text with formatted text in the editor
 * @param editor The text editor to perform replacement in
 * @param formattedText The formatted text to replace the selection with
 * @returns Promise that resolves to true if replacement succeeded, false otherwise
 */
export async function replaceSelection(
  editor: vscode.TextEditor,
  formattedText: string
): Promise<boolean> {
  try {
    // Use editor.edit() to replace the selected text
    const success = await editor.edit((editBuilder) => {
      // Replace the current selection with the formatted text
      editBuilder.replace(editor.selection, formattedText);
    });

    if (success) {
      // After replacement, move cursor to the end of the newly inserted text
      // This maintains a predictable cursor position
      const selection = editor.selection;
      const newPosition = selection.end;
      editor.selection = new vscode.Selection(newPosition, newPosition);
    }

    return success;
  } catch (error) {
    console.error("Error replacing text:", error);
    return false;
  }
}

// Main Command Handler

/**
 * Main command handler that orchestrates the boldify operation
 * This function coordinates all components to apply bold formatting to selected text
 *
 * Edge cases handled:
 * - Text already containing bold syntax: Additional formatting is applied (Requirement 5.1)
 * - Multi-line selections: Bold syntax encompasses all selected lines (Requirement 5.2)
 * - Non-text editors: Graceful handling with appropriate message (Requirement 5.3)
 */
export async function boldifySelectedText(): Promise<void> {
  try {
    // Step 1: Validate active editor existence
    const editor = getActiveEditor();
    if (!editor) {
      vscode.window.showInformationMessage("No active editor found");
      return;
    }

    // Step 2: Validate that editor is a text editor (Edge case: Requirement 5.3)
    // This handles cases like diff editors, output panels, etc.
    if (!isTextEditor(editor)) {
      vscode.window.showInformationMessage(
        "Boldify can only be used in text editors"
      );
      return;
    }

    // Step 3: Validate text selection
    if (!hasValidSelection(editor)) {
      vscode.window.showInformationMessage("Please select text to boldify");
      return;
    }

    const selectedText = getSelectedText(editor);
    if (!selectedText) {
      vscode.window.showInformationMessage("Please select text to boldify");
      return;
    }

    // Step 4: Detect language/file type
    const actualLanguageId = getLanguageId(editor);
    const language = detectLanguage(editor);

    // Step 5: Get formatted text using formatter strategy or custom format
    // Edge case (Requirement 5.1): If text already contains bold syntax,
    // additional formatting is applied without removing existing formatting
    // Edge case (Requirement 5.2): Multi-line selections are handled correctly
    // by the formatter, which wraps the entire selection including newlines
    const formattedText = formatText(selectedText, language, actualLanguageId);
    if (!formattedText) {
      vscode.window.showWarningMessage(
        `Boldify is not supported for this file type (${
          actualLanguageId || "unknown"
        }). Add a custom format in settings or use: Markdown, HTML, LaTeX, reStructuredText, TypeScript, JavaScript`
      );
      return;
    }

    // Step 6: Replace selected text with formatted text
    const success = await replaceSelection(editor, formattedText);
    if (!success) {
      vscode.window.showErrorMessage("Failed to apply bold formatting");
      return;
    }

    // Success - no message needed, the visual change is sufficient feedback
  } catch (error) {
    // Step 7: Error handling for unexpected errors
    console.error("Error in boldifySelectedText:", error);
    vscode.window.showErrorMessage(
      `Failed to apply bold formatting: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("Text Boldify extension is now active");

  // Register the boldify command
  const disposable = vscode.commands.registerCommand(
    "textBoldify.boldify",
    boldifySelectedText
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Cleanup will be handled automatically by VS Code disposing subscriptions
}
