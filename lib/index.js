const Prompt = require( 'prompt-base' );


import { FixPackageVersionsLib } from './lib';

const fixPackageVersions = new FixPackageVersionsLib( './package.json' )
console.log( '----------- Checking devDependencies versions -------------' );

const fixPackageModule = {
  fixAll() {
    fixVersions();
  },
  areYouSure() {
    const prompt = new Prompt( {
      name: 'areYouSure',
      message:
        'With this action you will make versions fixed with the latest package version installed. Are you sure? Y/n'
    } );
    prompt.run().then( answer => {
      if ( !answer ) return;
      if ( answer.toLowerCase() === 'y' ) {
        fixVersions();
      }
    } );
  }
};

module.exports = fixPackageModule;

function fixVersions() {
  fixPackageVersions.fixDevDependencies();
  fixPackageVersions.fixDependencies();
  fixPackageVersions.doneMessage();
}

