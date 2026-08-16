const ts = require('typescript');
const path = require('path');

/*
 * I am tired of strugle with ghost compilation, llm just pew-pew here something, that works
 */

const canon = (filePath) => path.normalize(path.resolve(filePath)).toLowerCase();

const typecheckGhostFiles = (files) => {
  const configPath = path.join(__dirname, '..', '..', 'tsconfig.ghost.json');
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    console.error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
    process.exit(1);
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath),
  );

  const program = ts.createProgram(files, { ...parsed.options, noEmit: true });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  const errorFiles = new Set();

  for (const diagnostic of diagnostics) {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    if (diagnostic.file && diagnostic.start != null) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      console.error(`${diagnostic.file.fileName}(${line + 1},${character + 1}): error TS${diagnostic.code}: ${message}`);
      errorFiles.add(canon(diagnostic.file.fileName));
    } else {
      console.error(message);
    }
  }

  return {
    goodFiles: files.filter((file) => !errorFiles.has(canon(file))),
    errorCount: diagnostics.length,
  };
};

module.exports = { typecheckGhostFiles };
