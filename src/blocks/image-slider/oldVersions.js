const version_1_1_4 = props => {
	const {
		ID,
		images,
		isDraggable,
		wrapsAround,
		autoplays,
		autoplayDuration,
		navOption,
		sliderHeight
	} = props.attributes;
	const imageArray = JSON.parse(images);
	return (
		<div>
			<div
				className="ub_image_slider"
				id={ID}
				data-flickity={JSON.stringify({
					draggable: isDraggable,
					pageDots: navOption === 'Page Dots',
					wrapAround: wrapsAround,
					autoPlay: autoplays ? autoplayDuration * 1000 : autoplays,
					adaptiveHeight: true
				})}
			>
				{imageArray.map((c, i) => (
					<div style={{ width: '100%' }}>
						<img
							key={i}
							src={c.url}
							style={{
								display: 'block',
								height: `${sliderHeight}px`,
								objectFit: 'contain',
								margin: '0 auto'
							}}
						/>
					</div>
				))}
			</div>
			{navOption === 'Mini Gallery' && (
				<div
					data-flickity={JSON.stringify({
						asNavFor: `#${ID}`,
						contain: true,
						pageDots: false
					})}
				>
					{imageArray.map((c, i) => (
						<img
							style={{
								maxHeight: '100px',
								objectFit: 'contain'
							}}
							key={i}
							src={c.url}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export { version_1_1_4 };
