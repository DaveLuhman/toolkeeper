
function openInNewTab() {
	const x = globalThis.open();
	const newPage = x.document.createElement("div");
	newPage.width = "100%";
	newPage.height = "100%";
	newPage.innerHTML = document.getElementById("printerFriendlyTools").innerHTML;
	x.document.body.appendChild(newPage);
}
if (document.getElementsByClassName("fa-print").length > 0) {
	console.log("Print button found.");
	document
		.getElementsByClassName("fa-print")[0]
		.addEventListener("click", openInNewTab);
}
function populateDashboard(cachedData) {
	const serviceAssignmentsContainer = document.getElementById(
		"service-assignments-parent",
	);
	if (serviceAssignmentsContainer) {
		// Clear any existing content
		serviceAssignmentsContainer.innerHTML = "";

		// Loop through the cached service assignments and render them
		// biome-ignore lint/complexity/noForEach: <explanation>
		cachedData.serviceAssignments.forEach((assignment) => {
			if (assignment.toolCount > 0 && assignment.active) {
				const assignmentElement = document.createElement("div");
				assignmentElement.innerHTML = `
      <tr>
        <td><a href="/tool/search?searchBy=serviceAssignment&searchTerm=${assignment._id}"> ${assignment.toolCount}  | ${assignment.jobNumber} - ${assignment.jobName}</td>
      </tr>
    `;

				// Append each active assignment to the container
				serviceAssignmentsContainer.appendChild(assignmentElement);
			}
		});
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const cachedData = JSON.parse(localStorage.getItem("serviceData"));

	if (cachedData) {
		// Pass the cached data to a function to populate the dashboard
		populateDashboard(cachedData);
	} else {
		console.log("No cached data found.");
	}
});

// src\public\js\toolkeeper.js
