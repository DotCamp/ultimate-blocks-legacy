const { __ } = wp.i18n;

export const richTextToHTML = (elem) => {
	let outputString = "";

	outputString += `<${elem.type}${
		elem.type === "a"
			? ` href='${elem.props.href}' rel='${elem.props.rel}' target='${elem.props.target}'`
			: elem.type === "img"
			? ` style='${elem.props.style}' class='${elem.props.class}' src='${elem.props.src}' alt='${elem.props.alt}'`
			: ""
	}>`;

	elem.props.children.forEach((child) => {
		outputString += typeof child === "string" ? child : richTextToHTML(child);
	});
	if (!["br", "img"].includes(elem.type)) outputString += `</${elem.type}>`;

	return outputString;
};

export const mergeRichTextArray = (input) =>
	input
		.map((item) => (typeof item === "string" ? item : richTextToHTML(item)))
		.join("");

export const dashesToCamelcase = (str) =>
	str
		.split("-")
		.map((s) => s[0].toUpperCase() + s.slice(1))
		.join("");

export const generateIcon = (selectedIcon, size, unit = "px") => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height={`${size}${unit === "em" ? "em" : ""}`}
		width={`${size}${unit === "em" ? "em" : ""}`}
		viewBox={`0, 0, ${selectedIcon.icon[0]}, ${selectedIcon.icon[1]}`}
	>
		<path fill={"currentColor"} d={selectedIcon.icon[4]} />
	</svg>
);

export const upgradeButtonLabel = __(
	"We have made some improvements to this block. Click here to upgrade the block. You will not lose any content."
);

export const getDescendantBlocks = (rootBlock) => {
	let descendants = [];
	rootBlock.innerBlocks.forEach((innerBlock) => {
		descendants.push(innerBlock);
		if (innerBlock.innerBlocks.length > 0) {
			descendants.push(...getDescendantBlocks(innerBlock));
		}
	});
	return descendants;
};

export const objectsMatch = (obj, source) =>
	Object.keys(source).every(
		(key) => obj.hasOwnProperty(key) && obj[key] === source[key]
	);

export const removeFromArray = (arr, removedElems) =>
	arr.filter((a) =>
		Array.isArray(removedElems) ? !removedElems.includes(a) : a !== removedElems
	);

export const splitArrayIntoChunks = (inputArray, chunkSize) =>
	//from Andrei R, https://stackoverflow.com/a/37826698
	inputArray.reduce((resultArray, item, index) => {
		const chunkIndex = Math.floor(index / chunkSize);

		if (!resultArray[chunkIndex]) {
			resultArray[chunkIndex] = []; // start a new chunk
		}

		resultArray[chunkIndex].push(item);

		return resultArray;
	}, []);

export const splitArray = (sourceArray, condition) => {
	let passArray = [];
	let failArray = [];

	sourceArray.forEach((item) => {
		if (condition(item)) {
			passArray.push(item);
		} else {
			failArray.push(item);
		}
	});

	return [passArray, failArray];
};
export const convertFromSeconds = (sec) => ({
	s: sec % 60,
	m: ~~(sec / 60) % 60,
	h: ~~(sec / 3600) % 24,
	d: ~~(sec / 86400),
});
