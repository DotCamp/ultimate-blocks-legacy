import { Component } from "react";
import { convertFromSeconds } from "../../common";

const { __ } = wp.i18n; // Import __() from wp.i18n

const { RichText, MediaUpload, InspectorControls } =
	wp.blockEditor || wp.editor;

const {
	Button,
	ToggleControl,
	PanelBody,
	RadioControl,
	RangeControl,
	SelectControl,
} = wp.components;

class InspectorPanel extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			attributes: {
				advancedMode,
				section,
				sectionListStyle,
				suppliesListStyle,
				toolsListStyle,
				showUnitFirst,
				useSections,
				includeToolsList,
				addToolImages,
				includeSuppliesList,
				addSupplyImages,
				finalImageID,
				finalImageWidth,
				finalImageFloat,
				firstLevelTag,
				secondLevelTag,
				thirdLevelTag,
			},
			setAttributes,
			currentStep,
			updateState,
		} = this.props;

		let activeImage = { width: 0, float: "none" };

		let sectionNum = -1;
		let stepNum = -1;

		const tagList = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "strong"];

		if (currentStep !== "") {
			if (currentStep === "final") {
				if (finalImageID > -1) {
					activeImage = { width: finalImageWidth, float: finalImageFloat };
				}
			} else {
				const parsed = currentStep.split("-");

				if (useSections) {
					sectionNum = parseInt(parsed[1]);
					stepNum = parseInt(parsed[3]);

					if (!isNaN(stepNum)) {
						//exclude review image
						const { width, float, id } =
							section[sectionNum].steps[stepNum].stepPic;
						if (id > -1) {
							activeImage = { width, float };
						}
					}
				} else {
					stepNum = parseInt(parsed[1]);

					if (!isNaN(stepNum)) {
						//exclude review image
						const { width, float, id } = section[0].steps[stepNum].stepPic;
						if (id > -1) {
							activeImage = { width, float };
						}
					}
				}
			}
		}

		return (
			<InspectorControls>
				<PanelBody title={__("How To Settings")}>
					<ToggleControl
						label={__("Use sections")}
						checked={useSections}
						onChange={(useSections) => {
							setAttributes({ useSections });
							if (useSections) {
								let newSection = JSON.parse(JSON.stringify(section));
								newSection.forEach((ns, i) =>
									ns.steps.forEach((s, j) => {
										s.anchor = `section${i}step${j}`;
									})
								);
								if (currentStep !== "") {
									updateState({ currentStep: `section-0-${currentStep}` });
								}
							} else {
								updateState({
									currentStep: currentStep.slice(currentStep.indexOf("step")),
								});
								if (section.length < 1) {
									setAttributes({
										section: [{ sectionName: "", steps: [] }],
									});
								} else {
									let newSection = JSON.parse(JSON.stringify(section));
									newSection[0].steps.forEach((s, i) => {
										s.anchor = `step${i}`;
									});
									setAttributes({ section: newSection });
								}
							}
						}}
					/>
					<ToggleControl
						label={__("Use additional recommended attributes")}
						checked={advancedMode}
						onChange={(advancedMode) => setAttributes({ advancedMode })}
					/>
					{advancedMode && (
						<>
							<ToggleControl
								label={__("Include list of supplies")}
								checked={includeSuppliesList}
								onChange={(includeSuppliesList) =>
									setAttributes({ includeSuppliesList })
								}
							/>
							<ToggleControl
								label={__("Include list of tools")}
								checked={includeToolsList}
								onChange={(includeToolsList) =>
									setAttributes({ includeToolsList })
								}
							/>
							<ToggleControl
								label={__("Display the unit first in cost")}
								checked={showUnitFirst}
								onChange={(showUnitFirst) => setAttributes({ showUnitFirst })}
							/>
						</>
					)}
					{useSections && (
						<RadioControl
							label={__("Section list style")}
							selected={sectionListStyle}
							options={["none", "ordered", "unordered"].map((a) => ({
								label: __(a),
								value: a,
							}))}
							onChange={(sectionListStyle) =>
								setAttributes({ sectionListStyle })
							}
						/>
					)}
				</PanelBody>
				{activeImage.width > 0 && (
					<PanelBody title={__("Desktop image display settings")}>
						<RangeControl
							label={__("Image width")}
							value={activeImage.width}
							onChange={(imageWidth) => {
								if (currentStep === "final") {
									setAttributes({ finalImageWidth: imageWidth });
								} else {
									const parsed = currentStep.split("-");
									let sectionClone = JSON.parse(JSON.stringify(section));
									if (useSections) {
										sectionNum = parseInt(parsed[1]);
										stepNum = parseInt(parsed[3]);
									} else {
										stepNum = parseInt(parsed[1]);
									}
									sectionClone[Math.max(sectionNum, 0)].steps[
										stepNum
									].stepPic.width = imageWidth;

									setAttributes({ section: sectionClone });
								}
							}}
							min={200}
							max={800}
						/>
						<SelectControl
							label={__("Image float")}
							value={activeImage.float}
							onChange={(newFloatValue) => {
								if (currentStep === "final") {
									setAttributes({ finalImageFloat: newFloatValue });
								} else {
									const parsed = currentStep.split("-");
									let sectionClone = JSON.parse(JSON.stringify(section));
									if (useSections) {
										sectionNum = parseInt(parsed[1]);
										stepNum = parseInt(parsed[3]);
									} else {
										stepNum = parseInt(parsed[1]);
									}
									sectionClone[Math.max(sectionNum, 0)].steps[
										stepNum
									].stepPic.float = newFloatValue;

									setAttributes({ section: sectionClone });
								}
							}}
							options={["none", "left", "right"].map((a) => ({
								label: a,
								value: a,
							}))}
						/>
					</PanelBody>
				)}
				{advancedMode && includeSuppliesList && (
					<PanelBody title={__("Supplies list settings")}>
						<ToggleControl
							label={__("Enable adding image for each supply")}
							checked={addSupplyImages}
							onChange={(addSupplyImages) => setAttributes({ addSupplyImages })}
						/>
						<RadioControl
							label={__("Supplies list style")}
							selected={suppliesListStyle}
							options={["none", "ordered", "unordered"].map((a) => ({
								label: __(a),
								value: a,
							}))}
							onChange={(suppliesListStyle) =>
								setAttributes({ suppliesListStyle })
							}
						/>
					</PanelBody>
				)}
				{advancedMode && includeToolsList && (
					<PanelBody title={__("Tools list settings")}>
						<ToggleControl
							label={__("Enable adding image for each tool")}
							checked={addToolImages}
							onChange={(addToolImages) => setAttributes({ addToolImages })}
						/>
						<RadioControl
							label={__("Tools list style")}
							selected={toolsListStyle}
							options={["none", "ordered", "unordered"].map((a) => ({
								label: __(a),
								value: a,
							}))}
							onChange={(toolsListStyle) => setAttributes({ toolsListStyle })}
						/>
					</PanelBody>
				)}
				<PanelBody title={__("Tag Settings")}>
					<SelectControl
						label={__("Howto title tag")}
						value={firstLevelTag}
						options={tagList.map((tag) => ({ label: __(tag), value: tag }))}
						onChange={(firstLevelTag) => setAttributes({ firstLevelTag })}
					/>
					<SelectControl
						label={__("Section title tag")}
						value={secondLevelTag}
						options={tagList.map((tag) => ({ label: __(tag), value: tag }))}
						onChange={(secondLevelTag) => setAttributes({ secondLevelTag })}
					/>
					<SelectControl
						label={__("Step title tag")}
						value={thirdLevelTag}
						options={tagList.map((tag) => ({ label: __(tag), value: tag }))}
						onChange={(thirdLevelTag) => setAttributes({ thirdLevelTag })}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}
