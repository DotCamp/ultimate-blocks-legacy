/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/base/ManagerBase.js":
/*!*********************************!*\
  !*** ./src/base/ManagerBase.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var _initialized = /*#__PURE__*/new WeakMap();

/**
 * Manager base abstract class.
 *
 * Implement `initLogic` function to comply.
 */
var ManagerBase = /*#__PURE__*/function () {
  function ManagerBase() {
    _classCallCheck(this, ManagerBase);

    _classPrivateFieldInitSpec(this, _initialized, {
      writable: true,
      value: false
    });
  }

  _createClass(ManagerBase, [{
    key: "isInitialized",
    value:
    /**
     * Get initialization status of manager.
     *
     * @return {boolean} initialization status
     */
    function isInitialized() {
      return _classPrivateFieldGet(this, _initialized);
    }
    /**
     * Initialization logic.
     *
     * @abstract
     */

  }, {
    key: "_initLogic",
    value: function _initLogic() {
      throw new Error('initLogic function is not implemented at extended class');
    }
    /**
     * Initialize manager instance.
     */

  }, {
    key: "init",
    value: function init() {
      if (!this.isInitialized()) {
        var _this$_initLogic;

        (_this$_initLogic = this._initLogic).call.apply(_this$_initLogic, [this].concat(Array.prototype.slice.call(arguments)));

        _classPrivateFieldSet(this, _initialized, true);
      }
    }
  }]);

  return ManagerBase;
}();
/**
 * @module ManagerBase
 */


/* harmony default export */ __webpack_exports__["default"] = (ManagerBase);

/***/ }),

/***/ "./src/inc/UpsellManager.js":
/*!**********************************!*\
  !*** ./src/inc/UpsellManager.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var $Base_ManagerBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! $Base/ManagerBase */ "./src/base/ManagerBase.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


/**
 * Editor upsell manager.
 */

var UpsellManager = /*#__PURE__*/function (_ManagerBase) {
  _inherits(UpsellManager, _ManagerBase);

  var _super = _createSuper(UpsellManager);

  function UpsellManager() {
    _classCallCheck(this, UpsellManager);

    return _super.apply(this, arguments);
  }

  _createClass(UpsellManager, [{
    key: "_initLogic",
    value: function _initLogic() {// TODO [ErdemBircan] mount react component
    }
  }]);

  return UpsellManager;
}($Base_ManagerBase__WEBPACK_IMPORTED_MODULE_0__["default"]);
/**
 * @module UpsellManager
 */


/* harmony default export */ __webpack_exports__["default"] = (new UpsellManager());

/***/ }),

/***/ "./src/stores/mainStore/actions.js":
/*!*****************************************!*\
  !*** ./src/stores/mainStore/actions.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/stores/mainStore/types.js");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Store actions.
 *
 * @param {string} storeName store name
 * @return {Object} action object
 */

var actions = function actions(storeName) {
  /**
   * Prepare hook name.
   *
   * @param {string} hookName name of hook
   * @param {string} hookType type of hook, available values 'action', 'filter'
   * @return {string} generated hook name
   */
  var preparePluginHookName = function preparePluginHookName(hookName, hookType) {
    var availableHookTypes = ['action', 'filter'];
    var finalHookType = availableHookTypes[0];

    if (availableHookTypes.includes(hookType)) {
      finalHookType = hookType;
    }

    return "".concat(storeName.toLowerCase(), "_").concat(finalHookType, "-").concat(hookName.replaceAll('/', '_'));
  };

  return {
    /**
     * Apply plugin filters.
     *
     * @param {string}   filterName name of filter
     * @param {any}      filterData data to be filtered
     * @param {Function} callback   callback function which will be called with filtered final data as argument
     * @return {Object} action object
     */
    applyPluginFilter: function applyPluginFilter(filterName, filterData, callback) {
      var finalFilterName = preparePluginHookName(filterName, 'filter');
      var finalData = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.applyFilters)(finalFilterName, filterData);

      if (typeof callback === 'function') {
        callback(finalData);
      }

      return {
        type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].UN_AFFECTIVE
      };
    },

    /**
     * Add plugin filter.
     *
     * @param {string}   filterName filter name
     * @param {Function} callback   callback function, will be called with current filtered data as first argument
     * @return {Object} action object
     */
    addPluginFilter: function addPluginFilter(filterName, callback) {
      var finalFilterName = preparePluginHookName(filterName, 'filter');

      if (typeof callback !== 'function') {
        throw new Error("invalid callback type supplied for filter ".concat(filterName));
      }

      (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)(finalFilterName, storeName, callback);
      return {
        type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].UN_AFFECTIVE
      };
    }
  };
};
/**
 * @module actions
 */


