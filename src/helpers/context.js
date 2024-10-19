function countValues(context, key) {
	if (Array.isArray(context[key])) {
		return context[key].length;
	}
	if (context[key] && typeof context[key] === "object") {
		return Object.keys(context[key]).length;
	}
	return 0;
}
export function organizeContext(context) {
	const result = [];
	const { _locals, tools } = context;
	for (const key in _locals) {
		if (typeof _locals[key] === "object" && !Array.isArray(_locals[key])) {
			result.push({
				key,
				content: _locals[key],
			});
		}
	}
    result.push({ key: "tools", content: tools });
    console.log(result);
	return result;
}

const context = {
	settings: {
		"x-powered-by": true,
		etag: "weak",
		env: "development",
		"query parser": "extended",
		"subdomain offset": 2,
		"trust proxy": 1,
		views: "./src/views",
		"jsonp callback name": "callback",
		"view engine": ".hbs",
	},
	user: {
		_id: "663870c0a1a9cdb4b707c737",
		firstName: "Admin",
		lastName: "User",
		email: "admin@toolkeeper.site",
		password: "$2a$10$AShXjhzY9xbt0jEvISEoP.C.m8B3VK0ubfj2ZEHDGlf/v1SpJySEW",
		role: "Superadmin",
		status: "Active",
		preferences: {
			theme: "dracula",
			sortField: "serialNumber",
			sortDirection: "asc",
			pageSize: "10",
			developer: "on",
		},
		tenant: "66af881237c17b64394a4166",
		createdAt: "2024-10-16T23:50:19.597Z",
		updatedAt: "2024-10-18T02:43:05.072Z",
		__v: 0,
		displayName: "Admin User",
		id: "663870c0a1a9cdb4b707c737",
	},
	categories: [
		{
			_id: "64a1c3d8d71e121dfd39b7ab",
			name: "Uncategorized",
			id: "64a1c3d8d71e121dfd39b7ab",
		},
	],
	activeServiceAssignments: [],
	cachedContent: {
		data: {
			serviceAssignments: [],
			categories: [
				{
					_id: "64a1c3d8d71e121dfd39b7ab",
					prefix: "UC",
					name: "Uncategorized",
					description: "For Tools that dont have a category",
					tenant: "66af881237c17b64394a4166",
					createdAt: "2024-10-16T23:50:19.640Z",
					updatedAt: "2024-10-16T23:50:19.640Z",
					__v: 0,
				},
			],
		},
		hash: "caf8126dc8985fb36f0b219b9bb9c4dcb5f8708d76724b46f5649ed44843d3dd",
	},
	tools: [],
	message: "There are no tools to make into a list",
	dashboardStats: {
		todaysTools: 0,
		thisWeeksTools: 0,
		totalIn: 0,
		totalOut: 0,
		totalTools: 0,
	},
	recentlyUpdatedTools: [],
	messages: {},
	_locals: {
		user: {
			_id: "663870c0a1a9cdb4b707c737",
			firstName: "Admin",
			lastName: "User",
			email: "admin@toolkeeper.site",
			password: "$2a$10$AShXjhzY9xbt0jEvISEoP.C.m8B3VK0ubfj2ZEHDGlf/v1SpJySEW",
			role: "Superadmin",
			status: "Active",
			preferences: {
				theme: "dracula",
				sortField: "serialNumber",
				sortDirection: "asc",
				pageSize: "10",
				developer: "on",
			},
			tenant: "66af881237c17b64394a4166",
			createdAt: "2024-10-16T23:50:19.597Z",
			updatedAt: "2024-10-18T02:43:05.072Z",
			__v: 0,
			displayName: "Admin User",
			id: "663870c0a1a9cdb4b707c737",
		},
		categories: [
			{
				_id: "64a1c3d8d71e121dfd39b7ab",
				name: "Uncategorized",
				id: "64a1c3d8d71e121dfd39b7ab",
			},
		],
		activeServiceAssignments: [],
		cachedContent: {
			data: {
				serviceAssignments: [],
				categories: [
					{
						_id: "64a1c3d8d71e121dfd39b7ab",
						prefix: "UC",
						name: "Uncategorized",
						description: "For Tools that dont have a category",
						tenant: "66af881237c17b64394a4166",
						createdAt: "2024-10-16T23:50:19.640Z",
						updatedAt: "2024-10-16T23:50:19.640Z",
						__v: 0,
					},
				],
			},
			hash: "caf8126dc8985fb36f0b219b9bb9c4dcb5f8708d76724b46f5649ed44843d3dd",
		},
		tools: [],
		message: "There are no tools to make into a list",
		dashboardStats: {
			todaysTools: 0,
			thisWeeksTools: 0,
			totalIn: 0,
			totalOut: 0,
			totalTools: 0,
		},
		recentlyUpdatedTools: [],
		messages: {},
	},
	cache: false,
	body: '<div class="mb-2 text-center">\r\n <div class="stats shadow">\r\n <div class="stat">\r\n <div class="stat-figure text-secondary">\r\n <svg\r\n xmlns="http://www.w3.org/2000/svg"\r\n fill="none"\r\n viewBox="0 0 24 24"\r\n class="inline-block w-8 h-8 stroke-current"\r\n >\r\n <path\r\n stroke-linecap="round"\r\n stroke-linejoin="round"\r\n stroke-width="2"\r\n d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"\r\n ></path>\r\n </svg>\r\n </div>\r\n <div class="stat-title">\r\n Changes\r\n <br />\r\n Today\r\n </div>\r\n <div class="stat-value">\r\n 0\r\n </div>\r\n </div>\r\n \r\n <div class="stat">\r\n <div class="stat-figure text-secondary">\r\n <svg\r\n xmlns="http://www.w3.org/2000/svg"\r\n fill="none"\r\n viewBox="0 0 24 24"\r\n class="inline-block w-8 h-8 stroke-current"\r\n >\r\n <path\r\n stroke-linecap="round"\r\n stroke-linejoin="round"\r\n stroke-width="2"\r\n d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"\r\n ></path>\r\n </svg>\r\n </div>\r\n <div class="stat-title">\r\n Changes\r\n <br />\r\n This Week\r\n </div>\r\n <div class="stat-value">\r\n 0\r\n </div>\r\n </div>\r\n \r\n <div class="stat">\r\n <div class="stat-figure text-secondary">\r\n </div>\r\n <div class="stat-title">\r\n Total Checked In/Out\r\n </div>\r\n <div class="stat-value">\r\n 0 in <br>\r\n 0 out\r\n </div>\r\n </div>\r\n </div></div>\r\n<div class="flex flex-row">\r\n <div class="flex-1" id="recentlyChanged">\r\n </div>\r\n <div class="flex flex-1 flex-col">\r\n <div class="text-center text-2xl font-semibold">Quick Search Links</div>\r\n <div class="flex flex-row justify-evenly">\r\n <div class="flex flex-row px-2 pb-2 overflow-y-scroll max-h-[75vh]">\r\n <table class="table table-xs w-auto max-h-min table-pin-rows table-pin-cols">\r\n <thead>\r\n <tr>\r\n <th>Categories</th>\r\n </tr>\r\n </thead>\r\n <tbody>\r\n <tr>\r\n <td><a href="/tool/search?searchBy=category&searchTerm=64a1c3d8d71e121dfd39b7ab"> Uncategorized</td>\r\n \r\n </tr>\r\n </tbody>\r\n </table>\r\n </div>\r\n </div>\r\n </div> </div>\r\n </div>\r\n</div>\r\n <script>\r\n document.addEventListener(\'DOMContentLoaded\', function () {\r\n const cachedContent = {"data":{"serviceAssignments":[],"categories":[{"_id":"64a1c3d8d71e121dfd39b7ab","prefix":"UC","name":"Uncategorized","description":"For Tools that dont have a category","tenant":"66af881237c17b64394a4166","createdAt":"2024-10-16T23:50:19.640Z","updatedAt":"2024-10-16T23:50:19.640Z","__v":0}]},"hash":"caf8126dc8985fb36f0b219b9bb9c4dcb5f8708d76724b46f5649ed44843d3dd"}\r\n \r\n // Get the current cached data and hash from localStorage\r\n const cachedHash = localStorage.getItem(\'serviceDataHash\')\r\n \r\n // If the hash doesn\'t match, update the cache\r\n if (cachedHash !== cachedContent.hash) {\r\n // Store the new data and hash in localStorage\r\n localStorage.setItem(\'serviceData\', JSON.stringify(cachedContent.data))\r\n localStorage.setItem(\'serviceDataHash\', cachedContent.hash)\r\n }\r\n })\r\n </script>',
};
