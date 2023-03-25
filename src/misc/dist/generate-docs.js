"use strict";
exports.__esModule = true;
var fs = require("fs");
var os = require("os");
var path = require("path");
var yaml = require("js-yaml");
//
// SUMMARY
//
// This script rebuilds the usage section in the README.md to be consistent with the action.yml
function updateUsage(actionReference, actionYamlPath, readmePath, startToken, endToken) {
    if (actionYamlPath === void 0) { actionYamlPath = 'action.yml'; }
    if (readmePath === void 0) { readmePath = 'README.md'; }
    if (startToken === void 0) { startToken = '<!-- start usage -->'; }
    if (endToken === void 0) { endToken = '<!-- end usage -->'; }
    if (!actionReference) {
        throw new Error('Parameter actionReference must not be empty');
    }
    // Load the action.yml
    var actionYaml = yaml.safeLoad(fs.readFileSync(actionYamlPath).toString());
    // Load the README
    var originalReadme = fs.readFileSync(readmePath).toString();
    // Find the start token
    var startTokenIndex = originalReadme.indexOf(startToken);
    if (startTokenIndex < 0) {
        throw new Error("Start token '" + startToken + "' not found");
    }
    // Find the end token
    var endTokenIndex = originalReadme.indexOf(endToken);
    if (endTokenIndex < 0) {
        throw new Error("End token '" + endToken + "' not found");
    }
    else if (endTokenIndex < startTokenIndex) {
        throw new Error('Start token must appear before end token');
    }
    // Build the new README
    var newReadme = [];
    // Append the beginning
    newReadme.push(originalReadme.substr(0, startTokenIndex + startToken.length));
    // Build the new usage section
    newReadme.push('```yaml', "- uses: " + actionReference, '  with:');
    var inputs = actionYaml.inputs;
    var firstInput = true;
    for (var _i = 0, _a = Object.keys(inputs); _i < _a.length; _i++) {
        var key = _a[_i];
        var input = inputs[key];
        // Line break between inputs
        if (!firstInput) {
            newReadme.push('');
        }
        // Constrain the width of the description
        var width = 80;
        var description = input.description
            .trimRight()
            .replace(/\r\n/g, '\n') // Convert CR to LF
            .replace(/ +/g, ' ') //    Squash consecutive spaces
            .replace(/ \n/g, '\n'); //  Squash space followed by newline
        while (description) {
            // Longer than width? Find a space to break apart
            var segment = description;
            if (description.length > width) {
                segment = description.substr(0, width + 1);
                while (!segment.endsWith(' ') && !segment.endsWith('\n') && segment) {
                    segment = segment.substr(0, segment.length - 1);
                }
                // Trimmed too much?
                if (segment.length < width * 0.67) {
                    segment = description;
                }
            }
            else {
                segment = description;
            }
            // Check for newline
            var newlineIndex = segment.indexOf('\n');
            if (newlineIndex >= 0) {
                segment = segment.substr(0, newlineIndex + 1);
            }
            // Append segment
            newReadme.push(("    # " + segment).trimRight());
            // Remaining
            description = description.substr(segment.length);
        }
        if (input["default"] !== undefined) {
            // Append blank line if description had paragraphs
            if (input.description.trimRight().match(/\n[ ]*\r?\n/)) {
                newReadme.push("    #");
            }
            // Default
            newReadme.push("    # Default: " + input["default"]);
        }
        // Input name
        newReadme.push("    " + key + ": ''");
        firstInput = false;
    }
    newReadme.push('```');
    // Append the end
    newReadme.push(originalReadme.substr(endTokenIndex));
    // Write the new README
    fs.writeFileSync(readmePath, newReadme.join(os.EOL));
}
updateUsage('actions/checkout@v3', path.join(__dirname, '..', '..', 'action.yml'), path.join(__dirname, '..', '..', 'README.md'));
