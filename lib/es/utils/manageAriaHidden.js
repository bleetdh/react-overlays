let BLACKLIST = ['template', 'script', 'style'];

let isHidable = function isHidable(_ref) {
  let nodeType = _ref.nodeType;
  let tagName = _ref.tagName;
  return nodeType === 1 && BLACKLIST.indexOf(tagName.toLowerCase()) === -1;
};

let siblings = function siblings(container, exclude, cb) {
  exclude = [].concat(exclude);
  [].forEach.call(container.children, function(node) {
    if (exclude.indexOf(node) === -1 && isHidable(node)) {
      cb(node);
    }
  });
};

export function ariaHidden(show, node) {
  if (!node) return;

  if (show) {
    node.setAttribute('aria-hidden', 'true');
  } else {
    node.removeAttribute('aria-hidden');
  }
}
export function hideSiblings(container, _ref2) {
  let root = _ref2.root;
  let backdrop = _ref2.backdrop;
  siblings(container, [root, backdrop], function(node) {
    return ariaHidden(true, node);
  });
}
export function showSiblings(container, _ref3) {
  let root = _ref3.root;
  let backdrop = _ref3.backdrop;
  siblings(container, [root, backdrop], function(node) {
    return ariaHidden(false, node);
  });
}
