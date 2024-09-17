export const secret = "df027e53-f33b-4155-8ef2-a7366f65acfe";

const toolkeeperProductObject = async () => {
    try{
	const response = await fetch("https://api.lemonsqueezy.com/v1/products", {
		method: "get",
		mode: "cors",
		credentials: "include",
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
			Authorization:
				"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiIwMjllYzNmYzc0NmZlOGM1MTdkMTM1ZTJhMWFhMjI4YzU1YjVkMTU0ZTNmNTM5MTdhMmFiZDJiNjQ3NWE3YjRiNjYwZmRkZWZlNDJlNDBjNSIsImlhdCI6MTcyNjQyMzM0Mi43MDc2NDgsIm5iZiI6MTcyNjQyMzM0Mi43MDc2NTEsImV4cCI6MjA0MTk1NjE0Mi42NTI4MzIsInN1YiI6IjEyMTk4MzYiLCJzY29wZXMiOltdfQ.mmfeSffuNxKbiTpQ0fOSzCYhwQnu6YLqIqReLGX1SgAXrUQ4gsp2wNR6Fj21A7KB4j1rC7zPuZeSqvoHLeB6RoNwpOnYwitm4ALa-An_FlMu0rvJZZ3pOb7ngk7apruK_6GFqiagj2QL_Nv41SnxqzIM9SeKhWuBQ54p5A2r12misdE7t1PZaIYhY95NqB6sz2VukzUbwZcDyYbGPbxi52GSVKI8pzxNkabycw-YhcY2pOvojTFpaIGhV-xb2t-4l3e58JejMDP2aJQkcgZz5fzvwvSIJ9drDhnQYOji_f3R37zZPTeUDU1y6227cPl4rROcoqDn34ynjfuTiMjTLl3hul4V8T4bXIwrkgMkgb-poakHJ-vt_aJQALFTvCxerb-KH3UwJ-0SalGYRc4qFlScE0Gti8KHLqhF83hgdUWGGHN5x5GtsVMv3VGJvSkl8J5tn2EAWvUPOPxVMS0_juMFDGoIvZYjbIW5y1QgBm2PhkZf3o9HbrKKOPI-CjmG",
		},
	});
    if (! response.ok) throw new Error("Invalid response")

	const jsonData = await response.json();
	const toolkeeper = jsonData.data.filter((product) => {
		return product.attributes.slug === "toolkeeper";
	});
	return toolkeeper[0].attributes;
} catch(err){
    console.log(err.message)
}
};

// 	{
// 		type: "products",
// 		id: "349759",
// 		attributes: {
// 			store_id: 122311,
// 			name: "Toolkeeper",
// 			slug: "toolkeeper",
// 			description:
// 				"<p>ToolKeeper is a powerful tool crib management platform designed to help contractors keep track of what tools are where with ease.</p>",
// 			status: "published",
// 			status_formatted: "Published",
// 			thumb_url:
// 				"https://lemonsqueezy.imgix.net/media/122311/55697374-fc66-4208-994e-286f7b5d5f64.png?fit=clip&h=100&ixlib=php-3.3.1&w=100&s=e278680c1cb00005b7619bb14ffba973",
// 			large_thumb_url:
// 				"https://lemonsqueezy.imgix.net/media/122311/55697374-fc66-4208-994e-286f7b5d5f64.png?fit=clip&h=1000&ixlib=php-3.3.1&w=1000&s=8ffcd4bf785faf70e99b275d017eb5d6",
// 			price: 10000,
// 			price_formatted: "$100.00 - $1,200.00",
// 			from_price: 10000,
// 			to_price: 120000,
// 			pay_what_you_want: false,
// 			buy_now_url:
// 				"https://store.ado.software/checkout/buy/7e74e0bb-3f63-4973-a60f-3969d31ffeae",
// 			from_price_formatted: "$100.00",
// 			to_price_formatted: "$1,200.00",
// 			created_at: "2024-09-09T23:38:46.000000Z",
// 			updated_at: "2024-09-14T22:24:45.000000Z",
// 			test_mode: true,
// 		},
// 		relationships: {
// 			store: {
// 				links: {
// 					related: "https://api.lemonsqueezy.com/v1/products/349759/store",
// 					self: "https://api.lemonsqueezy.com/v1/products/349759/relationships/store",
// 				},
// 			},
// 			variants: {
// 				links: {
// 					related: "https://api.lemonsqueezy.com/v1/products/349759/variants",
// 					self: "https://api.lemonsqueezy.com/v1/products/349759/relationships/variants",
// 				},
// 			},
// 		},
// 		links: { self: "https://api.lemonsqueezy.com/v1/products/349759" },
// 	}

export const checkoutUrl = async () => {
    const attributes = await toolkeeperProductObject()
    return attributes.buy_now_url
}