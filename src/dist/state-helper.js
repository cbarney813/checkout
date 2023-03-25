"use strict";
exports.__esModule = true;
exports.setSafeDirectory = exports.setSshKnownHostsPath = exports.setSshKeyPath = exports.setRepositoryPath = exports.SshKnownHostsPath = exports.SshKeyPath = exports.PostSetSafeDirectory = exports.RepositoryPath = exports.IsPost = void 0;
var core = require("@actions/core");
/**
 * Indicates whether the POST action is running
 */
exports.IsPost = !!core.getState('isPost');
/**
 * The repository path for the POST action. The value is empty during the MAIN action.
 */
exports.RepositoryPath = core.getState('repositoryPath');
/**
 * The set-safe-directory for the POST action. The value is set if input: 'safe-directory' is set during the MAIN action.
 */
exports.PostSetSafeDirectory = core.getState('setSafeDirectory') === 'true';
/**
 * The SSH key path for the POST action. The value is empty during the MAIN action.
 */
exports.SshKeyPath = core.getState('sshKeyPath');
/**
 * The SSH known hosts path for the POST action. The value is empty during the MAIN action.
 */
exports.SshKnownHostsPath = core.getState('sshKnownHostsPath');
/**
 * Save the repository path so the POST action can retrieve the value.
 */
function setRepositoryPath(repositoryPath) {
    core.saveState('repositoryPath', repositoryPath);
}
exports.setRepositoryPath = setRepositoryPath;
/**
 * Save the SSH key path so the POST action can retrieve the value.
 */
function setSshKeyPath(sshKeyPath) {
    core.saveState('sshKeyPath', sshKeyPath);
}
exports.setSshKeyPath = setSshKeyPath;
/**
 * Save the SSH known hosts path so the POST action can retrieve the value.
 */
function setSshKnownHostsPath(sshKnownHostsPath) {
    core.saveState('sshKnownHostsPath', sshKnownHostsPath);
}
exports.setSshKnownHostsPath = setSshKnownHostsPath;
/**
 * Save the set-safe-directory input so the POST action can retrieve the value.
 */
function setSafeDirectory() {
    core.saveState('setSafeDirectory', 'true');
}
exports.setSafeDirectory = setSafeDirectory;
// Publish a variable so that when the POST action runs, it can determine it should run the cleanup logic.
// This is necessary since we don't have a separate entry point.
if (!exports.IsPost) {
    core.saveState('isPost', 'true');
}
