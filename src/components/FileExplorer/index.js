import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from "@material-ui/core/Grid/Grid";


const style = () => ({
    paper: {
        width: "100%",
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto"
    },
    list: {
        width: "100%"
    }
});

class FileExplorer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            path: undefined,
            fileNames: []
        };

        this.setFileNames = this.setFileNames.bind(this);
        this.readFile = this.readFile.bind(this);
    }

    setFileNames(event, filesAndPath) {
        console.log("Updating files in file explorer.");

        this.setState(filesAndPath);
    }

    readFile(fileName) {
        const { path } = this.state;

        if (this.ipcRenderer != null && path != null) {
            let filePath = `${path}/${fileName}`;

            console.log("Sending request to read file: " + filePath);
            this.ipcRenderer.send('readFile', filePath);
        }
    }

    componentDidMount() {
        if (typeof window.require === "function") {
            this.electron = window.require('electron');

            this.fs = this.electron.remote.require('fs');
            this.ipcRenderer = this.electron.ipcRenderer;

            this.ipcRenderer.on('getFileNames', this.setFileNames);

            this.ipcRenderer.on('readFileReply', (event, code) => {
                if (typeof code === 'string') {
                    this.props.codeUpdater(code);
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.ipcRenderer != null) {
            this.ipcRenderer.removeAllListeners('getFileNames');
            this.ipcRenderer.removeAllListeners('readFileReply');
        }
    }

    render() {
        const { classes } = this.props;
        const { fileNames } = this.state;

        if (window.require == null || fileNames.length === 0) {
            console.log("Browser version.");
            return null;
        } else {
            console.log("Desktop version, enabling file explorer.");
        }

        return (
            <Grid item xs={3}>
                <Paper className={classes.paper}>
                    <List className={classes.list}>
                        {
                            fileNames.map(name => (
                                <ListItem
                                    button
                                    onClick={() => this.readFile(name)}
                                    key={name}
                                >
                                    <ListItemText primary={name} />
                                </ListItem>
                            ))
                        }
                    </List>
                </Paper>
            </Grid>
        );
    }
}

export default withStyles(style)(FileExplorer);