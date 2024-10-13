function btnToSpinner() {
	const submitBtn = document.querySelector("#testButton");

	submitBtn.addEventListener("click", () => {
		submitBtn.outerHTML =
			'<span class="loading loading-infinity loading-lg"></span>';
	});
}

/*
 * Function to open the printer friendly tools in a new tab
 */
// eslint-disable-next-line no-unused-vars
const openInNewTab = () => {
	const x = window.open();
	const newPage = x.document.createElement("div");
	newPage.width = "100%";
	newPage.height = "100%";
	newPage.innerHTML = document.getElementById("printerFriendlyTools").innerHTML;
	x.document.body.appendChild(newPage);
};

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
			const assignmentElement = document.createElement("div");
			assignmentElement.innerHTML = `
      <tr>
        <td><a href="/tool/search?searchBy=serviceAssignment&searchTerm=${assignment._id}"> ${assignment.toolCount}  | ${assignment.jobNumber} - ${assignment.jobName}</td>
      </tr>
    `;

			// Append each assignment to the container
			serviceAssignmentsContainer.appendChild(assignmentElement);
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

import "../css/style.css";

document.addEventListener("DOMContentLoaded", () => {
	const myDrawerTrigger = document.querySelector(".drawer #my-drawer");
	// biome-ignore lint/complexity/noForEach: <explanation>
	document.querySelectorAll(".drawer .drawer-side ul li").forEach((el) => {
		el.addEventListener("click", () => {
			if (myDrawerTrigger) {
				myDrawerTrigger.checked = false;
			}
		});
	});
});

// src\public\js\toolkeeper.js
