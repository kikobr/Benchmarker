/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// module.exports = (on, config) => {
//   // `on` is used to hook into various events Cypress emits
//   // `config` is the resolved Cypress config
// }

module.exports = (on, config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // provide absolute path to unpacked extension's folder
      launchOptions.extensions.push('/Users/kiko/Documents/Projetos/Benchmarker/cypress/plugins/gleekbfjekiniecknbkamfmkohkpodhe')
      // launchOptions.extensions.push('/Users/kiko/Documents/Projetos/Benchmarker/cypress/plugins/jfpdlihdedhlmhlbgooailmfhahieoem')
    }
    return launchOptions
    });
    on('task', { log (message) { console.log(message); return null } });
}
