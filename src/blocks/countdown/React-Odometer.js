/* React-Odometer.js, based on react-odometerjs

MIT License

Copyright (c) 2017 Vladislav Bezenson

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to use, 
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Odometer from './odometer';

export default class ReactOdometer extends PureComponent {
	// Information about options can be found here:
	// http://github.hubspot.com/odometer/
	static propTypes = {
		animation: PropTypes.bool,
		auto: PropTypes.bool,
		duration: PropTypes.number,
		format: PropTypes.string,
		selector: PropTypes.string,
		theme: PropTypes.string,
		value: PropTypes.number.isRequired
	};

	constructor(props) {
		super(props);

		this.node = React.createRef();
	}

	componentDidMount() {
		const { value, ...options } = this.props;
		this.odometer = new Odometer({
			el: this.node.current,
			value,
			...options
		});
	}

	componentDidUpdate() {
		const { value } = this.props;
		this.odometer.update(value);
	}

	render() {
		return React.createElement('div', {
			ref: this.node
		});
	}
}
