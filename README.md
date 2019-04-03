# fix-package-versions
[![CodeFactor](https://www.codefactor.io/repository/github/segux/fix-package-versions/badge)](https://www.codefactor.io/repository/github/segux/fix-package-versions)
[![Build Status](https://travis-ci.org/segux/fix-package-versions.svg?branch=master)](https://travis-ci.org/segux/fix-package-versions)
[![Published on npm](https://img.shields.io/npm/v/fix-package-versions.svg)](https://www.npmjs.com/package/fix-package-versions)

## Description

This package fixes node dependencies versions so they don't get updated nex time you do npm install

## [NEW] Features in 1.1.x
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
If you just type this in terminal, it will ask you if want to fix all dependencies and devDependencies of package.json
`fix-package-versions`


## Options

`-f , --force` : Forces fix package versions without asking you in prompt

