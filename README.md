Spotify Playlist Lambda
========================================
Lambda that populates a spotify playlist with tracks based on a song. Includes package script and [CircleCI](https://circleci.com) config.

[![CircleCI](https://circleci.com/gh/chrisdevwords/spotify-playlist-lambda/tree/master.svg?style=shield)](https://circleci.com/gh/chrisdevwords/spotify-playlist-lambda/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/chrisdevwords/spotify-playlist-lambda/badge.svg?branch=master)](https://coveralls.io/github/chrisdevwords/spotify-playlist-lambda?branch=master)
[![Dependency Status](https://david-dm.org/chrisdevwords/spotify-playlist-lambda.svg)](https://david-dm.org/chrisdevwords/spotify-playlist-lambda)
[![Dev Dependency Status](https://david-dm.org/chrisdevwords/spotify-playlist-lambda/dev-status.svg)](https://david-dm.org/chrisdevwords/spotify-playlist-lambda?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/chrisdevwords/spotify-playlist-lambda/badge.svg)](https://snyk.io/test/github/chrisdevwords/spotify-playlist-lambda)


Requirements
------------
* Requires Node v6.10
* Package engine is set to strict to match [AWS Lambda Environment](https://aws.amazon.com/blogs/compute/node-js-4-3-2-runtime-now-available-on-lambda/)
* I recommend using [NVM](https://github.com/creationix/nvm)

## Running Tests
This project includes [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/). If you add to this, write more tests. And run them:
````
$ npm test
````

### Contributing
The lint config is based on [AirBnB's eslint](https://www.npmjs.com/package/eslint-config-airbnb).
To lint the code run:
```
$ npm run lint
```

### Compiling For Upload
Make sure the bin directory has executable permissions:
````
$ chmod +x ./bin/build.sh
````
If this throws an error, trying using sudo:
```
$ sudo chmod +x .bin/build.sh
```

Zip up source code and runtime dependencies by running:
````
$ npm run build
````
This should output files.zip to the project root for upload to the AWS Lambda Console.


### Deploying w/ Circle CI
Included is a `circle.yml` file for deployment to AWS with [CircleCI](https://circleci.com).
This will:
1. Run mocha tests.
2. Publish a coverage report with [coveralls](http://coveralls.io).
3. Publish a dependency status report with [david](https://david-dm.org/).
4. Deploy your code to AWS when master or develop is updated on github.

In order to deploy :
1. [configure AWS Permissions for your Circle CI account](https://circleci.com/docs/1.0/continuous-deployment-with-amazon-s3/).
2. Setup [coveralls](https://coveralls.io/) for your repo.
3. Set the following [environment vars](https://circleci.com/docs/1.0/environment-variables/) in your Circle CI build console:
    - COVERALLS_REPO_TOKEN - access token for [coveralls](http://coveralls.io), used to publish a coverage report.
    - PROD_FUNCTION_NAME - the name of the AWS Lambda you want to build  when `master` is pushed to github.
    - DEV_FUNCTION_NAME - (optional) the name of the AWS Lambda you want to build  when `develop` is pushed to github.
4. Be sure to replace references to `spotify-playlist-lambda` in the badges at the top of this README with the name of your repo.
