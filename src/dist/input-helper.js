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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getInputs = void 0;
var core = require("@actions/core");
var fsHelper = require("./fs-helper");
var github = require("@actions/github");
var path = require("path");
var workflowContextHelper = require("./workflow-context-helper");
function getInputs() {
    return __awaiter(this, void 0, Promise, function () {
        var result, githubWorkspacePath, qualifiedRepository, splitRepository, isWorkflowRepository, submodulesString, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    result = {};
                    githubWorkspacePath = process.env['GITHUB_WORKSPACE'];
                    if (!githubWorkspacePath) {
                        throw new Error('GITHUB_WORKSPACE not defined');
                    }
                    githubWorkspacePath = path.resolve(githubWorkspacePath);
                    core.debug("GITHUB_WORKSPACE = '" + githubWorkspacePath + "'");
                    fsHelper.directoryExistsSync(githubWorkspacePath, true);
                    qualifiedRepository = core.getInput('repository') ||
                        github.context.repo.owner + "/" + github.context.repo.repo;
                    core.debug("qualified repository = '" + qualifiedRepository + "'");
                    splitRepository = qualifiedRepository.split('/');
                    if (splitRepository.length !== 2 ||
                        !splitRepository[0] ||
                        !splitRepository[1]) {
                        throw new Error("Invalid repository '" + qualifiedRepository + "'. Expected format {owner}/{repo}.");
                    }
                    result.repositoryOwner = splitRepository[0];
                    result.repositoryName = splitRepository[1];
                    // Repository path
                    result.repositoryPath = core.getInput('path') || '.';
                    result.repositoryPath = path.resolve(githubWorkspacePath, result.repositoryPath);
                    if (!(result.repositoryPath + path.sep).startsWith(githubWorkspacePath + path.sep)) {
                        throw new Error("Repository path '" + result.repositoryPath + "' is not under '" + githubWorkspacePath + "'");
                    }
                    isWorkflowRepository = qualifiedRepository.toUpperCase() ===
                        (github.context.repo.owner + "/" + github.context.repo.repo).toUpperCase();
                    // Source branch, source version
                    result.ref = core.getInput('ref');
                    if (!result.ref) {
                        if (isWorkflowRepository) {
                            result.ref = github.context.ref;
                            result.commit = github.context.sha;
                            // Some events have an unqualifed ref. For example when a PR is merged (pull_request closed event),
                            // the ref is unqualifed like "main" instead of "refs/heads/main".
                            if (result.commit && result.ref && !result.ref.startsWith('refs/')) {
                                result.ref = "refs/heads/" + result.ref;
                            }
                        }
                    }
                    // SHA?
                    else if (result.ref.match(/^[0-9a-fA-F]{40}$/)) {
                        result.commit = result.ref;
                        result.ref = '';
                    }
                    core.debug("ref = '" + result.ref + "'");
                    core.debug("commit = '" + result.commit + "'");
                    // Clean
                    result.clean = (core.getInput('clean') || 'true').toUpperCase() === 'TRUE';
                    core.debug("clean = " + result.clean);
                    // Fetch depth
                    result.fetchDepth = Math.floor(Number(core.getInput('fetch-depth') || '1'));
                    if (isNaN(result.fetchDepth) || result.fetchDepth < 0) {
                        result.fetchDepth = 0;
                    }
                    core.debug("fetch depth = " + result.fetchDepth);
                    // LFS
                    result.lfs = (core.getInput('lfs') || 'false').toUpperCase() === 'TRUE';
                    core.debug("lfs = " + result.lfs);
                    // Submodules
                    result.submodules = false;
                    result.nestedSubmodules = false;
                    submodulesString = (core.getInput('submodules') || '').toUpperCase();
                    if (submodulesString == 'RECURSIVE') {
                        result.submodules = true;
                        result.nestedSubmodules = true;
                    }
                    else if (submodulesString == 'TRUE') {
                        result.submodules = true;
                    }
                    core.debug("submodules = " + result.submodules);
                    core.debug("recursive submodules = " + result.nestedSubmodules);
                    // Auth token
                    result.authToken = core.getInput('token', { required: true });
                    // SSH
                    result.sshKey = core.getInput('ssh-key');
                    result.sshKnownHosts = core.getInput('ssh-known-hosts');
                    result.sshStrict =
                        (core.getInput('ssh-strict') || 'true').toUpperCase() === 'TRUE';
                    // Persist credentials
                    result.persistCredentials =
                        (core.getInput('persist-credentials') || 'false').toUpperCase() === 'TRUE';
                    // Workflow organization ID
                    _a = result;
                    return [4 /*yield*/, workflowContextHelper.getOrganizationId()
                        // Set safe.directory in git global config.
                    ];
                case 1:
                    // Workflow organization ID
                    _a.workflowOrganizationId = _b.sent();
                    // Set safe.directory in git global config.
                    result.setSafeDirectory =
                        (core.getInput('set-safe-directory') || 'true').toUpperCase() === 'TRUE';
                    // Determine the GitHub URL that the repository is being hosted from
                    result.githubServerUrl = core.getInput('github-server-url');
                    core.debug("GitHub Host URL = " + result.githubServerUrl);
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.getInputs = getInputs;
