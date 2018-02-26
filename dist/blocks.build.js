/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***********************!*\
  !*** ./src/blocks.js ***!
  \***********************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__blocks_notification_box_block_js__ = __webpack_require__(/*! ./blocks/notification-box/block.js */ 1);\n/**\n * Gutenberg Blocks\n *\n * All blocks related JavaScript files should be imported here.\n * You can create a new block folder in this dir and include code\n * for that block here as well.\n *\n * All blocks should be included here since this is the file that\n * Webpack is compiling as the input file.\n */\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9ibG9ja3MuanM/N2I1YiJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEd1dGVuYmVyZyBCbG9ja3NcbiAqXG4gKiBBbGwgYmxvY2tzIHJlbGF0ZWQgSmF2YVNjcmlwdCBmaWxlcyBzaG91bGQgYmUgaW1wb3J0ZWQgaGVyZS5cbiAqIFlvdSBjYW4gY3JlYXRlIGEgbmV3IGJsb2NrIGZvbGRlciBpbiB0aGlzIGRpciBhbmQgaW5jbHVkZSBjb2RlXG4gKiBmb3IgdGhhdCBibG9jayBoZXJlIGFzIHdlbGwuXG4gKlxuICogQWxsIGJsb2NrcyBzaG91bGQgYmUgaW5jbHVkZWQgaGVyZSBzaW5jZSB0aGlzIGlzIHRoZSBmaWxlIHRoYXRcbiAqIFdlYnBhY2sgaXMgY29tcGlsaW5nIGFzIHRoZSBpbnB1dCBmaWxlLlxuICovXG5cbmltcG9ydCAnLi9ibG9ja3Mvbm90aWZpY2F0aW9uLWJveC9ibG9jay5qcyc7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYmxvY2tzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/*!**********************************************!*\
  !*** ./src/blocks/notification-box/block.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__icons_info__ = __webpack_require__(/*! ./icons/info */ 4);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__icons_success__ = __webpack_require__(/*! ./icons/success */ 5);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icons_warning__ = __webpack_require__(/*! ./icons/warning */ 6);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style_scss__ = __webpack_require__(/*! ./style.scss */ 2);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__style_scss__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__editor_scss__ = __webpack_require__(/*! ./editor.scss */ 3);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__editor_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__editor_scss__);\n/**\n * BLOCK: ultimate-blocks\n *\n * Registering a basic block with Gutenberg.\n * Simple block, renders and saves the same content without any interactivity.\n */\n\n//Import Icons\n\n\n\n\n//  Import CSS.\n\n\n\nvar __ = wp.i18n.__; // Import __() from wp.i18n\n\nvar _wp$blocks = wp.blocks,\n    registerBlockType = _wp$blocks.registerBlockType,\n    RichText = _wp$blocks.RichText,\n    AlignmentToolbar = _wp$blocks.AlignmentToolbar,\n    BlockControls = _wp$blocks.BlockControls,\n    BlockAlignmentToolbar = _wp$blocks.BlockAlignmentToolbar;\nvar _wp$components = wp.components,\n    Toolbar = _wp$components.Toolbar,\n    Button = _wp$components.Button,\n    Tooltip = _wp$components.Tooltip;\n\n/**\n * Register: aa Gutenberg Block.\n *\n * Registers a new block provided a unique name and an object defining its\n * behavior. Once registered, the block is made editor as an option to any\n * editor interface where blocks are implemented.\n *\n * @link https://wordpress.org/gutenberg/handbook/block-api/\n * @param  {string}   name     Block name.\n * @param  {Object}   settings Block settings.\n * @return {?WPBlock}          The block, if it has been successfully\n *                             registered; otherwise `undefined`.\n */\n\nregisterBlockType('ub/notification-box', {\n\t// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.\n\ttitle: __('Notification Box'), // Block title.\n\ticon: 'info', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.\n\tcategory: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.\n\tkeywords: [__('notification'), __('warning'), __('info')],\n\tattributes: {\n\t\tub_notify_info: {\n\t\t\ttype: 'array',\n\t\t\tsource: 'children',\n\t\t\tselector: '.ub_notify_info',\n\t\t\tdefault: 'Replace this text with your own text.'\n\t\t},\n\t\tub_selected_notify: {\n\t\t\ttype: 'string',\n\t\t\tdefault: 'ub_notify_info'\n\t\t}\n\t},\n\n\t/**\n  * The edit function describes the structure of your block in the context of the editor.\n  * This represents what the editor will render when the block is used.\n  *\n  * The \"edit\" property must be a valid function.\n  *\n  * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/\n  */\n\tedit: function edit(props) {\n\n\t\tvar onChangeNotifyInfo = function onChangeNotifyInfo(value) {\n\t\t\tprops.setAttributes({ ub_notify_info: value });\n\t\t};\n\n\t\treturn wp.element.createElement(\n\t\t\t'div',\n\t\t\t{ className: props.className },\n\t\t\twp.element.createElement(RichText, {\n\t\t\t\ttagName: 'div',\n\t\t\t\tclassName: 'ub_notify_info',\n\t\t\t\tonChange: onChangeNotifyInfo,\n\t\t\t\tvalue: props.attributes.ub_notify_info,\n\t\t\t\tfocus: props.focus,\n\t\t\t\tkeepPlaceholderOnFocus: true\n\t\t\t})\n\t\t);\n\t},\n\n\t/**\n  * The save function defines the way in which the different attributes should be combined\n  * into the final markup, which is then serialized by Gutenberg into post_content.\n  *\n  * The \"save\" property must be specified and must be a valid function.\n  *\n  * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/\n  */\n\tsave: function save(props) {\n\t\treturn wp.element.createElement(\n\t\t\t'div',\n\t\t\t{ className: props.className },\n\t\t\twp.element.createElement(\n\t\t\t\t'div',\n\t\t\t\t{ 'class': 'ub_notify_info' },\n\t\t\t\tprops.attributes.ub_notify_info\n\t\t\t)\n\t\t);\n\t}\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9ibG9ja3Mvbm90aWZpY2F0aW9uLWJveC9ibG9jay5qcz80ZDJhIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQkxPQ0s6IHVsdGltYXRlLWJsb2Nrc1xuICpcbiAqIFJlZ2lzdGVyaW5nIGEgYmFzaWMgYmxvY2sgd2l0aCBHdXRlbmJlcmcuXG4gKiBTaW1wbGUgYmxvY2ssIHJlbmRlcnMgYW5kIHNhdmVzIHRoZSBzYW1lIGNvbnRlbnQgd2l0aG91dCBhbnkgaW50ZXJhY3Rpdml0eS5cbiAqL1xuXG4vL0ltcG9ydCBJY29uc1xuaW1wb3J0IGluZm8gZnJvbSAnLi9pY29ucy9pbmZvJztcbmltcG9ydCBzdWNjZXNzIGZyb20gJy4vaWNvbnMvc3VjY2Vzcyc7XG5pbXBvcnQgd2FybmluZyBmcm9tICcuL2ljb25zL3dhcm5pbmcnO1xuXG4vLyAgSW1wb3J0IENTUy5cbmltcG9ydCAnLi9zdHlsZS5zY3NzJztcbmltcG9ydCAnLi9lZGl0b3Iuc2Nzcyc7XG5cbnZhciBfXyA9IHdwLmkxOG4uX187IC8vIEltcG9ydCBfXygpIGZyb20gd3AuaTE4blxuXG52YXIgX3dwJGJsb2NrcyA9IHdwLmJsb2NrcyxcbiAgICByZWdpc3RlckJsb2NrVHlwZSA9IF93cCRibG9ja3MucmVnaXN0ZXJCbG9ja1R5cGUsXG4gICAgUmljaFRleHQgPSBfd3AkYmxvY2tzLlJpY2hUZXh0LFxuICAgIEFsaWdubWVudFRvb2xiYXIgPSBfd3AkYmxvY2tzLkFsaWdubWVudFRvb2xiYXIsXG4gICAgQmxvY2tDb250cm9scyA9IF93cCRibG9ja3MuQmxvY2tDb250cm9scyxcbiAgICBCbG9ja0FsaWdubWVudFRvb2xiYXIgPSBfd3AkYmxvY2tzLkJsb2NrQWxpZ25tZW50VG9vbGJhcjtcbnZhciBfd3AkY29tcG9uZW50cyA9IHdwLmNvbXBvbmVudHMsXG4gICAgVG9vbGJhciA9IF93cCRjb21wb25lbnRzLlRvb2xiYXIsXG4gICAgQnV0dG9uID0gX3dwJGNvbXBvbmVudHMuQnV0dG9uLFxuICAgIFRvb2x0aXAgPSBfd3AkY29tcG9uZW50cy5Ub29sdGlwO1xuXG4vKipcbiAqIFJlZ2lzdGVyOiBhYSBHdXRlbmJlcmcgQmxvY2suXG4gKlxuICogUmVnaXN0ZXJzIGEgbmV3IGJsb2NrIHByb3ZpZGVkIGEgdW5pcXVlIG5hbWUgYW5kIGFuIG9iamVjdCBkZWZpbmluZyBpdHNcbiAqIGJlaGF2aW9yLiBPbmNlIHJlZ2lzdGVyZWQsIHRoZSBibG9jayBpcyBtYWRlIGVkaXRvciBhcyBhbiBvcHRpb24gdG8gYW55XG4gKiBlZGl0b3IgaW50ZXJmYWNlIHdoZXJlIGJsb2NrcyBhcmUgaW1wbGVtZW50ZWQuXG4gKlxuICogQGxpbmsgaHR0cHM6Ly93b3JkcHJlc3Mub3JnL2d1dGVuYmVyZy9oYW5kYm9vay9ibG9jay1hcGkvXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgbmFtZSAgICAgQmxvY2sgbmFtZS5cbiAqIEBwYXJhbSAge09iamVjdH0gICBzZXR0aW5ncyBCbG9jayBzZXR0aW5ncy5cbiAqIEByZXR1cm4gez9XUEJsb2NrfSAgICAgICAgICBUaGUgYmxvY2ssIGlmIGl0IGhhcyBiZWVuIHN1Y2Nlc3NmdWxseVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyZWQ7IG90aGVyd2lzZSBgdW5kZWZpbmVkYC5cbiAqL1xuXG5yZWdpc3RlckJsb2NrVHlwZSgndWIvbm90aWZpY2F0aW9uLWJveCcsIHtcblx0Ly8gQmxvY2sgbmFtZS4gQmxvY2sgbmFtZXMgbXVzdCBiZSBzdHJpbmcgdGhhdCBjb250YWlucyBhIG5hbWVzcGFjZSBwcmVmaXguIEV4YW1wbGU6IG15LXBsdWdpbi9teS1jdXN0b20tYmxvY2suXG5cdHRpdGxlOiBfXygnTm90aWZpY2F0aW9uIEJveCcpLCAvLyBCbG9jayB0aXRsZS5cblx0aWNvbjogJ2luZm8nLCAvLyBCbG9jayBpY29uIGZyb20gRGFzaGljb25zIOKGkiBodHRwczovL2RldmVsb3Blci53b3JkcHJlc3Mub3JnL3Jlc291cmNlL2Rhc2hpY29ucy8uXG5cdGNhdGVnb3J5OiAnY29tbW9uJywgLy8gQmxvY2sgY2F0ZWdvcnkg4oCUIEdyb3VwIGJsb2NrcyB0b2dldGhlciBiYXNlZCBvbiBjb21tb24gdHJhaXRzIEUuZy4gY29tbW9uLCBmb3JtYXR0aW5nLCBsYXlvdXQgd2lkZ2V0cywgZW1iZWQuXG5cdGtleXdvcmRzOiBbX18oJ25vdGlmaWNhdGlvbicpLCBfXygnd2FybmluZycpLCBfXygnaW5mbycpXSxcblx0YXR0cmlidXRlczoge1xuXHRcdHViX25vdGlmeV9pbmZvOiB7XG5cdFx0XHR0eXBlOiAnYXJyYXknLFxuXHRcdFx0c291cmNlOiAnY2hpbGRyZW4nLFxuXHRcdFx0c2VsZWN0b3I6ICcudWJfbm90aWZ5X2luZm8nLFxuXHRcdFx0ZGVmYXVsdDogJ1JlcGxhY2UgdGhpcyB0ZXh0IHdpdGggeW91ciBvd24gdGV4dC4nXG5cdFx0fSxcblx0XHR1Yl9zZWxlY3RlZF9ub3RpZnk6IHtcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogJ3ViX25vdGlmeV9pbmZvJ1xuXHRcdH1cblx0fSxcblxuXHQvKipcbiAgKiBUaGUgZWRpdCBmdW5jdGlvbiBkZXNjcmliZXMgdGhlIHN0cnVjdHVyZSBvZiB5b3VyIGJsb2NrIGluIHRoZSBjb250ZXh0IG9mIHRoZSBlZGl0b3IuXG4gICogVGhpcyByZXByZXNlbnRzIHdoYXQgdGhlIGVkaXRvciB3aWxsIHJlbmRlciB3aGVuIHRoZSBibG9jayBpcyB1c2VkLlxuICAqXG4gICogVGhlIFwiZWRpdFwiIHByb3BlcnR5IG11c3QgYmUgYSB2YWxpZCBmdW5jdGlvbi5cbiAgKlxuICAqIEBsaW5rIGh0dHBzOi8vd29yZHByZXNzLm9yZy9ndXRlbmJlcmcvaGFuZGJvb2svYmxvY2stYXBpL2Jsb2NrLWVkaXQtc2F2ZS9cbiAgKi9cblx0ZWRpdDogZnVuY3Rpb24gZWRpdChwcm9wcykge1xuXG5cdFx0dmFyIG9uQ2hhbmdlTm90aWZ5SW5mbyA9IGZ1bmN0aW9uIG9uQ2hhbmdlTm90aWZ5SW5mbyh2YWx1ZSkge1xuXHRcdFx0cHJvcHMuc2V0QXR0cmlidXRlcyh7IHViX25vdGlmeV9pbmZvOiB2YWx1ZSB9KTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHdwLmVsZW1lbnQuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6IHByb3BzLmNsYXNzTmFtZSB9LFxuXHRcdFx0d3AuZWxlbWVudC5jcmVhdGVFbGVtZW50KFJpY2hUZXh0LCB7XG5cdFx0XHRcdHRhZ05hbWU6ICdkaXYnLFxuXHRcdFx0XHRjbGFzc05hbWU6ICd1Yl9ub3RpZnlfaW5mbycsXG5cdFx0XHRcdG9uQ2hhbmdlOiBvbkNoYW5nZU5vdGlmeUluZm8sXG5cdFx0XHRcdHZhbHVlOiBwcm9wcy5hdHRyaWJ1dGVzLnViX25vdGlmeV9pbmZvLFxuXHRcdFx0XHRmb2N1czogcHJvcHMuZm9jdXMsXG5cdFx0XHRcdGtlZXBQbGFjZWhvbGRlck9uRm9jdXM6IHRydWVcblx0XHRcdH0pXG5cdFx0KTtcblx0fSxcblxuXHQvKipcbiAgKiBUaGUgc2F2ZSBmdW5jdGlvbiBkZWZpbmVzIHRoZSB3YXkgaW4gd2hpY2ggdGhlIGRpZmZlcmVudCBhdHRyaWJ1dGVzIHNob3VsZCBiZSBjb21iaW5lZFxuICAqIGludG8gdGhlIGZpbmFsIG1hcmt1cCwgd2hpY2ggaXMgdGhlbiBzZXJpYWxpemVkIGJ5IEd1dGVuYmVyZyBpbnRvIHBvc3RfY29udGVudC5cbiAgKlxuICAqIFRoZSBcInNhdmVcIiBwcm9wZXJ0eSBtdXN0IGJlIHNwZWNpZmllZCBhbmQgbXVzdCBiZSBhIHZhbGlkIGZ1bmN0aW9uLlxuICAqXG4gICogQGxpbmsgaHR0cHM6Ly93b3JkcHJlc3Mub3JnL2d1dGVuYmVyZy9oYW5kYm9vay9ibG9jay1hcGkvYmxvY2stZWRpdC1zYXZlL1xuICAqL1xuXHRzYXZlOiBmdW5jdGlvbiBzYXZlKHByb3BzKSB7XG5cdFx0cmV0dXJuIHdwLmVsZW1lbnQuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6IHByb3BzLmNsYXNzTmFtZSB9LFxuXHRcdFx0d3AuZWxlbWVudC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyAnY2xhc3MnOiAndWJfbm90aWZ5X2luZm8nIH0sXG5cdFx0XHRcdHByb3BzLmF0dHJpYnV0ZXMudWJfbm90aWZ5X2luZm9cblx0XHRcdClcblx0XHQpO1xuXHR9XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9ibG9ja3Mvbm90aWZpY2F0aW9uLWJveC9ibG9jay5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///1\n");

