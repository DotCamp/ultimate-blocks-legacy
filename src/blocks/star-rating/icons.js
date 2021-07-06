export const BlockIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 510 510"
	>
		<path
			d="M510,197.472l-183.37-15.734L255,12.75l-71.629,168.988L0,197.472l0,0l0,0l139.103,120.539L97.41,497.25L255,402.186l0,0 l157.59,95.039l-41.692-179.239L510,197.472z M255,354.348V117.172l43.605,102.918l111.689,9.588l-84.711,73.389l25.398,109.166 L255,354.348z"
			fill="#f64646"
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
