# grunt-deploy-site

> Deploy the contents of a folder to a remote git repository

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-deploy-site --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-deploy-site');
```

## The "deploy_site" task

### Overview

The `deploy-site` grunt package leverages git to copy a specified folder from within your project to a separate git repository. The destination Git repository can live anywhere Git has access to whether it's a sibling directory or a remote repository via SSH.

#### Use Cases

* managing a static site such as Git Hub Pages
* deploying applications to production
* continuous integration tasks

In your project's Gruntfile, add a section named `deploy_site` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  deploy_site: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Settings

#### base_path
Type: `String`

This specifies the base path to push to the git remote git repository. For instance, specifying `dist` would make the `dist` folder the root of the remote repository.

#### remote_url
Type: `String`

This defines the destination git URL that the contents of `base_path` will be deployed to. This parameter can point to a local path or any valid git URL.

### Options

#### options.branch
Type: `String`
Default value: `master`

Remote branch to deploy

#### options.commit_msg
Type: `String`
Default value: `deployment`

A commit message to include for the deployment

#### options.deploy_url
Type: `String`
Default value: `N/A`

If set, the supplied URL will open in a browser window after the site is successfully deployed.

#### options.verbose
Type: `String`
Default value: false

Displays the output of git the commands used in the background when `verbose` is set to true

### Usage Examples

#### Default Options
In this example, the contents of the `dist` folder are deployed to the `gh-pages` branch of the remote repository `https://github.com/LonnyGomes/grunt-deploy-site.git`. A local reposiotry is created with in a folder named `.production_site` and after the site is deployed the URL _http://grunt-deploy-site.github.io_ will be opened up in a browser.

```js
grunt.initConfig({
   deploy_site: {
        produciton: {
            options: {
                branch: 'gh-pages',
                commit_msg: 'deployment',
                deploy_url: 'http://grunt-deploy-site.github.io'
            },
            base_path: 'dist',
            remote_url: 'https://github.com/LonnyGomes/grunt-deploy-site.git'
        }
    }
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

####v0.1.2

* allowed empty commits so a deploy can happen even if no changes were detected

####v0.1.1

* fixed issue where the browser wouldn't always open the `deploy_url` site (#1)
* updated console colors to increase readability

####v0.1.0

* Initial release