/***/ }),
/* 2 */
/*!************************************************!*\
  !*** ./src/blocks/notification-box/style.scss ***!
  \************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9ibG9ja3Mvbm90aWZpY2F0aW9uLWJveC9zdHlsZS5zY3NzP2NlYTkiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9ibG9ja3Mvbm90aWZpY2F0aW9uLWJveC9zdHlsZS5zY3NzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///2\n");

/***/ }),
/* 3 */
/*!*************************************************!*\
  !*** ./src/blocks/notification-box/editor.scss ***!
  \*************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9ibG9ja3Mvbm90aWZpY2F0aW9uLWJveC9lZGl0b3Iuc2Nzcz9iYTFiIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYmxvY2tzL25vdGlmaWNhdGlvbi1ib3gvZWRpdG9yLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///3\n");

/***/ }),
/* 4 */
/*!***************************************************!*\
  !*** ./src/blocks/notification-box/icons/info.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("var info = wp.element.createElement(\n    \"svg\",\n    { xmlns: \"http://www.w3.org/2000/svg\", id: \"Capa_1\", viewBox: \"0 0 437.6 437.6\",\n        width: \"20px\", height: \"20px\" },\n    wp.element.createElement(\n        \"g\",\n        { fill: \"#00529b\" },\n        wp.element.createElement(\"path\", { d: \"M194,142.8c0.8,1.6,1.6,3.2,2.4,4.4c0.8,1.2,2,2.4,2.8,3.6c1.2,1.2,2.4,2.4,4,3.6c1.2,0.8,2.8,2,4.8,2.4 c1.6,0.8,3.2,1.2,5.2,1.6c2,0.4,3.6,0.4,5.2,0.4c1.6,0,3.6,0,5.2-0.4c1.6-0.4,3.2-0.8,4.4-1.6h0.4c1.6-0.8,3.2-1.6,4.8-2.8 c1.2-0.8,2.4-2,3.6-3.2l0.4-0.4c1.2-1.2,2-2.4,2.8-3.6s1.6-2.4,2-4c0-0.4,0-0.4,0.4-0.8c0.8-1.6,1.2-3.6,1.6-5.2 c0.4-1.6,0.4-3.6,0.4-5.2s0-3.6-0.4-5.2c-0.4-1.6-0.8-3.2-1.6-5.2c-1.2-2.8-2.8-5.2-4.8-7.2c-0.4-0.4-0.4-0.4-0.8-0.8 c-1.2-1.2-2.4-2-4-3.2c-1.6-0.8-2.8-1.6-4.4-2.4c-1.6-0.8-3.2-1.2-4.8-1.6c-2-0.4-3.6-0.4-5.2-0.4c-1.6,0-3.6,0-5.2,0.4 c-1.6,0.4-3.2,0.8-4.8,1.6H208c-1.6,0.8-3.2,1.6-4.4,2.4c-1.6,1.2-2.8,2-4,3.2c-1.2,1.2-2.4,2.4-3.2,3.6 c-0.8,1.2-1.6,2.8-2.4,4.4c-0.8,1.6-1.2,3.2-1.6,4.8c-0.4,2-0.4,3.6-0.4,5.2c0,1.6,0,3.6,0.4,5.2 C192.8,139.6,193.6,141.2,194,142.8z\"\n        }),\n        wp.element.createElement(\"path\", { d: \"M249.6,289.2h-9.2v-98c0-5.6-4.4-10.4-10.4-10.4h-42c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h8.4v66.4 H188c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h61.6c5.6,0,10.4-4.4,10.4-10.4V300 C260,294,255.2,289.2,249.6,289.2z\"\n        }),\n        wp.element.createElement(\"path\", { d: \"M218.8,0C98,0,0,98,0,218.8s98,218.8,218.8,218.8s218.8-98,218.8-218.8S339.6,0,218.8,0z M218.8,408.8 c-104.8,0-190-85.2-190-190s85.2-190,190-190s190,85.2,190,190S323.6,408.8,218.8,408.8z\"\n        })\n    )\n);\n\n/* unused harmony default export */ var _unused_webpack_default_export = (info);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9ibG9ja3Mvbm90aWZpY2F0aW9uLWJveC9pY29ucy9pbmZvLmpzPzc4MzUiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGluZm8gPSB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgXCJzdmdcIixcbiAgICB7IHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIGlkOiBcIkNhcGFfMVwiLCB2aWV3Qm94OiBcIjAgMCA0MzcuNiA0MzcuNlwiLFxuICAgICAgICB3aWR0aDogXCIyMHB4XCIsIGhlaWdodDogXCIyMHB4XCIgfSxcbiAgICB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFwiZ1wiLFxuICAgICAgICB7IGZpbGw6IFwiIzAwNTI5YlwiIH0sXG4gICAgICAgIHdwLmVsZW1lbnQuY3JlYXRlRWxlbWVudChcInBhdGhcIiwgeyBkOiBcIk0xOTQsMTQyLjhjMC44LDEuNiwxLjYsMy4yLDIuNCw0LjRjMC44LDEuMiwyLDIuNCwyLjgsMy42YzEuMiwxLjIsMi40LDIuNCw0LDMuNmMxLjIsMC44LDIuOCwyLDQuOCwyLjQgYzEuNiwwLjgsMy4yLDEuMiw1LjIsMS42YzIsMC40LDMuNiwwLjQsNS4yLDAuNGMxLjYsMCwzLjYsMCw1LjItMC40YzEuNi0wLjQsMy4yLTAuOCw0LjQtMS42aDAuNGMxLjYtMC44LDMuMi0xLjYsNC44LTIuOCBjMS4yLTAuOCwyLjQtMiwzLjYtMy4ybDAuNC0wLjRjMS4yLTEuMiwyLTIuNCwyLjgtMy42czEuNi0yLjQsMi00YzAtMC40LDAtMC40LDAuNC0wLjhjMC44LTEuNiwxLjItMy42LDEuNi01LjIgYzAuNC0xLjYsMC40LTMuNiwwLjQtNS4yczAtMy42LTAuNC01LjJjLTAuNC0xLjYtMC44LTMuMi0xLjYtNS4yYy0xLjItMi44LTIuOC01LjItNC44LTcuMmMtMC40LTAuNC0wLjQtMC40LTAuOC0wLjggYy0xLjItMS4yLTIuNC0yLTQtMy4yYy0xLjYtMC44LTIuOC0xLjYtNC40LTIuNGMtMS42LTAuOC0zLjItMS4yLTQuOC0xLjZjLTItMC40LTMuNi0wLjQtNS4yLTAuNGMtMS42LDAtMy42LDAtNS4yLDAuNCBjLTEuNiwwLjQtMy4yLDAuOC00LjgsMS42SDIwOGMtMS42LDAuOC0zLjIsMS42LTQuNCwyLjRjLTEuNiwxLjItMi44LDItNCwzLjJjLTEuMiwxLjItMi40LDIuNC0zLjIsMy42IGMtMC44LDEuMi0xLjYsMi44LTIuNCw0LjRjLTAuOCwxLjYtMS4yLDMuMi0xLjYsNC44Yy0wLjQsMi0wLjQsMy42LTAuNCw1LjJjMCwxLjYsMCwzLjYsMC40LDUuMiBDMTkyLjgsMTM5LjYsMTkzLjYsMTQxLjIsMTk0LDE0Mi44elwiXG4gICAgICAgIH0pLFxuICAgICAgICB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXCJwYXRoXCIsIHsgZDogXCJNMjQ5LjYsMjg5LjJoLTkuMnYtOThjMC01LjYtNC40LTEwLjQtMTAuNC0xMC40aC00MmMtNS42LDAtMTAuNCw0LjQtMTAuNCwxMC40djIxLjZjMCw1LjYsNC40LDEwLjQsMTAuNCwxMC40aDguNHY2Ni40IEgxODhjLTUuNiwwLTEwLjQsNC40LTEwLjQsMTAuNHYyMS42YzAsNS42LDQuNCwxMC40LDEwLjQsMTAuNGg2MS42YzUuNiwwLDEwLjQtNC40LDEwLjQtMTAuNFYzMDAgQzI2MCwyOTQsMjU1LjIsMjg5LjIsMjQ5LjYsMjg5LjJ6XCJcbiAgICAgICAgfSksXG4gICAgICAgIHdwLmVsZW1lbnQuY3JlYXRlRWxlbWVudChcInBhdGhcIiwgeyBkOiBcIk0yMTguOCwwQzk4LDAsMCw5OCwwLDIxOC44czk4LDIxOC44LDIxOC44LDIxOC44czIxOC44LTk4LDIxOC44LTIxOC44UzMzOS42LDAsMjE4LjgsMHogTTIxOC44LDQwOC44IGMtMTA0LjgsMC0xOTAtODUuMi0xOTAtMTkwczg1LjItMTkwLDE5MC0xOTBzMTkwLDg1LjIsMTkwLDE5MFMzMjMuNiw0MDguOCwyMTguOCw0MDguOHpcIlxuICAgICAgICB9KVxuICAgIClcbik7XG5cbmV4cG9ydCBkZWZhdWx0IGluZm87XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYmxvY2tzL25vdGlmaWNhdGlvbi1ib3gvaWNvbnMvaW5mby5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///4\n");

