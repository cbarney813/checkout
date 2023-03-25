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
var exec = require("@actions/exec");
var fshelper = require("../lib/fs-helper");
var commandManager = require("../lib/git-command-manager");
var git;
var mockExec = jest.fn();
describe('git-auth-helper tests', function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            jest.spyOn(fshelper, 'fileExistsSync').mockImplementation(jest.fn());
            jest.spyOn(fshelper, 'directoryExistsSync').mockImplementation(jest.fn());
            return [2 /*return*/];
        });
    }); });
    afterEach(function () {
        jest.restoreAllMocks();
    });
    afterAll(function () { });
    it('branch list matches', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workingDirectory, lfs, branches;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockExec.mockImplementation(function (path, args, options) {
                        console.log(args, options.listeners.stdout);
                        if (args.includes('version')) {
                            options.listeners.stdout(Buffer.from('2.18'));
                            return 0;
                        }
                        if (args.includes('rev-parse')) {
                            options.listeners.stdline(Buffer.from('refs/heads/foo'));
                            options.listeners.stdline(Buffer.from('refs/heads/bar'));
                            return 0;
                        }
                        return 1;
                    });
                    jest.spyOn(exec, 'exec').mockImplementation(mockExec);
                    workingDirectory = 'test';
                    lfs = false;
                    return [4 /*yield*/, commandManager.createCommandManager(workingDirectory, lfs)];
                case 1:
                    git = _a.sent();
                    return [4 /*yield*/, git.branchList(false)];
                case 2:
                    branches = _a.sent();
                    expect(branches).toHaveLength(2);
                    expect(branches.sort()).toEqual(['foo', 'bar'].sort());
                    return [2 /*return*/];
            }
        });
    }); });
    it('ambiguous ref name output is captured', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workingDirectory, lfs, branches;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockExec.mockImplementation(function (path, args, options) {
                        console.log(args, options.listeners.stdout);
                        if (args.includes('version')) {
                            options.listeners.stdout(Buffer.from('2.18'));
                            return 0;
                        }
                        if (args.includes('rev-parse')) {
                            options.listeners.stdline(Buffer.from('refs/heads/foo'));
                            // If refs/tags/v1 and refs/heads/tags/v1 existed on this repository
                            options.listeners.errline(Buffer.from("error: refname 'tags/v1' is ambiguous"));
                            return 0;
                        }
                        return 1;
                    });
                    jest.spyOn(exec, 'exec').mockImplementation(mockExec);
                    workingDirectory = 'test';
                    lfs = false;
                    return [4 /*yield*/, commandManager.createCommandManager(workingDirectory, lfs)];
                case 1:
                    git = _a.sent();
                    return [4 /*yield*/, git.branchList(false)];
                case 2:
                    branches = _a.sent();
                    expect(branches).toHaveLength(1);
                    expect(branches.sort()).toEqual(['foo'].sort());
                    return [2 /*return*/];
            }
        });
    }); });
});
