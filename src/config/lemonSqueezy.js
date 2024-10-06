export const secret = "df027e53-f33b-4155-8ef2-a7366f65acfe";

export const toolkeeperProductObject = async () => {
    try{
	const response = await fetch("https://api.lemonsqueezy.com/v1/products", {
		method: "get",
		mode: "cors",
		credentials: "include",
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
			Authorization:
				`Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
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

export default toolkeeperProductObject
// src\config\lemonSqueezy.js
