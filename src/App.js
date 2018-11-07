import React, { Component } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import FileExplorer from "./components/FileExplorer";


const style = () => ({
    liveProvider: {
        width: "100%",
        height: "100%"
    },
    grid: {
        width: "100%",
        height: "100%",
        //maxWidth: "unset",
        flexGrow: 1
    },
    fullHeight: {
        height: "100%"
    },
    editor: {
        height: "100%",
        whiteSpace: "pre-wrap !important",
        overflowX: "hidden",
        overflowY: "auto"
    },
    error: {
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto"
    },
    preview: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        overflowY: "auto"
    }
});

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: "<strong>Hello World!</strong>"
        };

        this.setCode = this.setCode.bind(this);
    }

    setCode(code) {
        let codeImports = code.split(/[\n\r]/g).filter(line => line.startsWith('import '));
        console.log(codeImports);
        codeImports.forEach(line => {
            line = line.replace('import ', '');

            let from = 'error';

            let toImport = line.replace(/ from ['"].*['"];?/g, replaced => {
                from = replaced.match(/['"].*['"]/g)[0];
                //console.log('replaced', replaced);
                return '';
            });

            console.log('toImport', toImport);
            console.log('from', from);
        });

        this.setState({
            code
        });
    }

    render() {
        const { classes } = this.props;
        const { code } = this.state;

        return (
            <LiveProvider code={code} className={classes.liveProvider}>
                <CssBaseline />

                <Grid container className={classes.grid}>
                    <FileExplorer codeUpdater={this.setCode} />

                    <Grid item xs={9} container className={classes.grid}>
                        <Grid item xs={4} zeroMinWidth>
                            <LiveEditor className={classes.editor} />
                        </Grid>

                        <Grid item xs={4} zeroMinWidth>
                            <LiveError className={classes.error} />
                        </Grid>

                        <Grid item xs={4} zeroMinWidth>
                            <LivePreview className={classes.preview} />
                        </Grid>
                    </Grid>
                </Grid>
            </LiveProvider>
        );
    }
}

export default withStyles(style)(App);