/* harmony default export */ __webpack_exports__["default"] = (actions);

/***/ }),

/***/ "./src/stores/mainStore/index.js":
/*!***************************************!*\
  !*** ./src/stores/mainStore/index.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reducer */ "./src/stores/mainStore/reducer.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors */ "./src/stores/mainStore/selectors.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actions */ "./src/stores/mainStore/actions.js");
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! deepmerge */ "./node_modules/deepmerge/dist/cjs.js");
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(deepmerge__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var $Base_ManagerBase__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! $Base/ManagerBase */ "./src/base/ManagerBase.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }







/**
 * Main store for plugin.
 *
 * @param {string} storeName store name
 * @function Object() { [native code] }
 */

var _registerStore = /*#__PURE__*/new WeakMap();

var MainStore = /*#__PURE__*/function (_ManagerBase) {
  _inherits(MainStore, _ManagerBase);

  var _super = _createSuper(MainStore);

  function MainStore() {
    var _this;

    _classCallCheck(this, MainStore);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "storeName", null);

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _registerStore, {
      writable: true,
      value: function value() {
        var extraState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var innerExtraState = {
          storeName: _this.storeName
        };
        var reducerOptions = {
          reducer: (0,_reducer__WEBPACK_IMPORTED_MODULE_1__["default"])(deepmerge__WEBPACK_IMPORTED_MODULE_4___default()(innerExtraState, extraState)),
          selectors: _selectors__WEBPACK_IMPORTED_MODULE_2__["default"],
          actions: (0,_actions__WEBPACK_IMPORTED_MODULE_3__["default"])(_this.storeName)
        };
        var generatedStore = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createReduxStore)(_this.storeName, reducerOptions);
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.register)(generatedStore);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "dispatch", function () {
      return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_this.getStoreId());
    });

    return _this;
  }

  _createClass(MainStore, [{
    key: "_initLogic",
    value:
    /**
     * Initialization logic for pro store.
     *
     * @param {string} storeName store name
     */
    function _initLogic(storeName) {
      // store id for outside use to global context
      var context = self || __webpack_require__.g;
      context.ub_main_store_id = storeName;
      this.storeName = storeName;
      var _ubPriorityData = ubPriorityData,
          blockAttributes = _ubPriorityData.blockAttributes,
          upsellExtensionData = _ubPriorityData.upsellExtensionData,
          proStatus = _ubPriorityData.proStatus;

      _classPrivateFieldGet(this, _registerStore).call(this, {
        blockAttributes: blockAttributes,
        upsellExtensionData: upsellExtensionData,
        proStatus: JSON.parse(proStatus)
      }); // attach this instance to global context for outside usage


      context.ubMainStore = this;
    }
    /**
     * Get main store id.
     *
     * @return {string} store id
     */

  }, {
    key: "getStoreId",
    value: function getStoreId() {
      var _this$storeName;

      var context = self || __webpack_require__.g;
      return (_this$storeName = this.storeName) !== null && _this$storeName !== void 0 ? _this$storeName : context.ub_main_store_id;
    }
    /**
     * Store selector
     *
     * @return {Object} object containing available store selectors
     */

  }, {
    key: "select",
    value: function select() {
      return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(this.getStoreId());
    }
    /**
     * Store action dispatch.
     *
     * @return {Object} object containing available store actions
     */

  }]);

  return MainStore;
}($Base_ManagerBase__WEBPACK_IMPORTED_MODULE_5__["default"]);
/**
 * @module mainStoreObj
 */


/* harmony default export */ __webpack_exports__["default"] = (new MainStore());

/***/ }),

/***/ "./src/stores/mainStore/reducer.js":
/*!*****************************************!*\
  !*** ./src/stores/mainStore/reducer.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ "./src/stores/mainStore/state.js");

/**
 * Store reducer.
 *
 * @param {Object} [extraState={}] extra store state
 * @return {Function} reducer function
 */

var reducer = function reducer(extraState) {
  var DEFAULT_STATE = (0,_state__WEBPACK_IMPORTED_MODULE_0__["default"])(extraState);
  return function () {
    var storeState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    return storeState;
  };
};
/**
 * @module reducer
 */


/* harmony default export */ __webpack_exports__["default"] = (reducer);

/***/ }),

