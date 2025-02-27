import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Main function called when the extension is activated
 * @param context Extension context
 */
export function activate(context: vscode.ExtensionContext) {
  // Register tree view for filtering results
  const filteredFilesProvider = new FilteredFilesProvider();
  const treeView = vscode.window.createTreeView('filteredFiles', {
    treeDataProvider: filteredFilesProvider,
    showCollapseAll: false
  });

  // Monitor tree view visibility changes
  treeView.onDidChangeVisibility(e => {
    if (e.visible) {
      // Update when view becomes visible
      filteredFilesProvider.refresh();
    }
  });

  context.subscriptions.push(treeView);

  /**
   * Copy selected file's relative path to clipboard
   */
  context.subscriptions.push(
    vscode.commands.registerCommand('my-extension.copyToNotepad', async (item: FileItem) => {
      try {
        /**
         * Get the relative path of the selected file and
         * copy it to the clipboard
         */
        const relativePath = vscode.workspace.asRelativePath(item.resourceUri);
        await vscode.env.clipboard.writeText(relativePath);

        vscode.window.showInformationMessage('Path copied to clipboard');
      } catch (error) {
        vscode.window.showErrorMessage(`Error occurred: ${error}`);
      }
    })
  );

  // Register command to copy all selected files to Notepad
  context.subscriptions.push(
    vscode.commands.registerCommand('my-extension.copyAllToNotepad', async () => {
      try {
        const treeView = vscode.window.createTreeView('filteredFiles', {
          treeDataProvider: filteredFilesProvider,
          showCollapseAll: false
        });
        const selectedItems = treeView.selection;

        if (selectedItems.length === 0) {
          vscode.window.showWarningMessage('No files selected');
          return;
        }

        // Get relative paths of all files
        const relativePaths = selectedItems.map((item: FileItem) =>
          vscode.workspace.asRelativePath(item.resourceUri)
        );
        const content = relativePaths.join('\n');

        // Copy to clipboard
        await vscode.env.clipboard.writeText(content);

        vscode.window.showInformationMessage(`${selectedItems.length} file paths copied to clipboard. Please paste them into Cursor's notepad.`);
      } catch (error) {
        vscode.window.showErrorMessage(`Error occurred: ${error}`);
      }
    })
  );

  // Register command to clear filter
  context.subscriptions.push(
    vscode.commands.registerCommand('my-extension.clearFileFilter', async () => {
      await filteredFilesProvider.setFilterPattern('');
      vscode.window.showInformationMessage('Filter cleared');
    })
  );

  // Create status bar item
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "$(clock) Ready";
  statusBarItem.tooltip = "My Extension Status";
  statusBarItem.command = "my-extension.showTime"; // Command to execute when clicked
  statusBarItem.show();

  // New command: Show current date and time
  const showTimeCommand = vscode.commands.registerCommand('my-extension.showTime', () => {
    const now = new Date().toLocaleString();
    vscode.window.showInformationMessage(`Current date and time: ${now}`);
  });

  // Register search command in explorer toolbar
  context.subscriptions.push(
    vscode.commands.registerCommand('my-extension.quickFileFilter', async () => {
      // Show input box
      const pattern = await vscode.window.showInputBox({
        placeHolder: 'Enter filename to search (regular expressions supported)',
        prompt: 'Example: \\.js$ to search for JavaScript files'
      });

      if (pattern !== undefined) {
        try {
          // Test regex if input is not empty
          if (pattern) {
            // Test if regex is valid
            new RegExp(pattern);
          }

          // Set filter pattern and update results
          await filteredFilesProvider.setFilterPattern(pattern);

          // Show filtered results view
          await vscode.commands.executeCommand('filteredFiles.focus');

          if (pattern) {
            vscode.window.showInformationMessage(`Filter "${pattern}" applied`);
          } else {
            vscode.window.showInformationMessage('Filter cleared');
          }
        } catch (error) {
          vscode.window.showErrorMessage(`Invalid regular expression: ${error}`);
        }
      }
    })
  );

  context.subscriptions.push(showTimeCommand, statusBarItem);
}

// Class to maintain filtering results
class FilteredFilesProvider implements vscode.TreeDataProvider<FileItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<FileItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private files: FileItem[] = [];

  constructor() { }

  // Method to update tree view
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  // Set filter pattern and update results
  async setFilterPattern(filterPattern: string): Promise<void> {
    await this.updateFilteredFiles(filterPattern);
    this.refresh();
  }

  // Update filtered files list
  private async updateFilteredFiles(filterPattern: string): Promise<void> {
    if (!filterPattern) {
      this.files = [];
      return;
    }

    try {
      /**
       * Get all files in workspace and filter those matching
       * the regex pattern. Display filtered files in tree view
       */
      const allFiles = await vscode.workspace.findFiles('**/*');
      const regexPattern = new RegExp(filterPattern, 'i');
      const filteredFiles = allFiles
        .filter(file => {
          const fileName = path.basename(file.fsPath);
          const relativePath = vscode.workspace.asRelativePath(file.fsPath);
          return regexPattern.test(fileName) || regexPattern.test(relativePath);
        })
        .map(file => {
          const fileName = path.basename(file.fsPath);
          const relativePath = vscode.workspace.asRelativePath(file.fsPath);
          return new FileItem(
            fileName,
            relativePath,
            file,
            vscode.TreeItemCollapsibleState.None
          );
        });
      this.files = filteredFiles;
    } catch (error) {
      // Handle invalid regex
      vscode.window.showErrorMessage(`Invalid regular expression: ${error}`);
      this.files = [];
    }
  }

  /**
   * Implementation of TreeDataProvider interface
   * Returns TreeItem for each item in tree view
   * This method is called by VS Code to render the tree view
   */
  getTreeItem(element: FileItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FileItem): Thenable<FileItem[]> {
    if (element) {
      return Promise.resolve([]);
    }
    return Promise.resolve(this.files);
  }
}

// Class representing a file item
class FileItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly resourceUri: vscode.Uri,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = description;
    this.description = description; // Show relative path as description
    this.contextValue = 'file';

    // Set command to open file
    this.command = {
      command: 'vscode.open',
      title: 'Open File',
      arguments: [resourceUri]
    };

    // Set icon based on file type
    this.resourceUri = resourceUri; // This will use VS Code's standard file icons
  }
}

// This function is called when the extension is deactivated
export function deactivate() { } 