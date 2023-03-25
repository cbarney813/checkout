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
var core = require("@actions/core");
var retry_helper_1 = require("../lib/retry-helper");
var info;
var retryHelper;
describe('retry-helper tests', function () {
    beforeAll(function () {
        // Mock @actions/core info()
        jest.spyOn(core, 'info').mockImplementation(function (message) {
            info.push(message);
        });
        retryHelper = new retry_helper_1.RetryHelper(3, 0, 0);
    });
    beforeEach(function () {
        // Reset info
        info = [];
    });
    afterAll(function () {
        // Restore
        jest.restoreAllMocks();
    });
    it('first attempt succeeds', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, retryHelper.execute(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, 'some result'];
                        });
                    }); })];
                case 1:
                    actual = _a.sent();
                    expect(actual).toBe('some result');
                    expect(info).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('second attempt succeeds', function () { return __awaiter(void 0, void 0, void 0, function () {
        var attempts, actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempts = 0;
                    return [4 /*yield*/, retryHelper.execute(function () {
                            if (++attempts == 1) {
                                throw new Error('some error');
                            }
                            return Promise.resolve('some result');
                        })];
                case 1:
                    actual = _a.sent();
                    expect(attempts).toBe(2);
                    expect(actual).toBe('some result');
                    expect(info).toHaveLength(2);
                    expect(info[0]).toBe('some error');
                    expect(info[1]).toMatch(/Waiting .+ seconds before trying again/);
                    return [2 /*return*/];
            }
        });
    }); });
    it('third attempt succeeds', function () { return __awaiter(void 0, void 0, void 0, function () {
        var attempts, actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempts = 0;
                    return [4 /*yield*/, retryHelper.execute(function () {
                            if (++attempts < 3) {
                                throw new Error("some error " + attempts);
                            }
                            return Promise.resolve('some result');
                        })];
                case 1:
                    actual = _a.sent();
                    expect(attempts).toBe(3);
                    expect(actual).toBe('some result');
                    expect(info).toHaveLength(4);
                    expect(info[0]).toBe('some error 1');
                    expect(info[1]).toMatch(/Waiting .+ seconds before trying again/);
                    expect(info[2]).toBe('some error 2');
                    expect(info[3]).toMatch(/Waiting .+ seconds before trying again/);
                    return [2 /*return*/];
            }
        });
    }); });
    it('all attempts fail succeeds', function () { return __awaiter(void 0, void 0, void 0, function () {
        var attempts, error, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempts = 0;
                    error = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, retryHelper.execute(function () {
                            throw new Error("some error " + ++attempts);
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    error = err_1;
                    return [3 /*break*/, 4];
                case 4:
                    expect(error.message).toBe('some error 3');
                    expect(attempts).toBe(3);
                    expect(info).toHaveLength(4);
                    expect(info[0]).toBe('some error 1');
                    expect(info[1]).toMatch(/Waiting .+ seconds before trying again/);
                    expect(info[2]).toBe('some error 2');
                    expect(info[3]).toMatch(/Waiting .+ seconds before trying again/);
                    return [2 /*return*/];
            }
        });
    }); });
});
