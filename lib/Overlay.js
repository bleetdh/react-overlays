exports.__esModule = true;
exports.default = void 0;

let _propTypes = _interopRequireDefault(require('prop-types'));

let _elementType = _interopRequireDefault(
  require('prop-types-extra/lib/elementType'),
);

let _componentOrElement = _interopRequireDefault(
  require('prop-types-extra/lib/componentOrElement'),
);

let _react = _interopRequireDefault(require('react'));

let _reactDom = _interopRequireDefault(require('react-dom'));

let _Portal = _interopRequireDefault(require('./Portal'));

let _RootCloseWrapper = _interopRequireDefault(require('./RootCloseWrapper'));

let _reactPopper = require('react-popper');

let _forwardRef = _interopRequireDefault(
  require('react-context-toolbox/forwardRef'),
);

let _WaitForContainer = _interopRequireDefault(require('./WaitForContainer'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
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

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  }
  return self;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/**
 * Built on top of `<Position/>` and `<Portal/>`, the overlay component is
 * great for custom tooltip overlays.
 */
let Overlay =
  /*#__PURE__*/
  (function(_React$Component) {
    _inheritsLoose(Overlay, _React$Component);

    function Overlay(props, context) {
      let _this;

      _this = _React$Component.call(this, props, context) || this;

      _this.handleHidden = function() {
        _this.setState({
          exited: true,
        });

        if (_this.props.onExited) {
          let _this$props;

          (_this$props = _this.props).onExited.apply(_this$props, arguments);
        }
      };

      _this.state = {
        exited: !props.show,
      };
      _this.onHiddenListener = _this.handleHidden.bind(
        _assertThisInitialized(_this),
      );
      _this._lastTarget = null;
      return _this;
    }

    Overlay.getDerivedStateFromProps = function getDerivedStateFromProps(
      nextProps,
    ) {
      if (nextProps.show) {
        return {
          exited: false,
        };
      } else if (!nextProps.transition) {
        // Otherwise let handleHidden take care of marking exited.
        return {
          exited: true,
        };
      }

      return null;
    };

    let _proto = Overlay.prototype;

    _proto.componentDidMount = function componentDidMount() {
      this.setState({
        target: this.getTarget(),
      });
    };

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      if (this.props === prevProps) return;
      let target = this.getTarget();

      if (target !== this.state.target) {
        this.setState({
          target: target,
        });
      }
    };

    _proto.getTarget = function getTarget() {
      let target = this.props.target;
      target = typeof target === 'function' ? target() : target;
      return (target && _reactDom.default.findDOMNode(target)) || null;
    };

    _proto.render = function render() {
      let _this2 = this;

      let _this$props2 = this.props;
      let _0 = _this$props2.target;
      let container = _this$props2.container;
      let containerPadding = _this$props2.containerPadding;
      let placement = _this$props2.placement;
      let rootClose = _this$props2.rootClose;
      let children = _this$props2.children;
      let flip = _this$props2.flip;
      let _this$props2$popperCo = _this$props2.popperConfig;
      let popperConfig =
        _this$props2$popperCo === void 0 ? {} : _this$props2$popperCo;
      let Transition = _this$props2.transition;
      let props = _objectWithoutPropertiesLoose(_this$props2, [
        'target',
        'container',
        'containerPadding',
        'placement',
        'rootClose',
        'children',
        'flip',
        'popperConfig',
        'transition',
      ]);

      let target = this.state.target; // Don't un-render the overlay while it's transitioning out.

      let mountOverlay = props.show || (Transition && !this.state.exited);

      if (!mountOverlay) {
        // Don't bother showing anything if we don't have to.
        return null;
      }

      let child = children;
      let _popperConfig$modifie = popperConfig.modifiers;
      let modifiers =
        _popperConfig$modifie === void 0 ? {} : _popperConfig$modifie;

      let popperProps = _extends({}, popperConfig, {
        placement: placement,
        referenceElement: target,
        enableEvents: props.show,
        modifiers: _extends({}, modifiers, {
          preventOverflow: _extends(
            {
              padding: containerPadding || 5,
            },
            modifiers.preventOverflow,
          ),
          flip: _extends(
            {
              enabled: !!flip,
            },
            modifiers.preventOverflow,
          ),
        }),
      });

      child = _react.default.createElement(
        _reactPopper.Popper,
        popperProps,
        function(_ref) {
          let arrowProps = _ref.arrowProps;
          let style = _ref.style;
          let ref = _ref.ref;
          let popper = _objectWithoutPropertiesLoose(_ref, [
            'arrowProps',
            'style',
            'ref',
          ]);

          _this2.popper = popper;

          let innerChild = _this2.props.children(
            _extends({}, popper, {
              // popper doesn't set the initial placement
              placement: popper.placement || placement,
              show: props.show,
              arrowProps: arrowProps,
              props: {
                ref: ref,
                style: style,
              },
            }),
          );

          if (Transition) {
            let onExit = props.onExit;
            let onExiting = props.onExiting;
            let onEnter = props.onEnter;
            let onEntering = props.onEntering;
            let onEntered = props.onEntered;
            innerChild = _react.default.createElement(
              Transition,
              {
                in: props.show,
                appear: true,
                onExit: onExit,
                onExiting: onExiting,
                onExited: _this2.onHiddenListener,
                onEnter: onEnter,
                onEntering: onEntering,
                onEntered: onEntered,
              },
              innerChild,
            );
          }

          return innerChild;
        },
      );

      if (rootClose) {
        child = _react.default.createElement(
          _RootCloseWrapper.default,
          {
            onRootClose: props.onHide,
            event: props.rootCloseEvent,
            disabled: props.rootCloseDisabled,
          },
          child,
        );
      }

      return _react.default.createElement(
        _Portal.default,
        {
          container: container,
        },
        child,
      );
    };

    return Overlay;
  })(_react.default.Component);