const defaultTimeDisplay = {
	w: 0,
	d: 0,
	h: 0,
	m: 0,
	s: 0,
};

const ListWrapper = (props) => {
	const { className, children, listStyle } = props;
	return listStyle === "ordered" ? (
		<ol className={className ? className : null}>{children}</ol>
	) : (
		<ul
			className={className ? className : null}
			style={{ listStyleType: listStyle === "none" ? "none" : null }}
		>
			{children}
		</ul>
	);
};

class HowToStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startTime: Object.assign({}, defaultTimeDisplay),
			endTime: Object.assign({}, defaultTimeDisplay),
			validTimeInput: true,
		};
	}

	componentDidMount() {
		const {
			clips,
			hasVideoClip,
			videoClipEnd,
			videoClipStart,
			sectionNum,
			stepNum,
		} = this.props;

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
						(c) =>
							c.anchor !== clipId &&
							((videoClipStart > c.clipStart && videoClipStart < c.clipEnd) ||
								(videoClipEnd > c.clipStart && videoClipEnd < c.clipEnd))
					).length === 0,
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
			videoURL,
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
						(c) =>
							c.anchor !== clipId &&
							((videoClipStart > c.clipStart && videoClipStart < c.clipEnd) ||
								(videoClipEnd > c.clipStart && videoClipEnd < c.clipEnd))
					).length === 0,
			});
		}

		if (prevProps.videoURL !== videoURL) {
			this.setState({
				startTime: Object.assign({}, defaultTimeDisplay),
				endTime: Object.assign({}, defaultTimeDisplay),
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
			stepTag,
			videoDuration,
			hasVideoClip,
			advancedMode,
			blockIsSelected,
			selectStep,
		} = this.props;

		const { startTime, endTime, validTimeInput } = this.state;

		return (
			<li className="ub_howto-step">
				<div>
					<RichText
						tagName={stepTag}
						keepPlaceholderOnFocus
						placeholder={__("Title goes here")}
						value={title}
						onChange={(newVal) => editStep({ title: newVal })}
						onFocus={selectStep}
					/>
					<Button
						className="ub_howto-delete"
						icon="trash"
						label={__("Delete step")}
						onClick={() => deleteStep()}
					/>
					<Button
						className="ub_howto-arrow"
						icon="arrow-up-alt"
						onClick={() => moveUp()}
						label={__("Move step up")}
					/>
					<Button
						className="ub_howto-arrow"
						icon="arrow-down-alt"
						onClick={() => moveDown()}
						label={__("Move step down")}
					/>
				</div>
				{stepPic.url !== "" ? (
					<figure>
						<img
							className="ub_howto-step-image"
							src={stepPic.url}
							onClick={selectStep}
						/>
						{blockIsSelected && (
							<span
								title={__("Delete image")}
								className="dashicons dashicons-dismiss"
								onClick={() =>
									editStep({
										stepPic: {
											id: -1,
											alt: "",
											url: "",
											caption: "",
											width: 0,
											float: "none",
										},
									})
								}
							/>
						)}
						<RichText
							tagName="figcaption"
							keepPlaceholderOnFocus
							placeholder={__("Step image caption")}
							value={stepPic.caption}
							onFocus={selectStep}
							onChange={(newCaption) =>
								editStep({
									stepPic: Object.assign(stepPic, { caption: newCaption }),
								})
							}
						/>
					</figure>
				) : (
					<MediaUpload
						onSelect={(img) => {
							editStep({
								stepPic: {
									id: img.id,
									alt: img.alt,
									url: img.url,
									caption: img.caption,
									width: Math.min(Math.max(img.width, 200), 800),
									float: "none",
								},
							});
							selectStep();
						}}
						allowedTypes={["image"]}
						value={stepPic.id}
						render={({ open }) => (
							<Button
								className="button is-default is-large ub_howto-button-default"
								onClick={open}
							>
								{__("Upload Image")}
							</Button>
						)}
					/>
				)}
				<div>
					<RichText
						keepPlaceholderOnFocus
						placeholder={__("Direction goes here")}
						value={direction}
						onFocus={selectStep}
						onChange={(newVal) => editStep({ direction: newVal })}
					/>
					<RichText
						keepPlaceholderOnFocus
						placeholder={__("Add a tip (optional)")}
						value={tip}
						onFocus={selectStep}
						onChange={(newVal) => editStep({ tip: newVal })}
					/>
					{advancedMode && (
						<>
							{videoDuration > 0 && (
								<ToggleControl
									checked={hasVideoClip}
									label={__("Use part of the video in this step")}
									onChange={(hasVideoClip) => {
										editStep({ hasVideoClip });
										if (!hasVideoClip) {
											editStep({ videoClipEnd: 0, videoClipStart: 0 });
											this.setState({
												startTime: Object.assign({}, defaultTimeDisplay),
												endTime: Object.assign({}, defaultTimeDisplay),
											});
										}
									}}
								/>
							)}
							{videoDuration > 0 && hasVideoClip && (
								<>
									<span style={{ color: validTimeInput ? "black" : "red" }}>
										{__("Start time")}
									</span>
									{videoDuration >= 86400 && (
										<input
											type="number"
											value={startTime.d}
											min={0}
											step={1}
											title={__("Days")}
											onChange={(e) => {
												const { h, m, s } = this.state.startTime;
												const d = Number(e.target.value);
												const startPoint = d * 86400 + h * 3600 + m * 60 + s;

												if (
													startPoint < videoDuration &&
													d % 1 === 0 &&
													d > -1
												) {
													this.setState({
														startTime: Object.assign(startTime, { d }),
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
											title={__("Hours")}
											onChange={(e) => {
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
														startTime: Object.assign(startTime, { h }),
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
											title={__("Minutes")}
											onChange={(e) => {
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
														startTime: Object.assign(startTime, { m }),
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
										title={__("Seconds")}
										onChange={(e) => {
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
													startTime: Object.assign(startTime, { s }),
												});
												editStep({ videoClipStart: startPoint });
											}
										}}
									/>
									<br />
									<span style={{ color: validTimeInput ? "black" : "red" }}>
										{__("End time")}
									</span>
									{videoDuration >= 86400 && (
										<input
											type="number"
											value={endTime.d}
											min={0}
											step={1}
											title={__("Days")}
											onChange={(e) => {
												const { h, m, s } = this.state.endTime;
												const d = Number(e.target.value);
												const endPoint = d * 86400 + h * 3600 + m * 60 + s;

												if (
													endPoint <= videoDuration &&
													d % 1 === 0 &&
													d > -1
												) {
													this.setState({
														endTime: Object.assign(endTime, { d }),
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
											title={__("Hours")}
											onChange={(e) => {
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
														endTime: Object.assign(endTime, { h }),
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
											title={__("Minutes")}
											onChange={(e) => {
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
														endTime: Object.assign(endTime, { m }),
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
										title={__("Seconds")}
										onChange={(e) => {
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
													endTime: Object.assign(endTime, { s }),
												});
												editStep({ videoClipEnd: endPoint });
											}
										}}
									/>
								</>
							)}
						</>
					)}
				</div>
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
			sectionListStyle,
			sectionNum,
			sectionName,
			sectionTag,
			steps,
			stepTag,
			editSection,
			deleteSection,
			videoDuration,
			clips,
			videoURL,
			advancedMode,
			blockIsSelected,
			updateState,
			currentStep,
		} = this.props;

		return (
			<li className="ub_howto-section">
				<div>
					<RichText
						keepPlaceholderOnFocus
						tagName={sectionTag}
						placeholder={__("Section name goes here")}
						value={sectionName}
						onChange={(sectionName) => editSection({ sectionName, steps })}
					/>
					<Button
						className="ub_howto-delete"
						icon="trash"
						label={__("Delete section")}
						onClick={() => deleteSection()}
					/>
				</div>
				<ListWrapper
					className="ub_howto-steps-list"
					listStyle={sectionListStyle}
				>
					{steps.map((step, i) => (
						<HowToStep
							{...step}
							advancedMode={advancedMode}
							clips={clips}
							sectionNum={sectionNum}
							stepNum={i}
							stepTag={stepTag}
							videoURL={videoURL}
							videoDuration={videoDuration}
							selectStep={() => this.props.selectStepInSection(i)}
							editStep={(newStep) => {
								editSection({
									sectionName,
									steps: [
										...steps.slice(0, i),
										Object.assign(steps[i], newStep),
										...steps.slice(i + 1),
									],
								});
							}}
							deleteStep={() => {
								let newSteps = [...steps.slice(0, i), ...steps.slice(i + 1)];
								newSteps.forEach(
									(step, j) => (step.anchor = `section${sectionNum}step${j}`)
								);
								editSection({
									sectionName,
									steps: [...steps.slice(0, i), ...steps.slice(i + 1)],
								});
								if (currentStep === `section-${sectionNum}-step-${i}`) {
									updateState({ currentStep: "" });
								}
							}}
							moveUp={() => {
								if (i > 0) {
									let newSteps = [
										...steps.slice(0, i - 1),
										steps[i],
										steps[i - 1],
										...steps.slice(i + 1),
									];
									newSteps.forEach(
										(step, j) => (step.anchor = `section${sectionNum}step${j}`)
									);
									editSection({ sectionName, steps: newSteps });
									//set value of currentStep to recently-moved step
									updateState({
										currentStep: `section-${sectionNum}-step-${i - 1}`,
									});
								}
							}}
							moveDown={() => {
								if (i < steps.length - 1) {
									let newSteps = [
										...steps.slice(0, i),
										steps[i + 1],
										steps[i],
										...steps.slice(i + 2),
									];
									newSteps.forEach(
										(step, j) => (step.anchor = `section${sectionNum}step${j}`)
									);
									editSection({ sectionName, steps: newSteps });
									updateState({
										currentStep: `section-${sectionNum}-step-${i + 1}`,
									});
								}
							}}
							blockIsSelected={blockIsSelected}
							currentStep={currentStep}
							updateState={updateState}
						/>
					))}
				</ListWrapper>
				<Button
					className="ub_howto-button-default"
					onClick={() => {
						editSection({
							sectionName,
							steps: [
								...steps,
								{
									anchor: `section${sectionNum}step${steps.length}`,
									stepPic: {
										img: -1,
										alt: "",
										url: "",
										width: 0,
										float: "none",
									},
									direction: "",
									tip: "",
									title: "",
									hasVideoClip: false,
									videoClipStart: 0,
									videoClipEnd: 0,
								},
							],
						});
					}}
				>
					{__("Add step")}
				</Button>
			</li>
		);
	}
}

export class EditorComponent extends Component {
	constructor(props) {
		super(props);
		this.state = { videoURLInput: "", currentStep: "" };
	}

	componentDidMount() {
		const {
			attributes: { videoURL, section },
			setAttributes,
		} = this.props;

		this.setState({ videoURLInput: videoURL });

		//add width and float to images for each step

		let sectionClone = JSON.parse(JSON.stringify(section));
		let hasMissingProperties = false;

		sectionClone.forEach((s) => {
			s.steps.forEach((st) => {
				if (!st.stepPic.hasOwnProperty("width")) {
					hasMissingProperties = true;
					st.stepPic.width = 200;
					st.stepPic.float = "none";
				}
			});
		});

		if (hasMissingProperties) {
			setAttributes({ section: sectionClone });
		}
	}

	render() {
		const {
			attributes: {
				blockID,
				title,
				introduction,
				advancedMode,
				section,
				sectionListStyle,
				suppliesIntro,
				supplies,
				suppliesListStyle,
				toolsIntro,
				tools,
				toolsListStyle,
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
				finalImageCaption,
				finalImageWidth,
				finalImageFloat,
				videoURL,
				videoEmbedCode,
				videoDuration,
				firstLevelTag,
				secondLevelTag,
				thirdLevelTag,
			},
			setAttributes,
			block,
			getBlock,
			getClientIdsWithDescendants,
			isSelected,
		} = this.props;

		const { videoURLInput, currentStep } = this.state;

		const units = [
			"years",
			"months",
			"weeks",
			"days",
			"hours",
			"minutes",
			"seconds",
		];

		const resetVideoAttributes = () => {
			let newSection = JSON.parse(JSON.stringify(section));
			newSection.forEach((s) =>
				s.steps.map((st) =>
					Object.assign(st, {
						hasVideoClip: false,
						videoClipStart: 0,
						videoClipEnd: 0,
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
				videoDuration: 0,
			});
		};

		const clips = section
			.reduce((stepList, section) => [...stepList, ...section.steps], [])
			.filter((s) => s.hasVideoClip)
			.map((s) => ({
				anchor: s.anchor,
				clipStart: s.videoClipStart,
				clipEnd: s.videoClipEnd,
			}));

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}

		const checkVideoURLInput = () => {
			if (/^http(s)?:\/\//g.test(videoURLInput)) {
				const youtubeMatch =
					/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/g.exec(
						videoURLInput
					);
				const vimeoMatch =
					/^(?:https?\:\/\/)?(?:www\.|player\.)?(?:vimeo\.com\/)([0-9]+)/g.exec(
						videoURLInput
					);
				const dailyMotionMatch =
					/^(?:https?\:\/\/)?(?:www\.)?(?:dailymotion\.com\/video|dai\.ly)\/([0-9a-z]+)(?:[\-_0-9a-zA-Z]+#video=([a-z0-9]+))?/g.exec(
						videoURLInput
					);
				const videoPressMatch =
					/^https?:\/\/(?:www\.)?videopress\.com\/(?:embed|v)\/([a-zA-Z0-9]{8,})/g.exec(
						videoURLInput
					);
				if (youtubeMatch) {
					fetch(
						`https://www.googleapis.com/youtube/v3/videos?id=${youtubeMatch[1]}&part=snippet,contentDetails,player&key=AIzaSyDgItjYofyXkIZ4OxF6gN92PIQkuvU319c`
					)
						.then((response) => {
							response.json().then((data) => {
								if (data.items.length) {
									let timePeriods = data.items[0].contentDetails.duration.match(
										/(\d{1,2}(?:W|D|H|M|S))/g
									);
									setAttributes({
										videoURL: `https://www.youtube.com/watch?v=${youtubeMatch[1]}`,
										videoName: data.items[0].snippet.title,
										videoDescription: data.items[0].snippet.description,
										videoUploadDate:
											Date.parse(data.items[0].snippet.publishedAt) / 1000,
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
												S: 1,
											};
											return (
												sum +
												Number(part.slice(0, -1)) * multiplier[part.slice(-1)]
											);
										}, 0),
									});
								} else {
									resetVideoAttributes();
									setAttributes({
										videoEmbedCode: `<p>${__("No video found at URL")}</p>`,
									});
								}
							});
						})
						.catch((err) => {
							console.log("youtube fetch error");
							console.log(err);
						});
				} else if (vimeoMatch) {
					fetch(`https://vimeo.com/api/v2/video/${vimeoMatch[1]}.json`)
						.then((response) => {
							if (response.ok) {
								response
									.json()
									.then((data) => {
										setAttributes({
											videoURL: data[0].url,
											videoName: data[0].title,
											videoDescription: data[0].description,
											videoUploadDate: Date.parse(data[0].upload_date) / 1000,
											videoThumbnailURL: data[0].thumbnail_large,
											videoDuration: data[0].duration,
										});
										fetch(
											`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
												data[0].url
											)}`
										)
											.then((response) => {
												response.json().then((data) => {
													setAttributes({
														videoEmbedCode: data.html,
													});
												});
											})
											.catch((err) => {
												console.log("vimeo oembed error");
												console.log(err);
											});
									})
									.catch((err) => {
										console.log(err);
									});
							} else {
								resetVideoAttributes();
								setAttributes({
									videoEmbedCode: `<p>${__("No video found at URL")}</p>`,
								});
							}
						})
						.catch((err) => {
							console.log("vimeo fetch error");
							console.log(err);
						});
				} else if (dailyMotionMatch) {
					fetch(
						`https://api.dailymotion.com/video/${dailyMotionMatch[1]}?fields=created_time%2Cthumbnail_1080_url%2Ctitle%2Cdescription%2Curl%2Cembed_html%2Cduration`
					)
						.then((response) => {
							if (response.ok) {
								response.json().then((data) => {
									setAttributes({
										videoURL: data.url,
										videoName: data.title,
										videoDescription: data.description,
										videoUploadDate: data.created_time,
										videoThumbnailURL: data.thumbnail_1080_url,
										videoEmbedCode: decodeURIComponent(data.embed_html),
										videoDuration: data.duration,
									});
								});
							} else {
								resetVideoAttributes();
								setAttributes({
									videoEmbedCode: `<p>${__("No video found at URL")}</p>`,
								});
							}
						})
						.catch((err) => {
							console.log("dailymotion input error");
							console.log(err);
						});
				} else if (videoPressMatch) {
					fetch(
						`https://public-api.wordpress.com/rest/v1.1/videos/${videoPressMatch[1]}`
					)
						.then((response) => {
							if (response.ok) {
								response.json().then((data) => {
									setAttributes({
										videoURL: `https://videopress.com/v/${data.guid}`,
										videoName: data.title,
										videoDescription: data.description,
										videoUploadDate: Date.parse(data.upload_date) / 1000,
										videoThumbnailURL: data.poster,
										videoEmbedCode: `<iframe width="560" height="315" src="https://videopress.com/embed/${data.guid}" frameborder="0" allowfullscreen></iframe>
					<script src="https://videopress.com/videopress-iframe.js"></script>`,
										videoDuration: Math.floor(data.duration / 1000),
									});
								});
							} else {
								resetVideoAttributes();
								setAttributes({
									videoEmbedCode: `<p>${__("No video found at URL")}</p>`,
								});
							}
						})
						.catch((err) => {
							console.log("videopress input error");
							console.log(err);
						});
				} else {
					resetVideoAttributes();
					setAttributes({ videoEmbedCode: "<p>Video site not supported</p>" });
				}
			} else {
				resetVideoAttributes();
				console.log("input is not a url");
			}
		};

		return (
			<>
				<InspectorPanel
					{...this.props}
					{...this.state}
					updateState={(newState) => this.setState(newState)}
				/>
				<div className="ub_howto" id={`ub_howto-${blockID}`}>
					<RichText
						tagName={firstLevelTag}
						placeholder={__("How to title")}
						keepPlaceholderOnFocus={true}
						value={title}
						onChange={(title) => setAttributes({ title })}
					/>
					<RichText
						placeholder={__("How to introduction")}
						keepPlaceholderOnFocus={true}
						value={introduction}
						onChange={(introduction) => setAttributes({ introduction })}
					/>
					{advancedMode && (
						<>
							<div className="ub_howto-video-input">
								<input
									type="url"
									placeholder={__("Insert video URL")}
									className="button-url"
									value={videoURLInput}
									onChange={(e) =>
										this.setState({ videoURLInput: e.target.value })
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											checkVideoURLInput();
										}
									}}
								/>
								<Button
									icon={"editor-break"}
									label={__("Apply")}
									type={"submit"}
									onClick={checkVideoURLInput}
								/>
								<Button
									icon="trash"
									label={__("Delete")}
									onClick={() => {
										resetVideoAttributes();
										this.setState({ videoURLInput: "" });
									}}
								/>
							</div>
							<div
								dangerouslySetInnerHTML={{
									__html: videoEmbedCode || "<p>Input error</p>",
								}}
							/>
							{includeSuppliesList && (
								<>
									<RichText
										tagName={secondLevelTag}
										placeholder={__("Required supplies")}
										keepPlaceholderOnFocus={true}
										value={suppliesIntro}
										onChange={(suppliesIntro) =>
											setAttributes({ suppliesIntro })
										}
									/>
									<ListWrapper
										className={"ub_howto-supplies-list"}
										listStyle={suppliesListStyle}
									>
										{supplies.map((supply, i) => (
											<li>
												<div>
													<RichText
														keepPlaceholderOnFocus
														value={supply.name}
														placeholder={__("Enter supply name")}
														onChange={(newName) =>
															setAttributes({
																supplies: [
																	...supplies.slice(0, i),
																	Object.assign(supplies[i], { name: newName }),
																	...supplies.slice(i + 1),
																],
															})
														}
													/>
													<Button
														icon="trash"
														label={__("Delete supply")}
														onClick={() =>
															setAttributes({
																supplies: [
																	...supplies.slice(0, i),
																	...supplies.slice(i + 1),
																],
															})
														}
													/>
												</div>
												{addSupplyImages &&
													(supply.imageURL !== "" ? (
														<figure>
															<img
																className="ub_howto-supply-image"
																src={supply.imageURL}
															/>
															{isSelected && (
																<span
																	title={__("Delete image")}
																	className="dashicons dashicons-dismiss"
																	onClick={() =>
																		setAttributes({
																			supplies: [
																				...supplies.slice(0, i),
																				Object.assign(supply, {
																					imageID: 0,
																					imageURL: "",
																					imageAlt: "",
																				}),
																				...supplies.slice(i + 1),
																			],
																		})
																	}
																/>
															)}
														</figure>
													) : (
														<MediaUpload
															onSelect={(img) =>
																setAttributes({
																	supplies: [
																		...supplies.slice(0, i),
																		Object.assign(supply, {
																			imageID: img.id,
																			imageURL: img.url,
																			imageAlt: img.alt,
																		}),
																		...supplies.slice(i + 1),
																	],
																})
															}
															allowedTypes={["image"]}
															value={supply.imageID}
															render={({ open }) => (
																<Button
																	className="button is-default is-large ub_howto-button-default"
																	onClick={open}
																>
																	{__("Upload Image")}
																</Button>
															)}
														/>
													))}
											</li>
										))}
									</ListWrapper>
									<Button
										className="ub_howto-button-default"
										onClick={() =>
											setAttributes({
												supplies: [
													...supplies,
													{ name: "", imageID: 0, imageAlt: "", imageURL: "" },
												],
											})
										}
									>
										{__("Add new supplies")}
									</Button>
								</>
							)}
							{includeToolsList && (
								<>
									<RichText
										tagName={secondLevelTag}
										placeholder={__("Required tools")}
										keepPlaceholderOnFocus={true}
										value={toolsIntro}
										onChange={(toolsIntro) => setAttributes({ toolsIntro })}
									/>
									<ListWrapper
										className={"ub_howto-tools-list"}
										listStyle={toolsListStyle}
									>
										{tools.map((tool, i) => (
											<li>
												<div>
													<RichText
														keepPlaceholderOnFocus
														value={tool.name}
														placeholder={__("Enter tool name")}
														onChange={(newTool) =>
															setAttributes({
																tools: [
																	...tools.slice(0, i),
																	Object.assign(tools[i], { name: newTool }),
																	...tools.slice(i + 1),
																],
															})
														}
													/>
													<Button
														icon="trash"
														label={__("Delete tool")}
														onClick={() =>
															setAttributes({
																tools: [
																	...tools.slice(0, i),
																	...tools.slice(i + 1),
																],
															})
														}
													/>
												</div>
												{addToolImages &&
													(tool.imageURL !== "" ? (
														<figure>
															<img src={tool.imageURL} />
															{isSelected && (
																<span
																	title={__("Delete image")}
																	className="dashicons dashicons-dismiss"
																	onClick={() =>
																		setAttributes({
																			tools: [
																				...tools.slice(0, i),
																				Object.assign(tool, {
																					imageID: 0,
																					imageURL: "",
																					imageAlt: "",
																				}),
																				...tools.slice(i + 1),
																			],
																		})
																	}
																/>
															)}
														</figure>
													) : (
														<MediaUpload
															onSelect={(img) =>
																setAttributes({
																	tools: [
																		...tools.slice(0, i),
																		Object.assign(tool, {
																			imageID: img.id,
																			imageURL: img.url,
																			imageAlt: img.alt,
																		}),
																		...tools.slice(i + 1),
																	],
																})
															}
															allowedTypes={["image"]}
															value={tool.imageID}
															render={({ open }) => (
																<Button
																	className="button is-default is-large ub_howto-button-default"
																	onClick={open}
																>
																	{__("Upload Image")}
																</Button>
															)}
														/>
													))}
											</li>
										))}
									</ListWrapper>
									<Button
										className="ub_howto-button-default"
										onClick={() =>
											setAttributes({
												tools: [
													...tools,
													{ name: "", imageID: 0, imageAlt: "", imageURL: "" },
												],
											})
										}
									>
										{__("Add new tools")}
									</Button>
								</>
							)}
							<div className="ub_howto_cost_container">
								<RichText
									value={costDisplayText}
									onChange={(costDisplayText) =>
										setAttributes({ costDisplayText })
									}
								/>
								<div
									className="ub_howto_cost_display"
									style={{
										flexDirection: showUnitFirst ? "row" : "row-reverse",
									}}
								>
									<RichText
										style={
											showUnitFirst
												? { paddingRight: "10px" }
												: { paddingLeft: "10px" }
										}
										keepPlaceholderOnFocus
										placeholder={__("Units")}
										value={costCurrency}
										onChange={(costCurrency) => {
											costCurrency = costCurrency.replace(/<br>/g, "");
											setAttributes({ costCurrency });
										}}
									/>
									<RichText
										keepPlaceholderOnFocus
										placeholder={__("0")}
										value={String(cost)}
										onChange={(cost) => {
											if (!isNaN(Number(cost))) {
												setAttributes({ cost: Number(cost) });
											}
										}}
									/>
								</div>
							</div>
							<RichText
								tagName={secondLevelTag}
								placeholder={__("Duration")}
								keepPlaceholderOnFocus={true}
								value={timeIntro}
								onChange={(timeIntro) => setAttributes({ timeIntro })}
							/>
							<div className="ub_howto-duration-input">
								<span />
								{units.map((u) => (
									<p>{__(u)}</p>
								))}
								<RichText
									keepPlaceholderOnFocus
									value={totalTimeText}
									onChange={(totalTimeText) => setAttributes({ totalTimeText })}
								/>
								{totalTime.map((t, i) => (
									<RichText
										className="ub_howto-time-value"
										keepPlaceholderOnFocus
										placeholder={__("0")}
										value={String(t)}
										onChange={(newInput) => {
											if (!isNaN(Number(newInput))) {
												setAttributes({
													totalTime: [
														...totalTime.slice(0, i),
														Number(newInput),
														...totalTime.slice(i + 1),
													],
												});
											}
										}}
									/>
								))}
							</div>
						</>
					)}
					{useSections ? (
						<ListWrapper listStyle={sectionListStyle}>
							{section.map((s, i) => (
								<HowToSection
									{...s}
									advancedMode={advancedMode}
									clips={clips}
									videoURL={videoURL}
									videoDuration={videoDuration}
									sectionListStyle={sectionListStyle}
									sectionNum={i}
									sectionTag={secondLevelTag}
									stepTag={thirdLevelTag}
									selectStepInSection={(step) =>
										this.setState({ currentStep: `section-${i}-step-${step}` })
									}
									editSection={(newSection) =>
										setAttributes({
											section: [
												...section.slice(0, i),
												newSection,
												...section.slice(i + 1),
											],
										})
									}
									deleteSection={() =>
										setAttributes({
											section: [
												...section.slice(0, i),
												...section.slice(i + 1),
											],
										})
									}
									blockIsSelected={isSelected}
									currentStep={currentStep}
									updateState={(newState) => this.setState(newState)}
								/>
							))}
						</ListWrapper>
					) : (
						<>
							<ListWrapper
								className={"ub_howto-steps-list"}
								listStyle={sectionListStyle}
							>
								{section[0].steps.map((step, i) => (
									<HowToStep
										advancedMode={advancedMode}
										sectionNum={-1}
										stepNum={i}
										stepTag={thirdLevelTag}
										{...step}
										clips={clips}
										videoURL={videoURL}
										videoDuration={videoDuration}
										selectStep={() =>
											this.setState({ currentStep: `step-${i}` })
										}
										editStep={(newStep) => {
											setAttributes({
												section: [
													Object.assign(section[0], {
														steps: [
															...section[0].steps.slice(0, i),
															Object.assign(section[0].steps[i], newStep),
															...section[0].steps.slice(i + 1),
														],
													}),
												],
											});
										}}
										deleteStep={() => {
											let newSection = [
												Object.assign(section[0], {
													steps: [
														...section[0].steps.slice(0, i),
														...section[0].steps.slice(i + 1),
													],
												}),
											];

											section[0].steps.forEach((step, j) => {
												step.anchor = `step${j}`;
											});
											setAttributes({
												section: newSection,
											});
											if (currentStep === `step-${i}`) {
												this.setState({ currentStep: "" });
											}
										}}
										moveUp={() => {
											if (i > 0) {
												let newSection = [
													Object.assign(section[0], {
														steps: [
															...section[0].steps.slice(0, i - 1),
															section[0].steps[i],
															section[0].steps[i - 1],
															...section[0].steps.slice(i + 1),
														],
													}),
												];
												section[0].steps.forEach((step, j) => {
													step.anchor = `step${j}`;
												});
												setAttributes({ section: newSection });
												this.setState({ currentStep: `step-${i - 1}` });
											}
										}}
										moveDown={() => {
											if (i < section[0].steps.length - 1) {
												let newSection = [
													Object.assign(section[0], {
														steps: [
															...section[0].steps.slice(0, i),
															section[0].steps[i + 1],
															section[0].steps[i],
															...section[0].steps.slice(i + 2),
														],
													}),
												];
												section[0].steps.forEach((step, j) => {
													step.anchor = `step${j}`;
												});

												setAttributes({ section: newSection });
												this.setState({ currentStep: `step-${i + 1}` });
											}
										}}
										blockIsSelected={isSelected}
										updateState={(newState) => this.setState(newState)}
									/>
								))}
							</ListWrapper>
							<Button
								className="ub_howto-button-default"
								onClick={() => {
									setAttributes({
										section: [
											Object.assign(section[0], {
												steps: [
													...section[0].steps,
													{
														anchor: `step${section[0].steps.length}`,
														stepPic: {
															img: -1,
															alt: "",
															url: "",
															width: 0,
															float: "none",
														},
														direction: "",
														tip: "",
														title: "",
														hasVideoClip: false,
														videoClipStart: 0,
														videoClipEnd: 0,
													},
												],
											}),
										],
									});
								}}
							>
								{__("Add step")}
							</Button>
						</>
					)}
					{useSections && (
						<Button
							className="ub_howto-button-default"
							onClick={() =>
								setAttributes({
									section: [
										...section,
										{
											sectionName: "",
											steps: [
												{
													anchor: `section${section.length}step0`,
													stepPic: {
														img: -1,
														alt: "",
														url: "",
														width: 0,
														float: "none",
													},
													direction: "",
													tip: "",
													title: "",
													hasVideoClip: false,
													videoClipStart: 0,
													videoClipEnd: 0,
												},
											],
										},
									],
								})
							}
						>
							{__("Add Section")}
						</Button>
					)}
					<div className="ub_howto-yield">
						<RichText
							tagName={secondLevelTag}
							placeholder={__("Result")}
							keepPlaceholderOnFocus={true}
							value={resultIntro}
							onChange={(resultIntro) => setAttributes({ resultIntro })}
							onFocus={() => this.setState({ currentStep: "final" })}
						/>
						{finalImageURL !== "" ? (
							<figure className="ub_howto-yield-image-container">
								<img
									src={finalImageURL}
									onClick={() => this.setState({ currentStep: "final" })}
								/>
								{isSelected && (
									<span
										title={__("Delete image")}
										className="dashicons dashicons-dismiss"
										onClick={() =>
											setAttributes({
												finalImageID: -1,
												finalImageAlt: "",
												finalImageURL: "",
												finalImageCaption: "",
												finalImageWidth: 0,
												finalImageFloat: "none",
											})
										}
									/>
								)}
								<RichText
									tagName="figcaption"
									keepPlaceholderOnFocus
									placeholder={__("Final image caption")}
									value={finalImageCaption}
									onChange={(finalImageCaption) =>
										setAttributes({ finalImageCaption })
									}
									onFocus={() => this.setState({ currentStep: "final" })}
								/>
							</figure>
						) : (
							<MediaUpload
								onSelect={(img) => {
									this.setState({ currentStep: "final" });
									setAttributes({
										finalImageID: img.id,
										finalImageAlt: img.alt,
										finalImageURL: img.url,
										finalImageCaption: img.caption,
										finalImageWidth: Math.min(Math.max(img.width, 200), 800),
										finalImageFloat: "none",
									});
								}}
								allowedTypes={["image"]}
								value={finalImageID}
								render={({ open }) => (
									<Button
										className="button is-default is-large ub_howto-button-default"
										onClick={open}
									>
										{__("Upload Image")}
									</Button>
								)}
							/>
						)}
						<RichText
							keepPlaceholderOnFocus
							placeholder={__("Result text")}
							value={howToYield}
							onChange={(howToYield) => setAttributes({ howToYield })}
							onFocus={() => this.setState({ currentStep: "final" })}
						/>
					</div>
				</div>
				<style
					dangerouslySetInnerHTML={{
						__html: `@media (min-width:768px) {${
							useSections
								? section
										.map((s, i) =>
											s.steps
												.map((st) =>
													(({ width, float }) => ({ width, float }))(st.stepPic)
												)
												.map((img, j) =>
													img.width > 0
														? `#ub_howto-${blockID} .ub_howto-section:nth-child(${
																i + 1
														  }) .ub_howto-step:nth-child(${
																j + 1
														  }) figure { width: ${img.width}px; float: ${
																img.float
														  };}`
														: ""
												)
												.join("")
										)
										.join("")
								: section[0].steps
										.map((s) =>
											(({ width, float }) => ({ width, float }))(s.stepPic)
										)
										.map((img, i) =>
											img.width > 0
												? `#ub_howto-${blockID} .ub_howto-step:nth-child(${
														i + 1
												  }) figure { width: ${img.width}px; float: ${
														img.float
												  };}`
												: ""
										)
										.join("")
						}
						${
							finalImageWidth > 0
								? `#ub_howto-${blockID} .ub_howto-yield-image-container{
							width: ${finalImageWidth}px;
							float: ${finalImageFloat};
						}`
								: ""
						}
					}`,
					}}
				/>
			</>
		);
	}
}
