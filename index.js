'use strict';
const escapeStringRegexp = require('escape-string-regexp');
const ansiStyles = require('ansi-styles');
const {stdout: stdoutColor} = require('supports-color');
const template = require('./templates.js');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m'
];

const stringReplaceAll = (str, substr, replacer) => {
	let idx = str.indexOf(substr);
	if (idx === -1) {
		return str;
	}

	const subLen = substr.length;
	let end = 0;
	let res = '';
	do {
		res += str.substr(end, idx - end) + replacer;
		end = idx + subLen;
		idx = str.indexOf(substr, end);
	} while (idx !== -1);

	res += str.substr(end);
	return res;
};

const stringEncaseCRLF = (str, prefix, postfix) => {
	let idx = str.indexOf('\n');
	if (idx === -1) {
		return str;
	}

	let end = 0;
	let res = '';
	do {
		const gotCR = str[idx - 1] === '\r';
		res += str.substr(end, (gotCR ? idx - 1 : idx) - end) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		end = idx + 1;
		idx = str.indexOf('\n', end);
	} while (idx !== -1);

	res += str.substr(end);
	return res;
};

// `color-convert` models to exclude from the Chalk API due to conflicts and such
const skipModels = new Set(['gray']);

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level > 3 || options.level < 0) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
	object.enabled = 'enabled' in options ? options.enabled : object.level > 0;
};

class ChalkClass {
	constructor(options) {
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = {};
	applyOptions(chalk, options);

	chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_);

	Object.setPrototypeOf(chalk, Chalk.prototype);
	Object.setPrototypeOf(chalk.template, chalk);

	chalk.template.constructor = () => {
		throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
	};

	chalk.template.Instance = ChalkClass;

	return chalk.template;
};

function Chalk(options) {
	return chalkFactory(options);
}

for (const [styleName, style] of Object.entries(ansiStyles)) {
	style.closeRe = new RegExp(escapeStringRegexp(style.close), 'g');

	styles[styleName] = {
		get() {
			return createBuilder(this, [...(this._styles || []), style], this._isEmpty);
		}
	};
}

styles.visible = {
	get() {
		return createBuilder(this, this._styles || [], true);
	}
};

ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), 'g');
for (const model of Object.keys(ansiStyles.color.ansi)) {
	if (skipModels.has(model)) {
		continue;
	}

	styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const open = ansiStyles.color[levelMapping[level]][model](...arguments_);
				const codes = {
					open,
					close: ansiStyles.color.close,
					closeRe: ansiStyles.color.closeRe
				};
				return createBuilder(this, [...(this._styles || []), codes], this._isEmpty);
			};
		}
	};
}

ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), 'g');
for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
	if (skipModels.has(model)) {
		continue;
	}

	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const open = ansiStyles.bgColor[levelMapping[level]][model](...arguments_);
				const codes = {
					open,
					close: ansiStyles.bgColor.close,
					closeRe: ansiStyles.bgColor.closeRe
				};
				return createBuilder(this, [...(this._styles || []), codes], this._isEmpty);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this._generator.level;
		},
		set(level) {
			this._generator.level = level;
		}
	},
	enabled: {
		enumerable: true,
		get() {
			return this._generator.enabled;
		},
		set(enabled) {
			this._generator.enabled = enabled;
		}
	}
});

const createBuilder = (self, _styles, _isEmpty) => {
	const builder = (...arguments_) => {
		// eslint-disable-next-line no-implicit-coercion
		return applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));
	};

	// `__proto__` is used because we must return a function, but there is
	// no way to create a function with a different prototype
	builder.__proto__ = proto; // eslint-disable-line no-proto

	builder._generator = self;
	builder._styles = _styles;
	builder._isEmpty = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (!self.enabled || self.level <= 0 || !string) {
		return self._isEmpty ? '' : string;
	}

	for (const code of self._styles.slice().reverse()) {
		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		string = stringReplaceAll(string, code.close, code.open);

		// Close the styling before a linebreak and reopen
		// after next line to fix a bleed issue on macOS
		// https://github.com/chalk/chalk/pull/92
		string = stringEncaseCRLF(string, code.close, code.open);

		string = code.open + string + code.close;
	}

	return string;
};

const chalkTag = (chalk, ...strings) => {
	const [firstString] = strings;

	if (!Array.isArray(firstString)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return strings.join(' ');
	}

	const arguments_ = strings.slice(1);
	const parts = [firstString.raw[0]];

	for (let i = 1; i < firstString.length; i++) {
		parts.push(
			String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
			String(firstString.raw[i])
		);
	}

	return template(chalk, parts.join(''));
};

Object.defineProperties(Chalk.prototype, styles);

module.exports = Chalk(); // eslint-disable-line new-cap
module.exports.supportsColor = stdoutColor;
