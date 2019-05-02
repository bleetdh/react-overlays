exports.__esModule = true;
exports.default = void 0;

let _propTypes = _interopRequireDefault(require('prop-types'));

let _react = _interopRequireDefault(require('react'));

let _reactPopper = require('react-popper');

let _DropdownContext = _interopRequireDefault(require('./DropdownContext'));

let _RootCloseWrapper = _interopRequireDefault(require('./RootCloseWrapper'));

let _mapContextToProps = _interopRequireDefault(
  require('react-context-toolbox/mapContextToProps'),
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  let target = {};
  let sourceKeys = Object.keys(source);
  let key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (let i = 1; i < arguments.length; i++) {
        let source = arguments[i];
        for (let key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

let DropdownMenu =
  /*#__PURE__*/
  (function(_React$Component) {
    _inheritsLoose(DropdownMenu, _React$Component);

    function DropdownMenu() {
      let _this;

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      _this =
        _React$Component.call.apply(_React$Component, [this].concat(args)) ||
        this;
      _this.state = {
        toggleId: null,
      };
      _this.popperIsInitialized = false;

      _this.handleClose = function(e) {
        if (!_this.props.onToggle) return;

        _this.props.onToggle(false, e);
      };

      return _this;
    }

    let _proto = DropdownMenu.prototype;

    _proto.getSnapshotBeforeUpdate = function getSnapshotBeforeUpdate(
      prevProps,
    ) {
      // If, to the best we can tell, this update won't reinitialize popper,
      // manually schedule an update
      let shouldUpdatePopper =
        !prevProps.show &&
        this.props.show &&
        this.popperIsInitialized && // a new reference node will already trigger this internally
        prevProps.toggleNode === this.props.toggleNode;

      if (
        this.props.show &&
        this.props.usePopper &&
        !this.popperIsInitialized
      ) {
        this.popperIsInitialized = true;
      }

      return !!shouldUpdatePopper;
    };

    _proto.componentDidUpdate = function componentDidUpdate(
      _,
      __,
      shouldUpdatePopper,
    ) {
      if (shouldUpdatePopper && this.scheduleUpdate) {
        this.scheduleUpdate();
      }
    };

    _proto.render = function render() {
      let _this2 = this;

      let _this$props = this.props;
      let show = _this$props.show;
      let flip = _this$props.flip;
      let menuRef = _this$props.menuRef;
      let alignEnd = _this$props.alignEnd;
      let drop = _this$props.drop;
      let usePopper = _this$props.usePopper;
      let toggleNode = _this$props.toggleNode;
      let rootCloseEvent = _this$props.rootCloseEvent;
      let _this$props$popperCon = _this$props.popperConfig;
      let popperConfig =
        _this$props$popperCon === void 0 ? {} : _this$props$popperCon;
      let placement = alignEnd ? 'bottom-end' : 'bottom-start';
      if (drop === 'up') placement = alignEnd ? 'top-end' : 'top-start';
      if (drop === 'right') placement = alignEnd ? 'right-end' : 'right-start';
      if (drop === 'left') placement = alignEnd ? 'left-end' : 'left-start';
      let menu = null;
      let menuProps = {
        ref: menuRef,
        'aria-labelledby': toggleNode && toggleNode.id,
      };
      let childArgs = {
        show: show,
        alignEnd: alignEnd,
        close: this.handleClose,
      };

      if (!usePopper) {
        menu = this.props.children(
          _extends({}, childArgs, {
            props: menuProps,
          }),
        );
      } else if (this.popperIsInitialized || show) {
        // Add it this way, so it doesn't override someones usage
        // with react-poppers <Reference>
        if (toggleNode) popperConfig.referenceElement = toggleNode;
        menu = _react.default.createElement(
          _reactPopper.Popper,
          _extends({}, popperConfig, {
            innerRef: menuRef,
            placement: placement,
            eventsEnabled: !!show,
            modifiers: _extends(
              {
                flip: {
                  enabled: !!flip,
                },
              },
              popperConfig.modifiers,
            ),
          }),
          function(_ref) {
            let ref = _ref.ref;
            let style = _ref.style;
            let popper = _objectWithoutPropertiesLoose(_ref, ['ref', 'style']);

            _this2.scheduleUpdate = popper.scheduleUpdate;
            return _this2.props.children(
              _extends({}, popper, childArgs, {
                props: _extends({}, menuProps, {
                  ref: ref,
                  style: style,
                }),
              }),
            );
          },
        );
      }

      return (
        menu &&
        _react.default.createElement(
          _RootCloseWrapper.default,
          {
            disabled: !show,
            event: rootCloseEvent,
            onRootClose: this.handleClose,
          },
          menu,
        )
      );
    };

    return DropdownMenu;
  })(_react.default.Component);

DropdownMenu.displayName = 'ReactOverlaysDropdownMenu';
DropdownMenu.propTypes = {
  /**
   * A render prop that returns a Menu element. The `props`
   * argument should spread through to **a component that can accept a ref**.
   *
   * @type {Function ({
   *   show: boolean,
   *   alignEnd: boolean,
   *   close: (?SyntheticEvent) => void,
   *   placement: Placement,
   *   outOfBoundaries: ?boolean,
   *   scheduleUpdate: () => void,
   *   props: {
   *     ref: (?HTMLElement) => void,
   *     style: { [string]: string | number },
   *     aria-labelledby: ?string
   *   },
   *   arrowProps: {
   *     ref: (?HTMLElement) => void,
   *     style: { [string]: string | number },
   *   },
   * }) => React.Element}
   */
  children: _propTypes.default.func.isRequired,

  /**
   * Controls the visible state of the menu, generally this is
   * provided by the parent `Dropdown` component,
   * but may also be specified as a prop directly.
   */
  show: _propTypes.default.bool,

  /**
   * Aligns the dropdown menu to the 'end' of it's placement position.
   * Generally this is provided by the parent `Dropdown` component,
   * but may also be specified as a prop directly.
   */
  alignEnd: _propTypes.default.bool,

  /**
   * Enables the Popper.js `flip` modifier, allowing the Dropdown to
   * automatically adjust it's placement in case of overlap with the viewport or toggle.
   * Refer to the [flip docs](https://popper.js.org/popper-documentation.html#modifiers..flip.enabled) for more info
   */
  flip: _propTypes.default.bool,
  usePopper: _propTypes.default.oneOf([true, false]),

  /**
   * A set of popper options and props passed directly to react-popper's Popper component.
   */
  popperConfig: _propTypes.default.object,

  /**
   * Override the default event used by RootCloseWrapper.
   */
  rootCloseEvent: _propTypes.default.string,

  /** @private */
  onToggle: _propTypes.default.func,

  /** @private */
  menuRef: _propTypes.default.func,

  /** @private */
  drop: _propTypes.default.string,

  /** @private */
  toggleNode: _propTypes.default.any,
};
DropdownMenu.defaultProps = {
  usePopper: true,
};
let DecoratedDropdownMenu = (0, _mapContextToProps.default)(
  _DropdownContext.default,
  function(_ref2, props) {
    let show = _ref2.show;
    let alignEnd = _ref2.alignEnd;
    let toggle = _ref2.toggle;
    let drop = _ref2.drop;
    let menuRef = _ref2.menuRef;
    let toggleNode = _ref2.toggleNode;
    return {
      drop: drop,
      menuRef: menuRef,
      toggleNode: toggleNode,
      onToggle: toggle,
      show: show == null ? props.show : show,
      alignEnd: alignEnd == null ? props.alignEnd : alignEnd,
    };
  },
  DropdownMenu,
);
let _default = DecoratedDropdownMenu;
exports.default = _default;
module.exports = exports.default;
