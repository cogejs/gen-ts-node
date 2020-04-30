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
const mm = require("micromatch");
const chalk = require("chalk");
const coge_generator_1 = require("coge-generator");
const pkg = require('../../package');
const appname = path.basename(process.cwd()).replace(/[\/@\s\+%:\.]+?/g, '-');
const licenses = [
    { name: 'Apache 2.0', value: 'Apache-2.0' },
    { name: 'MIT', value: 'MIT' },
    { name: 'Mozilla Public License 2.0', value: 'MPL-2.0' },
    { name: 'BSD 2-Clause (FreeBSD) License', value: 'BSD-2-Clause-FreeBSD' },
    { name: 'BSD 3-Clause (NewBSD) License', value: 'BSD-3-Clause' },
    { name: 'Internet Systems Consortium (ISC) License', value: 'ISC' },
    { name: 'GNU AGPL 3.0', value: 'AGPL-3.0' },
    { name: 'GNU GPL 3.0', value: 'GPL-3.0' },
    { name: 'GNU LGPL 3.0', value: 'LGPL-3.0' },
    { name: 'Unlicense', value: 'unlicense' },
    { name: 'No License (Copyrighted)', value: 'UNLICENSED' }
];
class AppTemplate extends coge_generator_1.Template {
    constructor(opts) {
        super(opts);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._pkg = this.fs.readJsonSync('./package.json', { throws: false });
        });
    }
    questions() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return [{
                    type: "input",
                    name: "name",
                    message: "Name of the module",
                    default: ((_a = this._pkg) === null || _a === void 0 ? void 0 : _a.name) ? this._pkg.name : appname
                }, {
                    type: "input",
                    name: "description",
                    message: "Description of the module",
                    default: ((_b = this._pkg) === null || _b === void 0 ? void 0 : _b.description) ? this._pkg.description : `${appname} library`,
                }, {
                    type: "input",
                    name: "owner",
                    message: "Full name of package owner",
                    default: this.user.git.name()
                }, {
                    type: "input",
                    name: "email",
                    message: "Email of the owner?" + chalk.gray(' (for setting package.json)'),
                    default: this.user.git.email
                }, {
                    type: "list",
                    name: "license",
                    message: "Which license do you want to use?",
                    choices: licenses,
                    default: 'MIT'
                }];
        });
    }
    locals(locals) {
        return __awaiter(this, void 0, void 0, function* () {
            locals.author = locals.owner + (locals.email ? ` <${locals.email}>` : '');
            locals.year = locals.licenceYear || new Date().getFullYear().toString();
            locals.githubUsername = yield this.user.github.username();
            locals.tsnpVersion = pkg.version;
            return locals;
        });
    }
    filter(files, locals) {
        return __awaiter(this, void 0, void 0, function* () {
            const license = locals.license || 'MIT';
            return mm(files, ['**', `!**/licenses${path.sep}*.*`, `**/licenses${path.sep}${license}.*`], {});
        });
    }
    install(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.installDependencies(opts);
        });
    }
}
module.exports = AppTemplate;
