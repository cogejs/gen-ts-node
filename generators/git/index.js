"use strict";
const path = require("path");
const gitRemoteOriginUrl = require("git-remote-origin-url");
const coge_generator_1 = require("coge-generator");
const folder = path.basename(process.cwd()).replace(/[\/@\s\+%:\.]+?/g, '-');
class GitTemplate extends coge_generator_1.Template {
    constructor(opts) {
        super(opts);
        this._cwd = opts.cwd || process.cwd();
    }
    async init() {
        try {
            this._originUrl = await gitRemoteOriginUrl(this._cwd);
        }
        catch (e) {
        }
        if (this._originUrl) {
            this.log('Current project is already git repository. Skipped.');
            return false;
        }
    }
    async questions() {
        return [{
                type: 'input',
                name: 'provider',
                message: "Git provider",
                default: 'github.com'
            }, {
                type: 'input',
                name: 'account',
                message: "Git username or organization",
                default: await this.user.github.username(),
            }, {
                type: 'input',
                name: 'repositoryName',
                message: "Name of the repository",
                default: await this._detectRepositoryName(),
            }];
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
    async locals(locals) {
        this._locals = locals;
        return locals;
    }
    async end() {
        let originUrl = '';
        try {
            originUrl = await gitRemoteOriginUrl(this._cwd);
        }
        catch (e) {
        }
        const repository = originUrl || `${this._locals.account}/${this._locals.repositoryName}`;
        const pkg = this._readPkg();
        if (pkg) {
            pkg.repository = repository;
            this._writePkg(pkg);
        }
        await this.spawn('git', ['init', '--quiet'], {
            cwd: this._cwd
        });
        if (repository && !originUrl) {
            let repoSSH = repository;
            if (repository && repository.indexOf('.git') === -1) {
                repoSSH = `git@${this._locals.provider}:${repository}.git`;
            }
            await this.spawn('git', ['remote', 'add', 'origin', repoSSH], {
                cwd: this._cwd
            });
        }
    }
}
module.exports = GitTemplate;
