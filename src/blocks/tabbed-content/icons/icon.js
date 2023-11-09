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
			d="M2 9C2 8.44772 2.44772 8 3 8H21C21.5523 8 22 8.44772 22 9V19C22 19.5523 21.5523 20 21 20H3C2.44772 20 2 19.5523 2 19V9ZM4.22223 10.5C4.22223 10.2239 4.44608 10 4.72223 10H19.2778C19.5539 10 19.7778 10.2239 19.7778 10.5C19.7778 10.7761 19.5539 11 19.2778 11H4.72223C4.44608 11 4.22223 10.7761 4.22223 10.5ZM5.22223 12C4.66994 12 4.22223 12.4477 4.22223 13V17C4.22223 17.5523 4.66994 18 5.22223 18H18.7778C19.3301 18 19.7778 17.5523 19.7778 17V13C19.7778 12.4477 19.3301 12 18.7778 12H5.22223Z"
			fill="#E11B4C"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.5 14C6.5 13.7239 6.72386 13.5 7 13.5H11C11.2761 13.5 11.5 13.7239 11.5 14C11.5 14.2761 11.2761 14.5 11 14.5H7C6.72386 14.5 6.5 14.2761 6.5 14Z"
			fill="#E11B4C"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.50001 15.999C6.50058 15.7228 6.72489 15.4994 7.00104 15.5L17.501 15.5216C17.7772 15.5222 18.0006 15.7465 18 16.0226C17.9994 16.2988 17.7751 16.5222 17.499 16.5216L6.99898 16.5C6.72284 16.4994 6.49944 16.2751 6.50001 15.999Z"
			fill="#E11B4C"
		/>
		<rect x="9" y="5" width="4" height="2" rx="0.5" fill="#E11B4C" />
		<path
			d="M14 5.5C14 5.22386 14.2239 5 14.5 5H17.5C17.7761 5 18 5.22386 18 5.5V6.5C18 6.77614 17.7761 7 17.5 7H14.5C14.2239 7 14 6.77614 14 6.5V5.5Z"
			fill="#E11B4C"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2.5 5C2.22386 5 2 5.22386 2 5.5V6.5C2 6.77614 2.22386 7 2.5 7H7.5C7.77614 7 8 6.77614 8 6.5V5.5C8 5.22386 7.77614 5 7.5 5H2.5ZM7 6.46732C7.25809 6.46732 7.46732 6.25809 7.46732 6C7.46732 5.74191 7.25809 5.53268 7 5.53268C6.74191 5.53268 6.53268 5.74191 6.53268 6C6.53268 6.25809 6.74191 6.46732 7 6.46732Z"
			fill="#E11B4C"
		/>
	</svg>
);

export const horizontalTabIcon = (
	<svg
		height="20px"
		width="20px"
		xmlns="http://www.w3.org/2000/svg"
		version="1.1"
		viewBox="0 0 16 16"
	>
		<path d="M14 4v-2h-14v13h16v-11h-2zM10 3h3v1h-3v-1zM6 3h3v1h-3v-1zM15 14h-14v-11h4v2h10v9z" />
	</svg>
);

export const verticalTabIcon = (
	<svg
		height="20px"
		width="20px"
		xmlns="http://www.w3.org/2000/svg"
		version="1.1"
		viewBox="0 0 16 16"
	>
		<path
			d="M14 4v-2h-14v13h16v-11h-2zM10 3h3v1h-3v-1zM6 3h3v1h-3v-1zM15 14h-14v-11h4v2h10v9z"
			transform="rotate(-90, 8, 8) scale(-1,1) translate(-16, 0)"
		/>
	</svg>
);

export const accordionIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 16 16"
	>
		<path d="M0 4v8h16v-8h-16zM15 11h-14v-4h14v4z" />
		<path d="M0 0h16v3h-16v-3z" />
		<path d="M0 13h16v3h-16v-3z" />
	</svg>
);

export default icon;
