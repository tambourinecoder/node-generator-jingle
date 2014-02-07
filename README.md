# generator-jingle [![Build Status](https://travis-ci.org/tambourinecoder/node-generator-jingle.png?branch=master)](https://travis-ci.org/tambourinecoder/node-generator-jingle)
> A [Yeoman](http://yeoman.io/) generator providing (personally flavoured) tools for writing node packages

This simple generator is what I use when working on node packages.
In particular, it allows for quickly spinning up unit tests backed
by a testing setup that conforms to my personal likings.


## Install
```bash
$ npm install generator-jingle
```

## Generators

### `jingle:package`
> Initialize a package

#### Options

- `--skip-install`

#### Example
It will try to to infer appropriate defaults:

```bash
$ mkdir node-my-package && cd $\_
$ yo jingle:package
  [?] Package name? (my-package)
  [?] Github user? (tambourinecoder)
  [?] Name? (Tambourinecoder)
  [?] Email? (tambourinecoder@gmail.com)
  [?] Include tests? (Yes)
  [?] Choose test additions:
      [x] Mocha-JSHint
      [ ] Sinon / Sinon-Chai

  create package.json
  create LICENSE
  create README.md
  create lib/index.js
  create .jshintrc
  create .jshintignore
  create .gitignore
  create .travis.yml
  create test/mocha.opts
  create test/support.js
  create test/specs/jshint_spec.js

  ...
```

## Generators

### `jingle:module`
> Generate a module along with a corresponding unit test

#### Arguments

- module name(s)

#### Example

```bash
$ yo jingle:module foo
  create lib/foo/index.js
  create test/specs/foo_spec.js

# hack hack...

$ yo jingle:module yo jingle:module foo bar-baz
  create lib/foo/bar_baz/index.js
  create test/specs/foo/bar_baz_spec.js
```

## Licence
MIT
