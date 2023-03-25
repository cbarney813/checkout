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
exports.execute = exports.RetryHelper = void 0;
var core = require("@actions/core");
var defaultMaxAttempts = 3;
var defaultMinSeconds = 10;
var defaultMaxSeconds = 20;
var RetryHelper = /** @class */ (function () {
    function RetryHelper(maxAttempts, minSeconds, maxSeconds) {
        if (maxAttempts === void 0) { maxAttempts = defaultMaxAttempts; }
        if (minSeconds === void 0) { minSeconds = defaultMinSeconds; }
        if (maxSeconds === void 0) { maxSeconds = defaultMaxSeconds; }
        this.maxAttempts = maxAttempts;
        this.minSeconds = Math.floor(minSeconds);
        this.maxSeconds = Math.floor(maxSeconds);
        if (this.minSeconds > this.maxSeconds) {
            throw new Error('min seconds should be less than or equal to max seconds');
        }
    }
    RetryHelper.prototype.execute = function (action) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var attempt, err_1, seconds;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        attempt = 1;
                        _b.label = 1;
                    case 1:
                        if (!(attempt < this.maxAttempts)) return [3 /*break*/, 7];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, action()];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        err_1 = _b.sent();
                        core.info((_a = err_1) === null || _a === void 0 ? void 0 : _a.message);
                        return [3 /*break*/, 5];
                    case 5:
                        seconds = this.getSleepAmount();
                        core.info("Waiting " + seconds + " seconds before trying again");
                        return [4 /*yield*/, this.sleep(seconds)];
                    case 6:
                        _b.sent();
                        attempt++;
                        return [3 /*break*/, 1];
                    case 7: return [4 /*yield*/, action()];
                    case 8: 
                    // Last attempt
                    return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    RetryHelper.prototype.getSleepAmount = function () {
        return (Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) +
            this.minSeconds);
    };
    RetryHelper.prototype.sleep = function (seconds) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, seconds * 1000); })];
            });
        });
    };
    return RetryHelper;
}());
exports.RetryHelper = RetryHelper;
function execute(action) {
    return __awaiter(this, void 0, Promise, function () {
        var retryHelper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    retryHelper = new RetryHelper();
                    return [4 /*yield*/, retryHelper.execute(action)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.execute = execute;
