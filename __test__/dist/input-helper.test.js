"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var core = require("@actions/core");
var fsHelper = require("../lib/fs-helper");
var github = require("@actions/github");
var inputHelper = require("../lib/input-helper");
var path = require("path");
var workflowContextHelper = require("../lib/workflow-context-helper");
var originalGitHubWorkspace = process.env['GITHUB_WORKSPACE'];
var gitHubWorkspace = path.resolve('/checkout-tests/workspace');
// Inputs for mock @actions/core
var inputs = {};
// Shallow clone original @actions/github context
var originalContext = __assign({}, github.context);
describe('input-helper tests', function () {
    beforeAll(function () {
        // Mock getInput
        jest.spyOn(core, 'getInput').mockImplementation(function (name) {
            return inputs[name];
        });
        // Mock error/warning/info/debug
        jest.spyOn(core, 'error').mockImplementation(jest.fn());
        jest.spyOn(core, 'warning').mockImplementation(jest.fn());
        jest.spyOn(core, 'info').mockImplementation(jest.fn());
        jest.spyOn(core, 'debug').mockImplementation(jest.fn());
        // Mock github context
        jest.spyOn(github.context, 'repo', 'get').mockImplementation(function () {
            return {
                owner: 'some-owner',
                repo: 'some-repo'
            };
        });
        github.context.ref = 'refs/heads/some-ref';
        github.context.sha = '1234567890123456789012345678901234567890';
        // Mock ./fs-helper directoryExistsSync()
        jest
            .spyOn(fsHelper, 'directoryExistsSync')
            .mockImplementation(function (path) { return path == gitHubWorkspace; });
        // Mock ./workflowContextHelper getOrganizationId()
        jest
            .spyOn(workflowContextHelper, 'getOrganizationId')
            .mockImplementation(function () { return Promise.resolve(123456); });
        // GitHub workspace
        process.env['GITHUB_WORKSPACE'] = gitHubWorkspace;
    });
    beforeEach(function () {
        // Reset inputs
        inputs = {};
    });
    afterAll(function () {
        // Restore GitHub workspace
        delete process.env['GITHUB_WORKSPACE'];
        if (originalGitHubWorkspace) {
            process.env['GITHUB_WORKSPACE'] = originalGitHubWorkspace;
        }
        // Restore @actions/github context
        github.context.ref = originalContext.ref;
        github.context.sha = originalContext.sha;
        // Restore
        jest.restoreAllMocks();
    });
    it('sets defaults', function () { return __awaiter(void 0, void 0, void 0, function () {
        var settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inputHelper.getInputs()];
                case 1:
                    settings = _a.sent();
                    expect(settings).toBeTruthy();
                    expect(settings.authToken).toBeFalsy();
                    expect(settings.clean).toBe(true);
                    expect(settings.commit).toBeTruthy();
                    expect(settings.commit).toBe('1234567890123456789012345678901234567890');
                    expect(settings.fetchDepth).toBe(1);
                    expect(settings.lfs).toBe(false);
                    expect(settings.ref).toBe('refs/heads/some-ref');
                    expect(settings.repositoryName).toBe('some-repo');
                    expect(settings.repositoryOwner).toBe('some-owner');
                    expect(settings.repositoryPath).toBe(gitHubWorkspace);
                    expect(settings.setSafeDirectory).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('qualifies ref', function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalRef, settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    originalRef = github.context.ref;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    github.context.ref = 'some-unqualified-ref';
                    return [4 /*yield*/, inputHelper.getInputs()];
                case 2:
                    settings = _a.sent();
                    expect(settings).toBeTruthy();
                    expect(settings.commit).toBe('1234567890123456789012345678901234567890');
                    expect(settings.ref).toBe('refs/heads/some-unqualified-ref');
                    return [3 /*break*/, 4];
                case 3:
                    github.context.ref = originalRef;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('requires qualified repo', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputs.repository = 'some-unqualified-repo';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, inputHelper.getInputs()];
                case 2:
                    _a.sent();
                    throw 'should not reach here';
                case 3:
                    err_1 = _a.sent();
                    expect("(" + err_1.message).toMatch("Invalid repository 'some-unqualified-repo'");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('roots path', function () { return __awaiter(void 0, void 0, void 0, function () {
        var settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputs.path = 'some-directory/some-subdirectory';
                    return [4 /*yield*/, inputHelper.getInputs()];
                case 1:
                    settings = _a.sent();
                    expect(settings.repositoryPath).toBe(path.join(gitHubWorkspace, 'some-directory', 'some-subdirectory'));
                    return [2 /*return*/];
            }
        });
    }); });
    it('sets ref to empty when explicit sha', function () { return __awaiter(void 0, void 0, void 0, function () {
        var settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputs.ref = '1111111111222222222233333333334444444444';
                    return [4 /*yield*/, inputHelper.getInputs()];
                case 1:
                    settings = _a.sent();
                    expect(settings.ref).toBeFalsy();
                    expect(settings.commit).toBe('1111111111222222222233333333334444444444');
                    return [2 /*return*/];
            }
        });
    }); });
    it('sets sha to empty when explicit ref', function () { return __awaiter(void 0, void 0, void 0, function () {
        var settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputs.ref = 'refs/heads/some-other-ref';
                    return [4 /*yield*/, inputHelper.getInputs()];
                case 1:
                    settings = _a.sent();
                    expect(settings.ref).toBe('refs/heads/some-other-ref');
                    expect(settings.commit).toBeFalsy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sets workflow organization ID', function () { return __awaiter(void 0, void 0, void 0, function () {
        var settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inputHelper.getInputs()];
                case 1:
                    settings = _a.sent();
                    expect(settings.workflowOrganizationId).toBe(123456);
                    return [2 /*return*/];
            }
        });
    }); });
});
