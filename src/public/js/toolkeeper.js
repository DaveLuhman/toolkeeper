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

		console.log(
			"All cached service assignments:",
			cachedData.serviceAssignments,
		);

		// Loop through the cached service assignments and render them
		// biome-ignore lint/complexity/noForEach: <explanation>
		cachedData.serviceAssignments.forEach((assignment) => {
			console.log("Processing assignment:", assignment);
			console.log(
				"toolCount:",
				assignment.toolCount,
				"active:",
				assignment.active,
			);

			if (assignment.toolCount > 0 && assignment.active) {
				const tr = document.createElement("tr");
				const td = document.createElement("td");
				td.innerHTML = `<a href="/tool/search?searchBy=serviceAssignment&searchTerm=${assignment._id}"> ${assignment.toolCount}  | ${assignment.jobNumber} - ${assignment.jobName}</a>`;
				tr.appendChild(td);
				serviceAssignmentsContainer.appendChild(tr);
			} else {
				console.log(
					"Assignment filtered out:",
					assignment.jobNumber,
					"toolCount:",
					assignment.toolCount,
					"active:",
					assignment.active,
				);
			}
		});
	}
}

document.addEventListener("DOMContentLoaded", async () => {
	const cachedData = JSON.parse(localStorage.getItem("serviceData"));
	const cachedHash = localStorage.getItem("serviceDataHash");

	// sourcery skip: avoid-function-declarations-in-blocks
	async function fetchAndUpdateCache() {
		console.log("Fetching fresh data from server...");
		try {
			const response = await fetch("/dashboard/cache");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();

			// If the hash is different, update the cache
			if (data.hash !== cachedHash) {
				console.log("Cache is stale, updating with new data...");
				localStorage.setItem("serviceData", JSON.stringify(data.data));
				localStorage.setItem("serviceDataHash", data.hash);
				return data.data;
			}
			console.log("Cache is up to date");
			return cachedData;
		} catch (error) {
			console.error("Error fetching cached data:", error);
			return cachedData; // Fall back to cached data if fetch fails
		}
	}

	if (cachedData && cachedHash) {
		console.log("Found cached data, checking if it's still valid...");
		const data = await fetchAndUpdateCache();
		populateDashboard(data);
	} else {
		console.log("No cached data found, fetching from server...");
		const data = await fetchAndUpdateCache();
		if (data) {
			populateDashboard(data);
		}
	}
});

// src\public\js\toolkeeper.js
