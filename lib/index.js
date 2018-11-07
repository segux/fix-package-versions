const editJsonFile = require('edit-json-file');
const isObject = require('./utils/is-object');
const Prompt = require('prompt-base');

const versionSpecialCharacter = new RegExp(/^[\\^<>~]/);

const packageJsonFile = editJsonFile('./fake-package.json', { autosave: true });

const devDependencies = packageJsonFile.get('devDependencies');
const dependencies = packageJsonFile.get('dependencies');

let hasChanges = false;

console.log('----------- Checking devDependencies versions -------------');

const fixVersion = (namespace, dependencies) => {
  if (!isObject(dependencies)) return;
  Object.keys(dependencies).forEach(dependency => {
    const version = dependencies[dependency];
    if (versionSpecialCharacter.test(version)) {
      setDependency(namespace, dependency, version);
    }
  });
};

const setDependency = (namespace, dependency, version) => {
  console.log(namespace, dependency, version);
  const nodeModulesPackage = editJsonFile(`./node_modules/${dependency}/package.json`);
  const fixedVersion = nodeModulesPackage.get('version');
  if (fixedVersion && fixedVersion <= version) {
    console.log(`------ Fixing from ${version} to ${namespace}.${dependency}: ${fixedVersion} ---------- `);
    packageJsonFile.set(`${namespace}.${dependency}`, fixedVersion);
    hasChanges = true;
  }
};

const doneMessage = () => {
  if (hasChanges) {
    console.log('------------------- Package fixed done ---------------------');
  } else {
    console.log('------------------- Nothing to change. This package is fixed already ---------------------');
  }
};
const fixPackageModule = {
  fixAll() {
    fixVersion('devDependencies', devDependencies);
    fixVersion('dependencies', dependencies);
    doneMessage();
  },
  areYouSure() {
    const prompt = new Prompt({
      name: 'areYouSure',
      message:
        'With this action you will make versions fixed with the latest package version installed. Are you sure? Y/n'
    });
    prompt.run().then(answer => {
      if (!answer) return;
      if (answer.toLowerCase() === 'y') {
        fixVersion('devDependencies', devDependencies);
        fixVersion('dependencies', dependencies);
        doneMessage();
      }
    });
  }
};

module.exports = fixPackageModule;
