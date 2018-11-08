const editJsonFile = require( 'edit-json-file' );
const isObject = require( './utils/is-object' );
const PJV = require( 'package-json-validator' ).PJV;
export class FixPackageVersionsLib {
  hasChanges = false;
  versionSpecialCharacter = new RegExp( /^[\\^<>~]/ );
  jsonUrl = './package.json';

  packageJsonFile = undefined;

  devDependencies = {};
  dependencies = {};
  constructor( jsonUrl ) {
    this.setJsonUrl( jsonUrl );
    // TODO: Create init method
    this.setPackageJsonFile();
    this.setDevDependencies();
    this.setDependencies();
  }
  setJsonUrl( jsonUrl ) {
    if ( !jsonUrl ) return;
    this.jsonUrl = jsonUrl;
  }
  getJsonUrl() {
    return this.jsonUrl;
  }
  setPackageJsonFile() {
    this.packageJsonFile = editJsonFile( this.jsonUrl, { autosave: true } );
  }
  getPackageJsonFile() {
    return this.packageJsonFile;
  }
  setDependencies() {
    this.dependencies = this.packageJsonFile.get( 'dependencies' );
  }
  getDependencies() {
    return this.dependencies;
  }
  setDevDependencies() {
    this.devDependencies = this.packageJsonFile.get( 'devDependencies' )
  }
  getDevDependencies() {
    return this.devDependencies;
  }
  fixDependencies() {
    const dependencies = this.getDependencies();
    Object.keys( dependencies ).forEach( dependency => {
      const version = dependencies[dependency];
      if ( this.versionSpecialCharacter.test( version ) ) {
        this.setDependency( 'dependencies', dependency, version );
      }
    } );
  }
  fixDevDependencies() {
    const devDependencies = this.getDevDependencies();
    Object.keys( devDependencies ).forEach( dependency => {
      const version = devDependencies[dependency];
      if ( this.versionSpecialCharacter.test( version ) ) {
        this.setDependency( 'devDependencies', dependency, version );
      }
    } );
  }

  setDependency( namespace, dependency, version ) {
    console.log( namespace, dependency, version );
    const nodeModulesPackage = editJsonFile( `./node_modules/${ dependency }/package.json` );
    const fixedVersion = nodeModulesPackage.get( 'version' );
    console.log( fixedVersion );
    if ( fixedVersion && fixedVersion <= version ) {
      console.log( `------ Fixing from ${ version } to ${ namespace }.${ dependency }: ${ fixedVersion } ---------- ` );
      const parsedDependency = dependency.replace( '.', '\\.' );
      this.packageJsonFile.set( `${ namespace }.${ parsedDependency }`, fixedVersion );
      this.hasChanges = true;
    }
  }

  getDependency( namespace, dependency ) {
    return this.packageJsonFile.get( `${ namespace }.${ dependency }` );
  }

  isValidPackage() {
    const validation = PJV.validate( JSON.stringify( this.getPackageJsonFile().data ) );
    console.info( '------------ VALIDATION OF JSON -------------' );
    if ( validation.errors && validation.errors.length ) {
      console.info( '------ ERRORS ------' );
      validation.errors.forEach( ( error ) => {
        console.error( error );
      } );
    }

    if ( validation.warnings && validation.warnings.length ) {
      console.info( '------ WARNINGS ------' );
      validation.warnings.forEach( ( warning ) => {
        console.warn( warning );
      } );
    }

    if ( validation.recommendations && validation.recommendations.length ) {
      console.info( '------- RECOMMENDATIONS -------' );
      validation.warnings.forEach( ( recommendation ) => {
        console.info( recommendation );
      } );
    }
    return validation.valid;
  }

  doneMessage() {
    if ( this.hasChanges ) {
      console.log( '------------------- Package fixed done ---------------------' );
    } else {
      console.log( '------------------- Nothing to change. This package is fixed already ---------------------' );
    }
  }

}

