import icon from "./icon";
import { Component, Fragment } from "react";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { RichText, MediaUpload, InspectorControls, URLInput } =
	wp.blockEditor || wp.editor;

const { withState } = wp.compose;

const { Button, ToggleControl, Icon, IconButton, PanelBody } = wp.components;

const attributes = {
	blockID: {
		type: "string",
		default: ""
	},
	title: {
		type: "string",
		default: ""
	},
	introduction: {
		type: "string",
		default: ""
	},
	toolsIntro: {
		type: "string",
		default: __("Required tools")
	},
	tools: {
		type: "array",
		default: [] //format: {name, imageid, imagealt, imageurl}
	},
	addToolImages: {
		type: "boolean",
		default: false
	},
	suppliesIntro: {
		type: "string",
		default: __("Required supplies")
	},
	supplies: {
		type: "array",
		default: [] //format: {name, imageid, imagealt, imageurl}
	},
	addSupplyImages: {
		type: "boolean",
		default: false
	},
	section: {
		type: "array",
		default: [{ sectionName: "", steps: [] }] //contains steps, if useSections is set to false, then only use contents of the first section. minimum of two steps.
	},
	timeIntro: {
		type: "string",
		default: __("Duration")
	},
	totalTime: {
		type: "array",
		default: Array(7).fill(0)
	},
	totalTimeText: {
		type: "string",
		default: __("Total time: ")
	},
	cost: {
		type: "number",
		default: 0
	},
	costCurrency: {
		type: "string",
		default: "USD"
	},
	costDisplayText: {
		type: "string",
		default: __("Total cost: ")
	},
	showUnitFirst: {
		type: "boolean",
		default: true
	},
	howToYield: {
		//avoid using yield as variable name
		type: "string",
		default: ""
	},
	videoURL: {
		type: "string", //videoobject
		default: "" //needed: video url, thumbnail url, video description, upload date
	},
	videoThumbnailURL: {
		type: "string",
		default: ""
	},
	videoName: {
		type: "string",
		default: ""
	},
	videoDescription: {
		type: "string",
		default: ""
	},
	videoUploadDate: {
		type: "number", //UNIX Date
		default: 0
	},
	videoEmbedCode: {
		type: "string",
		default: "<p>When insertion is successful, video should appear here</p>"
	},
	videoDuration: {
		type: "number",
		default: 0
	},
	useSections: {
		type: "boolean",
		default: false
	},
	includeSuppliesList: {
		type: "boolean",
		default: false
	},
	includeToolsList: {
		type: "boolean",
		default: false
	},
	resultIntro: {
		type: "string",
		default: __("Result")
	},
	finalImageID: {
		type: "number",
		default: -1
	},
	finalImageAlt: {
		type: "string",
		default: ""
	},
	finalImageURL: {
		type: "string",
		default: ""
	}
};

const defaultTimeDisplay = {
	w: 0,
	d: 0,
	h: 0,
	m: 0,
	s: 0
};

class HowToStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startTime: Object.assign({}, defaultTimeDisplay),
			endTime: Object.assign({}, defaultTimeDisplay),
			validTimeInput: true
		};
	}

	componentDidMount() {
		const {
			clips,
			hasVideoClip,
			videoClipEnd,
			videoClipStart,
			sectionNum,
			stepNum
		} = this.props;

		const convertFromSeconds = sec => ({
			s: sec % 60,
			m: ~~(sec / 60) % 60,
			h: ~~(sec / 3600) % 24,
			d: ~~(sec / 86400)
		});

		if (hasVideoClip) {
			const start = convertFromSeconds(videoClipStart);
			const end = convertFromSeconds(videoClipEnd);
			const clipId =
				sectionNum > -1
					? `section${sectionNum}step${stepNum}`
					: `step${stepNum}`;
			this.setState({
				startTime: { w: 0, d: start.d, h: start.h, m: start.m, s: start.s },
				endTime: { w: 0, d: end.d, h: end.h, m: end.m, s: end.s },
				validTimeInput:
					clips.filter(
						c =>
							c.anchor !== clipId &&
							((videoClipStart > c.clipStart && videoClipStart < c.clipEnd) ||
								(videoClipEnd > c.clipStart && videoClipEnd < c.clipEnd))
					).length === 0
			});
		}
	}

	componentDidUpdate(prevProps) {
		const {
			videoClipStart,
			videoClipEnd,
			sectionNum,
			stepNum,
			clips,
			videoURL
		} = this.props;

		const clipId =
			sectionNum > -1 ? `section${sectionNum}step${stepNum}` : `step${stepNum}`;

		if (
			prevProps.videoClipStart !== videoClipStart ||
			prevProps.videoClipEnd !== videoClipEnd
		) {
			this.setState({
				validTimeInput:
					videoClipStart <= videoClipEnd &&
					clips.filter(
						c =>
							c.anchor !== clipId &&
							((videoClipStart > c.clipStart && videoClipStart < c.clipEnd) ||
								(videoClipEnd > c.clipStart && videoClipEnd < c.clipEnd))
					).length === 0
			});
		}

		if (prevProps.videoURL !== videoURL) {
			this.setState({
				startTime: defaultTimeDisplay,
				endTime: defaultTimeDisplay
			});
		}
	}

	render() {
		const {
			direction,
			tip,
			title,
			editStep,
			deleteStep,
			moveUp,
			moveDown,
			stepPic,
			videoDuration,
			hasVideoClip
		} = this.props;

		const { startTime, endTime, validTimeInput } = this.state;

		return (
			<li>
				<div className="ub_howto_step">
					<div>
						<RichText
							tagName="h4"
							keepPlaceholderOnFocus
							placeholder={__("Title goes here")}
							value={title}
							onChange={newVal => editStep({ title: newVal })}
						/>
					</div>
					<IconButton
						className="ub_howto_delete"
						icon="trash"
						label={__("Delete step")}
						onClick={_ => deleteStep()}
					/>
					<IconButton
						icon="arrow-up-alt"
						onClick={_ => moveUp()}
						label={__("Move step up")}
					/>
					<IconButton
						icon="arrow-down-alt"
						onClick={_ => moveDown()}
						label={__("Move step down")}
					/>
				</div>
				{stepPic.url !== "" ? (
					<div>
						<img src={stepPic.url} />
						<span
							title={__("Delete image")}
							className="dashicons dashicons-dismiss"
							onClick={_ =>
								editStep({
									stepPic: {
										id: -1,
										alt: "",
										url: ""
									}
								})
							}
						/>
					</div>
				) : (
					<MediaUpload
						onSelect={img =>
							editStep({
								stepPic: {
									id: img.id,
									alt: img.alt,
									url: img.url
								}
							})
						}
						type="image"
						value={stepPic.id}
						render={({ open }) => (
							<React.Fragment>
								<Button
									className="components-button button button-medium"
									onClick={open}
								>
									{__("Upload Image")}
								</Button>
								<p />
							</React.Fragment>
						)}
					/>
				)}
				{videoDuration > 0 && (
					<ToggleControl
						checked={hasVideoClip}
						label={__("Use part of the video in this step")}
						onChange={hasVideoClip => {
							editStep({ hasVideoClip });
							if (!hasVideoClip) {
								editStep({ videoClipEnd: 0, videoClipStart: 0 });
								this.setState({
									startTime: Object.assign({}, defaultTimeDisplay),
									endTime: Object.assign({}, defaultTimeDisplay)
								});
							}
						}}
					/>
				)}
				{videoDuration > 0 && hasVideoClip && (
					<React.Fragment>
						<span style={{ color: validTimeInput ? "black" : "red" }}>
							Start time
						</span>
						{videoDuration >= 86400 && (
							<input
								type="number"
								value={startTime.d}
								min={0}
								step={1}
								onChange={e => {
									const { h, m, s } = this.state.startTime;
									const d = Number(e.target.value);
									const startPoint = d * 86400 + h * 3600 + m * 60 + s;

									if (startPoint < videoDuration && d % 1 === 0 && d > -1) {
										this.setState({
											startTime: Object.assign(startTime, { d })
										});
										editStep({ videoClipStart: startPoint });
									}
								}}
							/>
						)}
						{videoDuration >= 3600 && (
							<input
								type="number"
								value={startTime.h}
								min={0}
								max={23}
								step={1}
								onChange={e => {
									const { d, m, s } = this.state.startTime;
									const h = Number(e.target.value);
									const startPoint = d * 86400 + h * 3600 + m * 60 + s;

									if (
										startPoint < videoDuration &&
										h % 1 === 0 &&
										h > -1 &&
										h < 24
									) {
										this.setState({
											startTime: Object.assign(startTime, { h })
										});
										editStep({ videoClipStart: startPoint });
									}
								}}
							/>
						)}
						{videoDuration >= 60 && (
							<input
								type="number"
								value={startTime.m}
								min={0}
								max={59}
								step={1}
								onChange={e => {
									const { d, h, s } = this.state.startTime;
									const m = Number(e.target.value);
									const startPoint = d * 86400 + h * 3600 + m * 60 + s;

									if (
										startPoint < videoDuration &&
										m % 1 === 0 &&
										m > -1 &&
										m < 60
									) {
										this.setState({
											startTime: Object.assign(startTime, { m })
										});
										editStep({ videoClipStart: startPoint });
									}
								}}
							/>
						)}
						<input
							type="number"
							value={startTime.s}
							min={0}
							max={59}
							step={1}
							onChange={e => {
								const { d, h, m } = this.state.startTime;
								const s = Number(e.target.value);
								const startPoint = d * 86400 + h * 3600 + m * 60 + s;

								if (
									startPoint < videoDuration &&
									s % 1 === 0 &&
									s > -1 &&
									s < 60
								) {
									this.setState({
										startTime: Object.assign(startTime, { s })
									});
									editStep({ videoClipStart: startPoint });
								}
							}}
						/>
						<br />
						<span style={{ color: validTimeInput ? "black" : "red" }}>
							End time
						</span>
						{videoDuration >= 86400 && (
							<input
								type="number"
								value={endTime.d}
								min={0}
								step={1}
								onChange={e => {
									const { h, m, s } = this.state.endTime;
									const d = Number(e.target.value);
									const endPoint = d * 86400 + h * 3600 + m * 60 + s;

									if (endPoint <= videoDuration && d % 1 === 0 && d > -1) {
										this.setState({
											endTime: Object.assign(endTime, { d })
										});
										editStep({ videoClipEnd: endPoint });
									}
								}}
							/>
						)}
						{videoDuration >= 3600 && (
							<input
								type="number"
								value={endTime.h}
								min={0}
								max={23}
								step={1}
								onChange={e => {
									const { d, m, s } = this.state.endTime;
									const h = Number(e.target.value);
									const endPoint = d * 86400 + h * 3600 + m * 60 + s;

									if (
										endPoint <= videoDuration &&
										h % 1 === 0 &&
										h > -1 &&
										h < 24
									) {
										this.setState({
											endTime: Object.assign(endTime, { h })
										});
										editStep({ videoClipEnd: endPoint });
									}
								}}
							/>
						)}
						{videoDuration >= 60 && (
							<input
								type="number"
								value={endTime.m}
								min={0}
								max={59}
								step={1}
								onChange={e => {
									const { d, h, s } = this.state.endTime;
									const m = Number(e.target.value);
									const endPoint = d * 86400 + h * 3600 + m * 60 + s;

									if (
										endPoint <= videoDuration &&
										m % 1 === 0 &&
										m > -1 &&
										m < 60
									) {
										this.setState({
											endTime: Object.assign(endTime, { m })
										});
										editStep({ videoClipEnd: endPoint });
									}
								}}
							/>
						)}
						<input
							type="number"
							value={endTime.s}
							min={0}
							max={59}
							step={1}
							onChange={e => {
								const { d, h, m } = this.state.endTime;
								const s = Number(e.target.value);
								const endPoint = d * 86400 + h * 3600 + m * 60 + s;

								if (
									endPoint <= videoDuration &&
									s % 1 === 0 &&
									s > -1 &&
									s < 60
								) {
									this.setState({
										endTime: Object.assign(endTime, { s })
									});
									editStep({ videoClipEnd: endPoint });
								}
							}}
						/>
					</React.Fragment>
				)}
				<RichText
					keepPlaceholderOnFocus
					placeholder={__("Direction goes here")}
					value={direction}
					onChange={newVal => editStep({ direction: newVal })}
				/>
				<RichText
					keepPlaceholderOnFocus
					placeholder={__("Add a tip (optional)")}
					value={tip}
					onChange={newVal => editStep({ tip: newVal })}
				/>
			</li>
		);
	}
}

