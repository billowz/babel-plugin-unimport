
# babel-plugin-unimport

> remove some libary code on babel build

## Installation

```sh
npm install --save-dev babel-plugin-unimport
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": [
    ["unimport", {
      "libary": {
        "devlevel": ["log", "debug", "info", "warn", "error"]
      }
    }]
  ]
}
```

### Via CLI

```sh
babel --plugins unimport script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["babel-plugin-unimport"]
});
```

This content is released under the (http://opensource.org/licenses/MIT) MIT License.
