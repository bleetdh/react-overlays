exports.__esModule = true;
exports.default = void 0;

let _propTypes = _interopRequireDefault(require('prop-types'));

let _react = _interopRequireDefault(require('react'));

let _DropdownContext = _interopRequireDefault(require('./DropdownContext'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

let propTypes = {
  /**
   * A render prop that returns a Toggle element. The `props`
   * argument should spread through to **a component that can accept a ref**. Use
   * the `onToggle` argument to toggle the menu open or closed
   *
   * @type {Function ({
   *   show: boolean,
   *   toggle: (show: boolean) => void,
   *   props: {
   *     ref: (?HTMLElement) => void,
   *     aria-haspopup: true
   *     aria-expanded: boolean
   *   },
   * }) => React.Element}
   */
  children: _propTypes.default.func.isRequired,
};

function DropdownToggle(_ref) {
  let children = _ref.children;
  return _react.default.createElement(
    _DropdownContext.default.Consumer,
    null,
    function(_ref2) {
      let show = _ref2.show;
      let toggle = _ref2.toggle;
      let toggleRef = _ref2.toggleRef;
      return children({
        show: show,
        toggle: toggle,
        props: {
          ref: toggleRef,
          'aria-haspopup': true,
          'aria-expanded': !!show,
        },
      });
    },
  );
}

DropdownToggle.displayName = 'ReactOverlaysDropdownToggle';
DropdownToggle.propTypes = propTypes;
let _default = DropdownToggle;
exports.default = _default;
module.exports = exports.default;
