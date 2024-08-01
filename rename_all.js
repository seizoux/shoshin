const fs = require('fs');
const path = require('path');

const convertToTS = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            convertToTS(filePath);
        } else if (path.extname(file) === '.js') {
            fs.renameSync(filePath, filePath.replace('.js', '.ts'));
        }
    });
};

// Start conversion from the js directory
convertToTS('./static/js');