class HowToSection extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			sectionNum,
			sectionName,
			steps,
			editSection,
			deleteSection,
			videoDuration,
			clips,
			videoURL
		} = this.props;

		return (
			<li>
				<div className="ub_howto_step">
					<RichText
						keepPlaceholderOnFocus
						tagName="h3"
						placeholder={__("Section name goes here")}
						value={sectionName}
						onChange={sectionName => editSection({ sectionName, steps })}
					/>
					<IconButton
						style={{ marginLeft: "auto" }}
						icon="trash"
						label={__("Delete section")}
						onClick={_ => deleteSection()}
					/>
				</div>
				<ol>
					{steps.map((step, i) => (
						<HowToStep
							{...step}
							clips={clips}
							sectionNum={sectionNum}
							stepNum={i}
							videoURL={videoURL}
							videoDuration={videoDuration}
							editStep={newStep =>
								editSection({
									sectionName,
									steps: [
										...steps.slice(0, i),
										Object.assign(steps[i], newStep),
										...steps.slice(i + 1)
									]
								})
							}
							deleteStep={_ => {
								let newSteps = [...steps.slice(0, i), ...steps.slice(i + 1)];
								newSteps.forEach(
									(step, j) => (step.anchor = `section${sectionNum}step${j}`)
								);
								editSection({
									sectionName,
									steps: [...steps.slice(0, i), ...steps.slice(i + 1)]
								});
							}}
							moveUp={_ => {
								if (i > 0) {
									let newSteps = [
										...steps.slice(0, i - 1),
										steps[i],
										steps[i - 1],
										...steps.slice(i + 1)
									];
									newSteps.forEach(
										(step, j) => (step.anchor = `section${sectionNum}step${j}`)
									);
									editSection({
										sectionName,
										steps: newSteps
									});
								}
							}}
							moveDown={_ => {
								if (i < steps.length - 1) {
									let newSteps = [
										...steps.slice(0, i),
										steps[i + 1],
										steps[i],
										...steps.slice(i + 2)
									];
									newSteps.forEach(
										(step, j) => (step.anchor = `section${sectionNum}step${j}`)
									);
									editSection({
										sectionName,
										steps: newSteps
									});
								}
							}}
						/>
					))}
				</ol>
				<Button
					onClick={_ => {
						editSection({
							sectionName,
							steps: [
								...steps,
								{
									anchor: `section${sectionNum}step${steps.length}`,
									stepPic: { img: -1, alt: "", url: "" },
									direction: "",
									tip: "",
									title: "",
									hasVideoClip: false,
									videoClipStart: 0,
									videoClipEnd: 0
								}
							]
						});
					}}
				>
					<Icon icon="plus" />
					{__("Add step")}
				</Button>
			</li>
		);
	}
}

