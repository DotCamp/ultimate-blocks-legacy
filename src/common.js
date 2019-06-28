export const richTextToHTML = elem => {
	let outputString = '';

	outputString += `<${elem.type}${
		elem.type === 'a'
			? ` href='${elem.props.href}' rel='${elem.props.rel}' target='${
					elem.props.target
			  }'`
			: elem.type === 'img'
			? ` style='${elem.props.style}' class='${elem.props.class}' src='${
					elem.props.src
			  }' alt='${elem.props.alt}'`
			: ''
	}>`;

	elem.props.children.forEach(child => {
		outputString +=
			typeof child === 'string' ? child : richTextToHTML(child);
	});
	if (!['br', 'img'].includes(elem.type)) outputString += `</${elem.type}>`;

	return outputString;
};

export const dashesToCamelcase = str =>
	str
		.split('-')
		.map(s => s[0].toUpperCase() + s.slice(1))
		.join('');

export const generateIcon = (selectedIcon, size) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height={size}
		width={size}
		viewBox={`0, 0, ${selectedIcon.icon[0]}, ${selectedIcon.icon[1]}`}
	>
		<path fill={'currentColor'} d={selectedIcon.icon[4]} />
	</svg>
);
