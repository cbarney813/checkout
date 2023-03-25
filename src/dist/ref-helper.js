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
exports.checkCommitInfo = exports.testRef = exports.getRefSpec = exports.getRefSpecForAllHistory = exports.getCheckoutInfo = exports.tagsRefSpec = void 0;
var core = require("@actions/core");
var github = require("@actions/github");
var octokit_provider_1 = require("./octokit-provider");
var url_helper_1 = require("./url-helper");
exports.tagsRefSpec = '+refs/tags/*:refs/tags/*';
function getCheckoutInfo(git, ref, commit) {
    return __awaiter(this, void 0, Promise, function () {
        var result, upperRef, branch, branch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!git) {
                        throw new Error('Arg git cannot be empty');
                    }
                    if (!ref && !commit) {
                        throw new Error('Args ref and commit cannot both be empty');
                    }
                    result = {};
                    upperRef = (ref || '').toUpperCase();
                    if (!!ref) return [3 /*break*/, 1];
                    result.ref = commit;
                    return [3 /*break*/, 8];
                case 1:
                    if (!upperRef.startsWith('REFS/HEADS/')) return [3 /*break*/, 2];
                    branch = ref.substring('refs/heads/'.length);
                    result.ref = branch;
                    result.startPoint = "refs/remotes/origin/" + branch;
                    return [3 /*break*/, 8];
                case 2:
                    if (!upperRef.startsWith('REFS/PULL/')) return [3 /*break*/, 3];
                    branch = ref.substring('refs/pull/'.length);
                    result.ref = "refs/remotes/pull/" + branch;
                    return [3 /*break*/, 8];
                case 3:
                    if (!upperRef.startsWith('REFS/')) return [3 /*break*/, 4];
                    result.ref = ref;
                    return [3 /*break*/, 8];
                case 4: return [4 /*yield*/, git.branchExists(true, "origin/" + ref)];
                case 5:
                    if (!_a.sent()) return [3 /*break*/, 6];
                    result.ref = ref;
                    result.startPoint = "refs/remotes/origin/" + ref;
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, git.tagExists("" + ref)];
                case 7:
                    if (_a.sent()) {
                        result.ref = "refs/tags/" + ref;
                    }
                    else {
                        throw new Error("A branch or tag with the name '" + ref + "' could not be found");
                    }
                    _a.label = 8;
                case 8: return [2 /*return*/, result];
            }
        });
    });
}
exports.getCheckoutInfo = getCheckoutInfo;
function getRefSpecForAllHistory(ref, commit) {
    var result = ['+refs/heads/*:refs/remotes/origin/*', exports.tagsRefSpec];
    if (ref && ref.toUpperCase().startsWith('REFS/PULL/')) {
        var branch = ref.substring('refs/pull/'.length);
        result.push("+" + (commit || ref) + ":refs/remotes/pull/" + branch);
    }
    return result;
}
exports.getRefSpecForAllHistory = getRefSpecForAllHistory;
function getRefSpec(ref, commit) {
    if (!ref && !commit) {
        throw new Error('Args ref and commit cannot both be empty');
    }
    var upperRef = (ref || '').toUpperCase();
    // SHA
    if (commit) {
        // refs/heads
        if (upperRef.startsWith('REFS/HEADS/')) {
            var branch = ref.substring('refs/heads/'.length);
            return ["+" + commit + ":refs/remotes/origin/" + branch];
        }
        // refs/pull/
        else if (upperRef.startsWith('REFS/PULL/')) {
            var branch = ref.substring('refs/pull/'.length);
            return ["+" + commit + ":refs/remotes/pull/" + branch];
        }
        // refs/tags/
        else if (upperRef.startsWith('REFS/TAGS/')) {
            return ["+" + commit + ":" + ref];
        }
        // Otherwise no destination ref
        else {
            return [commit];
        }
    }
    // Unqualified ref, check for a matching branch or tag
    else if (!upperRef.startsWith('REFS/')) {
        return [
            "+refs/heads/" + ref + "*:refs/remotes/origin/" + ref + "*",
            "+refs/tags/" + ref + "*:refs/tags/" + ref + "*"
        ];
    }
    // refs/heads/
    else if (upperRef.startsWith('REFS/HEADS/')) {
        var branch = ref.substring('refs/heads/'.length);
        return ["+" + ref + ":refs/remotes/origin/" + branch];
    }
    // refs/pull/
    else if (upperRef.startsWith('REFS/PULL/')) {
        var branch = ref.substring('refs/pull/'.length);
        return ["+" + ref + ":refs/remotes/pull/" + branch];
    }
    // refs/tags/
    else {
        return ["+" + ref + ":" + ref];
    }
}
exports.getRefSpec = getRefSpec;
/**
 * Tests whether the initial fetch created the ref at the expected commit
 */
