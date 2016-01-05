# Ember-deploy-cobot-scss

This is the adapter implementation to use ember-cli-deploy to upload scss files to the Cobot SCSS service.

# Configuration

In your _deploy.js_ add the following:

    module.exports = function(environment) {
      return {
        "cobot-scss": {
          srcDir: 'scss', //  files within build dir where scss files are located
          blankOut: ['<path to scss file to be blanked out>'], // usefull to remove files with color definitions that are provided by scss service
          accessToken: '<cobot access token with write_scss scope>',
          bundleUrl: '<url of scss bundle from scss service>'
        }
      };
