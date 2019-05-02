exports.__esModule = true;
exports.default = void 0;

let _activeElement = _interopRequireDefault(
  require('dom-helpers/activeElement'),
);

let _contains = _interopRequireDefault(require('dom-helpers/query/contains'));

let _inDOM = _interopRequireDefault(require('dom-helpers/util/inDOM'));

let _listen = _interopRequireDefault(require('dom-helpers/events/listen'));

let _propTypes = _interopRequireDefault(require('prop-types'));

let _componentOrElement = _interopRequireDefault(
  require('prop-types-extra/lib/componentOrElement'),
);

let _elementType = _interopRequireDefault(
  require('prop-types-extra/lib/elementType'),
);

let _react = _interopRequireDefault(require('react'));

let _reactDom = _interopRequireDefault(require('react-dom'));

let _ModalManager = _interopRequireDefault(require('./ModalManager'));

let _Portal = _interopRequireDefault(require('./Portal'));

let _getContainer = _interopRequireDefault(require('./utils/getContainer'));

let _ownerDocument = _interopRequireDefault(require('./utils/ownerDocument'));

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

let modalManager = new _ModalManager.default();

function omitProps(props, propTypes) {
  let keys = Object.keys(props);
  let newProps = {};
  keys.map(function(prop) {
    if (!Object.prototype.hasOwnProperty.call(propTypes, prop)) {
      newProps[prop] = props[prop];
    }
  });
  return newProps;
}
/**
 * Love them or hate them, `<Modal />` provides a solid foundation for creating dialogs, lightboxes, or whatever else.
 * The Modal component renders its `children` node in front of a backdrop component.
 *
 * The Modal offers a few helpful features over using just a `<Portal/>` component and some styles:
 *
 * - Manages dialog stacking when one-at-a-time just isn't enough.
 * - Creates a backdrop, for disabling interaction below the modal.
 * - It properly manages focus; moving to the modal content, and keeping it there until the modal is closed.
 * - It disables scrolling of the page content while open.
 * - Adds the appropriate ARIA roles are automatically.
 * - Easily pluggable animations via a `<Transition/>` component.
 *
 * Note that, in the same way the backdrop element prevents users from clicking or interacting
 * with the page content underneath the Modal, Screen readers also need to be signaled to not to
 * interact with page content while the Modal is open. To do this, we use a common technique of applying
 * the `aria-hidden='true'` attribute to the non-Modal elements in the Modal `container`. This means that for
 * a Modal to be truly modal, it should have a `container` that is _outside_ your app's
 * React hierarchy (such as the default: document.body).
 */

