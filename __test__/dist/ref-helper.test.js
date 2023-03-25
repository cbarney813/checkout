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
var assert = require("assert");
var refHelper = require("../lib/ref-helper");
var commit = '1234567890123456789012345678901234567890';
var git;
describe('ref-helper tests', function () {
    beforeEach(function () {
        git = {};
    });
    it('getCheckoutInfo requires git', function () { return __awaiter(void 0, void 0, void 0, function () {
        var git, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    git = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, refHelper.getCheckoutInfo(git, 'refs/heads/my/branch', commit)];
                case 2:
                    _b.sent();
                    throw new Error('Should not reach here');
                case 3:
                    err_1 = _b.sent();
                    expect((_a = err_1) === null || _a === void 0 ? void 0 : _a.message).toBe('Arg git cannot be empty');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('getCheckoutInfo requires ref or commit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, refHelper.getCheckoutInfo(git, '', '')];
                case 1:
                    _b.sent();
                    throw new Error('Should not reach here');
                case 2:
                    err_2 = _b.sent();
                    expect((_a = err_2) === null || _a === void 0 ? void 0 : _a.message).toBe('Args ref and commit cannot both be empty');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('getCheckoutInfo sha only', function () { return __awaiter(void 0, void 0, void 0, function () {
        var checkoutInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, refHelper.getCheckoutInfo(git, '', commit)];
                case 1:
                    checkoutInfo = _a.sent();
                    expect(checkoutInfo.ref).toBe(commit);
                    expect(checkoutInfo.startPoint).toBeFalsy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('getCheckoutInfo refs/heads/', function () { return __awaiter(void 0, void 0, void 0, function () {
        var checkoutInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, refHelper.getCheckoutInfo(git, 'refs/heads/my/branch', commit)];
                case 1:
                    checkoutInfo = _a.sent();
                    expect(checkoutInfo.ref).toBe('my/branch');
                    expect(checkoutInfo.startPoint).toBe('refs/remotes/origin/my/branch');
                    return [2 /*return*/];
            }
        });
    }); });
    it('getCheckoutInfo refs/pull/', function () { return __awaiter(void 0, void 0, void 0, function () {
        var checkoutInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, refHelper.getCheckoutInfo(git, 'refs/pull/123/merge', commit)];
                case 1:
                    checkoutInfo = _a.sent();
                    expect(checkoutInfo.ref).toBe('refs/remotes/pull/123/merge');
                    expect(checkoutInfo.startPoint).toBeFalsy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('getCheckoutInfo refs/tags/', function () { return __awaiter(void 0, void 0, void 0, function () {
        var checkoutInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, refHelper.getCheckoutInfo(git, 'refs/tags/my-tag', commit)];
                case 1:
                    checkoutInfo = _a.sent();
                    expect(checkoutInfo.ref).toBe('refs/tags/my-tag');
                    expect(checkoutInfo.startPoint).toBeFalsy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('getCheckoutInfo unqualified branch only', function () { return __awaiter(void 0, void 0, void 0, function () {
        var checkoutInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    git.branchExists = jest.fn(function (remote, pattern) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, true];
                        });
                    }); });
                    return [4 /*yield*/, refHelper.getCheckoutInfo(git, 'my/branch', '')];
                case 1:
                    checkoutInfo = _a.sent();
                    expect(checkoutInfo.ref).toBe('my/branch');
                    expect(checkoutInfo.startPoint).toBe('refs/remotes/origin/my/branch');
                    return [2 /*return*/];
            }
        });
    }); });
    it('getCheckoutInfo unqualified tag only', function () { return __awaiter(void 0, void 0, void 0, function () {
        var checkoutInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    git.branchExists = jest.fn(function (remote, pattern) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        });
                    }); });
                    git.tagExists = jest.fn(function (pattern) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, true];
                        });
                    }); });
                    return [4 /*yield*/, refHelper.getCheckoutInfo(git, 'my-tag', '')];
                case 1:
                    checkoutInfo = _a.sent();
                    expect(checkoutInfo.ref).toBe('refs/tags/my-tag');
                    expect(checkoutInfo.startPoint).toBeFalsy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('getCheckoutInfo unqualified ref only, not a branch or tag', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    git.branchExists = jest.fn(function (remote, pattern) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        });
                    }); });
                    git.tagExists = jest.fn(function (pattern) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        });
                    }); });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, refHelper.getCheckoutInfo(git, 'my-ref', '')];
                case 2:
                    _b.sent();
                    throw new Error('Should not reach here');
                case 3:
                    err_3 = _b.sent();
                    expect((_a = err_3) === null || _a === void 0 ? void 0 : _a.message).toBe("A branch or tag with the name 'my-ref' could not be found");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('getRefSpec requires ref or commit', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            assert.throws(function () { return refHelper.getRefSpec('', ''); }, /Args ref and commit cannot both be empty/);
            return [2 /*return*/];
        });
    }); });
    it('getRefSpec sha + refs/heads/', function () { return __awaiter(void 0, void 0, void 0, function () {
        var refSpec;
        return __generator(this, function (_a) {
            refSpec = refHelper.getRefSpec('refs/heads/my/branch', commit);
            expect(refSpec.length).toBe(1);
            expect(refSpec[0]).toBe("+" + commit + ":refs/remotes/origin/my/branch");
            return [2 /*return*/];
        });
    }); });
    it('getRefSpec sha + refs/pull/', function () { return __awaiter(void 0, void 0, void 0, function () {
        var refSpec;
        return __generator(this, function (_a) {
            refSpec = refHelper.getRefSpec('refs/pull/123/merge', commit);
            expect(refSpec.length).toBe(1);
            expect(refSpec[0]).toBe("+" + commit + ":refs/remotes/pull/123/merge");
            return [2 /*return*/];
        });
    }); });
    it('getRefSpec sha + refs/tags/', function () { return __awaiter(void 0, void 0, void 0, function () {
        var refSpec;
        return __generator(this, function (_a) {
            refSpec = refHelper.getRefSpec('refs/tags/my-tag', commit);
            expect(refSpec.length).toBe(1);
            expect(refSpec[0]).toBe("+" + commit + ":refs/tags/my-tag");
            return [2 /*return*/];
        });
    }); });
    it('getRefSpec sha only', function () { return __awaiter(void 0, void 0, void 0, function () {
        var refSpec;
        return __generator(this, function (_a) {
            refSpec = refHelper.getRefSpec('', commit);
            expect(refSpec.length).toBe(1);
            expect(refSpec[0]).toBe(commit);
            return [2 /*return*/];
        });
    }); });
    it('getRefSpec unqualified ref only', function () { return __awaiter(void 0, void 0, void 0, function () {
        var refSpec;
        return __generator(this, function (_a) {
            refSpec = refHelper.getRefSpec('my-ref', '');
            expect(refSpec.length).toBe(2);
            expect(refSpec[0]).toBe('+refs/heads/my-ref*:refs/remotes/origin/my-ref*');
            expect(refSpec[1]).toBe('+refs/tags/my-ref*:refs/tags/my-ref*');
            return [2 /*return*/];
        });
    }); });
    it('getRefSpec refs/heads/ only', function () { return __awaiter(void 0, void 0, void 0, function () {
        var refSpec;
        return __generator(this, function (_a) {
            refSpec = refHelper.getRefSpec('refs/heads/my/branch', '');
            expect(refSpec.length).toBe(1);
            expect(refSpec[0]).toBe('+refs/heads/my/branch:refs/remotes/origin/my/branch');
            return [2 /*return*/];
        });
    }); });
    it('getRefSpec refs/pull/ only', function () { return __awaiter(void 0, void 0, void 0, function () {
        var refSpec;
        return __generator(this, function (_a) {
            refSpec = refHelper.getRefSpec('refs/pull/123/merge', '');
            expect(refSpec.length).toBe(1);
            expect(refSpec[0]).toBe('+refs/pull/123/merge:refs/remotes/pull/123/merge');
            return [2 /*return*/];
        });
    }); });
    it('getRefSpec refs/tags/ only', function () { return __awaiter(void 0, void 0, void 0, function () {
        var refSpec;
        return __generator(this, function (_a) {
            refSpec = refHelper.getRefSpec('refs/tags/my-tag', '');
            expect(refSpec.length).toBe(1);
            expect(refSpec[0]).toBe('+refs/tags/my-tag:refs/tags/my-tag');
            return [2 /*return*/];
        });
    }); });
});
