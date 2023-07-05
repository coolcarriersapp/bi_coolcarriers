import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { jsPDF } from "jspdf";
import autoTable, { CellInput, RowInput } from "jspdf-autotable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";

var timerId: any = null;
var globalTimerId: any = null;
var waitingTime = 1000;

export default function BasicFilterDemo({ data, requestUpdate }: any) {
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  interface Filters {
    global: {
      value: string | null;
      matchMode: FilterMatchMode;
    };
    [key: string]: {
      value: string | null;
      matchMode: FilterMatchMode;
    };
  }
  const [lazyState, setlazyState] = useState<{
    first: number;
    rows: number;
    page: number;
    sortField: string | null;
    sortOrder: number | null;
    filters: Filters;
  }>({
    first: 0,
    rows: 0,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    },
  });
  const [idTable, setIdTable] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [globalFilterBlock, setGlobalFilterBlock] = useState<boolean>(false);
  const [selectedColumns, setSelectedColumns] = useState<any>(null);
  const [totalColumns, setTotalColumns] = useState<any[]>([]);

  const dt = useRef(null);

  useEffect(() => {
    if (data !== null) {
      if (data["data"] === null) {
        requestUpdate(
          data["id"],
          data["query"],
          data["variables"],
          data["filters"]
        );
      } else {
        let full_data = data.data[data.query_name];
        let count_rows = data.data.count_rows;
        setDataTable(full_data);
        setIdTable(data.table_id);
        let columns_ = data.columns.map(function (el: string) {
          return { name: el, code: el };
        });
        if (selectedColumns === null || totalColumns !== columns_) {
          setSelectedColumns(columns_);
          setColumns(data.columns);
        } else {
          let selectedColumns_ = selectedColumns.map((el: any) => el.name);
          setColumns(selectedColumns_);
        }
        setTotalColumns(columns_);
        setTotalRecords(count_rows);
        let filters = { ...lazyState.filters };
        for (let i = 0; i < data.columns.length; i++) {
          if (globalFilterValue) {
            filters[data.columns[i]] = {
              value: globalFilterValue,
              matchMode: FilterMatchMode.CONTAINS,
            };
          } else {
            if (globalFilterBlock) {
              filters[data.columns[i]] = {
                value: null,
                matchMode: FilterMatchMode.CONTAINS,
              };
            } else {
              if (!Object.keys(filters).includes(data.columns[i])) {
                filters[data.columns[i]] = {
                  value: null,
                  matchMode: FilterMatchMode.CONTAINS,
                };
              }
            }
          }
        }
        if (globalFilterValue && !globalFilterBlock) {
          setGlobalFilterBlock(true);
        } else {
          setGlobalFilterBlock(false);
        }
        setlazyState({
          ...lazyState,
          rows: data.variables.limit,
          filters: filters,
        });
        setLoading(false);
      }
    }
  }, [data]);

  useEffect(() => {
    if (selectedColumns) {
      let selectedColumns_ = selectedColumns.map((el: any) => el.name);
      setColumns(selectedColumns_);
    }
  }, [selectedColumns]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    if (globalTimerId !== null) {
      clearTimeout(globalTimerId);
    }
    globalTimerId = setTimeout(() => {
      let filters_ = { ...lazyState.filters };
      if ("value" in filters_["global"]) {
        filters_["global"].value = value;
      }
      setlazyState({ ...lazyState, filters: filters_ });
      globalTimerId = null;
    }, waitingTime);
  };

  const exportPdf = () => {
    let head = selectedColumns.map((el: any) => el.name);
    let body: RowInput[] = dataTable.map(
      (el) => Object.values(el) as CellInput[]
    );
    const doc = new jsPDF();
    autoTable(doc, { head, body });
    doc.save("coolcarriers_data.pdf");
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(dataTable);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "coolcarriers_data");
    });
  };

  const saveAsExcelFile = (buffer: any, fileName: string) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
        <Button
          style={{ marginLeft: "10px" }}
          type="button"
          icon="pi pi-file-excel"
          severity="success"
          rounded
          onClick={exportExcel}
          data-pr-tooltip="XLS"
        />
        <Button
          style={{ marginLeft: "10px" }}
          type="button"
          icon="pi pi-file-pdf"
          severity="warning"
          rounded
          onClick={exportPdf}
          data-pr-tooltip="PDF"
        />
      </div>
    );
  };

  const header = renderHeader();

  const onPage = (event: any) => {
    setlazyState(event);
  };

  const onSort = (event: any) => {
    event["first"] = 0;
    setlazyState(event);
  };

  const onFilter = (event: any) => {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      event["first"] = 0;
      setlazyState(event);
      timerId = null;
    }, waitingTime);
  };

  useEffect(() => {
    let order = data.variables.order;
    if (lazyState.sortField && lazyState.sortOrder) {
      order = JSON.stringify([
        {
          column: lazyState.sortField,
          order: lazyState.sortOrder > 0 ? "ASC" : "DESC",
        },
      ]);
    }
    let columns_like = null;
    let counter_filters = null;
    let filters = Object.keys(lazyState.filters)
      .map(function (el) {
        return { ...lazyState.filters[el], key: el };
      })
      .filter((el_) => el_.value);
    if (filters.length > 0) {
      if (filters.map((el) => el.key).includes("global")) {
        let global_value = filters.find((el) => el.key === "global")?.value;
        columns_like = selectedColumns
          .map((el_: any) => el_.name)
          .map(function (el: string) {
            return el + "-" + global_value + "-contains";
          });
        columns_like.push("global");
        counter_filters = JSON.stringify(columns_like);
        columns_like = JSON.stringify(columns_like);
      } else {
        columns_like = filters.map(function (el) {
          return el.key + "-" + el.value + "-" + el.matchMode;
        });
        counter_filters = JSON.stringify(columns_like);
        columns_like = JSON.stringify(columns_like);
      }
    }
    let variables = {
      limit: lazyState.rows,
      offset: lazyState.first,
      order: order,
      columns_like: columns_like,
      filters: counter_filters,
    };
    if (
      data.data !== null &&
      JSON.stringify(Object.values(data.variables)) !==
        JSON.stringify(Object.values(variables))
    ) {
      setLoading(true);
      requestUpdate(data["id"], data["query"], variables, lazyState.filters);
    }
  }, [lazyState]);

  return (
    <div className="CCTable__container">
      <div className="CCTable__columns-selector">
        <MultiSelect
          value={selectedColumns}
          onChange={(e) => {
            setSelectedColumns(e.value);
          }}
          options={totalColumns}
          optionLabel="name"
          display="chip"
          placeholder="Select Columns"
          maxSelectedLabels={3}
          className="w-full md:w-20rem"
        />
      </div>
      <DataTable
        ref={dt}
        value={dataTable}
        lazy
        filterDisplay="row"
        dataKey={idTable}
        paginator
        first={lazyState.first}
        rows={lazyState.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        onSort={onSort}
        sortField={lazyState.sortField || ""}
        sortOrder={
          lazyState.sortOrder === null
            ? null
            : (lazyState.sortOrder as 0 | 1 | -1)
        }
        onFilter={onFilter}
        filters={lazyState.filters}
        loading={loading}
        header={header}
        emptyMessage="No data found."
        resizableColumns
      >
        {columns.map((el) => (
          <Column
            key={"column-" + el}
            field={el}
            header={el.replace("_", " ")}
            sortable
            filter
            filterPlaceholder={"Search by " + el}
            style={{ minWidth: "12rem" }}
          />
        ))}
      </DataTable>
    </div>
  );
}
