# grunt-seajs-fresh

> Bust the assets cache by inserting a timestamp or hash to urls.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-seajs-fresh --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-seajs-fresh');
```

## The "seajs_fresh" task

### Overview
In your project's Gruntfile, add a section named `seajs_fresh` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  seajs_fresh: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.configFile
Type: `String`
Default value: `null`

The seajs config file path relative to `Gruntfile.js`.

#### options.base
Type: `String`
Default value: `''`

Similar to the `base` in seajs config, but relative to `Gruntfile.js`.

#### options.position
Type: `String`
Default value: `'query'`

Only two valid values: `'query'` and `'append'`.
The former represents the string is inserted as a query parameter value (`?v=20140930163555`),
And the latter represents the string is appended to the filename, not including extname (`filename.93ja4dk3ji.js`).

#### options.type
Type: `String` or `Function`
Default value: `'timestamp'`

The type of the string inserted into the file url. The valid values: `'timestramp'`, `'datetime'` or hash algorithms supported by nodejs, such as md5 and sha1.

If this is a function, it accepts an argument representing the `src` filepath 
and the returned value will be inserted into the file url.

#### options.length
Type: `Number`
Default value: `10`

An integer represents the length of the inserted string. Only if the `options.type` is a hash algorithm, it works.

#### options.paths
Type: `Object`
Default value: `null`

Similar to the `paths` in seajs config, but relative to `Gruntfile.js`.

#### options.vars
Type: `Object`
Default value: `null`

Similar to the `vars` in seajs config, but relative to `Gruntfile.js`.
The reason why have this option is that some people use it as `paths`.

#### options.blockRe
Type: `RegExp`
Default value: `/\/\*fresh start\*\/[^]*?\/\*fresh end\*\//g`

Used to match all blocks in seajs config.

#### options.fileRe
Type: `RegExp`
Default value: `/([:,]\s*?['"])(.*?)(['"][^,\]\}]*?[,\]\}])/g`

Used to replace the file url with new file url in seajs config.

### Usage Examples

#### Basic Options

```js
grunt.initConfig({
  seajs_fresh: {
    options: {
      configFile: 'js/config.js',
      base: 'js/dist'
    },
    files: [
      {
        expand: true,
        cwd: 'js/dist',
        src: '**/*.js'
      }
    ]
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