Overlay.propTypes = _extends({}, _Portal.default.propTypes, {
  /**
   * Set the visibility of the Overlay
   */
  show: _propTypes.default.bool,

  /** Specify where the overlay element is positioned in relation to the target element */
  placement: _propTypes.default.oneOf(_reactPopper.placements),

  /**
   * A Node, Component instance, or function that returns either. The `container` will have the Portal children
   * appended to it.
   */
  container: _propTypes.default.oneOfType([
    _componentOrElement.default,
    _propTypes.default.func,
  ]),

  /**
   * Enables the Popper.js `flip` modifier, allowing the Overlay to
   * automatically adjust it's placement in case of overlap with the viewport or toggle.
   * Refer to the [flip docs](https://popper.js.org/popper-documentation.html#modifiers..flip.enabled) for more info
   */
  flip: _propTypes.default.bool,

  /**
   * A render prop that returns an element to overlay and position. See
   * the [react-popper documentation](https://github.com/FezVrasta/react-popper#children) for more info.
   *
   * @type {Function ({
   *   show: boolean,
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
   * A set of popper options and props passed directly to react-popper's Popper component.
   */
  popperConfig: _propTypes.default.object,

  /**
   * Specify whether the overlay should trigger `onHide` when the user clicks outside the overlay
   */
  rootClose: _propTypes.default.bool,

  /**
   * Specify event for toggling overlay
   */
  rootCloseEvent: _RootCloseWrapper.default.propTypes.event,

  /**
   * Specify disabled for disable RootCloseWrapper
   */
  rootCloseDisabled: _RootCloseWrapper.default.propTypes.disabled,

  /**
   * A Callback fired by the Overlay when it wishes to be hidden.
   *
   * __required__ when `rootClose` is `true`.
   *
   * @type func
   */
  onHide: function onHide(props) {
    let propType = _propTypes.default.func;

    if (props.rootClose) {
      propType = propType.isRequired;
    }

    for (
      var _len = arguments.length,
        args = new Array(_len > 1 ? _len - 1 : 0),
        _key = 1;
      _key < _len;
      _key++
    ) {
      args[_key - 1] = arguments[_key];
    }

    return propType.apply(void 0, [props].concat(args));
  },

  /**
   * A `react-transition-group@2.0.0` `<Transition/>` component
   * used to animate the overlay as it changes visibility.
   */
  transition: _elementType.default,

  /**
   * Callback fired before the Overlay transitions in
   */
  onEnter: _propTypes.default.func,

  /**
   * Callback fired as the Overlay begins to transition in
   */
  onEntering: _propTypes.default.func,

  /**
   * Callback fired after the Overlay finishes transitioning in
   */
  onEntered: _propTypes.default.func,

  /**
   * Callback fired right before the Overlay transitions out
   */
  onExit: _propTypes.default.func,

  /**
   * Callback fired as the Overlay begins to transition out
   */
  onExiting: _propTypes.default.func,

  /**
   * Callback fired after the Overlay finishes transitioning out
   */
  onExited: _propTypes.default.func,
});

let _default = (0, _forwardRef.default)(
  function(props, ref) {
    return (
      // eslint-disable-next-line react/prop-types
      _react.default.createElement(
        _WaitForContainer.default,
        {
          container: props.container,
        },
        function(container) {
          return _react.default.createElement(
            Overlay,
            _extends({}, props, {
              ref: ref,
              container: container,
            }),
          );
        },
      )
    );
  },
  {
    displayName: 'withContainer(Overlay)',
  },
);

exports.default = _default;
module.exports = exports.default;
