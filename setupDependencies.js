
        const fs = require('fs');
        const path = require('path');

        // Calculate the absolute path to the shared node_modules directory
        const sharedNodeModulesPath = path.resolve('../../../base-app/static-app/node_modules');
        console.log('Shared Node Modules Path:', sharedNodeModulesPath);

        // Remove existing node_modules directory or link if it exists
        if (fs.existsSync('node_modules')) {
            if (fs.lstatSync('node_modules').isSymbolicLink()) {
                fs.unlinkSync('node_modules');
                console.log('Removed existing symbolic link');
            } else {
                fs.rmdirSync('node_modules', { recursive: true });
                console.log('Removed existing node_modules directory');
            }
        }

        // Create symbolic link to shared node_modules directory
        try {
            fs.symlinkSync(sharedNodeModulesPath, 'node_modules', 'junction');
            console.log('Symbolic link created successfully.');
        } catch (err) {
            if (err.code === 'EEXIST') {
                console.log('Symbolic link already exists.');
            } else {
                console.error('Error creating symbolic link:', err);
            }
        }
    