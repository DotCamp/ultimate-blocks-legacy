const version_1_1_2 = props => {
	return (
		<div className={props.className}>
			<div className={props.attributes.ub_selected_notify}>
				<p className="ub_notify_text">
					{props.attributes.ub_notify_info}
				</p>
			</div>
		</div>
	);
};

export { version_1_1_2 };
