import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { PanelBody, Tip } from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";
import { CodeEditor } from "../components";

function Inspector(props) {
	const { attributes, setAttributes } = props;
	const { ubCustomCSS, className } = attributes;
	const handleCSS = (value = ubCustomCSS) => {
		setAttributes({ ubCustomCSS: value });
	};

	useEffect(handleCSS, []);
	useEffect(handleCSS, [ubCustomCSS, className]);
	return (
		<InspectorControls group="styles">
			<PanelBody title={__("Custom CSS")} initialOpen={false}>
				<CodeEditor
					mode="css"
					onChange={(value) => handleCSS(value)}
					value={ubCustomCSS}
				/>
				<div style={{ marginTop: 20 }}>
					<Tip>
						<span>{__(`Use `, "ultimate-blocks")}</span>
						<pre
							style={{
								margin: "0",
								backgroundColor: "#f7f7f7",
								padding: "5px",
								display: "inline-block",
							}}
						>
							{__("Selector", "ultimate-blocks")}
						</pre>
						<span>
							{__(" to insert the current block selection.", "ultimate-blocks")}
						</span>
					</Tip>
					<p style={{ marginTop: 20 }}>Example: </p>
					<pre
						style={{
							backgroundColor: "#f7f7f7",
							padding: "10px",
							whiteSpace: "pre-line",
						}}
						dangerouslySetInnerHTML={{
							__html: `selector {
							background: #000;
							}

							selector img {
							border-radius: 100%;
						}`,
						}}
					></pre>
					<Tip>
						{__(
							`You can also use other CSS syntax here, such as media queries.`,
							"ultimate-blocks"
						)}
					</Tip>
				</div>
			</PanelBody>
		</InspectorControls>
	);
}
export default Inspector;
