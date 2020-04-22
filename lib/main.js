"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const process = __importStar(require("process"));
const semver = __importStar(require("semver"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //echo ::set-env name=RELEASE_VERSION::$(echo ${GITHUB_REF:11})
            const githubRef = process.env['GITHUB_REF'];
            if (!githubRef) {
                core.setFailed('must set GITHUB_REF environment variable');
                return;
            }
            let tagName = githubRef;
            if (tagName.length < 11) {
                core.setFailed(`tag name is too short '${tagName}'`);
                return;
            }
            const expectedPrefix = 'refs/tags/';
            const prefix = tagName.substr(0, expectedPrefix.length);
            if (prefix != expectedPrefix) {
                core.setFailed(`tag name should start with '${expectedPrefix}' ('${tagName}')`);
                return;
            }
            tagName = tagName.substr(expectedPrefix.length);
            if (tagName[0] != 'v') {
                core.setFailed('version tags should start with "v"');
                return;
            }
            const version = tagName.substr(1);
            if (version.length == 0) {
                core.setFailed(`version string is empty`);
                return;
            }
            let allowIllegalSemanticVersion = core.getInput('allow-illegal-semver');
            const shouldCheckSemanticVersion = !allowIllegalSemanticVersion;
            if (!shouldCheckSemanticVersion) {
                core.debug('skipping semantic version check');
            }
            if (shouldCheckSemanticVersion && !semver.valid(version)) {
                core.setFailed(`not a valid semver version "${version}"`);
                return;
            }
            core.debug(`found version '${version}'`);
            core.exportVariable('RELEASE_VERSION', version);
            core.setOutput('version', version);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
