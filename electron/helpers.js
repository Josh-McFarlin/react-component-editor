const { dialog, BrowserWindow } = require('electron');
const fs = require('fs');


exports.openDirectorySelector = () => {
    dialog.showOpenDialog(
        {
            properties: [ 'openDirectory']
        },
        (directories) => {
            if (directories === undefined) return;

            if (directories.length > 0) {
                let path = directories[0];

                fs.readdir(path, (err, files) => {
                    let fileNames = files.filter(filename => filename.match(/.jsx?$/));

                    BrowserWindow.getFocusedWindow().webContents.send('getFileNames', {
                        path,
                        fileNames
                    });
                });
            }
        }
    );
};

exports.readFile = (event, filePath) => {
    fs.readFile(filePath, "utf8", (err, content) => {
        if (err) throw err;

        event.sender.send('readFileReply', content);
    });
};