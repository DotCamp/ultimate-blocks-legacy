//restored to ensure reverse compatibility
export const EmptyStar = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		style={{ fill: props.fillColor }}
		fill={props.fillColor}
		width={props.size}
		height={props.size}
		viewBox="0 0 510 510"
	>
		<path d="M510,197.472l-183.37-15.734L255,12.75l-71.629,168.988L0,197.472l139.103,120.539L97.41,497.25L255,402.186 l157.59,95.064l-41.692-179.239L510,197.472z M255,354.348l-95.957,57.886l25.398-109.166l-84.736-73.389l111.69-9.588 L255,117.172l43.605,102.918l111.689,9.588l-84.711,73.389l25.398,109.166L255,354.348z" />
	</svg>
);

export const HalfStar = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		style={{ fill: props.fillColor }}
		fill={props.fillColor}
		width={props.size}
		height={props.size}
		viewBox="0 0 510 510"
	>
		<path d="M510,197.472l-183.37-15.734L255,12.75l-71.629,168.988L0,197.472l0,0l0,0l139.103,120.539L97.41,497.25L255,402.186l0,0 l157.59,95.039l-41.692-179.239L510,197.472z M255,354.348V117.172l43.605,102.918l111.689,9.588l-84.711,73.389l25.398,109.166 L255,354.348z" />
	</svg>
);

export const FullStar = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		style={{ fill: props.fillColor }}
		fill={props.fillColor}
		width={props.size}
		height={props.size}
		viewBox="0 0 510 510"
	>
		<polygon
			points="255,402.212 412.59,497.25 370.897,318.011 510,197.472 326.63,181.738 255,12.75 183.371,181.738 0,197.472 139.103,318.011 97.41,497.25"
			id="star"
		/>
	</svg>
);

export const BlockIcon = (
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
			d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM12 5.66844L13.9749 9.95014L18.6574 10.5053L15.1955 13.7067L16.1145 18.3316L12 16.0284L7.88549 18.3316L8.80444 13.7067L5.34259 10.5053L10.025 9.95014L12 5.66844ZM12 8.1066V14.9191L9.29297 16.4386L9.89453 13.4035L7.61328 11.2863L10.6992 10.9269L12 8.1066Z"
			fill="#E11B4C"
		/>
	</svg>
);

export const Star = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height={props.size}
		width={props.size}
		viewBox="-10 -10 170 170"
	>
		<defs>
			<mask id={`ub_star_rating_filter-${props.id}-${props.index}`}>
				<rect
					height="150"
					width={Math.max(0, Math.min(props.value, 1)) * 150}
					y="0"
					x="0"
					fill="#fff"
				/>
			</mask>
		</defs>

		<path
			fill={"none"}
			strokeWidth="5"
			d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
			stroke={props.displayColor}
		/>
		<path
			className="star"
			mask={`url(#ub_star_rating_filter-${props.id}-${props.index})`}
			fill={props.displayColor}
			strokeWidth="5"
			d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
			stroke={props.displayColor}
		/>
	</svg>
);
