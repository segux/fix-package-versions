const { readFileSync } = require( 'fs' )
const babelConfig = JSON.parse( readFileSync( './.babelrc', 'utf8' ) )

require( 'babel-register' )( babelConfig )
require( 'babel-polyfill' );

module.exports = {
  verbose: true,
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
};