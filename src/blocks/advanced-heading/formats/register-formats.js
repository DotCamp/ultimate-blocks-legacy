import highlight from "./highlight";

const { registerFormatType } = wp.richText;

/* register the formats */
function registerFormats() {
	[highlight].forEach(({ name, ...settings }) =>
		registerFormatType(name, settings)
	);
}

registerFormats();
