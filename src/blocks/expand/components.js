import { Component } from "react";
import { getDescendantBlocks } from "../../common";

const { __ } = wp.i18n;
const { InnerBlocks } = wp.blockEditor || wp.editor;
const { subscribe } = wp.data;

export class ExpandRoot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedBlockID: "",
			unsubscribe: null,
		};
	}
	componentDidMount() {
		const unsubscribe = subscribe(() => {
			const { selectedBlockID } = this.state;
			const selection = this.props.getSelectedBlockClientId();
			if (selection !== selectedBlockID) {
				this.setState({ selectedBlockID: selection });
			}
		});
		this.setState({ unsubscribe });
	}
	componentWillUnmount() {
		this.state.unsubscribe();
	}
	render() {
		const {
			block,
			updateBlockAttributes,
			setAttributes,
			getBlock,
			getClientIdsWithDescendants,
		} = this.props;

		const { selectedBlockID } = this.state;

		const showPreviewText = __("show more");

		const hidePreviewText = __("show less");

		const fullVersionVisibility =
			selectedBlockID === block.clientId ||
			getDescendantBlocks(block)
				.map((b) => b.clientId)
				.includes(selectedBlockID);

		if (
			block.innerBlocks[1] &&
			block.innerBlocks[1].attributes.isVisible !== fullVersionVisibility
		) {
			updateBlockAttributes(block.innerBlocks[1].clientId, {
				isVisible: fullVersionVisibility,
			});
		}

		if (
			this.props.attributes.blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					ID !== block.clientId &&
					getBlock(ID).attributes.blockID === this.props.attributes.blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}

		return (
			<div className="ub-expand">
				<InnerBlocks
					templateLock={"all"}
					template={[
						[
							"ub/expand-portion",
							{
								displayType: "partial",
								clickText: showPreviewText,
								isVisible: true,
							},
						],
						[
							"ub/expand-portion",
							{
								displayType: "full",
								clickText: hidePreviewText,
								isVisible: false,
							},
						],
					]}
				/>
			</div>
		);
	}
}
