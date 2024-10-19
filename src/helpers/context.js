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
	return result;
}