let Modal =
  /*#__PURE__*/
  (function(_React$Component) {
    _inheritsLoose(Modal, _React$Component);

    function Modal() {
      let _this;

      for (
        var _len = arguments.length, _args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        _args[_key] = arguments[_key];
      }

      _this =
        _React$Component.call.apply(_React$Component, [this].concat(_args)) ||
        this;
      _this.state = {
        exited: !_this.props.show,
      };

      _this.onPortalRendered = function() {
        if (_this.props.onShow) {
          _this.props.onShow();
        } // autofocus after onShow, to not trigger a focus event for previous
        // modals before this one is shown.

        _this.autoFocus();
      };

      _this.onShow = function() {
        let doc = (0, _ownerDocument.default)(_assertThisInitialized(_this));
        let container = (0, _getContainer.default)(
          _this.props.container,
          doc.body,
        );

        _this.props.manager.add(
          _assertThisInitialized(_this),
          container,
          _this.props.containerClassName,
        );

        _this.removeKeydownListener = (0, _listen.default)(
          doc,
          'keydown',
          _this.handleDocumentKeyDown,
        );
        _this.removeFocusListener = (0, _listen.default)(
          doc,
          'focus', // the timeout is necessary b/c this will run before the new modal is mounted
          // and so steals focus from it
          function() {
            return setTimeout(_this.enforceFocus);
          },
          true,
        );
      };

      _this.onHide = function() {
        _this.props.manager.remove(_assertThisInitialized(_this));

        _this.removeKeydownListener();

        _this.removeFocusListener();

        if (_this.props.restoreFocus) {
          _this.restoreLastFocus();
        }
      };

      _this.setDialogRef = function(ref) {
        _this.dialog = ref;
      };

      _this.setBackdropRef = function(ref) {
        _this.backdrop = ref && _reactDom.default.findDOMNode(ref);
      };

      _this.handleHidden = function() {
        _this.setState({
          exited: true,
        });

        _this.onHide();

        if (_this.props.onExited) {
          let _this$props;

          (_this$props = _this.props).onExited.apply(_this$props, arguments);
        }
      };

      _this.handleBackdropClick = function(e) {
        if (e.target !== e.currentTarget) {
          return;
        }

        if (_this.props.onBackdropClick) {
          _this.props.onBackdropClick(e);
        }

        if (_this.props.backdrop === true) {
          _this.props.onHide();
        }
      };

      _this.handleDocumentKeyDown = function(e) {
        if (_this.props.keyboard && e.keyCode === 27 && _this.isTopModal()) {
          if (_this.props.onEscapeKeyDown) {
            _this.props.onEscapeKeyDown(e);
          }

          _this.props.onHide();
        }
      };

      _this.enforceFocus = function() {
        if (
          !_this.props.enforceFocus ||
          !_this._isMounted ||
          !_this.isTopModal()
        ) {
          return;
        }

        let currentActiveElement = (0, _activeElement.default)(
          (0, _ownerDocument.default)(_assertThisInitialized(_this)),
        );

        if (
          _this.dialog &&
          !(0, _contains.default)(_this.dialog, currentActiveElement)
        ) {
          _this.dialog.focus();
        }
      };

      _this.renderBackdrop = function() {
        let _this$props2 = _this.props;
        let renderBackdrop = _this$props2.renderBackdrop;
        let Transition = _this$props2.backdropTransition;
        let backdrop = renderBackdrop({
          ref: _this.setBackdropRef,
          onClick: _this.handleBackdropClick,
        });

        if (Transition) {
          backdrop = _react.default.createElement(
            Transition,
            {
              appear: true,
              in: _this.props.show,
            },
            backdrop,
          );
        }

        return backdrop;
      };

      return _this;
    }

    Modal.getDerivedStateFromProps = function getDerivedStateFromProps(
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

    let _proto = Modal.prototype;

    _proto.getSnapshotBeforeUpdate = function getSnapshotBeforeUpdate(
      prevProps,
    ) {
      if (_inDOM.default && !prevProps.show && this.props.show) {
        this.lastFocus = (0, _activeElement.default)();
      }

      return null;
    };

    _proto.componentDidMount = function componentDidMount() {
      this._isMounted = true;

      if (this.props.show) {
        this.onShow();
      }
    };

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      let transition = this.props.transition;

      if (prevProps.show && !this.props.show && !transition) {
        // Otherwise handleHidden will call this.
        this.onHide();
      } else if (!prevProps.show && this.props.show) {
        this.onShow();
      }
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      let _this$props3 = this.props;
      let show = _this$props3.show;
      let transition = _this$props3.transition;
      this._isMounted = false;

      if (show || (transition && !this.state.exited)) {
        this.onHide();
      }
    };

    _proto.autoFocus = function autoFocus() {
      if (!this.props.autoFocus) return;
      let currentActiveElement = (0, _activeElement.default)(
        (0, _ownerDocument.default)(this),
      );

      if (
        this.dialog &&
        !(0, _contains.default)(this.dialog, currentActiveElement)
      ) {
        this.lastFocus = currentActiveElement;
        this.dialog.focus();
      }
    };

    _proto.restoreLastFocus = function restoreLastFocus() {
      // Support: <=IE11 doesn't support `focus()` on svg elements (RB: #917)
      if (this.lastFocus && this.lastFocus.focus) {
        this.lastFocus.focus(this.props.restoreFocusOptions);
        this.lastFocus = null;
      }
    };

    _proto.isTopModal = function isTopModal() {
      return this.props.manager.isTopModal(this);
    };

    _proto.render = function render() {
      let _this$props4 = this.props;
      let show = _this$props4.show;
      let container = _this$props4.container;
      let children = _this$props4.children;
      let renderDialog = _this$props4.renderDialog;
      let _this$props4$role = _this$props4.role;
      let role = _this$props4$role === void 0 ? 'dialog' : _this$props4$role;
      let Transition = _this$props4.transition;
      let backdrop = _this$props4.backdrop;
      let className = _this$props4.className;
      let style = _this$props4.style;
      let onExit = _this$props4.onExit;
      let onExiting = _this$props4.onExiting;
      let onEnter = _this$props4.onEnter;
      let onEntering = _this$props4.onEntering;
      let onEntered = _this$props4.onEntered;
      let props = _objectWithoutPropertiesLoose(_this$props4, [
        'show',
        'container',
        'children',
        'renderDialog',
        'role',
        'transition',
        'backdrop',
        'className',
        'style',
        'onExit',
        'onExiting',
        'onEnter',
        'onEntering',
        'onEntered',
      ]);

      if (!(show || (Transition && !this.state.exited))) {
        return null;
      }

      let dialogProps = _extends(
        {
          role: role,
          ref: this.setDialogRef,
          // apparently only works on the dialog role element
          'aria-modal': role === 'dialog' ? true : undefined,
        },
        omitProps(props, Modal.propTypes),
        {
          style: style,
          className: className,
          tabIndex: '-1',
        },
      );

      let dialog = renderDialog
        ? renderDialog(dialogProps)
        : _react.default.createElement(
            'div',
            dialogProps,
            _react.default.cloneElement(children, {
              role: 'document',
            }),
          );

      if (Transition) {
        dialog = _react.default.createElement(
          Transition,
          {
            appear: true,
            unmountOnExit: true,
            in: show,
            onExit: onExit,
            onExiting: onExiting,
            onExited: this.handleHidden,
            onEnter: onEnter,
            onEntering: onEntering,
            onEntered: onEntered,
          },
          dialog,
        );
      }

      return _react.default.createElement(
        _Portal.default,
        {
          container: container,
          onRendered: this.onPortalRendered,
        },
        _react.default.createElement(
          _react.default.Fragment,
          null,
          backdrop && this.renderBackdrop(),
          dialog,
        ),
      );
    };

    return Modal;
  })(_react.default.Component);

