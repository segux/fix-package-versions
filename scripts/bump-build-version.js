const packageJson = require( '../package.json' );
const exec = require( 'child_process' ).exec;
const travisBuildNumber = process.env.TRAVIS_BUILD_NUMBER;
let buildVersion = 0;
console.log( travisBuildNumber );
if ( travisBuildNumber ) {
  buildVersion = parseInt( travisBuildNumber );
}

let newVersion = packageJson.version.split( '.' ).map( ( versionNumber, index ) => {
  if ( index === 2 ) {
    return ( buildVersion );
  } else {
    return versionNumber;
  }
} ).join( '.' );

exec( `npm version ${ newVersion }  --no-git-tag-version --yes`, null, ( error, stdout ) => {
  if ( error ) {
    console.error( `exec error: ${ error }` );
  }
  console.log( stdout );
  console.log( `Bumped correctly build version ${ newVersion }` );
} );
