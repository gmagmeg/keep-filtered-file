# File Filter - Advanced File Search & Management
File Filter enhances file searching in VS Code.
Quickly perform regex-based searches across directories and pin results in a dedicated panel.
Easily access relevant files and resume work without hassle.

🔹 Key Features
- 🚀 Advanced Filtering: Flexible search with regular expressions
- 📌 Persistent Panel: Keep search results in a tree view
- 📋 One-Click Copy: Quickly copy file paths
- ⚡ Quick Access: Integrated with Command Palette & Status Bar

Reduce search overhead and stay focused on development!

## Usage

### File Filtering
1. Click the filter icon in the File Explorer or use the command palette
2. Enter a search pattern (supports regular expressions)
3. View filtered results in the dedicated tree view
4. Use the clear icon to reset the current filter

### Copying File Paths
1. **Single File**:
   - Right-click on a file in the filtered view
   - Select "Copy to Notepad"
   - The file's relative path is copied to clipboard

### Quick Access
- Use the status bar item to quickly check the current time
- Access filtering features from:
  - File Explorer toolbar
  - Editor title bar
  - Command palette

## Commands

- `File Filter: Filter Files` - Open the file filter dialog
- `File Filter: Clear Filter` - Clear the current filter
- `File Filter: Copy to Notepad` - Copy selected file path
- `File Filter: Copy All to Notepad` - Copy all selected file paths
- `File Filter: Show Current Time` - Display current time

## Features in Detail

### File Filtering
- Supports regular expressions for advanced search
- Searches both file names and relative paths
- Case-insensitive search
- Real-time filtering results
- Clear visual feedback

### Tree View
- Dedicated view for filtered results
- Shows file names and relative paths
- Click to open files
- Supports multi-selection
- Updates automatically when workspace changes

### Clipboard Integration
- One-click path copying
- Support for multiple file paths
- Relative path format
- Clear success notifications

## Requirements

- VS Code 1.60.0 or higher

## Extension Settings

This extension does not contribute any settings.

## Known Issues

None at the moment.

## Release Notes

### 0.0.1

Initial release of File Filter:
- Basic file filtering functionality
- Clipboard integration
- Tree view for filtered results
- Status bar integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 