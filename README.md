# KeyboardShortcuts

KeyboardShortcuts is a Chrome extension which enables users to define hotkeys or keyboard shortcuts and a sequence of operations to be invoked when a matching key sequence is pressed.  For help see the <a href="https://github.com/farleigh/keyboardshortcuts/wiki">wiki</a>.

## Dependencies

KeyboardShortcuts uses node/node package manager to handle dependency resolution and manage builds. Gulp is used to handle the build itself. Karma/Jasmine are used for testing.

## Build Instructions

Assuming you have node.js set up in your environment, you can build KeyboardShortcuts by typing: 

```
npm install
npm run build
```

while you are in the KeyboardShortcuts project directory. Building includes linting, and running tests (Karma/Jasmine) and copying files to the dist folder. The extension can be loaded directly into Chrome from the dist folder.

## License

<i>Keyboard Shortcuts is released under the MIT license</i>

Copyright (c) 2015 Clinton Farleigh <clint@farleigh.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
