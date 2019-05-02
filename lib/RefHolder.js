exports.__esModule = true;
exports.default = void 0;

let _propTypes = _interopRequireDefault(require('prop-types'));

let _react = _interopRequireDefault(require('react'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

let propTypes = {
  children: _propTypes.default.node,
};
/**
 * Internal helper component to allow attaching a non-conflicting ref to a
 * child element that may not accept refs.
 */

let RefHolder =
  /*#__PURE__*/
  (function(_React$Component) {
    _inheritsLoose(RefHolder, _React$Component);

    function RefHolder() {
      return _React$Component.apply(this, arguments) || this;
    }

    let _proto = RefHolder.prototype;

    _proto.render = function render() {
      return this.props.children;
    };

    return RefHolder;
  })(_react.default.Component);

RefHolder.propTypes = propTypes;
let _default = RefHolder;
exports.default = _default;
module.exports = exports.default;
