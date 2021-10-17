const icon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={20}
		height={20}
		viewBox="0 0 1000 1000"
	>
		<path
			d="M10,132.5c0-33.8,27.4-61.3,61.3-61.3s61.3,27.4,61.3,61.3s-27.4,61.3-61.3,61.3S10,166.3,10,132.5z M255,71.3h735v122.5H255V71.3z M255,377.5c0-33.8,27.4-61.3,61.3-61.3s61.3,27.4,61.3,61.3c0,33.8-27.4,61.3-61.3,61.3S255,411.3,255,377.5z M500,316.3h490v122.5H500V316.3z M255,867.5c0-33.8,27.4-61.3,61.3-61.3s61.3,27.4,61.3,61.3c0,33.8-27.4,61.3-61.3,61.3S255,901.3,255,867.5z M500,806.3h490v122.5H500V806.3z M500,622.5c0-33.8,27.4-61.3,61.3-61.3c33.8,0,61.3,27.4,61.3,61.3c0,33.8-27.4,61.3-61.3,61.3C527.4,683.8,500,656.3,500,622.5z M745,561.2h245v122.5H745V561.2z"
			fill="#f64646"
		/>
	</svg>
);

export const oneColumnIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height="20"
		width="20"
		viewBox="0 0 110 110"
	>
		{[...Array(6).keys()].map((a) => (
			<rect width="110" height="10" x="0" y={a * 20} />
		))}
	</svg>
);

export const twoColumnsIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height="20"
		width="20"
		viewBox="0 0 110 110"
	>
		{[...Array(6).keys()].map((a) => (
			<>
				<rect width="50" height="10" x="0" y={a * 20} />
				<rect width="50" height="10" x="60" y={a * 20} />
			</>
		))}
	</svg>
);

export const threeColumnsIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height="20"
		width="20"
		viewBox="0 0 110 110"
	>
		{[...Array(6).keys()].map((a) => (
			<>
				<rect width="30" height="10" x="0" y={a * 20} />
				<rect width="30" height="10" x="40" y={a * 20} />
				<rect width="30" height="10" x="80" y={a * 20} />
			</>
		))}
	</svg>
);

export const plainList = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height="20"
		width="20"
		viewBox="0 0 20 20"
	>
		<rect x="0" fill="none" width="20" height="20" />
		<path d="M4 5h13v1h-13v-1z M4 10h13v1h-13v-1z M4 15h13v1h-13v-1z" />
	</svg>
);

export default icon;
