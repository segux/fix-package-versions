'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var editJsonFile = require('edit-json-file');

var PJV = require('package-json-validator').PJV;

var FixPackageVersionsLib =
/*#__PURE__*/
function () {
  function FixPackageVersionsLib(jsonUrl) {
    _classCallCheck(this, FixPackageVersionsLib);

    _defineProperty(this, "hasChanges", false);

    _defineProperty(this, "versionSpecialCharacter", new RegExp(/^[\\^<>~]/));

    _defineProperty(this, "jsonUrl", './package.json');

    _defineProperty(this, "packageJsonFile", undefined);

    _defineProperty(this, "devDependencies", {});

    _defineProperty(this, "dependencies", {});

    this.setJsonUrl(jsonUrl); // TODO: Create init method

    this.setPackageJsonFile();
    this.setDevDependencies();
    this.setDependencies();
  }

  _createClass(FixPackageVersionsLib, [{
    key: "setJsonUrl",
    value: function setJsonUrl(jsonUrl) {
      if (!jsonUrl) return;
      this.jsonUrl = jsonUrl;
    }
  }, {
    key: "getJsonUrl",
    value: function getJsonUrl() {
      return this.jsonUrl;
    }
  }, {
    key: "setPackageJsonFile",
    value: function setPackageJsonFile() {
      this.packageJsonFile = editJsonFile(this.jsonUrl, {
        autosave: true
      });
    }
  }, {
    key: "getPackageJsonFile",
    value: function getPackageJsonFile() {
      return this.packageJsonFile;
    }
  }, {
    key: "setDependencies",
    value: function setDependencies() {
      this.dependencies = this.packageJsonFile.get('dependencies');
    }
  }, {
    key: "getDependencies",
    value: function getDependencies() {
      return this.dependencies;
    }
  }, {
    key: "setDevDependencies",
    value: function setDevDependencies() {
      this.devDependencies = this.packageJsonFile.get('devDependencies');
    }
  }, {
    key: "getDevDependencies",
    value: function getDevDependencies() {
      return this.devDependencies;
    }
  }, {
    key: "fixDependencies",
    value: function fixDependencies() {
      var _this = this;

      var dependencies = this.getDependencies();
      Object.keys(dependencies).forEach(function (dependency) {
        var version = dependencies[dependency];

        if (_this.versionSpecialCharacter.test(version)) {
          _this.setDependency('dependencies', dependency, version);
        }
      });
    }
  }, {
    key: "fixDevDependencies",
    value: function fixDevDependencies() {
      var _this2 = this;

      var devDependencies = this.getDevDependencies();
      Object.keys(devDependencies).forEach(function (dependency) {
        var version = devDependencies[dependency];

        if (_this2.versionSpecialCharacter.test(version)) {
          _this2.setDependency('devDependencies', dependency, version);
        }
      });
    }
  }, {
    key: "setDependency",
    value: function setDependency(namespace, dependency, version) {
      console.log(namespace, dependency, version);
      var nodeModulesPackage = editJsonFile("./node_modules/".concat(dependency, "/package.json"));
      var fixedVersion = nodeModulesPackage.get('version');
      console.log(fixedVersion);

      if (fixedVersion && fixedVersion <= version) {
        console.log("------ Fixing from ".concat(version, " to ").concat(namespace, ".").concat(dependency, ": ").concat(fixedVersion, " ---------- "));
        var parsedDependency = dependency.replace('.', '\\.');
        this.packageJsonFile.set("".concat(namespace, ".").concat(parsedDependency), fixedVersion);
        this.hasChanges = true;
      }
    }
  }, {
    key: "getDependency",
    value: function getDependency(namespace, dependency) {
      return this.packageJsonFile.get("".concat(namespace, ".").concat(dependency));
    }
  }, {
    key: "isValidPackage",
    value: function isValidPackage() {
      var validation = PJV.validate(JSON.stringify(this.getPackageJsonFile().data));
      console.info('------------ VALIDATION OF JSON -------------');

      if (validation.errors && validation.errors.length) {
        console.info('------ ERRORS ------');
        validation.errors.forEach(function (error) {
          console.error(error);
        });
      }

      if (validation.warnings && validation.warnings.length) {
        console.info('------ WARNINGS ------');
        validation.warnings.forEach(function (warning) {
          console.warn(warning);
        });
      }

      if (validation.recommendations && validation.recommendations.length) {
        console.info('------- RECOMMENDATIONS -------');
        validation.warnings.forEach(function (recommendation) {
          console.info(recommendation);
        });
      }

      return validation.valid;
    }
  }, {
    key: "doneMessage",
    value: function doneMessage() {
      if (this.hasChanges) {
        console.log('------------------- Package fixed done ---------------------');
      } else {
        console.log('------------------- Nothing to change. This package is fixed already ---------------------');
      }
    }
  }]);

  return FixPackageVersionsLib;
}();

var Prompt = require('prompt-base');
var fixPackageVersions = new FixPackageVersionsLib('./package.json');
console.log('----------- Checking devDependencies versions -------------');
var fixPackageModule = {
  fixAll: function fixAll() {
    fixVersions();
  },
  areYouSure: function areYouSure() {
    var prompt = new Prompt({
      name: 'areYouSure',
      message: 'With this action you will make versions fixed with the latest package version installed. Are you sure? Y/n'
    });
    prompt.run().then(function (answer) {
      if (!answer) return;

      if (answer.toLowerCase() === 'y') {
        fixVersions();
      }
    });
  }
};
module.exports = fixPackageModule;

function fixVersions() {
  fixPackageVersions.fixDevDependencies();
  fixPackageVersions.fixDependencies();
  fixPackageVersions.doneMessage();
}
