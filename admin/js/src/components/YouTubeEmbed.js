import React, { useEffect, useState } from 'react';

/**
 * YouTube embed component.
 *
 * @param {Object}       props         component properties
 * @param {string}       props.videoId video id
 * @param {number |null} props.width   embed width
 * @param {number |null} props.height  embed height
 * @class
 */
function YouTubeEmbed({ videoId, width = null, height = null }) {
	const [embedUrl, setEmbedUrl] = useState(null);

	const defaults = {
		width: '100',
		height: '100',
	};

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		const generatedEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
		setEmbedUrl(generatedEmbedUrl);
	}, []);

	return (
		<div className={'ub-youtube-embed'}>
			<iframe
				width={width || defaults.width}
				height={height || defaults.height}
				src={embedUrl}
				title="YouTube video player"
				allow="picture-in-picture; web-share; fullscreen"
			></iframe>
		</div>
	);
}

/**
 * @module YouTubeEmbed
 */
export default YouTubeEmbed;
