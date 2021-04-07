import React, {useState} from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useStyles } from "./common/styles";
import { convertForExport } from "./common/utils";
import { DAYS } from "./common/constants";
import { sum } from 'lodash';
import { Box, Typography } from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const DataToolBar = (props) => {
  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
          checked={props.billableOnly}
          onChange={props.toggleBillableOnly}
          name="billable-only"
          />
        }
        label="Show Billable only"
        />
      <FormControlLabel
        control={
          <Checkbox
          checked={props.nonZero}
          onChange={props.toggleNonZero}
          name="non-zero-only"
          />
        }
        label="Show >0 only"
        />
      </Box>
  )
}

export const DataPage = (props) => {
  const classes = useStyles();
  const [nonZero, setNonZero] = useState(false)
  const [billableOnly, setBillableOnly] = useState(false)

  const toggleNonZero = () => {
    setNonZero(() => !nonZero)
  }

  const toggleBillableOnly = () => {
    setBillableOnly(() => !billableOnly)
  }

  let data = convertForExport(props.data);
  let summary = {billable: 0, total: 0}
  data.forEach((d) => {
    let tmp = Object.keys(d)
      .filter((k) => Object.values(DAYS).includes(k))
      .map((k) => Number(d[k]));
    d.Total = sum(tmp)
    summary.total += sum(tmp)
    if (d.Billable) summary.billable += sum(tmp)
  });

  const showData = (data) => {
    let tmp = data
    if (nonZero) tmp = tmp.filter(d => d.Total > 0)
    if (billableOnly) tmp = tmp.filter(d => d.Billable)
    return tmp
  }

  const columns = [
    { field: "Project", headerName: "Name", width: 300, cellClassName: (v) => (v.getValue('Billable') == undefined ? "" : "colBillable"), },
    {
      field: "Billable",
      headerName: "$",
      width: 70,
      cellClassName: (v) => (v.getValue('Billable') == undefined ? "" : "colBillable"),
      valueFormatter: (v) => (v.value == undefined ? "" : "$"),
    },
    { field: "Monday", headerName: "M", type: "number", width: 90, cellClassName: (v) => (v.getValue('Billable') == undefined ? "" : "colBillable"),},
    { field: "Tuesday", headerName: "T", type: "number", width: 90, cellClassName: (v) => (v.getValue('Billable') == undefined ? "" : "colBillable"), },
    { field: "Wednesday", headerName: "W", type: "number", width: 90, cellClassName: (v) => (v.getValue('Billable') == undefined ? "" : "colBillable"), },
    { field: "Thursday", headerName: "Th", type: "number", width: 90, cellClassName: (v) => (v.getValue('Billable') == undefined ? "" : "colBillable"), },
    { field: "Friday", headerName: "F", type: "number", width: 90, cellClassName: (v) => (v.getValue('Billable') == undefined ? "" : "colBillable"), },
    { field: "Saturday", headerName: "S", type: "number", width: 90, cellClassName: (v) => (v.getValue('Billable') == undefined ? "" : "colBillable"), },
    { field: "Sunday", headerName: "Su", type: "number", width: 90, cellClassName: (v) => (v.getValue('Billable') == undefined ? "" : "colBillable"), },
    { field: "Total", headerName: "Total", type: "number", width: 150, cellClassName: (v) => (v.getValue('Billable') == undefined ? "" : "colBillable"), },
  ];
  return (
    <div style={{ display: props.active ? "flex" : "none", flexDirection: 'column' }}>
      <DataToolBar
        nonZero={nonZero}
        toggleNonZero={toggleNonZero}
        billableOnly={billableOnly}
        toggleBillableOnly={toggleBillableOnly}
      />
      <DataGrid
        autoHeight
        loading={data.length === 0}
        className={classes.dataGrid}
        rows={showData(data)}
        columns={columns}
      />
      <Typography
        align='right'
        variant='caption'
      >Note: This only updates when an action is taken on the 'Log Time' page, such as a pause/unpause.</Typography>
      <Box className={classes.dataSummary}>
        <Typography variant='h5'>{`Total Time Logged this week: ${summary.total}`}</Typography>
        <Typography variant='h6'>{`Total Billable Time this week: ${summary.billable}`}</Typography>
      </Box>
    </div>
  );
};
