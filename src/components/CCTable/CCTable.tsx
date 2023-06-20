import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { jsPDF } from "jspdf";
import autoTable, { CellInput, RowInput } from "jspdf-autotable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";

export default function BasicFilterDemo({ data }: any) {
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<any>(null);
  const [totalColumns, setTotalColumns] = useState<any[]>([]);
  const [dataTable, setDataTable] = useState<any[]>([]);

  const dt = useRef(null);

  useEffect(() => {
    if (data !== null) {
      setDataTable(data.data.slice(0, 1000));
      let columns_ = data.headers.map(function (el: string) {
        return { name: el, code: el };
      });
      setTotalColumns(columns_);
      setSelectedColumns(columns_);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (selectedColumns) {
      let selectedColumns_ = selectedColumns.map((el: any) => el.name);
      let dataTable_ = [...data.data.slice(0, 1000)];
      for (let i = 0; i < dataTable_.length; i++) {
        let obj = { ...dataTable_[i] };
        Object.keys(obj).forEach(function (key: string) {
          if (!selectedColumns_.includes(key)) {
            delete obj[key];
          }
        });
        dataTable_[i] = obj;
      }
      setDataTable(dataTable_);
      setColumns(selectedColumns_);
      let filters_ = { ...filters };
      for (let i = 0; i < selectedColumns_.length; i++) {
        filters_[selectedColumns_[i]] = {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        };
      }
      setFilters(filters_);
    }
  }, [selectedColumns]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    if ("value" in _filters["global"]) {
      _filters["global"].value = value;
    }
    setFilters(_filters);
    setGlobalFilterValue(value);
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

  return (
    <div>
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
        size="small"
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={loading}
        globalFilterFields={[
          "specialty",
          "variaty",
          "boxes",
          "weight",
          "exporter",
          "region_destiny",
          "port_destiny",
          "country_destiny",
          "receiver",
          "ship",
          "ship_type",
          "week_number",
          "date",
          "port_of_shipment",
          "arrive_date",
          "origin_code",
          "condition",
        ]}
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
