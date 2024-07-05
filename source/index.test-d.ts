import {expectType, expectAssignable, expectError, expectDeprecated} from 'tsd';
import chalk, {
	Chalk, ChalkInstance, ColorInfo, ColorSupport, ColorSupportLevel, chalkStderr, supportsColor, supportsColorStderr, createSupportsColor,
	ModifierName, ForegroundColorName, BackgroundColorName, ColorName,
	Modifiers,
} from './index.js';

// - supportsColor -
expectType<ColorInfo>(supportsColor);
if (supportsColor) {
	expectType<ColorSupport>(supportsColor);
	expectType<ColorSupportLevel>(supportsColor.level);
	expectType<boolean>(supportsColor.hasBasic);
	expectType<boolean>(supportsColor.has256);
	expectType<boolean>(supportsColor.has16m);
}

// - stderr -
expectAssignable<ChalkInstance>(chalkStderr);
expectType<ColorInfo>(supportsColorStderr);
if (supportsColorStderr) {
	expectType<boolean>(supportsColorStderr.hasBasic);
	expectType<boolean>(supportsColorStderr.has256);
	expectType<boolean>(supportsColorStderr.has16m);
}

expectType<ColorInfo>(createSupportsColor());

// -- `supportsColorStderr` is not a member of the Chalk interface --
expectError(chalk.reset.supportsColorStderr);

// -- `supportsColor` is not a member of the Chalk interface --
expectError(chalk.reset.supportsColor);

// - Chalk -
// -- Instance --
expectType<ChalkInstance>(new Chalk({level: 1}));

// -- Properties --
expectType<ColorSupportLevel>(chalk.level);

// -- Color methods --
expectType<ChalkInstance>(chalk.rgb(0, 0, 0));
expectType<ChalkInstance>(chalk.hex('#DEADED'));
expectType<ChalkInstance>(chalk.ansi256(0));
expectType<ChalkInstance>(chalk.bgRgb(0, 0, 0));
expectType<ChalkInstance>(chalk.bgHex('#DEADED'));
expectType<ChalkInstance>(chalk.bgAnsi256(0));

// -- Modifiers --
expectType<string>(chalk.reset('foo'));
expectType<string>(chalk.bold('foo'));
expectType<string>(chalk.dim('foo'));
expectType<string>(chalk.italic('foo'));
expectType<string>(chalk.underline('foo'));
expectType<string>(chalk.overline('foo'));
expectType<string>(chalk.inverse('foo'));
expectType<string>(chalk.hidden('foo'));
expectType<string>(chalk.strikethrough('foo'));
expectType<string>(chalk.visible('foo'));
expectType<string>(chalk.reset`foo`);
expectType<string>(chalk.bold`foo`);
expectType<string>(chalk.dim`foo`);
expectType<string>(chalk.italic`foo`);
expectType<string>(chalk.underline`foo`);
expectType<string>(chalk.inverse`foo`);
expectType<string>(chalk.hidden`foo`);
expectType<string>(chalk.strikethrough`foo`);
expectType<string>(chalk.visible`foo`);

