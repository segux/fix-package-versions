import { FixPackageVersionsLib } from './lib';

describe( 'fix versions lib ------', () => {
  let fixPackageVersions;
  const packageUrl = './fake-package.json';
  beforeEach( () => {
    fixPackageVersions = new FixPackageVersionsLib( packageUrl );
  } );

  it( 'has jsonUrl', () => {
    expect( fixPackageVersions.getJsonUrl() ).toBe( packageUrl )
  } );

  it( 'has getPackageJsonFile', () => {
    expect( fixPackageVersions.getPackageJsonFile() ).toBeTruthy();
  } );

  it( 'has dependencies', () => {
    expect( Object.keys( fixPackageVersions.getDevDependencies() ).length ).toBeGreaterThan( 0 );
  } );

  it( 'has devDependencies', () => {
    expect( Object.keys( fixPackageVersions.getDevDependencies() ).length ).toBeGreaterThan( 0 );
  } );

  it( 'fix dependencies and validation', () => {
    fixPackageVersions.fixDependencies();

    expect( fixPackageVersions.isValidPackage() ).toBeTruthy();
  } );

  it( 'fix devDependencies and validation', () => {
    fixPackageVersions.fixDevDependencies();
    expect( fixPackageVersions.isValidPackage() ).toBeTruthy();
  } );
} );