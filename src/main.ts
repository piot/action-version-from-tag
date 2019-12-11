import * as core from '@actions/core';
import * as process from 'process';
import * as semver from 'semver';

async function run() {
  try {
    //echo ::set-env name=RELEASE_VERSION::$(echo ${GITHUB_REF:11})
    const githubRef = process.env['GITHUB_REF']
    if (!githubRef) {
      core.setFailed('must set GITHUB_REF environment variable')
      return
    }


    let tagName = githubRef
    if (tagName.length < 11) {
      core.setFailed(`tag name is too short '${tagName}'`)
      return
    }

    const expectedPrefix = 'refs/tags/'
    const prefix = tagName.substr(0, expectedPrefix.length)
    if (prefix != expectedPrefix) {
      core.setFailed(`tag name should start with '${expectedPrefix}' ('${tagName}')`)
      return
    }

    tagName = tagName.substr(expectedPrefix.length)
    if (tagName[0] != 'v') {
      core.setFailed('version tags should start with "v"')
      return
    }

    const version = tagName.substr(1)

    if (version.length == 0) {
      core.setFailed(`version string is empty`)
      return
    }

    if (!semver.valid(version)) {
      core.setFailed(`not a valid semver version "${version}"`)
      return
    }

    core.debug(`found version '${version}'`)

    core.exportVariable('RELEASE_VERSION', version)
    core.setOutput('version', version)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
