import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { PanelBody, Tip } from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";
import { CodeEditor } from "../components";

const panelIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M7.82524 11.3905L12.2857 9.57413H7.66538L7.44568 7.83588H16.5542L16.3746 9.57407L12.0296 11.3905H16.2215L15.742 16.781L12.0466 17.8358L8.33104 16.7616L8.09132 14.0467H9.929L10.0489 15.453L12.0266 15.9413L14.084 15.3749L14.2239 13.1092L7.97147 13.0898L7.97125 13.0871L7.96501 13.0897L7.82524 11.3905Z"
			fill="#E11B4C"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M15.7647 20.1262C14.8304 20.6599 13.8963 21.1935 12.9618 21.7264C12.332 22.0856 11.6892 22.0934 11.0604 21.7362C9.48667 20.8416 7.91557 19.9431 6.3442 19.0444L6.34153 19.0429C5.54674 18.5883 4.75187 18.1338 3.95655 17.6796C3.32373 17.3184 3.00534 16.7727 3.00336 16.0562C2.9984 13.3561 2.99939 10.656 3.00336 7.95585C3.00435 7.22855 3.32869 6.67989 3.96945 6.31477C4.86931 5.8013 5.76873 5.28725 6.66811 4.77323C8.12899 3.9383 9.59018 3.1032 11.0524 2.27097C11.6644 1.92254 12.3002 1.90389 12.9122 2.25134C15.3255 3.61858 17.7347 4.99268 20.1361 6.37857C20.7223 6.71719 20.996 7.26291 20.998 7.93524C20.9993 8.84022 20.9989 9.74564 20.9984 10.6509L20.998 12.0085C20.998 12.3419 20.9988 12.6752 20.9986 13.0085L20.9985 13.21C20.9978 14.144 20.9972 15.0778 21 16.012C21.002 16.7717 20.6707 17.3282 20.0051 17.7071C18.5909 18.5117 17.1773 19.3192 15.7647 20.1262ZM12.4664 20.8577C12.1349 21.0468 11.8683 21.045 11.5544 20.8667C9.98152 19.9726 8.41227 19.0751 6.84143 18.1768L6.83745 18.1745C6.04307 17.7202 5.24828 17.2657 4.45242 16.8112C4.12697 16.6255 4.00443 16.4078 4.00336 16.0539C3.9984 13.3553 3.99939 10.6566 4.00336 7.95732C4.00385 7.59712 4.12824 7.37524 4.46454 7.18361C5.36569 6.6694 6.2661 6.15479 7.1656 5.6407L7.16734 5.63971C8.62706 4.80544 10.0858 3.97176 11.5471 3.14007C11.8726 2.95474 12.1325 2.95857 12.4185 3.12096C14.83 4.48722 17.2375 5.86034 19.6359 7.24448C19.8752 7.38273 19.9969 7.57517 19.998 7.93819C19.9993 8.84143 19.9989 9.7443 19.9984 10.6482L19.9984 10.6598C19.9982 11.109 19.998 11.5586 19.998 12.0085V13.0085L19.9985 13.2072C19.9978 14.1418 19.9972 15.0787 20 16.0147C20.0006 16.244 19.9524 16.3911 19.8912 16.4949C19.8294 16.5999 19.72 16.7187 19.5106 16.8379C18.0964 17.6425 16.6822 18.4504 15.2691 19.2576L15.2674 19.2586C14.3332 19.7922 13.3994 20.3257 12.4664 20.8577Z"
			fill="#E11B4C"
		/>
	</svg>
);
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
			<PanelBody title={__("Custom CSS")} initialOpen={false} icon={panelIcon}>
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
							"ultimate-blocks",
						)}
					</Tip>
				</div>
			</PanelBody>
		</InspectorControls>
	);
}
export default Inspector;
