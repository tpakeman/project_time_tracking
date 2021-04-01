import React from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useStyles } from "./common/styles";
import { convertForExport } from "./common/utils";
import { DAYS } from "./common/constants";
import { sum } from 'lodash';

export const DataPage = (props) => {
  const classes = useStyles();
  let data = convertForExport(props.data);
  data.forEach((d) => {
    let tmp = Object.keys(d)
      .filter((k) => Object.values(DAYS).includes(k))
      .map((k) => Number(d[k]));
    d.Total = sum(tmp);
  });
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
    <div style={{ display: props.active ? "flex" : "none" }}>
      <DataGrid
        autoHeight
        loading={data.length === 0}
        className={classes.dataGrid}
        rows={data}
        columns={columns}
      />
    </div>
  );
};
