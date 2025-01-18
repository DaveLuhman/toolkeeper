const dashboardHelp = () => {
	const tour1 = introJs()
		const dashboardSteps = [
			{
				element: "#dashboardLink",
				title: "Dashboard",
				intro:
					"This is the dashboard. It is the main page of the platform. It is where you can view your tools, services, and categories.",
			},
			{
				element: "#createLink",
				title: "Create",
				intro:
					"This is how you create items from anywhere across the platform.",
			},
			{
				element: "#checkInOutLink",
				title: "Check In/Out",
				intro: "This is how you check in and out tools.",
			},
			{
				element: "#searchLink",
				title: "Search",
				intro: "This is how you search for tools.",
			},
			{
				element: "#userMenu",
				title: "User Menu",
				intro: "This is where you can access your profile and settings.",
			},
			{
				element: "#statsBoxToday",
				title: "Today's Changes",
				intro:
					"This is the number of tools that have been checked in or out today.",
			},
			{
				element: "#statsBoxThisWeek",
				title: "This Week's Changes",
				intro:
					"This is the number of tools that have been checked in or out this week.",
			},
			{
				element: "#statsBoxTotal",
				title: "Total Changes",
				intro: "This is the total number of tools that are checked in or out.",
			},
			{
				element: "#recentlyUpdatedTable",
				title: "Recently Updated",
				intro:
					"This is a list of 50 tools that have been most recently updated.",
			},
			{
				element: "#printButton",
				title: "Print",
				intro:
					"This is how you print the displayed list of tools. \
                    Anywhere you see this symbol, you can use it to generate \
                    a printable report.",
			},
		]
		tour1.setOptions({
			steps: dashboardSteps,
		}).start();
};

export default dashboardHelp;
