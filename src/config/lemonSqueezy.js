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

export const checkoutUrl = async () => {
    const attributes = await toolkeeperProductObject()
    return attributes.buy_now_url
}

export const inTestMode = async () => {
	const attributes = await toolkeeperProductObject()
    return attributes.test_mode
}
}
// src\config\lemonSqueezy.js