/***/ "./src/stores/mainStore/selectors.js":
/*!*******************************************!*\
  !*** ./src/stores/mainStore/selectors.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Get block upsell data
 *
 * @param {Object}      state            store state
 * @param {string}      blockType        block type
 * @param {string|null} [featureId=null] feature id, if null is supplied, all upsell data associated with the block will be returned
 *
 * @return {Object | Array} block upsell data
 */

var getBlockUpsellData = function getBlockUpsellData(state, blockType) {
  var featureId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var blockUpsellData = state.upsellExtensionData[blockType];
  return featureId ? blockUpsellData[featureId] : blockUpsellData;
};
/**
 * Store selectors.
 *
 * @type {Object}
 */


var selectors = {
  /**
   * Name of store.
   *
   * @param {Object} state store state
   * @return {null | string} store name
   */
  getStoreName: function getStoreName(state) {
    return state.storeName;
  },

  /**
   * Get default attributes for target block type.
   *
   * @param {Object} state     store state
   * @param {string} blockType block type
   *
   * @return {Array | null} block default attributes
   */
  getBlockDefaultAttributes: function getBlockDefaultAttributes(state, blockType) {
    return state.blockAttributes[blockType];
  },
  getBlockUpsellData: getBlockUpsellData,

  /**
   * Get upsell data for currently active block.
   *
   * @param {Object}      state            store state
   * @param {string|null} [featureId=null] feature id, if null is supplied, all upsell data associated with the block will be returned
   *
   * @return {Array|null} active block upsell data
   */
  getUpsellDataActiveBlock: function getUpsellDataActiveBlock(state) {
    var _select$getSelectedBl;

    var featureId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var currentBlockType = (_select$getSelectedBl = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('core/block-editor').getSelectedBlock()) === null || _select$getSelectedBl === void 0 ? void 0 : _select$getSelectedBl.name;

    if (currentBlockType) {
      return getBlockUpsellData(state, currentBlockType, featureId);
    }

    return null;
  },

  /**
   * Get plugin pro status.
   *
   * @param {Object} state store state
   *
   * @return {boolean} pro status
   */
  getProStatus: function getProStatus(state) {
    return state.proStatus;
  }
};
/**
 * @module selectors
 */

/* harmony default export */ __webpack_exports__["default"] = (selectors);

/***/ }),

/***/ "./src/stores/mainStore/state.js":
/*!***************************************!*\
  !*** ./src/stores/mainStore/state.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! deepmerge */ "./node_modules/deepmerge/dist/cjs.js");
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(deepmerge__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Default store state.
 *
 * @type {Object}
 */

var defaultState = {
  storeName: null
};
/**
 * Create state.
 *
 * @param {Object} [extraState={}] extra state to use
 */

var createStore = function createStore() {
  var extraState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return deepmerge__WEBPACK_IMPORTED_MODULE_0___default()(defaultState, extraState);
};
/**
 * @module createStore
 */


/* harmony default export */ __webpack_exports__["default"] = (createStore);

/***/ }),

/***/ "./src/stores/mainStore/types.js":
/*!***************************************!*\
  !*** ./src/stores/mainStore/types.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
var ACTION_TYPES = {
  UN_AFFECTIVE: 'unAffective'
};
/**
 * @module types
 */

/* harmony default export */ __webpack_exports__["default"] = (ACTION_TYPES);

/***/ }),

/***/ "./node_modules/deepmerge/dist/cjs.js":
/*!********************************************!*\
  !*** ./node_modules/deepmerge/dist/cjs.js ***!
  \********************************************/
/***/ (function(module) {



var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;


/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ (function(module) {

module.exports = window["wp"]["hooks"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*************************!*\
  !*** ./src/priority.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var $BlockStores_mainStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! $BlockStores/mainStore */ "./src/stores/mainStore/index.js");
/* harmony import */ var $Inc_UpsellManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! $Inc/UpsellManager */ "./src/inc/UpsellManager.js");
// register main plugin store

 // initialize main plugin store

$BlockStores_mainStore__WEBPACK_IMPORTED_MODULE_0__["default"].init('ub/main');
var proStatus = $BlockStores_mainStore__WEBPACK_IMPORTED_MODULE_0__["default"].select().getProStatus();

if (!proStatus) {
  // only initialize upsell manager if pro version is not available
  $Inc_UpsellManager__WEBPACK_IMPORTED_MODULE_1__["default"].init();
}
}();
/******/ })()
;
//# sourceMappingURL=priority.build.js.map