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

