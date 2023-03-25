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
var coreCommand = require("@actions/core/lib/command");
var gitSourceProvider = require("./git-source-provider");
var inputHelper = require("./input-helper");
var path = require("path");
var stateHelper = require("./state-helper");
function run() {
    var _a, _b;
    return __awaiter(this, void 0, Promise, function () {
        var sourceSettings, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, inputHelper.getInputs()];
                case 1:
                    sourceSettings = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 4, 5]);
                    // Register problem matcher
                    coreCommand.issueCommand('add-matcher', {}, path.join(__dirname, 'problem-matcher.json'));
                    // Get sources
                    return [4 /*yield*/, gitSourceProvider.getSource(sourceSettings)];
                case 3:
                    // Get sources
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    // Unregister problem matcher
                    coreCommand.issueCommand('remove-matcher', { owner: 'checkout-git' }, '');
                    return [7 /*endfinally*/];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _c.sent();
                    core.setFailed("" + ((_b = (_a = error_1) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : error_1));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function cleanup() {
    var _a, _b;
    return __awaiter(this, void 0, Promise, function () {
        var error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, gitSourceProvider.cleanup(stateHelper.RepositoryPath)];
                case 1:
                    _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _c.sent();
                    core.warning("" + ((_b = (_a = error_2) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : error_2));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Main
if (!stateHelper.IsPost) {
    run();
}
// Post
else {
    cleanup();
}
