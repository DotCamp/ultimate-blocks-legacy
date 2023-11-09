const icon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect width="24" height="24" fill="white" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6ZM7.5 7.5C7.5 7.22386 7.72386 7 8 7L19.5 7C19.7761 7 20 7.22386 20 7.5C20 7.77614 19.7761 8 19.5 8L8 8C7.72386 8 7.5 7.77614 7.5 7.5ZM10 10C9.72386 10 9.5 10.2239 9.5 10.5C9.5 10.7761 9.72386 11 10 11L19.5 11C19.7761 11 20 10.7761 20 10.5C20 10.2239 19.7761 10 19.5 10L10 10ZM11.5 13.5C11.5 13.2239 11.7239 13 12 13L19.5 13C19.7761 13 20 13.2239 20 13.5C20 13.7761 19.7761 14 19.5 14L12 14C11.7239 14 11.5 13.7761 11.5 13.5ZM8 16C7.72386 16 7.5 16.2239 7.5 16.5C7.5 16.7761 7.72386 17 8 17H19.5C19.7761 17 20 16.7761 20 16.5C20 16.2239 19.7761 16 19.5 16H8ZM6 7.5C6 8.05229 5.55228 8.5 5 8.5C4.44772 8.5 4 8.05229 4 7.5C4 6.94772 4.44772 6.5 5 6.5C5.55228 6.5 6 6.94772 6 7.5ZM7 11.5C7.55228 11.5 8 11.0523 8 10.5C8 9.94771 7.55228 9.5 7 9.5C6.44772 9.5 6 9.94771 6 10.5C6 11.0523 6.44772 11.5 7 11.5ZM10 13.5C10 14.0523 9.55229 14.5 9 14.5C8.44771 14.5 8 14.0523 8 13.5C8 12.9477 8.44771 12.5 9 12.5C9.55229 12.5 10 12.9477 10 13.5ZM5 17.5C5.55228 17.5 6 17.0523 6 16.5C6 15.9477 5.55228 15.5 5 15.5C4.44772 15.5 4 15.9477 4 16.5C4 17.0523 4.44772 17.5 5 17.5Z"
			fill="#E11B4C"
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
