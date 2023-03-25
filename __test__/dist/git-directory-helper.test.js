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
var fs = require("fs");
var gitDirectoryHelper = require("../lib/git-directory-helper");
var io = require("@actions/io");
var path = require("path");
var testWorkspace = path.join(__dirname, '_temp', 'git-directory-helper');
var repositoryPath;
var repositoryUrl;
var clean;
var ref;
var git;
describe('git-directory-helper tests', function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Clear test workspace
                return [4 /*yield*/, io.rmRF(testWorkspace)];
                case 1:
                    // Clear test workspace
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () {
        // Mock error/warning/info/debug
        jest.spyOn(core, 'error').mockImplementation(jest.fn());
        jest.spyOn(core, 'warning').mockImplementation(jest.fn());
        jest.spyOn(core, 'info').mockImplementation(jest.fn());
        jest.spyOn(core, 'debug').mockImplementation(jest.fn());
    });
    afterEach(function () {
        // Unregister mocks
        jest.restoreAllMocks();
    });
    var cleansWhenCleanTrue = 'cleans when clean true';
    it(cleansWhenCleanTrue, function () { return __awaiter(void 0, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(cleansWhenCleanTrue)];
                case 1:
                    // Arrange
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')
                        // Act
                    ];
                case 2:
                    _a.sent();
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 4:
                    files = _a.sent();
                    expect(files.sort()).toEqual(['.git', 'my-file']);
                    expect(git.tryClean).toHaveBeenCalled();
                    expect(git.tryReset).toHaveBeenCalled();
                    expect(core.warning).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    var checkoutDetachWhenNotDetached = 'checkout detach when not detached';
    it(checkoutDetachWhenNotDetached, function () { return __awaiter(void 0, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(checkoutDetachWhenNotDetached)];
                case 1:
                    // Arrange
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')
                        // Act
                    ];
                case 2:
                    _a.sent();
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 4:
                    files = _a.sent();
                    expect(files.sort()).toEqual(['.git', 'my-file']);
                    expect(git.checkoutDetach).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    var doesNotCheckoutDetachWhenNotAlreadyDetached = 'does not checkout detach when already detached';
    it(doesNotCheckoutDetachWhenNotAlreadyDetached, function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockIsDetached, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(doesNotCheckoutDetachWhenNotAlreadyDetached)];
                case 1:
                    // Arrange
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')];
                case 2:
                    _a.sent();
                    mockIsDetached = git.isDetached;
                    mockIsDetached.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, true];
                        });
                    }); });
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 4:
                    files = _a.sent();
                    expect(files.sort()).toEqual(['.git', 'my-file']);
                    expect(git.checkoutDetach).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    var doesNotCleanWhenCleanFalse = 'does not clean when clean false';
    it(doesNotCleanWhenCleanFalse, function () { return __awaiter(void 0, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(doesNotCleanWhenCleanFalse)];
                case 1:
                    // Arrange
                    _a.sent();
                    clean = false;
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')
                        // Act
                    ];
                case 2:
                    _a.sent();
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 4:
                    files = _a.sent();
                    expect(files.sort()).toEqual(['.git', 'my-file']);
                    expect(git.isDetached).toHaveBeenCalled();
                    expect(git.branchList).toHaveBeenCalled();
                    expect(core.warning).not.toHaveBeenCalled();
                    expect(git.tryClean).not.toHaveBeenCalled();
                    expect(git.tryReset).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    var removesContentsWhenCleanFails = 'removes contents when clean fails';
    it(removesContentsWhenCleanFails, function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockTryClean, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(removesContentsWhenCleanFails)];
                case 1:
                    // Arrange
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')];
                case 2:
                    _a.sent();
                    mockTryClean = git.tryClean;
                    mockTryClean.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        });
                    }); });
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 4:
                    files = _a.sent();
                    expect(files).toHaveLength(0);
                    expect(git.tryClean).toHaveBeenCalled();
                    expect(core.warning).toHaveBeenCalled();
                    expect(git.tryReset).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    var removesContentsWhenDifferentRepositoryUrl = 'removes contents when different repository url';
    it(removesContentsWhenDifferentRepositoryUrl, function () { return __awaiter(void 0, void 0, void 0, function () {
        var differentRepositoryUrl, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(removesContentsWhenDifferentRepositoryUrl)];
                case 1:
                    // Arrange
                    _a.sent();
                    clean = false;
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')];
                case 2:
                    _a.sent();
                    differentRepositoryUrl = 'https://github.com/my-different-org/my-different-repo';
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, differentRepositoryUrl, clean, ref)
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 4:
                    files = _a.sent();
                    expect(files).toHaveLength(0);
                    expect(core.warning).not.toHaveBeenCalled();
                    expect(git.isDetached).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    var removesContentsWhenNoGitDirectory = 'removes contents when no git directory';
    it(removesContentsWhenNoGitDirectory, function () { return __awaiter(void 0, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(removesContentsWhenNoGitDirectory)];
                case 1:
                    // Arrange
                    _a.sent();
                    clean = false;
                    return [4 /*yield*/, io.rmRF(path.join(repositoryPath, '.git'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')
                        // Act
                    ];
                case 3:
                    _a.sent();
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 4:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 5:
                    files = _a.sent();
                    expect(files).toHaveLength(0);
                    expect(core.warning).not.toHaveBeenCalled();
                    expect(git.isDetached).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    var removesContentsWhenResetFails = 'removes contents when reset fails';
    it(removesContentsWhenResetFails, function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockTryReset, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(removesContentsWhenResetFails)];
                case 1:
                    // Arrange
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')];
                case 2:
                    _a.sent();
                    mockTryReset = git.tryReset;
                    mockTryReset.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        });
                    }); });
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 4:
                    files = _a.sent();
                    expect(files).toHaveLength(0);
                    expect(git.tryClean).toHaveBeenCalled();
                    expect(git.tryReset).toHaveBeenCalled();
                    expect(core.warning).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    var removesContentsWhenUndefinedGitCommandManager = 'removes contents when undefined git command manager';
    it(removesContentsWhenUndefinedGitCommandManager, function () { return __awaiter(void 0, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(removesContentsWhenUndefinedGitCommandManager)];
                case 1:
                    // Arrange
                    _a.sent();
                    clean = false;
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')
                        // Act
                    ];
                case 2:
                    _a.sent();
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(undefined, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 4:
                    files = _a.sent();
                    expect(files).toHaveLength(0);
                    expect(core.warning).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    var removesLocalBranches = 'removes local branches';
    it(removesLocalBranches, function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockBranchList, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(removesLocalBranches)];
                case 1:
                    // Arrange
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')];
                case 2:
                    _a.sent();
                    mockBranchList = git.branchList;
                    mockBranchList.mockImplementation(function (remote) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, remote ? [] : ['local-branch-1', 'local-branch-2']];
                        });
                    }); });
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 4:
                    files = _a.sent();
                    expect(files.sort()).toEqual(['.git', 'my-file']);
                    expect(git.branchDelete).toHaveBeenCalledWith(false, 'local-branch-1');
                    expect(git.branchDelete).toHaveBeenCalledWith(false, 'local-branch-2');
                    return [2 /*return*/];
            }
        });
    }); });
    var removesLockFiles = 'removes lock files';
    it(removesLockFiles, function () { return __awaiter(void 0, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(removesLockFiles)];
                case 1:
                    // Arrange
                    _a.sent();
                    clean = false;
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, '.git', 'index.lock'), '')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, '.git', 'shallow.lock'), '')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')
                        // Act
                    ];
                case 4:
                    _a.sent();
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 5:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(path.join(repositoryPath, '.git'))];
                case 6:
                    files = _a.sent();
                    expect(files).toHaveLength(0);
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 7:
                    files = _a.sent();
                    expect(files.sort()).toEqual(['.git', 'my-file']);
                    expect(git.isDetached).toHaveBeenCalled();
                    expect(git.branchList).toHaveBeenCalled();
                    expect(core.warning).not.toHaveBeenCalled();
                    expect(git.tryClean).not.toHaveBeenCalled();
                    expect(git.tryReset).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    var removesAncestorRemoteBranch = 'removes ancestor remote branch';
    it(removesAncestorRemoteBranch, function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockBranchList, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(removesAncestorRemoteBranch)];
                case 1:
                    // Arrange
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')];
                case 2:
                    _a.sent();
                    mockBranchList = git.branchList;
                    mockBranchList.mockImplementation(function (remote) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, remote ? ['origin/remote-branch-1', 'origin/remote-branch-2'] : []];
                        });
                    }); });
                    ref = 'remote-branch-1/conflict';
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 4:
                    files = _a.sent();
                    expect(files.sort()).toEqual(['.git', 'my-file']);
                    expect(git.branchDelete).toHaveBeenCalledTimes(1);
                    expect(git.branchDelete).toHaveBeenCalledWith(true, 'origin/remote-branch-1');
                    return [2 /*return*/];
            }
        });
    }); });
    var removesDescendantRemoteBranches = 'removes descendant remote branch';
    it(removesDescendantRemoteBranches, function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockBranchList, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Arrange
                return [4 /*yield*/, setup(removesDescendantRemoteBranches)];
                case 1:
                    // Arrange
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(path.join(repositoryPath, 'my-file'), '')];
                case 2:
                    _a.sent();
                    mockBranchList = git.branchList;
                    mockBranchList.mockImplementation(function (remote) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, remote
                                    ? ['origin/remote-branch-1/conflict', 'origin/remote-branch-2']
                                    : []];
                        });
                    }); });
                    ref = 'remote-branch-1';
                    // Act
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref)
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 4:
                    files = _a.sent();
                    expect(files.sort()).toEqual(['.git', 'my-file']);
                    expect(git.branchDelete).toHaveBeenCalledTimes(1);
                    expect(git.branchDelete).toHaveBeenCalledWith(true, 'origin/remote-branch-1/conflict');
                    return [2 /*return*/];
            }
        });
    }); });
});
function setup(testName) {
    return __awaiter(this, void 0, Promise, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testName = testName.replace(/[^a-zA-Z0-9_]+/g, '-');
                    // Repository directory
                    repositoryPath = path.join(testWorkspace, testName);
                    return [4 /*yield*/, fs.promises.mkdir(path.join(repositoryPath, '.git'), { recursive: true })
                        // Repository URL
                    ];
                case 1:
                    _a.sent();
                    // Repository URL
                    repositoryUrl = 'https://github.com/my-org/my-repo';
                    // Clean
                    clean = true;
                    // Ref
                    ref = '';
                    // Git command manager
                    git = {
                        branchDelete: jest.fn(),
                        branchExists: jest.fn(),
                        branchList: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, []];
                            });
                        }); }),
                        checkout: jest.fn(),
                        checkoutDetach: jest.fn(),
                        config: jest.fn(),
                        configExists: jest.fn(),
                        fetch: jest.fn(),
                        getDefaultBranch: jest.fn(),
                        getWorkingDirectory: jest.fn(function () { return repositoryPath; }),
                        init: jest.fn(),
                        isDetached: jest.fn(),
                        lfsFetch: jest.fn(),
                        lfsInstall: jest.fn(),
                        log1: jest.fn(),
                        remoteAdd: jest.fn(),
                        removeEnvironmentVariable: jest.fn(),
                        revParse: jest.fn(),
                        setEnvironmentVariable: jest.fn(),
                        shaExists: jest.fn(),
                        submoduleForeach: jest.fn(),
                        submoduleSync: jest.fn(),
                        submoduleUpdate: jest.fn(),
                        tagExists: jest.fn(),
                        tryClean: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, true];
                            });
                        }); }),
                        tryConfigUnset: jest.fn(),
                        tryDisableAutomaticGarbageCollection: jest.fn(),
                        tryGetFetchUrl: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // Sanity check - this function shouldn't be called when the .git directory doesn't exist
                                    return [4 /*yield*/, fs.promises.stat(path.join(repositoryPath, '.git'))];
                                    case 1:
                                        // Sanity check - this function shouldn't be called when the .git directory doesn't exist
                                        _a.sent();
                                        return [2 /*return*/, repositoryUrl];
                                }
                            });
                        }); }),
                        tryReset: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, true];
                            });
                        }); })
                    };
                    return [2 /*return*/];
            }
        });
    });
}
