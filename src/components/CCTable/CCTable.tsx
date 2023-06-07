import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from 'primereact/button';

export default function BasicFilterDemo({ data }) {
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(null);
  const [totalColumns, setTotalColumns] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  const dt = useRef<DataTable>(null);

  useEffect(() => {
    if (data !== null) {
      setDataTable(data.data.slice(0, 1000));
      let columns_ = data.headers.map(function (el: String) {
        return { name: el, code: el };
      });
      setTotalColumns(columns_);
      setSelectedColumns(columns_);
      // setColumns(columns_);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (selectedColumns) {
      let selectedColumns_ = selectedColumns.map((el) => el.name);
      let dataTable_ = [...data.data.slice(0, 1000)];
      for (let i = 0; i < dataTable_.length; i++) {
        let obj = { ...dataTable_[i] };
        Object.keys(obj).forEach(function (key: String) {
          if (!selectedColumns_.includes(key)) {
            delete obj[key];
          }
        });
        dataTable_[i] = obj;
      }
      setDataTable(dataTable_);
      setColumns(selectedColumns_);
      // Update filters
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
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);

        doc.autoTable(exportColumns, products);
        doc.save("products.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "products");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
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
        {/* <div className="flex align-items-center justify-content-end gap-2">
          <Button
            type="button"
            icon="pi pi-file"
            rounded
            onClick={() => exportCSV(false)}
            data-pr-tooltip="CSV"
          />
          <Button
            type="button"
            icon="pi pi-file-excel"
            severity="success"
            rounded
            onClick={exportExcel}
            data-pr-tooltip="XLS"
          />
          <Button
            type="button"
            icon="pi pi-file-pdf"
            severity="warning"
            rounded
            onClick={exportPdf}
            data-pr-tooltip="PDF"
          />
        </div> */}
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
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
        // value={customers}
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
