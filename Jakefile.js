// @author Kanstantsin Kamkou <2ka.by>
// MIT license

// defaults
var uglify = require('uglify-js'),
  fs = require('fs'),
  path = require('path'),
  wrench = require('wrench'),
  _ = require('lodash'),
  less = require('less'),
  csso = require('csso');

// constants
var CONSTANTS = {
  DIR_APP: path.join(__dirname, 'src', 'app'),
  DIR_SRC: path.join(__dirname, 'src'),
  DIR_VENDORS: path.join(__dirname, 'src', 'vendors'),
  DIR_BUILD: path.join(__dirname, 'build'),
  DIR_BUILD_APP: path.join(__dirname, 'build', 'app')
};

// default
desc('Default build action');
task('default', ['layout-modify'], function () {
  var versionNumber = process.env['version'];
  console.log('Done. Version:', versionNumber);
});

// pack-app
desc('Application scripts packing');
task('pack-app', ['copy-sources'], {async: true}, function () {
  var fileSet = _readDir(CONSTANTS.DIR_APP, 'js').reverse();

  ['background.js'].forEach(function (fileName) {
    _.remove(fileSet, function (filePath) {
      return (filePath.indexOf(fileName) !== -1);
    });
  });

  fs.writeFile(
    path.join(CONSTANTS.DIR_BUILD_APP, 'app.js'),
    uglify.minify(fileSet, {mangle: false}).code,
    function () {
      console.log('- Packed to "app.js":', "\n", fileSet);
      complete();
    }
  );
});

// pack-vendors
desc('Vendors scripts packing');
task('pack-vendors', ['copy-sources'], {async: true}, function () {
  var fileSet = _readDir(CONSTANTS.DIR_VENDORS, 'js').sort();

  ['Metro-UI-CSS', 'less'].forEach(function (libName) {
    _.remove(fileSet, function (folderPath) {
      return (folderPath.indexOf(path.join('/', libName, '/')) !== -1);
    });
  });

  fs.writeFile(
    path.join(CONSTANTS.DIR_BUILD_APP, 'vendors.js'),
    uglify.minify(fileSet, {mangle: false}).code,
    function () {
      console.log('- Packed to "vendors.js":', "\n", fileSet);
      complete();
    }
  );
});

// pack-css
desc('Application styles packing');
task('pack-css', ['copy-sources'], {async: true}, function () {
  var cssPath = path.join(CONSTANTS.DIR_APP, 'styles.less'),
  parser = new(less.Parser)({paths: [CONSTANTS.DIR_SRC]});

  parser.parse(
    fs.readFileSync(cssPath, {encoding: 'utf-8'}),
    function (err, tree) {
      if (!err) {
        fs.writeFileSync(
          path.join(CONSTANTS.DIR_BUILD_APP, 'app.css'),
          csso.justDoIt(tree.toCSS())
        );
        complete();
      }
    }
  );

  console.log('- Styles were packed');
});

// copy-sources
desc('Copies sources to the build folder');
task('copy-sources', function () {
  wrench.copyDirSyncRecursive(
    CONSTANTS.DIR_SRC, CONSTANTS.DIR_BUILD, {
      forceDelete: true,
      exclude: function (fileName, filePath) {
        return fileName === 'variables.less'
          || filePath.indexOf(CONSTANTS.DIR_VENDORS) !== -1
          || filePath.indexOf(CONSTANTS.DIR_APP) !== -1;
      }
    }
  );
  console.log('- Sources were copied to the build folder');
});

// copy-metro
desc('Copying Metro-UI-CSS styles to the build folder');
task('copy-metro', ['copy-sources'], function () {
  var pathMetroCssOut = path.join(CONSTANTS.DIR_BUILD_APP, 'metro.css'),
    pathMetroCssIn = path.join(
      CONSTANTS.DIR_VENDORS, 'Metro-UI-CSS', 'css', 'metro-bootstrap.css'
    );

  fs.writeFileSync(
    pathMetroCssOut,
    csso.justDoIt(fs.readFileSync(pathMetroCssIn, {encoding: 'utf-8'}))
  );

  console.log('- Metro styles were copied');

  wrench.copyDirSyncRecursive(
    path.join(CONSTANTS.DIR_VENDORS, 'Metro-UI-CSS', 'fonts'),
    path.join(CONSTANTS.DIR_BUILD, 'fonts')
  );

  console.log('- Metro fonts were copied');
});

// copy-background
desc('Copying background.js to the build folder');
task('copy-background', ['copy-sources'], {async: true}, function () {
  var btOut = path.join(CONSTANTS.DIR_BUILD_APP, 'background.js'),
    btIn = path.join(CONSTANTS.DIR_APP, 'background.js');

  fs.writeFile(btOut, uglify.minify(btIn).code, function () {
    console.log('- background.js was copied');
    complete();
  });
});

// layout-modify
desc('Replaces headers in the dafault layout');
task('layout-modify', ['copy-sources', 'pack-app', 'pack-vendors', 'pack-css', 'copy-metro', 'copy-background', 'version-number'], function () {
  var templatePath = path.join(CONSTANTS.DIR_BUILD, 'views', 'default.html'),
    body = fs.readFileSync(templatePath, {encoding: 'utf-8'});

  body = body.replace(
    /<!-- styles -->([^_]+?)<!-- \/styles -->/gm,
    '<link rel="stylesheet" type="text/css" href="/app/metro.css">' +
    '<link rel="stylesheet" type="text/css" href="/app/app.css">'
  );

  body = body.replace(
    /<!-- scripts -->([^_]+?)<!-- \/scripts -->/gm,
    '<script type="text/javascript" src="/app/vendors.js"></script>' +
    '<script type="text/javascript" src="/app/app.js"></script>'
  );

  fs.writeFileSync(templatePath, body);
  console.log('- The default.html was updated');
});

// version-number
desc('Adds a version number to the about template');
task('version-number', ['copy-sources'], function () {
  var templatePath = path.join(CONSTANTS.DIR_BUILD, 'views', 'options-about.html'),
    manifestPath = path.join(CONSTANTS.DIR_BUILD, 'manifest.json');

  fs.writeFileSync(
    templatePath, fs.readFileSync(templatePath, {encoding: 'utf-8'})
      .replace('##VERSION##', process.env['version'])
  );

  fs.writeFileSync(
    manifestPath, fs.readFileSync(manifestPath, {encoding: 'utf-8'})
      .replace('0.0.0', process.env['version'])
  );

  console.log('- Version number was changed');
});

// internal functions
function _readDir(pathDir, ext) {
  var files = fs.readdirSync(pathDir),
    results = [];

  for (var idx in files) {
    var filePath = path.join(pathDir, files[idx]),
      stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = _.union(results, _readDir(filePath, ext));
      continue;
    }

    if (!ext || (ext && filePath.match(new RegExp('\\.' + ext + '$')))) {
      results.push(filePath);
    }
  }

  return results;
}