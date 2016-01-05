var BasePlugin = require('ember-cli-deploy-plugin');
var minimatch = require('minimatch');
var Uploader = require('./lib/uploader');

module.exports = {
  name: 'ember-cli-deploy-cobot-scss',

  createDeployPlugin: function(options) {
    var DeployPlugin = BasePlugin.extend({
      name: options.name,

      defaultConfig: {
        srcDir: 'scss',
        blankOut: [],
        distDir: function(context) {
          return context.distDir;
        },
        distFiles: function(context) {
          return context.distFiles || [];
        },
      },
      requiredConfig: ['accessToken', 'bundleUrl'],

      upload: function(context) {
        var that = this;
        var blankOut = this.readConfig('blankOut');
        var distFiles = this.readConfig('distFiles');
        var filesToUpload = distFiles.filter(minimatch.filter(this.readConfig('srcDir') + '/**/*.scss', { matchBase: true }));
        this.log('Uploading SCSS...');
        this.log('Files to upload: ' + filesToUpload, {verbose: true});
        var uploader = new Uploader({
          accessToken: this.readConfig('accessToken'),
          bundleUrl: this.readConfig('bundleUrl'),
          srcDir: this.readConfig('srcDir'),
          baseDir: this.readConfig('distDir'),
          logger: this
        });
        return uploader.uploadFiles(filesToUpload, blankOut).then(function() {
          that.log('Done uploading SCSS.');
        }, function(error) {
          that.log('Error uploading SCSS: ' + error, { color: 'red' });
        });
      }
    });

    return new DeployPlugin();
  }
};