// -- Colors --
expectType<string>(chalk.black('foo'));
expectType<string>(chalk.red('foo'));
expectType<string>(chalk.green('foo'));
expectType<string>(chalk.yellow('foo'));
expectType<string>(chalk.blue('foo'));
expectType<string>(chalk.magenta('foo'));
expectType<string>(chalk.cyan('foo'));
expectType<string>(chalk.white('foo'));
expectType<string>(chalk.gray('foo'));
expectType<string>(chalk.grey('foo'));
expectType<string>(chalk.blackBright('foo'));
expectType<string>(chalk.redBright('foo'));
expectType<string>(chalk.greenBright('foo'));
expectType<string>(chalk.yellowBright('foo'));
expectType<string>(chalk.blueBright('foo'));
expectType<string>(chalk.magentaBright('foo'));
expectType<string>(chalk.cyanBright('foo'));
expectType<string>(chalk.whiteBright('foo'));
expectType<string>(chalk.bgBlack('foo'));
expectType<string>(chalk.bgRed('foo'));
expectType<string>(chalk.bgGreen('foo'));
expectType<string>(chalk.bgYellow('foo'));
expectType<string>(chalk.bgBlue('foo'));
expectType<string>(chalk.bgMagenta('foo'));
expectType<string>(chalk.bgCyan('foo'));
expectType<string>(chalk.bgWhite('foo'));
expectType<string>(chalk.bgBlackBright('foo'));
expectType<string>(chalk.bgRedBright('foo'));
expectType<string>(chalk.bgGreenBright('foo'));
expectType<string>(chalk.bgYellowBright('foo'));
expectType<string>(chalk.bgBlueBright('foo'));
expectType<string>(chalk.bgMagentaBright('foo'));
expectType<string>(chalk.bgCyanBright('foo'));
expectType<string>(chalk.bgWhiteBright('foo'));
expectType<string>(chalk.black`foo`);
expectType<string>(chalk.red`foo`);
expectType<string>(chalk.green`foo`);
expectType<string>(chalk.yellow`foo`);
expectType<string>(chalk.blue`foo`);
expectType<string>(chalk.magenta`foo`);
expectType<string>(chalk.cyan`foo`);
expectType<string>(chalk.white`foo`);
expectType<string>(chalk.gray`foo`);
expectType<string>(chalk.grey`foo`);
expectType<string>(chalk.blackBright`foo`);
expectType<string>(chalk.redBright`foo`);
expectType<string>(chalk.greenBright`foo`);
expectType<string>(chalk.yellowBright`foo`);
expectType<string>(chalk.blueBright`foo`);
expectType<string>(chalk.magentaBright`foo`);
expectType<string>(chalk.cyanBright`foo`);
expectType<string>(chalk.whiteBright`foo`);
expectType<string>(chalk.bgBlack`foo`);
expectType<string>(chalk.bgRed`foo`);
expectType<string>(chalk.bgGreen`foo`);
expectType<string>(chalk.bgYellow`foo`);
expectType<string>(chalk.bgBlue`foo`);
expectType<string>(chalk.bgMagenta`foo`);
expectType<string>(chalk.bgCyan`foo`);
expectType<string>(chalk.bgWhite`foo`);
expectType<string>(chalk.bgBlackBright`foo`);
expectType<string>(chalk.bgRedBright`foo`);
expectType<string>(chalk.bgGreenBright`foo`);
expectType<string>(chalk.bgYellowBright`foo`);
expectType<string>(chalk.bgBlueBright`foo`);
expectType<string>(chalk.bgMagentaBright`foo`);
expectType<string>(chalk.bgCyanBright`foo`);
expectType<string>(chalk.bgWhiteBright`foo`);

// -- Complex --
expectType<string>(chalk.red.bgGreen.underline('foo'));
expectType<string>(chalk.underline.red.bgGreen('foo'));

// -- Complex template literal --
expectType<string>(chalk.underline``);
expectType<string>(chalk.red.bgGreen.bold`Hello {italic.blue ${name}}`);
expectType<string>(chalk.strikethrough.cyanBright.bgBlack`Works with {reset {bold numbers}} {bold.red ${1}}`);

// -- Modifiers types
expectAssignable<ModifierName>('strikethrough');
expectError<ModifierName>('delete');

// -- Foreground types
expectAssignable<ForegroundColorName>('red');
expectError<ForegroundColorName>('pink');

// -- Background types
expectAssignable<BackgroundColorName>('bgRed');
expectError<BackgroundColorName>('bgPink');

// -- Color types --
expectAssignable<ColorName>('red');
expectAssignable<ColorName>('bgRed');
expectError<ColorName>('hotpink');
expectError<ColorName>('bgHotpink');
