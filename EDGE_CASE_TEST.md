# Edge Case Testing for Text Boldify Extension

## Test Case 1: Text Already Contains Bold Syntax (Requirement 5.1)

Select the text below and apply boldify:
**already bold text**

Expected result: \***\*already bold text\*\***

## Test Case 2: Multi-line Selection (Requirement 5.2)

Select all three lines below and apply boldify:
Line one
Line two
Line three

Expected result:
**Line one
Line two
Line three**

## Test Case 3: Mixed Content Multi-line (Requirement 5.2)

Select the text below including the newlines:
First paragraph with some text.

Second paragraph with more text.

Expected result:
\*\*First paragraph with some text.

Second paragraph with more text.\*\*

## Test Case 4: Non-text Editor (Requirement 5.3)

This is automatically handled - try opening a diff view or output panel and the extension should show:
"Boldify can only be used in text editors"

## Test Case 5: Empty Selection

Don't select anything and try to boldify.
Expected: "Please select text to boldify"

## Test Case 6: No Active Editor

Close all editors and try to invoke the command.
Expected: "No active editor found"

## Manual Testing Instructions:

1. Open this file in VS Code
2. For each test case, select the specified text
3. Press Ctrl+B Ctrl+B (or Cmd+B Cmd+B on Mac)
4. Verify the result matches the expected output
5. Test in different file types (HTML, LaTeX, reStructuredText)