function testRef(git, ref, commit) {
    return __awaiter(this, void 0, Promise, function () {
        var upperRef, branch, _a, _b, tagName, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!git) {
                        throw new Error('Arg git cannot be empty');
                    }
                    if (!ref && !commit) {
                        throw new Error('Args ref and commit cannot both be empty');
                    }
                    if (!!commit) return [3 /*break*/, 1];
                    return [2 /*return*/, true];
                case 1:
                    if (!!ref) return [3 /*break*/, 3];
                    return [4 /*yield*/, git.shaExists(commit)];
                case 2: return [2 /*return*/, _e.sent()];
                case 3:
                    upperRef = ref.toUpperCase();
                    if (!upperRef.startsWith('REFS/HEADS/')) return [3 /*break*/, 7];
                    branch = ref.substring('refs/heads/'.length);
                    return [4 /*yield*/, git.branchExists(true, "origin/" + branch)];
                case 4:
                    _a = (_e.sent());
                    if (!_a) return [3 /*break*/, 6];
                    _b = commit;
                    return [4 /*yield*/, git.revParse("refs/remotes/origin/" + branch)];
                case 5:
                    _a = _b === (_e.sent());
                    _e.label = 6;
                case 6: return [2 /*return*/, (_a)];
                case 7:
                    if (!upperRef.startsWith('REFS/PULL/')) return [3 /*break*/, 8];
                    // Assume matches because fetched using the commit
                    return [2 /*return*/, true];
                case 8:
                    if (!upperRef.startsWith('REFS/TAGS/')) return [3 /*break*/, 12];
                    tagName = ref.substring('refs/tags/'.length);
                    return [4 /*yield*/, git.tagExists(tagName)];
                case 9:
                    _c = (_e.sent());
                    if (!_c) return [3 /*break*/, 11];
                    _d = commit;
                    return [4 /*yield*/, git.revParse(ref)];
                case 10:
                    _c = _d === (_e.sent());
                    _e.label = 11;
                case 11: return [2 /*return*/, (_c)];
                case 12:
                    core.debug("Unexpected ref format '" + ref + "' when testing ref info");
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.testRef = testRef;
function checkCommitInfo(token, commitInfo, repositoryOwner, repositoryName, ref, commit, baseUrl) {
    var _a, _b;
    return __awaiter(this, void 0, Promise, function () {
        var expectedHeadSha, expectedBaseSha, expectedMessage, match, actualHeadSha, octokit, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    // GHES?
                    if (url_helper_1.isGhes(baseUrl)) {
                        return [2 /*return*/];
                    }
                    // Auth token?
                    if (!token) {
                        return [2 /*return*/];
                    }
                    // Public PR synchronize, for workflow repo?
                    if (fromPayload('repository.private') !== false ||
                        github.context.eventName !== 'pull_request' ||
                        fromPayload('action') !== 'synchronize' ||
                        repositoryOwner !== github.context.repo.owner ||
                        repositoryName !== github.context.repo.repo ||
                        ref !== github.context.ref ||
                        !ref.startsWith('refs/pull/') ||
                        commit !== github.context.sha) {
                        return [2 /*return*/];
                    }
                    expectedHeadSha = fromPayload('after');
                    if (!expectedHeadSha) {
                        core.debug('Unable to determine head sha');
                        return [2 /*return*/];
                    }
                    expectedBaseSha = fromPayload('pull_request.base.sha');
                    if (!expectedBaseSha) {
                        core.debug('Unable to determine base sha');
                        return [2 /*return*/];
                    }
                    expectedMessage = "Merge " + expectedHeadSha + " into " + expectedBaseSha;
                    if (commitInfo.indexOf(expectedMessage) >= 0) {
                        return [2 /*return*/];
                    }
                    match = commitInfo.match(/Merge ([0-9a-f]{40}) into ([0-9a-f]{40})/);
                    if (!match) {
                        core.debug('Unexpected message format');
                        return [2 /*return*/];
                    }
                    actualHeadSha = match[1];
                    if (!(actualHeadSha !== expectedHeadSha)) return [3 /*break*/, 2];
                    core.debug("Expected head sha " + expectedHeadSha + "; actual head sha " + actualHeadSha);
                    octokit = octokit_provider_1.getOctokit(token, {
                        baseUrl: baseUrl,
                        userAgent: "actions-checkout-tracepoint/1.0 (code=STALE_MERGE;owner=" + repositoryOwner + ";repo=" + repositoryName + ";pr=" + fromPayload('number') + ";run_id=" + process.env['GITHUB_RUN_ID'] + ";expected_head_sha=" + expectedHeadSha + ";actual_head_sha=" + actualHeadSha + ")"
                    });
                    return [4 /*yield*/, octokit.repos.get({ owner: repositoryOwner, repo: repositoryName })];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2: return [3 /*break*/, 4];
                case 3:
                    err_1 = _c.sent();
                    core.debug("Error when validating commit info: " + ((_b = (_a = err_1) === null || _a === void 0 ? void 0 : _a.stack) !== null && _b !== void 0 ? _b : err_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.checkCommitInfo = checkCommitInfo;
function fromPayload(path) {
    return select(github.context.payload, path);
}
function select(obj, path) {
    if (!obj) {
        return undefined;
    }
    var i = path.indexOf('.');
    if (i < 0) {
        return obj[path];
    }
    var key = path.substr(0, i);
    return select(obj[key], path.substr(i + 1));
}
