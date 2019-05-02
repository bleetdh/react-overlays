exports.__esModule = true;
exports.default = void 0;

let _matches = _interopRequireDefault(require('dom-helpers/query/matches'));

let _querySelectorAll = _interopRequireDefault(
  require('dom-helpers/query/querySelectorAll'),
);

let _react = _interopRequireDefault(require('react'));

let _reactDom = _interopRequireDefault(require('react-dom'));

let _propTypes = _interopRequireDefault(require('prop-types'));

let _uncontrollable = _interopRequireDefault(require('uncontrollable'));

let Popper = _interopRequireWildcard(require('react-popper'));

let _DropdownContext = _interopRequireDefault(require('./DropdownContext'));

let _DropdownMenu = _interopRequireDefault(require('./DropdownMenu'));

let _DropdownToggle = _interopRequireDefault(require('./DropdownToggle'));

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    let newObj = {};
    if (obj != null) {
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          let desc =
            Object.defineProperty && Object.getOwnPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : {};
          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }
    newObj.default = obj;
    return newObj;
  }
}

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

let propTypes = {
  /**
   * A render prop that returns the root dropdown element. The `props`
   * argument should spread through to an element containing _both_ the
   * menu and toggle in order to handle keyboard events for focus management.
   *
   * @type {Function ({
   *   props: {
   *     onKeyDown: (SyntheticEvent) => void,
   *   },
   * }) => React.Element}
   */
  children: _propTypes.default.func.isRequired,

  /**
   * Determines the direction and location of the Menu in relation to it's Toggle.
   */
  drop: _propTypes.default.oneOf(['up', 'left', 'right', 'down']),

  /**
   * Controls the focus behavior for when the Dropdown is opened. Set to
   * `true` to always focus the first menu item, `keyboard` to focus only when
   * navigating via the keyboard, or `false` to disable completely
   *
   * The Default behavior is `false` **unless** the Menu has a `role="menu"`
   * where it will default to `keyboard` to match the recommended [ARIA Authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton).
   */
  focusFirstItemOnShow: _propTypes.default.oneOf([false, true, 'keyboard']),

  /**
   * A css slector string that will return __focusable__ menu items.
   * Selectors should be relative to the menu component:
   * e.g. ` > li:not('.disabled')`
   */
  itemSelector: _propTypes.default.string.isRequired,

  /**
   * Align the menu to the 'end' side of the placement side of the Dropdown toggle. The default placement is `top-start` or `bottom-start`.
   */
  alignEnd: _propTypes.default.bool,

  /**
   * Whether or not the Dropdown is visible.
   *
   * @controllable onToggle
   */
  show: _propTypes.default.bool,

  /**
   * A callback fired when the Dropdown wishes to change visibility. Called with the requested
   * `show` value, the DOM event, and the source that fired it: `'click'`,`'keydown'`,`'rootClose'`, or `'select'`.
   *
   * ```js
   * function(
   *   isOpen: boolean,
   *   event: SyntheticEvent,
   * ): void
   * ```
   *
   * @controllable show
   */
  onToggle: _propTypes.default.func,
};
let defaultProps = {
  itemSelector: '* > *',
};
/**
 * `Dropdown` is set of structural components for building, accessible dropdown menus with close-on-click,
 * keyboard navigation, and correct focus handling. As with all the react-overlay's
 * components its BYOS (bring your own styles). Dropdown is primarily
 * built from three base components, you should compose to build your Dropdowns.
 *
 * - `Dropdown`, which wraps the menu and toggle, and handles keyboard navigation
 * - `Dropdown.Toggle` generally a button that triggers the menu opening
 * - `Dropdown.Menu` The overlaid, menu, positioned to the toggle with PopperJs
 */

