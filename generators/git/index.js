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
const path = require("path");
const gitRemoteOriginUrl = require("git-remote-origin-url");
const coge_generator_1 = require("coge-generator");
const folder = path.basename(process.cwd()).replace(/[\/@\s\+%:\.]+?/g, '-');
class GitTemplate extends coge_generator_1.Template {
    constructor(opts) {
        super(opts);
        this._cwd = opts.cwd || process.cwd();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._originUrl = yield gitRemoteOriginUrl(this._cwd);
            }
            catch (e) {
            }
            if (this._originUrl) {
                this.log('Current project is already git repository. Skipped.');
                return false;
            }
        });
    }
    questions() {
        return __awaiter(this, void 0, void 0, function* () {
            return [{
                    type: 'input',
                    name: 'provider',
                    message: "Git provider",
                    default: 'github.com'
                }, {
                    type: 'input',
                    name: 'account',
                    message: "Git username or organization",
                    default: yield this.user.github.username(),
                }, {
                    type: 'input',
                    name: 'repositoryName',
                    message: "Name of the repository",
                    default: yield this._detectRepositoryName(),
                }];
        });
    }
    _detectRepositoryName() {
        const pkg = this._readPkg();
        return pkg ? pkg.name : folder;
    }
    _readPkg() {
        const pkgPath = path.resolve(this._cwd, 'package.json');
        if (!this._pkg && this.fs.existsSync(pkgPath)) {
            this._pkg = this.fs.readJsonSync(pkgPath, { throws: false, encoding: 'utf8' });
        }
        return this._pkg;
    }
    _writePkg(pkg) {
        const pkgPath = path.resolve(this._cwd, 'package.json');
        this.fs.writeJsonSync(pkgPath, pkg, {
            spaces: '\t',
            encoding: 'utf8'
        });
    }
    locals(locals) {
        return __awaiter(this, void 0, void 0, function* () {
            this._locals = locals;
            return locals;
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            let originUrl = '';
            try {
                originUrl = yield gitRemoteOriginUrl(this._cwd);
            }
            catch (e) {
            }
            const repository = originUrl || `${this._locals.account}/${this._locals.repositoryName}`;
            const pkg = this._readPkg();
            if (pkg) {
                pkg.repository = repository;
                this._writePkg(pkg);
            }
            yield this.spawn('git', ['init', '--quiet'], {
                cwd: this._cwd
            });
            if (repository && !originUrl) {
                let repoSSH = repository;
                if (repository && repository.indexOf('.git') === -1) {
                    repoSSH = `git@${this._locals.provider}:${repository}.git`;
                }
                yield this.spawn('git', ['remote', 'add', 'origin', repoSSH], {
                    cwd: this._cwd
                });
            }
        });
    }
}
module.exports = GitTemplate;
