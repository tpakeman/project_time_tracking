import React from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useStyles } from "./common/styles";
import { convertForExport } from "./common/utils";
import { DAYS } from "./common/constants";
import { sum } from 'lodash';
import { Box, Typography } from "@material-ui/core";

export const DataPage = (props) => {
  const classes = useStyles();
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
  console.log(summary)
  const columns = [
    { field: "Project", headerName: "Name", width: 300 },
    {
      field: "Billable",
      headerName: "$",
      width: 60,
      valueFormatter: (v) => (v.value == undefined ? "" : "$"),
    },
    { field: "Monday", headerName: "M", type: "number", width: 90 },
    { field: "Tuesday", headerName: "T", type: "number", width: 90 },
    { field: "Wednesday", headerName: "W", type: "number", width: 90 },
    { field: "Thursday", headerName: "Th", type: "number", width: 90 },
    { field: "Friday", headerName: "F", type: "number", width: 90 },
    { field: "Saturday", headerName: "S", type: "number", width: 90 },
    { field: "Sunday", headerName: "Su", type: "number", width: 90 },
    { field: "Total", headerName: "Total", type: "number", width: 150 },
  ];
  return (
    <div style={{ display: props.active ? "flex" : "none", flexDirection: 'column' }}>
      <DataGrid
        autoHeight
        loading={data.length === 0}
        className={classes.dataGrid}
        rows={data}
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
