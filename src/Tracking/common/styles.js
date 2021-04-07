import { makeStyles } from "@material-ui/core/styles";
import { teal } from '@material-ui/core/colors';
import { pink } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
  appContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
  },
  passwordModal: {
    padding: theme.spacing(2, 4, 3),
    maxWidth: "35%",
  },
  cardTimer: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  addProject: {
    padding: theme.spacing(1),
  },
  cardHeader: {
    padding: theme.spacing(2),
  },
  projectList: {
    padding: theme.spacing(2),
  },
  dataGrid: {
    width: "100%",
    minHeight: "500px",
    '& .colBillable': {
      backgroundColor: teal[100]
    },
  },
  bottomButtonContainer: {
    float: "right",
    padding: theme.spacing(2),
  },
  bottomButton: { margin: theme.spacing(1) },
  clearallButton: {
    color: "white",
    backgroundColor: theme.palette.success.main,
  },
  addDefaultButton: {
    color: "white",
    backgroundColor: theme.palette.warning.main,
  },
  projectRowRunning: {
    "&:hover": { backgroundColor: pink[200] },
    backgroundColor: teal[100],
  },
  projectRowNotRunning: {
    "&:hover": { backgroundColor: teal[200] },
  },
  dataSummary: {
    margin: theme.spacing(2)
  },
  billableIcon: {
    color: teal[700]
  }
}));
