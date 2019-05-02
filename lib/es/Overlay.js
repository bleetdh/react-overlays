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

import PropTypes from 'prop-types';
import elementType from 'prop-types-extra/lib/elementType';
import componentOrElement from 'prop-types-extra/lib/componentOrElement';
import React from 'react';
import ReactDOM from 'react-dom';
import Portal from './Portal';
import RootCloseWrapper from './RootCloseWrapper';
import { Popper, placements } from 'react-popper';
import forwardRef from 'react-context-toolbox/forwardRef';
import WaitForContainer from './WaitForContainer';
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
      return (target && ReactDOM.findDOMNode(target)) || null;
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

      child = React.createElement(Popper, popperProps, function(_ref) {
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
          innerChild = React.createElement(
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
      });

      if (rootClose) {
        child = React.createElement(
          RootCloseWrapper,
          {
            onRootClose: props.onHide,
            event: props.rootCloseEvent,
            disabled: props.rootCloseDisabled,
          },
          child,
        );
      }

      return React.createElement(
        Portal,
        {
          container: container,
        },
        child,
      );
    };

    return Overlay;
  })(React.Component);

Overlay.propTypes = _extends({}, Portal.propTypes, {
  /**
   * Set the visibility of the Overlay
   */
  show: PropTypes.bool,

  /** Specify where the overlay element is positioned in relation to the target element */
  placement: PropTypes.oneOf(placements),

  /**
   * A Node, Component instance, or function that returns either. The `container` will have the Portal children
   * appended to it.
   */
  container: PropTypes.oneOfType([componentOrElement, PropTypes.func]),

  /**
   * Enables the Popper.js `flip` modifier, allowing the Overlay to
   * automatically adjust it's placement in case of overlap with the viewport or toggle.
   * Refer to the [flip docs](https://popper.js.org/popper-documentation.html#modifiers..flip.enabled) for more info
   */
  flip: PropTypes.bool,

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
  children: PropTypes.func.isRequired,

  /**
   * A set of popper options and props passed directly to react-popper's Popper component.
   */
  popperConfig: PropTypes.object,

  /**
   * Specify whether the overlay should trigger `onHide` when the user clicks outside the overlay
   */
  rootClose: PropTypes.bool,

  /**
   * Specify event for toggling overlay
   */
  rootCloseEvent: RootCloseWrapper.propTypes.event,

  /**
   * Specify disabled for disable RootCloseWrapper
   */
  rootCloseDisabled: RootCloseWrapper.propTypes.disabled,

  /**
   * A Callback fired by the Overlay when it wishes to be hidden.
   *
   * __required__ when `rootClose` is `true`.
   *
   * @type func
   */
  onHide: function onHide(props) {
    let propType = PropTypes.func;

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
  transition: elementType,

  /**
   * Callback fired before the Overlay transitions in
   */
  onEnter: PropTypes.func,

  /**
   * Callback fired as the Overlay begins to transition in
   */
  onEntering: PropTypes.func,

  /**
   * Callback fired after the Overlay finishes transitioning in
   */
  onEntered: PropTypes.func,

  /**
   * Callback fired right before the Overlay transitions out
   */
  onExit: PropTypes.func,

  /**
   * Callback fired as the Overlay begins to transition out
   */
  onExiting: PropTypes.func,

  /**
   * Callback fired after the Overlay finishes transitioning out
   */
  onExited: PropTypes.func,
});
export default forwardRef(
  function(props, ref) {
    return (
      // eslint-disable-next-line react/prop-types
      React.createElement(
        WaitForContainer,
        {
          container: props.container,
        },
        function(container) {
          return React.createElement(
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
