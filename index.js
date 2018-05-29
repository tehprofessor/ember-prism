'use strict';

var fs = require('fs');

module.exports = {
  name: 'ember-prism',
  included() {
    // Defaults that can be overriden by options
    this.components = [];
    this.plugins = [];
    this.theme = 'node_modules/prismjs/themes/prism.css';

    let app = findHost(this);

    if (app.options && app.options['ember-prism']) {
      const options = app.options['ember-prism'];
      const plugins = options.plugins;
      const theme = options.theme;

      if (options.components) {
        if (typeof FastBoot !== 'undefined') {
          this.components = options.components;
        } else {
          this.components = options.components.map((component) => {
            return `node_modules/prismjs/components/prism-${component}.js`;
          });
        }
      }

      if (theme && theme !== 'none') {
        this.theme = `node_modules/prismjs/themes/prism-${theme}.css`;
      }

      if (plugins) {
        plugins.forEach((plugin) => {

          /**
           * Most Prism plugins contains both a js file and a css file, but there
           * are exception. `highlight-keywords` for instance, does not have a
           * css file.
           *
           * When the plugin is imported, the app should check for file existence
           * before calling `app.import()`.
           */

            // file extensions to be tested for existence.
          const fileExtensions = ['js', 'css'];

          fileExtensions.forEach((fileExtension) => {
            const nodeAssetsPath = `plugins/${plugin}/prism-${plugin}.${fileExtension}`;
            const file = `node_modules/prismjs/${nodeAssetsPath}`;


            if (fs.existsSync(file)) {
              this.plugins.push(file);
            }
          });

        });
      }
    }

    this._super.included.apply(this, arguments);

    if (typeof FastBoot !== 'undefined') {
      // Fastboot
      const Prism = require('prismjs');
      const loadLanguages = require('prismjs/components/index.js');
      loadLanguages(this.components);
    } else {
      // Browser
      this.import('node_modules/prismjs/prism.js');
      this.components.forEach((component) => {
        this.import(component);
      });
    }

    this.plugins.forEach((plugin) => {
      this.import(plugin);
    });

    this.import(this.theme);
  }
};


// Polyfill [Addon._findHost](https://ember-cli.com/api/classes/Addon.html#method__findHost) for older versions of ember-cli
function findHost(addon) {
  var current = addon;
  var app;

  do {
    app = current.app || app;
  } while (current.parent.parent && (current = current.parent));

  return app;
}
