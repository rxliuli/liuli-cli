(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global['javascript-template'] = {}));
}(this, (function (exports) { 'use strict';

  async function hello() {
    console.log('hello world');
  }

  var index = { hello };

  exports.default = index;
  exports.hello = hello;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=javascript-template.js.map
