import icon, {
	RegularCountdownIcon,
	CircularCountdownIcon,
	TickingCountdownIcon
} from './icon';

import './style.scss';
import Timer from './components';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InspectorControls, RichText } = wp.editor;
const { DateTimePicker, ButtonGroup, IconButton, PanelBody } = wp.components;

const { withState } = wp.compose;

registerBlockType('ub/countdown', {
	title: __('Countdown'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Countdown'), __('Timer'), __('Ultimate Blocks')],
	attributes: {
		endDate: {
			type: 'number',
			default: 60 * (1440 + Math.ceil(Date.now() / 60000)) // 24 hours from Date.now
		},
		style: {
			type: 'string',
			default: 'Odometer' //available types: Regular, Circular, Odometer
		},
		expiryMessage: {
			type: 'string',
			default: ''
		}
	},

	edit: withState({ editable: 'content' })(function(props) {
		const { editable, isSelected, setAttributes } = props;
		const { style, endDate, expiryMessage } = props.attributes;

		const onSetActiveEditable = newEditable => () => {
			setState({ editable: newEditable });
		};

		return [
			isSelected && (
				<InspectorControls>
					<PanelBody title={__('Timer Style')}>
						<ButtonGroup className="ub_countdown_style_selector">
							<IconButton
								isPrimary={style === 'Regular'}
								icon={RegularCountdownIcon}
								label={__('Regular')}
								onClick={() =>
									setAttributes({ style: 'Regular' })
								}
							/>
							<IconButton
								isPrimary={style === 'Circular'}
								icon={CircularCountdownIcon}
								label={__('Circular')}
								onClick={() =>
									setAttributes({ style: 'Circular' })
								}
							/>
							<IconButton
								isPrimary={style === 'Odometer'}
								icon={TickingCountdownIcon}
								label={__('Odometer')}
								onClick={() =>
									setAttributes({ style: 'Odometer' })
								}
							/>
						</ButtonGroup>
					</PanelBody>
					<PanelBody title={__('Timer expiration')}>
						<DateTimePicker
							currentDate={endDate * 1000}
							onChange={value => {
								console.log(
									Math.floor(Date.parse(value) / 1000)
								);
								setAttributes({
									endDate: Math.floor(
										Date.parse(value) / 1000
									)
								});
							}}
						/>
					</PanelBody>
				</InspectorControls>
			),
			<React.Fragment>
				<Timer timerStyle={style} deadline={endDate} />
				<div key="editable">
					<RichText
						tagName="p"
						placeholder={__(
							'Text to show after the countdown is over'
						)}
						value={expiryMessage}
						onChange={text =>
							setAttributes({ expiryMessage: text })
						}
						keepPlaceholderOnFocus={true}
						isSelected={
							isSelected && editable === 'countdown_expiry_text'
						}
						onFocus={onSetActiveEditable('countdown_expiry_text')}
					/>
				</div>
			</React.Fragment>
		];
	}),

	save() {
		return null;
	}
});