/***/ }),
/* 5 */
/*!******************************************************!*\
  !*** ./src/blocks/notification-box/icons/success.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("var success = wp.element.createElement(\n         \"svg\",\n         { xmlns: \"http://www.w3.org/2000/svg\", id: \"Layer_1\", viewBox: \"0 0 426.667 426.667\",\n                  width: \"20px\", height: \"20px\" },\n         wp.element.createElement(\"polygon\", { points: \"293.333,135.04 190.08,240.213 137.173,187.093 108.8,215.467 192.213,298.667 326.187,168.747\",\n                  fill: \"#4f8a10\" }),\n         wp.element.createElement(\"path\", { d: \"M213.333,0C95.513,0,0,95.513,0,213.333s95.513,213.333,213.333,213.333s213.333-95.513,213.333-213.333 S331.154,0,213.333,0z M213.333,388.053c-96.495,0-174.72-78.225-174.72-174.72s78.225-174.72,174.72-174.72 c96.446,0.117,174.602,78.273,174.72,174.72C388.053,309.829,309.829,388.053,213.333,388.053z\",\n                  fill: \"#4f8a10\" })\n);\n\n/* unused harmony default export */ var _unused_webpack_default_export = (success);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9ibG9ja3Mvbm90aWZpY2F0aW9uLWJveC9pY29ucy9zdWNjZXNzLmpzP2FmZjciXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHN1Y2Nlc3MgPSB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICBcInN2Z1wiLFxuICAgICAgICAgeyB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBpZDogXCJMYXllcl8xXCIsIHZpZXdCb3g6IFwiMCAwIDQyNi42NjcgNDI2LjY2N1wiLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IFwiMjBweFwiLCBoZWlnaHQ6IFwiMjBweFwiIH0sXG4gICAgICAgICB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXCJwb2x5Z29uXCIsIHsgcG9pbnRzOiBcIjI5My4zMzMsMTM1LjA0IDE5MC4wOCwyNDAuMjEzIDEzNy4xNzMsMTg3LjA5MyAxMDguOCwyMTUuNDY3IDE5Mi4yMTMsMjk4LjY2NyAzMjYuMTg3LDE2OC43NDdcIixcbiAgICAgICAgICAgICAgICAgIGZpbGw6IFwiIzRmOGExMFwiIH0pLFxuICAgICAgICAgd3AuZWxlbWVudC5jcmVhdGVFbGVtZW50KFwicGF0aFwiLCB7IGQ6IFwiTTIxMy4zMzMsMEM5NS41MTMsMCwwLDk1LjUxMywwLDIxMy4zMzNzOTUuNTEzLDIxMy4zMzMsMjEzLjMzMywyMTMuMzMzczIxMy4zMzMtOTUuNTEzLDIxMy4zMzMtMjEzLjMzMyBTMzMxLjE1NCwwLDIxMy4zMzMsMHogTTIxMy4zMzMsMzg4LjA1M2MtOTYuNDk1LDAtMTc0LjcyLTc4LjIyNS0xNzQuNzItMTc0Ljcyczc4LjIyNS0xNzQuNzIsMTc0LjcyLTE3NC43MiBjOTYuNDQ2LDAuMTE3LDE3NC42MDIsNzguMjczLDE3NC43MiwxNzQuNzJDMzg4LjA1MywzMDkuODI5LDMwOS44MjksMzg4LjA1MywyMTMuMzMzLDM4OC4wNTN6XCIsXG4gICAgICAgICAgICAgICAgICBmaWxsOiBcIiM0ZjhhMTBcIiB9KVxuKTtcblxuZXhwb3J0IGRlZmF1bHQgc3VjY2VzcztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9ibG9ja3Mvbm90aWZpY2F0aW9uLWJveC9pY29ucy9zdWNjZXNzLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///5\n");

