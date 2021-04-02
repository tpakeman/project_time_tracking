import { makeStyles } from "@material-ui/core/styles";

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
    "&:hover": { backgroundColor: theme.palette.error.light },
    backgroundColor: theme.palette.success.light,
  },
  projectRowNotRunning: {
    "&:hover": { backgroundColor: theme.palette.success.light },
  },
  dataSummary: {
    margin: theme.spacing(2)
  }
}));