Modal.propTypes = {
  /**
   * Set the visibility of the Modal
   */
  show: _propTypes.default.bool,

  /**
   * A Node, Component instance, or function that returns either. The Modal is appended to it's container element.
   *
   * For the sake of assistive technologies, the container should usually be the document body, so that the rest of the
   * page content can be placed behind a virtual backdrop as well as a visual one.
   */
  container: _propTypes.default.oneOfType([
    _componentOrElement.default,
    _propTypes.default.func,
  ]),

  /**
   * A callback fired when the Modal is opening.
   */
  onShow: _propTypes.default.func,

  /**
   * A callback fired when either the backdrop is clicked, or the escape key is pressed.
   *
   * The `onHide` callback only signals intent from the Modal,
   * you must actually set the `show` prop to `false` for the Modal to close.
   */
  onHide: _propTypes.default.func,

  /**
   * Include a backdrop component.
   */
  backdrop: _propTypes.default.oneOfType([
    _propTypes.default.bool,
    _propTypes.default.oneOf(['static']),
  ]),

  /**
   * A function that returns the dialog component. Useful for custom
   * rendering. **Note:** the component should make sure to apply the provided ref.
   *
   * ```js
   *  renderDialog={props => <MyDialog {...props} />}
   * ```
   */
  renderDialog: _propTypes.default.func,

  /**
   * A function that returns a backdrop component. Useful for custom
   * backdrop rendering.
   *
   * ```js
   *  renderBackdrop={props => <MyBackdrop {...props} />}
   * ```
   */
  renderBackdrop: _propTypes.default.func,

  /**
   * A callback fired when the escape key, if specified in `keyboard`, is pressed.
   */
  onEscapeKeyDown: _propTypes.default.func,

  /**
   * A callback fired when the backdrop, if specified, is clicked.
   */
  onBackdropClick: _propTypes.default.func,

  /**
   * A css class or set of classes applied to the modal container when the modal is open,
   * and removed when it is closed.
   */
  containerClassName: _propTypes.default.string,

  /**
   * Close the modal when escape key is pressed
   */
  keyboard: _propTypes.default.bool,

  /**
   * A `react-transition-group@2.0.0` `<Transition/>` component used
   * to control animations for the dialog component.
   */
  transition: _elementType.default,

  /**
   * A `react-transition-group@2.0.0` `<Transition/>` component used
   * to control animations for the backdrop components.
   */
  backdropTransition: _elementType.default,

  /**
   * When `true` The modal will automatically shift focus to itself when it opens, and
   * replace it to the last focused element when it closes. This also
   * works correctly with any Modal children that have the `autoFocus` prop.
   *
   * Generally this should never be set to `false` as it makes the Modal less
   * accessible to assistive technologies, like screen readers.
   */
  autoFocus: _propTypes.default.bool,

  /**
   * When `true` The modal will prevent focus from leaving the Modal while open.
   *
   * Generally this should never be set to `false` as it makes the Modal less
   * accessible to assistive technologies, like screen readers.
   */
  enforceFocus: _propTypes.default.bool,

  /**
   * When `true` The modal will restore focus to previously focused element once
   * modal is hidden
   */
  restoreFocus: _propTypes.default.bool,

  /**
   * Options passed to focus function when `restoreFocus` is set to `true`
   *
   * @link  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#Parameters
   */
  restoreFocusOptions: _propTypes.default.shape({
    preventScroll: _propTypes.default.bool,
  }),

  /**
   * Callback fired before the Modal transitions in
   */
  onEnter: _propTypes.default.func,

  /**
   * Callback fired as the Modal begins to transition in
   */
  onEntering: _propTypes.default.func,

  /**
   * Callback fired after the Modal finishes transitioning in
   */
  onEntered: _propTypes.default.func,

  /**
   * Callback fired right before the Modal transitions out
   */
  onExit: _propTypes.default.func,

  /**
   * Callback fired as the Modal begins to transition out
   */
  onExiting: _propTypes.default.func,

  /**
   * Callback fired after the Modal finishes transitioning out
   */
  onExited: _propTypes.default.func,

  /**
   * A ModalManager instance used to track and manage the state of open
   * Modals. Useful when customizing how modals interact within a container
   */
  manager: _propTypes.default.object.isRequired,
};
Modal.defaultProps = {
  show: false,
  role: 'dialog',
  backdrop: true,
  keyboard: true,
  autoFocus: true,
  enforceFocus: true,
  restoreFocus: true,
  onHide: function onHide() {},
  manager: modalManager,
  renderBackdrop: function renderBackdrop(props) {
    return _react.default.createElement('div', props);
  },
};
Modal.Manager = _ModalManager.default;
let _default = Modal;
exports.default = _default;
module.exports = exports.default;