registerBlockType("ub/how-to", {
	title: __("How To"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Tutorial"), __("How To"), __("Ultimate Blocks")],
	attributes,
	supports: {
		multiple: false
	},
	edit: withState({ videoURLInput: "", notYetLoaded: true })(function(props) {
		const {
			attributes: {
				title,
				introduction,
				section,
				suppliesIntro,
				supplies,
				toolsIntro,
				tools,
				howToYield,
				cost,
				costCurrency,
				costDisplayText,
				showUnitFirst,
				timeIntro,
				totalTime,
				totalTimeText,
				useSections,
				includeToolsList,
				addToolImages,
				includeSuppliesList,
				addSupplyImages,
				resultIntro,
				finalImageID,
				finalImageURL,
				videoURL,
				videoEmbedCode,
				videoDuration
			},
			videoURLInput,
			notYetLoaded,
			setAttributes,
			setState
		} = props;

		const units = [
			"years",
			"months",
			"weeks",
			"days",
			"hours",
			"minutes",
			"seconds"
		];

		const resetVideoAttributes = _ => {
			let newSection = JSON.parse(JSON.stringify(section));
			newSection.forEach(s =>
				s.steps.map(st =>
					Object.assign(st, {
						hasVideoClip: false,
						videoClipStart: 0,
						videoClipEnd: 0
					})
				)
			);

			setAttributes({
				section: newSection,
				videoURL: "",
				videoDescription: "",
				videoUploadDate: 0,
				videoThumbnailURL: "",
				videoEmbedCode: `<p>${__(
					"When insertion is successful, video should appear here"
				)}</p>`,
				videoDuration: 0
			});
		};

		if (notYetLoaded) {
			setState({ videoURLInput: videoURL, notYetLoaded: false });
		}

		const clips = section
			.reduce((stepList, section) => [...stepList, ...section.steps], [])
			.filter(s => s.hasVideoClip)
			.map(s => ({
				anchor: s.anchor,
				clipStart: s.videoClipStart,
				clipEnd: s.videoClipEnd
			}));

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={__("How To Settings")}>
						<ToggleControl
							label={__("Use sections")}
							checked={useSections}
							onChange={useSections => {
								setAttributes({ useSections });
								if (useSections) {
									let newSection = JSON.parse(JSON.stringify(section));
									newSection.forEach((ns, i) =>
										ns.steps.forEach((s, j) => {
											s.anchor = `section${i}step${j}`;
										})
									);
									setAttributes({ section: newSection });
								} else if (section.length < 1) {
									setAttributes({
										section: [
											{
												sectionName: "",
												steps: []
											}
										]
									});
								} else {
									let newSection = JSON.parse(JSON.stringify(section));
									newSection[0].steps.forEach((s, i) => {
										s.anchor = `step${i}`;
									});
									setAttributes({ section: newSection });
								}
							}}
						/>
						<ToggleControl
							label={__("Include list of supplies")}
							checked={includeSuppliesList}
							onChange={includeSuppliesList =>
								setAttributes({ includeSuppliesList })
							}
						/>
						{includeSuppliesList && (
							<ToggleControl
								label={__("Enable adding image for each supply")}
								checked={addSupplyImages}
								onChange={addSupplyImages => setAttributes({ addSupplyImages })}
							/>
						)}
						<ToggleControl
							label={__("Include list of tools")}
							checked={includeToolsList}
							onChange={includeToolsList => setAttributes({ includeToolsList })}
						/>
						{includeToolsList && (
							<ToggleControl
								label={__("Enable adding image for each tool")}
								checked={addToolImages}
								onChange={addToolImages => setAttributes({ addToolImages })}
							/>
						)}
						<ToggleControl
							label={__("Display the unit first in cost")}
							checked={showUnitFirst}
							onChange={showUnitFirst => setAttributes({ showUnitFirst })}
						/>
					</PanelBody>
				</InspectorControls>
				<div className="ub_howto">
					<RichText
						tagName="h2"
						placeholder={__("How to title")}
						keepPlaceholderOnFocus={true}
						value={title}
						onChange={title => setAttributes({ title })}
					/>
					<RichText
						placeholder={__("How to introduction")}
						keepPlaceholderOnFocus={true}
						value={introduction}
						onChange={introduction => setAttributes({ introduction })}
					/>
					{__("Insert video here")}
					<div style={{ display: "flex" }}>
						<URLInput
							autoFocus={false}
							disableSuggestions={true}
							className="button-url"
							value={videoURLInput}
							onChange={videoURLInput =>
								setState({
									videoURLInput
								})
							}
						/>
						<IconButton
							icon={"editor-break"}
							label={__("Apply")}
							type={"submit"}
							onClick={_ => {
								if (/^http(s)?:\/\//g.test(videoURLInput)) {
									const youtubeMatch = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/g.exec(
										videoURLInput
									);
									const vimeoMatch = /^(?:https?\:\/\/)?(?:www\.|player\.)?(?:vimeo\.com\/)([0-9]+)/g.exec(
										videoURLInput
									);
									const dailyMotionMatch = /^(?:https?\:\/\/)?(?:www\.)?(?:dailymotion\.com\/video|dai\.ly)\/([0-9a-z]+)(?:[\-_0-9a-zA-Z]+#video=([a-z0-9]+))?/g.exec(
										videoURLInput
									);
									const videoPressMatch = /^https?:\/\/(?:www\.)?videopress\.com\/(?:embed|v)\/([a-zA-Z0-9]{8,})/g.exec(
										videoURLInput
									);
									if (youtubeMatch) {
										fetch(
											`https://www.googleapis.com/youtube/v3/videos?id=${youtubeMatch[1]}&part=snippet,contentDetails,player&key=AIzaSyDgItjYofyXkIZ4OxF6gN92PIQkuvU319c`
										)
											.then(response => {
												response.json().then(data => {
													if (data.items.length) {
														let timePeriods = data.items[0].contentDetails.duration.match(
															/(\d{1,2}(?:W|D|H|M|S))/g
														);
														setAttributes({
															videoURL: `https://www.youtube.com/watch?v=${youtubeMatch[1]}`,
															videoName: data.items[0].snippet.title,
															videoDescription:
																data.items[0].snippet.description,
															videoUploadDate:
																Date.parse(data.items[0].snippet.publishedAt) /
																1000,
															videoThumbnailURL: `https://i.ytimg.com/vi/${youtubeMatch[1]}/default.jpg`,
															videoEmbedCode: decodeURIComponent(
																data.items[0].player.embedHtml
															),
															videoDuration: timePeriods.reduce((sum, part) => {
																let multiplier = {
																	W: 604800,
																	D: 86400,
																	H: 3600,
																	M: 60,
																	S: 1
																};
																return (
																	sum +
																	Number(part.slice(0, -1)) *
																		multiplier[part.slice(-1)]
																);
															}, 0)
														});
													} else {
														resetVideoAttributes();
														setAttributes({
															videoEmbedCode: `<p>${__(
																"No video found at URL"
															)}</p>`
														});
													}
												});
											})
											.catch(err => {
												console.log("youtube fetch error");
												console.log(err);
											});
									} else if (vimeoMatch) {
										fetch(
											`https://vimeo.com/api/v2/video/${vimeoMatch[1]}.json`
										)
											.then(response => {
												if (response.ok) {
													response
														.json()
														.then(data => {
															setAttributes({
																videoURL: data[0].url,
																videoName: data[0].title,
																videoDescription: data[0].description,
																videoUploadDate:
																	Date.parse(data[0].upload_date) / 1000,
																videoThumbnailURL: data[0].thumbnail_large,
																videoDuration: data[0].duration
															});
															fetch(
																`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
																	data[0].url
																)}`
															)
																.then(response => {
																	response.json().then(data => {
																		setAttributes({
																			videoEmbedCode: data.html
																		});
																	});
																})
																.catch(err => {
																	console.log("vimeo oembed error");
																	console.log(err);
																});
														})
														.catch(err => {
															console.log(err);
														});
												} else {
													resetVideoAttributes();
													setAttributes({
														videoEmbedCode: `<p>${__(
															"No video found at URL"
														)}</p>`
													});
												}
											})
											.catch(err => {
												console.log("vimeo fetch error");
												console.log(err);
											});
									} else if (dailyMotionMatch) {
										fetch(
											`https://api.dailymotion.com/video/${dailyMotionMatch[1]}?fields=created_time%2Cthumbnail_1080_url%2Ctitle%2Cdescription%2Curl%2Cembed_html%2Cduration`
										)
											.then(response => {
												if (response.ok) {
													response.json().then(data => {
														setAttributes({
															videoURL: data.url,
															videoName: data.title,
															videoDescription: data.description,
															videoUploadDate: data.created_time,
															videoThumbnailURL: data.thumbnail_1080_url,
															videoEmbedCode: decodeURIComponent(
																data.embed_html
															),
															videoDuration: data.duration
														});
													});
												} else {
													resetVideoAttributes();
													setAttributes({
														videoEmbedCode: `<p>${__(
															"No video found at URL"
														)}</p>`
													});
												}
											})
											.catch(err => {
												console.log("dailymotion input error");
												console.log(err);
											});
									} else if (videoPressMatch) {
										fetch(
											`https://public-api.wordpress.com/rest/v1.1/videos/${videoPressMatch[1]}`
										)
											.then(response => {
												if (response.ok) {
													response.json().then(data => {
														setAttributes({
															videoURL: `https://videopress.com/v/${data.guid}`,
															videoName: data.title,
															videoDescription: data.description,
															videoUploadDate:
																Date.parse(data.upload_date) / 1000,
															videoThumbnailURL: data.poster,
															videoEmbedCode: `<iframe width="560" height="315" src="https://videopress.com/embed/${data.guid}" frameborder="0" allowfullscreen></iframe>
														<script src="https://videopress.com/videopress-iframe.js"></script>`,
															videoDuration: Math.floor(data.duration / 1000)
														});
													});
												} else {
													resetVideoAttributes();
													setAttributes({
														videoEmbedCode: `<p>${__(
															"No video found at URL"
														)}</p>`
													});
												}
											})
											.catch(err => {
												console.log("videopress input error");
												console.log(err);
											});
									} else {
										resetVideoAttributes();
										setAttributes({
											videoEmbedCode: "<p>Video site not supported</p>"
										});
									}
								} else {
									resetVideoAttributes();
									console.log("input is not a url");
								}
							}}
						/>
						<IconButton
							icon="trash"
							label={__("Delete")}
							onClick={_ => {
								resetVideoAttributes();
								setState({ videoURLInput: "" });
							}}
						/>
					</div>
					<div
						dangerouslySetInnerHTML={{
							__html: videoEmbedCode || "<p>Input error</p>"
						}}
					/>
					{includeSuppliesList && (
						<Fragment>
							<RichText
								tagName="h2"
								placeholder={__("Required supplies")}
								keepPlaceholderOnFocus={true}
								value={suppliesIntro}
								onChange={suppliesIntro => setAttributes({ suppliesIntro })}
							/>
							<ul>
								{supplies.map((supply, i) => (
									<li>
										<RichText
											keepPlaceholderOnFocus
											value={supply.name}
											placeholder={__("Enter supply name")}
											onChange={newName =>
												setAttributes({
													supplies: [
														...supplies.slice(0, i),
														Object.assign(supplies[i], { name: newName }),
														...supplies.slice(i + 1)
													]
												})
											}
										/>
										{addSupplyImages &&
											(supply.imageURL !== "" ? (
												<div>
													<img src={supply.imageURL} />
													<span
														title={__("Delete image")}
														className="dashicons dashicons-dismiss"
														onClick={_ =>
															setAttributes({
																supplies: [
																	...supplies.slice(0, i),
																	Object.assign(supply, {
																		imageID: 0,
																		imageURL: "",
																		imageAlt: ""
																	}),
																	...supplies.slice(i + 1)
																]
															})
														}
													/>
												</div>
											) : (
												<MediaUpload
													onSelect={img =>
														setAttributes({
															supplies: [
																...supplies.slice(0, i),
																Object.assign(supply, {
																	imageID: img.id,
																	imageURL: img.url,
																	imageAlt: img.alt
																}),
																...supplies.slice(i + 1)
															]
														})
													}
													type="image"
													value={supply.imageID}
													render={({ open }) => (
														<Button
															className="components-button button button-medium"
															onClick={open}
														>
															{__("Upload Image")}
														</Button>
													)}
												/>
											))}
										<IconButton
											icon="trash"
											label={__("Delete step")}
											onClick={_ =>
												setAttributes({
													supplies: [
														...supplies.slice(0, i),
														...supplies.slice(i + 1)
													]
												})
											}
										/>
									</li>
								))}
							</ul>
							<Button
								onClick={_ =>
									setAttributes({
										supplies: [
											...supplies,
											{ name: "", imageID: 0, imageAlt: "", imageURL: "" }
										]
									})
								}
							>
								{__("Add new supplies")}
							</Button>
						</Fragment>
					)}
					{includeToolsList && (
						<Fragment>
							<RichText
								tagName="h2"
								placeholder={__("Required tools")}
								keepPlaceholderOnFocus={true}
								value={toolsIntro}
								onChange={toolsIntro => setAttributes({ toolsIntro })}
							/>
							<ul>
								{tools.map((tool, i) => (
									<li>
										<RichText
											keepPlaceholderOnFocus
											value={tool.name}
											placeholder={__("Enter tool name")}
											onChange={newTool =>
												setAttributes({
													tools: [
														...tools.slice(0, i),
														Object.assign(tools[i], { name: newTool }),
														...tools.slice(i + 1)
													]
												})
											}
										/>

										{addToolImages &&
											(tool.imageURL !== "" ? (
												<div>
													<img src={tool.imageURL} />
													<span
														title={__("Delete image")}
														className="dashicons dashicons-dismiss"
														onClick={_ =>
															setAttributes({
																tools: [
																	...tools.slice(0, i),
																	Object.assign(tool, {
																		imageID: 0,
																		imageURL: "",
																		imageAlt: ""
																	}),
																	...tools.slice(i + 1)
																]
															})
														}
													/>
												</div>
											) : (
												<MediaUpload
													onSelect={img =>
														setAttributes({
															tools: [
																...tools.slice(0, i),
																Object.assign(tool, {
																	imageID: img.id,
																	imageURL: img.url,
																	imageAlt: img.alt
																}),
																...tools.slice(i + 1)
															]
														})
													}
													type="image"
													value={tool.imageID}
													render={({ open }) => (
														<Button
															className="components-button button button-medium"
															onClick={open}
														>
															{__("Upload Image")}
														</Button>
													)}
												/>
											))}

										<IconButton
											className="ub_howto_delete"
											icon="trash"
											label={__("Delete step")}
											onClick={_ =>
												setAttributes({
													tools: [...tools.slice(0, i), ...tools.slice(i + 1)]
												})
											}
										/>
									</li>
								))}
							</ul>
							<Button
								onClick={_ =>
									setAttributes({
										tools: [
											...tools,
											{ name: "", imageID: 0, imageAlt: "", imageURL: "" }
										]
									})
								}
							>
								{__("Add new tools")}
							</Button>
						</Fragment>
					)}
					<RichText
						tagName="h2"
						placeholder={__("Duration")}
						keepPlaceholderOnFocus={true}
						value={timeIntro}
						onChange={timeIntro => setAttributes({ timeIntro })}
					/>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "35% 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
						}}
					>
						<span />
						{units.map(u => (
							<p style={{ textAlign: "center", fontSize: "15px" }}>{__(u)}</p>
						))}
						<RichText
							keepPlaceholderOnFocus
							value={totalTimeText}
							onChange={totalTimeText => setAttributes({ totalTimeText })}
						/>
						{totalTime.map((t, i) => (
							<RichText
								style={{ textAlign: "right" }}
								className="ub_howto_time_value"
								keepPlaceholderOnFocus
								placeholder={__("0")}
								value={String(t)}
								onChange={newInput => {
									if (!isNaN(Number(newInput))) {
										setAttributes({
											totalTime: [
												...totalTime.slice(0, i),
												Number(newInput),
												...totalTime.slice(i + 1)
											]
										});
									}
								}}
							/>
						))}
					</div>
					<div className="ub_howto_cost_container">
						<RichText
							value={costDisplayText}
							onChange={costDisplayText => setAttributes({ costDisplayText })}
						/>
						<div
							className="ub_howto_cost_display"
							style={{
								flexDirection: showUnitFirst ? "row" : "row-reverse"
							}}
						>
							<RichText
								keepPlaceholderOnFocus
								placeholder={__("Units")}
								value={costCurrency}
								onChange={costCurrency => setAttributes({ costCurrency })}
							/>
							<RichText
								keepPlaceholderOnFocus
								placeholder={__("0")}
								value={String(cost)}
								onChange={cost => {
									if (!isNaN(Number(cost))) {
										setAttributes({ cost: Number(cost) });
									}
								}}
							/>
						</div>
					</div>
					{useSections ? (
						<ol>
							{section.map((s, i) => (
								<HowToSection
									{...s}
									clips={clips}
									videoURL={videoURL}
									videoDuration={videoDuration}
									sectionNum={i}
									editSection={newSection =>
										setAttributes({
											section: [
												...section.slice(0, i),
												newSection,
												...section.slice(i + 1)
											]
										})
									}
									deleteSection={_ =>
										setAttributes({
											section: [...section.slice(0, i), ...section.slice(i + 1)]
										})
									}
								/>
							))}
						</ol>
					) : (
						<div>
							<ol>
								{section[0].steps.map((step, i) => (
									<HowToStep
										sectionNum={-1}
										stepNum={i}
										{...step}
										clips={clips}
										videoURL={videoURL}
										videoDuration={videoDuration}
										editStep={newStep =>
											setAttributes({
												section: [
													Object.assign(section[0], {
														steps: [
															...section[0].steps.slice(0, i),
															Object.assign(section[0].steps[i], newStep),
															...section[0].steps.slice(i + 1)
														]
													})
												]
											})
										}
										deleteStep={_ => {
											let newSection = [
												Object.assign(section[0], {
													steps: [
														...section[0].steps.slice(0, i),
														...section[0].steps.slice(i + 1)
													]
												})
											];

											section[0].steps.forEach((step, j) => {
												step.anchor = `step${j}`;
											});
											setAttributes({
												section: newSection
											});
										}}
										moveUp={_ => {
											if (i > 0) {
												let newSection = [
													Object.assign(section[0], {
														steps: [
															...section[0].steps.slice(0, i - 1),
															section[0].steps[i],
															section[0].steps[i - 1],
															...section[0].steps.slice(i + 1)
														]
													})
												];
												section[0].steps.forEach((step, j) => {
													step.anchor = `step${j}`;
												});
												setAttributes({
													section: newSection
												});
											}
										}}
										moveDown={_ => {
											if (i < section[0].steps.length - 1) {
												let newSection = [
													Object.assign(section[0], {
														steps: [
															...section[0].steps.slice(0, i),
															section[0].steps[i + 1],
															section[0].steps[i],
															...section[0].steps.slice(i + 2)
														]
													})
												];
												section[0].steps.forEach((step, j) => {
													step.anchor = `step${j}`;
												});

												setAttributes({
													section: newSection
												});
											}
										}}
									/>
								))}
							</ol>
							<Button
								onClick={_ => {
									setAttributes({
										section: [
											Object.assign(section[0], {
												steps: [
													...section[0].steps,
													{
														anchor: `step${section[0].steps.length}`,
														stepPic: { img: -1, alt: "", url: "" },
														direction: "",
														tip: "",
														title: "",
														hasVideoClip: false,
														videoClipStart: 0,
														videoClipEnd: 0
													}
												]
											})
										]
									});
								}}
							>
								<Icon icon="plus" />
								{__("Add step")}
							</Button>
						</div>
					)}
					{useSections && (
						<Button
							onClick={_ =>
								setAttributes({
									section: [
										...section,
										{
											sectionName: "",
											steps: [
												{
													anchor: `section${section.length}step0`,
													stepPic: { img: -1, alt: "", url: "" },
													direction: "",
													tip: "",
													title: "",
													hasVideoClip: false,
													videoClipStart: 0,
													videoClipEnd: 0
												}
											]
										}
									]
								})
							}
						>
							<Icon icon="plus" />
							{__("Add section")}
						</Button>
					)}
					<RichText
						tagName="h2"
						placeholder={__("Result")}
						keepPlaceholderOnFocus={true}
						value={resultIntro}
						onChange={resultIntro => setAttributes({ resultIntro })}
					/>
					<RichText
						keepPlaceholderOnFocus
						placeholder={__("Result text")}
						value={howToYield}
						onChange={howToYield => setAttributes({ howToYield })}
					/>
					{finalImageURL !== "" ? (
						<div>
							<img src={finalImageURL} />
							<span
								title={__("Delete image")}
								className="dashicons dashicons-dismiss"
								onClick={_ =>
									setAttributes({
										finalImageID: -1,
										finalImageAlt: "",
										finalImageURL: ""
									})
								}
							/>
						</div>
					) : (
						<MediaUpload
							onSelect={img =>
								setAttributes({
									finalImageID: img.id,
									finalImageAlt: img.alt,
									finalImageURL: img.url
								})
							}
							type="image"
							value={finalImageID}
							render={({ open }) => (
								<Button
									className="components-button button button-medium"
									onClick={open}
								>
									{__("Upload Image")}
								</Button>
							)}
						/>
					)}
				</div>
			</Fragment>
		);
	}),
	save: _ => null
});