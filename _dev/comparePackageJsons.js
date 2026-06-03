#!/usr/bin/env node
// neuroslop
// from root:
//   node ./_dev/comparePackageJsons.js --file ./planar-asclepius/package.json --file ./planar-prism/package.json --file ./planar-shared/package.json --file ./planar-shell/package.json

const fs = require('fs');
const path = require('path');

function getFilePaths() {
    const args = process.argv.slice(2);
    const files = [];
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--file' && args[i + 1]) {
            files.push(args[i + 1]);
            i++;
        }
    }
    return files;
}

// Load and parse package.json
function loadPackageJson(filePath) {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
        console.error(`❌ File not found: ${absolutePath}`);
        return null;
    }

    try {
        const content = fs.readFileSync(absolutePath, 'utf8');
        const data = JSON.parse(content);
        return {
            path: absolutePath,
            name: data.name || path.basename(path.dirname(absolutePath)),
            dependencies: data.dependencies || {},
            devDependencies: data.devDependencies || {}
        };
    } catch (err) {
        console.error(`❌ Failed to parse ${absolutePath}: ${err.message}`);
        return null;
    }
}

function compareDependencies(packages) {
    const depMap = new Map(); // dependency name -> Map of version -> array of package paths

    // Collect all dependencies and devDependencies
    packages.forEach(pkg => {
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

        Object.entries(allDeps).forEach(([depName, version]) => {
            if (!depMap.has(depName)) {
                depMap.set(depName, new Map());
            }
            const versionMap = depMap.get(depName);
            if (!versionMap.has(version)) {
                versionMap.set(version, []);
            }
            versionMap.get(version).push({ path: pkg.path, name: pkg.name });
        });
    });

    let hasMismatches = false;
    for (const [depName, versionMap] of depMap.entries()) {
        if (versionMap.size > 1) {
            hasMismatches = true;
            console.log(`MISMATCH: ${depName}`);
            for (const [version, locations] of versionMap.entries()) {
                console.log(`   ${version}:`);
                locations.forEach(loc => {
                    console.log(`     → ${loc.name} (${loc.path})`);
                });
            }
        }
    }

    if (!hasMismatches) {
        console.log('Good.');
    } else {
        console.log('BAD.');
    }
}

// Main execution
function main() {
    const filePaths = getFilePaths();

    if (filePaths.length < 2) {
        console.error('❌ Error: At least 2 package.json files required');
        console.error('Usage: node index.js --file ./foo/package.json --file ./bar/package.json');
        process.exit(1);
    }

    const packages = [];
    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i];
      const pkg = loadPackageJson(filePath);
        if (pkg) {
            packages.push(pkg);
            console.log(`Loaded ${i}/${filePaths.length}: ${pkg.name} (${pkg.path})`);
        }
    }

    if (packages.length < 2) {
        console.error('❌ Error: Need at least 2 valid package.json files to compare');
        process.exit(1);
    }

    compareDependencies(packages);
}

// Run it
main();
