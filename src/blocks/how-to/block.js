import icon from "./icon";
import { Component, Fragment } from "react";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { RichText, MediaUpload, InspectorControls } =
	wp.blockEditor || wp.editor;

const {
	Button,
	SelectControl,
	ToggleControl,
	Icon,
	IconButton,
	PanelBody
} = wp.components;

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
	//add option for video, tool array, and supplies array
	tools: {
		type: "array",
		default: [] //format: {name, imageid, imagealt, imageurl}
	},
	addToolImages: {
		type: "boolean",
		default: false
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
	prepTime: {
		type: "number",
		default: 0
	},
	prepTimeUnit: {
		type: "string",
		default: "minutes"
	},
	performTime: {
		type: "number",
		default: 0
	},
	performTimeUnit: {
		type: "string",
		default: "minutes"
	},
	totalTime: {
		type: "number",
		default: 0
	},
	totalTimeUnit: {
		type: "string",
		default: "minutes"
	},
	autoConvertTimeUnit: {
		type: "boolean",
		default: false
	},
	cost: {
		type: "number",
		default: 0
	},
	costCurrency: {
		type: "string",
		default: ""
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
	video: {
		type: "string", //videoobject
		default: "" //url
	},
	useSections: {
		type: "boolean",
		default: false
	},
	useDetailedTime: {
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

class HowToStep extends Component {
	constructor(props) {
		super(props);
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
			stepPic
		} = this.props;

		return (
			<li>
				<div className="ub_howto_step">
					{/* ADD NAME */}
					<div>
						<RichText
							tagName="h4"
							keepPlaceholderOnFocus
							placeholder={__("Title goes here")}
							value={title}
							onChange={newVal => editStep({ title: newVal })}
						/>
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
									<Button
										className="components-button button button-medium"
										onClick={open}
									>
										{__("Upload Image")}
									</Button>
								)}
							/>
						)}
						<RichText
							keepPlaceholderOnFocus
							placeholder={__("Direction goes here")}
							value={direction}
							onChange={newVal => editStep({ direction: newVal })}
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
			deleteSection
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
									title: ""
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
	edit(props) {
		const {
			attributes: {
				title,
				introduction,
				section,
				supplies,
				tools,
				howToYield,
				cost,
				costCurrency,
				showUnitFirst,
				prepTime,
				prepTimeUnit,
				performTime,
				performTimeUnit,
				totalTime,
				totalTimeUnit,
				autoConvertTimeUnit,
				useSections,
				useDetailedTime,
				includeToolsList,
				addToolImages,
				includeSuppliesList,
				addSupplyImages,
				finalImageID,
				finalImageAlt,
				finalImageURL
			},
			setAttributes
		} = props;

		const units = [
			"seconds",
			"minutes",
			"hours",
			"days",
			"weeks",
			"months",
			"years"
		];

		const calcTotalTime = (
			prepTime,
			performTime,
			prepTimeUnit = props.attributes.prepTimeUnit,
			performTimeUnit = props.attributes.performTimeUnit
		) => {
			let totalTime = 0;
			let totalTimeUnit = "";
			let unitMultiplier = [1, 60, 60, 24, 7, 365, 12];
			if (prepTimeUnit === performTimeUnit) {
				totalTime = prepTime + performTime;
				totalTimeUnit = performTimeUnit;
				/*setAttributes({
					totalTime: prepTime + performTime,
					totalTimeUnit: performTimeUnit
				});*/
			} else {
				let smallerUnitIndex = Math.min(
					units.indexOf(prepTimeUnit),
					units.indexOf(performTimeUnit)
				);

				let largerUnitIndex = Math.max(
					units.indexOf(prepTimeUnit),
					units.indexOf(performTimeUnit)
				);

				const conversionFactor =
					unitMultiplier
						.slice(smallerUnitIndex + 1, largerUnitIndex + 1)
						.reduce((prev, curr) => prev * curr) /
					(smallerUnitIndex <= 4 && largerUnitIndex >= 5 ? 84 : 1);

				totalTime =
					Math.round(
						(units.indexOf(prepTimeUnit) > units.indexOf(performTimeUnit)
							? prepTime + performTime / conversionFactor
							: prepTime / conversionFactor + performTime) * 1000
					) / 1000;

				totalTimeUnit = units[largerUnitIndex];
			}

			if (autoConvertTimeUnit) {
				let newTotalTime = totalTime;

				if (totalTime >= 1) {
					while (newTotalTime >= 1 && totalTimeUnit !== "years") {
						newTotalTime /=
							unitMultiplier[units.indexOf(totalTimeUnit) + 1] /
							(totalTimeUnit === "weeks" ? 84 : 1);
						if (newTotalTime >= 1) {
							totalTimeUnit = units[units.indexOf(totalTimeUnit) + 1];
							totalTime = newTotalTime;
						}
					}
				} else {
					while (newTotalTime < 1 && totalTimeUnit !== "seconds") {
						newTotalTime *=
							unitMultiplier[units.indexOf(totalTimeUnit)] /
							(totalTimeUnit === "weeks" ? 84 : 1);
						totalTimeUnit = units[units.indexOf(totalTimeUnit) - 1];
						totalTime = newTotalTime;
					}
				}
			}
			setAttributes({ totalTimeUnit, totalTime });
		};

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={__("How To Settings")}>
						<ToggleControl
							label={__("Use detailed time")}
							checked={useDetailedTime}
							onChange={useDetailedTime => {
								setAttributes({ useDetailedTime });
								if (useDetailedTime) {
									calcTotalTime(prepTime, performTime);
								} else
									setAttributes({
										prepTime: 0,
										performTime: 0,
										autoConvertTimeUnit: false
									});
							}}
						/>
						{useDetailedTime && (
							<ToggleControl
								label={__(
									"Convert total time to minimize use of leading/trailing zeroes"
								)}
								checked={autoConvertTimeUnit}
								onChange={autoConvertTimeUnit =>
									setAttributes({ autoConvertTimeUnit })
								}
							/>
						)}
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
					{includeSuppliesList && (
						<Fragment>
							<h2>{__("Required supplies")}</h2>
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
							<h2>{__("Required tools")}</h2>
							<ul>
								{tools.map((tool, i) => (
									<li>
										<RichText
											keepPlaceholderOnFocus
											value={tool.name}
											placeholder={__("Enter tool name")}
											onChange={newTool =>
												setAttributes({
													supplies: [
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
					<h2>{__("Duration")}</h2>
					{useDetailedTime && [
						<div className="ub_howto_time_input">
							<p>{__("Preparation time")}</p>
							<RichText
								className="ub_howto_time_value"
								keepPlaceholderOnFocus
								placeholder={__("0")}
								value={prepTime.toString()}
								onChange={prepTime => {
									if (!isNaN(Number(prepTime))) {
										setAttributes({ prepTime: Number(prepTime) });
										calcTotalTime(Number(prepTime), performTime);
									}
								}}
							/>
							<SelectControl
								value={prepTimeUnit}
								options={units.map(t => ({ label: t, value: t }))}
								onChange={prepTimeUnit => {
									setAttributes({ prepTimeUnit });
									calcTotalTime(
										prepTime,
										performTime,
										prepTimeUnit,
										performTimeUnit
									);
								}}
							/>
						</div>,
						<div className="ub_howto_time_input">
							<p>{__("Performance time")}</p>
							<RichText
								className="ub_howto_time_value"
								keepPlaceholderOnFocus
								value={performTime.toString()}
								onChange={performTime => {
									if (!isNaN(Number(performTime))) {
										setAttributes({ performTime: Number(performTime) });
										calcTotalTime(prepTime, Number(performTime));
									}
								}}
							/>
							<SelectControl
								value={performTimeUnit}
								options={units.map(u => ({ label: __(u), value: u }))}
								onChange={performTimeUnit => {
									setAttributes({ performTimeUnit });
									calcTotalTime(
										prepTime,
										performTime,
										prepTimeUnit,
										performTimeUnit
									);
								}}
							/>
						</div>
					]}
					<div className="ub_howto_time_input">
						<p>{__("Total time")}</p>
						{useDetailedTime ? (
							<span className="ub_howto_time_value">{String(totalTime)}</span>
						) : (
							<RichText
								className="ub_howto_time_value"
								keepPlaceholderOnFocus
								placeholder={__("0")}
								value={String(totalTime)}
								onChange={totalTime => {
									if (!isNaN(Number(totalTime))) {
										setAttributes({ totalTime: Number(totalTime) });
									}
								}}
							/>
						)}
						<SelectControl
							value={totalTimeUnit}
							options={units.map(t => ({ label: __(t), value: t }))}
							onChange={totalTimeUnit => {
								if (!useDetailedTime) setAttributes({ totalTimeUnit });
							}} //if performtime and preptime are enabled, peg to larger unit, else allow user to choose
						/>
					</div>
					<div className="ub_howto_cost_container">
						<p>{__("Cost: ")}</p>
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
										{...step}
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
														title: ""
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
													title: ""
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
					<h2>{__("Result")}</h2>
					<RichText
						keepPlaceholderOnFocus
						placeholder={__("Result")}
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
	},
	save: _ => null
});
