document.getElementById("errorsOnly").addEventListener("change", function () {
	const showErrorsOnly = this.checked;
	const logRows = document.querySelectorAll(".log-row");

	// biome-ignore lint/complexity/noForEach: <explanation>
	logRows.forEach((row) => {
		if (showErrorsOnly) {
			if (!row.classList.contains("log-error")) {
				row.style.display = "none"; // Hide non-error logs
			}
		} else {
			row.style.display = ""; // Show all logs
		}
	});
});
