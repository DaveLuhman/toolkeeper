const fs = require("fs");
const path = require("node:path");

/**
 * Recursively appends the relative filename as a JS comment to each JS file in the directories.
 * @param {string} dir - The directory to start from (use '.' for current directory).
 */
function appendRelativeFilenameAsComment(dir = ".") {
	// Read all items (files and directories) in the current directory
	fs.readdir(dir, { withFileTypes: true }, (err, items) => {
		if (err) {
			console.error(`Error reading directory ${dir}: ${err.message}`);
			return;
		}

		for(const item of items) {
			const fullPath = path.join(dir, item.name);

			if (item.isDirectory()) {
				// Recursively process subdirectory
				appendRelativeFilenameAsComment(fullPath);
			} else if (item.isFile() && item.name.endsWith(".js")) {
				const relativePath = path.relative(".", fullPath);
				const comment = `\n// ${relativePath}\n`;
				fs.appendFile(fullPath, comment, (err) => {
					if (err) {
						console.error(
							`Error appending to file ${fullPath}: ${err.message}`,
						);
					} else {
						console.log(`Appended to file: ${relativePath}`);
					}
				});
			}
		}
	});
}

// Run the function starting from the current directory
appendRelativeFilenameAsComment(".");
