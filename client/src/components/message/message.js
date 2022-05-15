import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        messageRow: {
            display: "flex"
        },
        messageRowRigth: {
            display: "flex",
            justifyContente: "flex-end"
        },
        messageWhite: {
            position: "relative",
            marginLeft: "20px",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "#A8DDFD",
            width: "60%",
            textAlign: "left",
            font: "400 .9em 'Open Sans', sans-serif",
            border: "1px solid $97C6E3",
            borderRadius: "10px"
        },
        messageBlue: {
            position: "relative",
            marginRigth: "20px",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "#f8e896",
            width: "60%",
            textAlign: "left",
            font: "400 .9em 'Open Sans', sans-serif",
            border: "1px solid #dfd087",
            borderRadius: "10px"
        },
        messageContent: {
            padding: 0,
            margin: 0
        },
        messageTimeStampRight: {
            position: "absolute",
            fontSize: ".85em",
            fontWeight: "300",
            marginTop: "10px",
            bottom: "-3px",
            right: "5px"
        },
        displayName: {
            marginLeft: "20px"
        }
    })
);

export const MessageLeft = (props) => {
    const message = props.message ? props.message : "sem mensagem";
    const timestamp = props.timestamp ? props.timestamp : "";
    const classes = useStyles();

    return (
        <>
            <div className={classes.messageRow}>
                <div>
                    <div className={classes.messageBlue}>
                        <div>
                            <p className={classes.messageContent}>{message}</p>
                        </div>
                        <div className={classes.messageTimeStampRight}>{timestamp}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const MessageRight = (props) => {
    const classes = useStyles();
    const message = props.message ? props.message : "sem mensagem"
    const timestamp = props.timestamp ? props.timestamp : "";

    return (
        <div className={classes.messageRowRigth}>
            <div className={classes.messageBlue}>
                <p className={classes.messageContent}>{message}</p>
                <div className={classes.messageTimeStampRight}>{timestamp}</div>
            </div>
        </div>
    );
};