let Dropdown =
  /*#__PURE__*/
  (function(_React$Component) {
    _inheritsLoose(Dropdown, _React$Component);

    Dropdown.getDerivedStateFromProps = function getDerivedStateFromProps(
      _ref,
      prevState,
    ) {
      let drop = _ref.drop;
      let alignEnd = _ref.alignEnd;
      let show = _ref.show;
      let lastShow = prevState.context.show;
      return {
        lastShow: lastShow,
        context: _extends({}, prevState.context, {
          drop: drop,
          show: show,
          alignEnd: alignEnd,
        }),
      };
    };

    function Dropdown(props, context) {
      let _this;

      _this = _React$Component.call(this, props, context) || this;

      _this.handleClick = function(event) {
        _this.toggleOpen(event);
      };

      _this.handleKeyDown = function(event) {
        let key = event.key;
        let target = event.target; // Second only to https://github.com/twbs/bootstrap/blob/8cfbf6933b8a0146ac3fbc369f19e520bd1ebdac/js/src/dropdown.js#L400
        // in inscrutability

        let isInput = /input|textarea/i.test(target.tagName);

        if (
          isInput &&
          (key === ' ' ||
            (key !== 'Escape' && _this.menu && _this.menu.contains(target)))
        ) {
          return;
        }

        _this._lastSourceEvent = event.type;

        switch (key) {
          case 'ArrowUp': {
            let next = _this.getNextFocusedChild(target, -1);

            if (next && next.focus) next.focus();
            event.preventDefault();
            return;
          }

          case 'ArrowDown':
            event.preventDefault();

            if (!_this.props.show) {
              _this.toggleOpen(event);
            } else {
              let _next = _this.getNextFocusedChild(target, 1);

              if (_next && _next.focus) _next.focus();
            }

            return;

          case 'Escape':
          case 'Tab':
            _this.props.onToggle(false, event);

            break;

          default:
        }
      };

      _this._focusInDropdown = false;
      _this.menu = null;
      _this.state = {
        context: {
          close: _this.handleClose,
          toggle: _this.handleClick,
          menuRef: function menuRef(r) {
            _this.menu = r;
          },
          toggleRef: function toggleRef(r) {
            let toggleNode = r && _reactDom.default.findDOMNode(r);

            _this.setState(function(_ref2) {
              let context = _ref2.context;
              return {
                context: _extends({}, context, {
                  toggleNode: toggleNode,
                }),
              };
            });
          },
        },
      };
      return _this;
    }

    let _proto = Dropdown.prototype;

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      let show = this.props.show;
      let prevOpen = prevProps.show;

      if (show && !prevOpen) {
        this.maybeFocusFirst();
      }

      this._lastSourceEvent = null;

      if (!show && prevOpen) {
        // if focus hasn't already moved from the menu let's return it
        // to the toggle
        if (this._focusInDropdown) {
          this._focusInDropdown = false;
          this.focus();
        }
      }
    };

    _proto.getNextFocusedChild = function getNextFocusedChild(current, offset) {
      if (!this.menu) return null;
      let itemSelector = this.props.itemSelector;
      let items = (0, _querySelectorAll.default)(this.menu, itemSelector);
      let index = items.indexOf(current) + offset;
      index = Math.max(0, Math.min(index, items.length));
      return items[index];
    };

    _proto.hasMenuRole = function hasMenuRole() {
      return this.menu && (0, _matches.default)(this.menu, '[role=menu]');
    };

    _proto.focus = function focus() {
      let toggleNode = this.state.context.toggleNode;

      if (toggleNode && toggleNode.focus) {
        toggleNode.focus();
      }
    };

    _proto.maybeFocusFirst = function maybeFocusFirst() {
      let type = this._lastSourceEvent;
      let focusFirstItemOnShow = this.props.focusFirstItemOnShow;

      if (focusFirstItemOnShow == null) {
        focusFirstItemOnShow = this.hasMenuRole() ? 'keyboard' : false;
      }

      if (
        focusFirstItemOnShow === false ||
        (focusFirstItemOnShow === 'keyboard' && !/^key.+$/.test(type))
      ) {
        return;
      }

      let itemSelector = this.props.itemSelector;
      let first = (0, _querySelectorAll.default)(this.menu, itemSelector)[0];
      if (first && first.focus) first.focus();
    };

    _proto.toggleOpen = function toggleOpen(event) {
      let show = !this.props.show;
      this.props.onToggle(show, event);
    };

    _proto.render = function render() {
      let _this$props = this.props;
      let children = _this$props.children;
      let props = _objectWithoutPropertiesLoose(_this$props, ['children']);

      delete props.onToggle;

      if (this.menu && this.state.lastShow && !this.props.show) {
        this._focusInDropdown = this.menu.contains(document.activeElement);
      }

      return _react.default.createElement(
        _DropdownContext.default.Provider,
        {
          value: this.state.context,
        },
        _react.default.createElement(
          Popper.Manager,
          null,
          children({
            props: {
              onKeyDown: this.handleKeyDown,
            },
          }),
        ),
      );
    };

    return Dropdown;
  })(_react.default.Component);

Dropdown.displayName = 'ReactOverlaysDropdown';
Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;
let UncontrolledDropdown = (0, _uncontrollable.default)(Dropdown, {
  show: 'onToggle',
});
UncontrolledDropdown.Menu = _DropdownMenu.default;
UncontrolledDropdown.Toggle = _DropdownToggle.default;
let _default = UncontrolledDropdown;
exports.default = _default;
module.exports = exports.default;
