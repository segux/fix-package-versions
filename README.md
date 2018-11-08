# fix-package-versions
[![Build Status](https://travis-ci.org/segux/fix-package-versions.svg?branch=master)](https://travis-ci.org/segux/fix-package-versions)
## Description
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
This project is just for people that want to launch a stable product with current versions of n and doesnt want to fight vs future version problems everytime you do a npm install

## [NEW] Features in 1.1.1
- Add json validation with errors, warnings and recommendations about package.json
- Add tests for a consistent versioning
- Add rollup for a common.js library
- Refactor to a new class with more detailed properties and methods

## Install

### Global
`npm install -g fix-package-versions`

### Local
`npm install --save-dev fix-package-versions`


## Usage

### Global
If you just type this in terminal, it will question you if want to fix all dependencies and devDependencies of package.json
`fix-package-versions`


## Options

`-f , --force` : Forces fix package versions without asking you in prompt
