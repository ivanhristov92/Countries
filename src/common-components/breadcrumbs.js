import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: "center",
    flexWrap: "wrap"
  },
  paper: {
    padding: theme.spacing(1, 2)
  }
}));

export default function CustomSeparator(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={0} className={classes.paper}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link color="inherit" href="/">
            {props.country ? (
              "Countries"
            ) : (
              <Typography color="textPrimary">Countries</Typography>
            )}
          </Link>
          {props.country && (
            <Link color="inherit" href={`/country/${props.country}`}>
              <Typography color="textPrimary">{props.country}</Typography>
            </Link>
          )}
        </Breadcrumbs>
      </Paper>
    </div>
  );
}