/***/ }),
/* 6 */
/*!******************************************************!*\
  !*** ./src/blocks/notification-box/icons/warning.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("var warning = wp.element.createElement(\n      \"svg\",\n      { xmlns: \"http://www.w3.org/2000/svg\", id: \"Capa_1\", viewBox: \"0 0 512 512\",\n            width: \"20px\", height: \"20px\" },\n      wp.element.createElement(\"path\", { d: \"M256,0C114.497,0,0,114.507,0,256c0,141.503,114.507,256,256,256c141.503,0,256-114.507,256-256 C512,114.497,397.493,0,256,0z M256,472c-119.393,0-216-96.615-216-216c0-119.393,96.615-216,216-216 c119.393,0,216,96.615,216,216C472,375.393,375.385,472,256,472z\",\n            fill: \"#D80027\" }),\n      wp.element.createElement(\"path\", { d: \"M256,128.877c-11.046,0-20,8.954-20,20V277.67c0,11.046,8.954,20,20,20s20-8.954,20-20V148.877 C276,137.831,267.046,128.877,256,128.877z\",\n            fill: \"#D80027\" }),\n      wp.element.createElement(\"circle\", { cx: \"256\", cy: \"349.16\", r: \"27\", fill: \"#D80027\" })\n);\n\n/* unused harmony default export */ var _unused_webpack_default_export = (warning);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9ibG9ja3Mvbm90aWZpY2F0aW9uLWJveC9pY29ucy93YXJuaW5nLmpzP2MzZjciXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHdhcm5pbmcgPSB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBcInN2Z1wiLFxuICAgICAgeyB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBpZDogXCJDYXBhXzFcIiwgdmlld0JveDogXCIwIDAgNTEyIDUxMlwiLFxuICAgICAgICAgICAgd2lkdGg6IFwiMjBweFwiLCBoZWlnaHQ6IFwiMjBweFwiIH0sXG4gICAgICB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXCJwYXRoXCIsIHsgZDogXCJNMjU2LDBDMTE0LjQ5NywwLDAsMTE0LjUwNywwLDI1NmMwLDE0MS41MDMsMTE0LjUwNywyNTYsMjU2LDI1NmMxNDEuNTAzLDAsMjU2LTExNC41MDcsMjU2LTI1NiBDNTEyLDExNC40OTcsMzk3LjQ5MywwLDI1NiwweiBNMjU2LDQ3MmMtMTE5LjM5MywwLTIxNi05Ni42MTUtMjE2LTIxNmMwLTExOS4zOTMsOTYuNjE1LTIxNiwyMTYtMjE2IGMxMTkuMzkzLDAsMjE2LDk2LjYxNSwyMTYsMjE2QzQ3MiwzNzUuMzkzLDM3NS4zODUsNDcyLDI1Niw0NzJ6XCIsXG4gICAgICAgICAgICBmaWxsOiBcIiNEODAwMjdcIiB9KSxcbiAgICAgIHdwLmVsZW1lbnQuY3JlYXRlRWxlbWVudChcInBhdGhcIiwgeyBkOiBcIk0yNTYsMTI4Ljg3N2MtMTEuMDQ2LDAtMjAsOC45NTQtMjAsMjBWMjc3LjY3YzAsMTEuMDQ2LDguOTU0LDIwLDIwLDIwczIwLTguOTU0LDIwLTIwVjE0OC44NzcgQzI3NiwxMzcuODMxLDI2Ny4wNDYsMTI4Ljg3NywyNTYsMTI4Ljg3N3pcIixcbiAgICAgICAgICAgIGZpbGw6IFwiI0Q4MDAyN1wiIH0pLFxuICAgICAgd3AuZWxlbWVudC5jcmVhdGVFbGVtZW50KFwiY2lyY2xlXCIsIHsgY3g6IFwiMjU2XCIsIGN5OiBcIjM0OS4xNlwiLCByOiBcIjI3XCIsIGZpbGw6IFwiI0Q4MDAyN1wiIH0pXG4pO1xuXG5leHBvcnQgZGVmYXVsdCB3YXJuaW5nO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Jsb2Nrcy9ub3RpZmljYXRpb24tYm94L2ljb25zL3dhcm5pbmcuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///6\n");

/***/ })
/******/ ]);