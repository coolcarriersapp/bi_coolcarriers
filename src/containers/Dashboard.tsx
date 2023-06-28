import { useEffect, useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Row } from "react-bootstrap";

// === Components ===
import CCTable from "../components/CCTable/CCTable";
import { FilterMatchMode } from "primereact/api";

function Dashboard() {
  const [dataComponents, setDataComponents] = useState<any>({});
  const [executeQuery] = useLazyQuery(gql`
    query list_shipments {
      list_shipments(limit: 1) {
        ships_id
      }
    }
  `);

  const defaultComponents = {
    "components-table-1": {
      id: "components-table-1",
      table_id: "shipments_id",
      columns: [
        "shipments_id",
        "asoex_documents_id",
        "species_name",
        "varieties_name",
        "boxes",
        "weight",
        "exporters_id",
        "region",
        "destination_region",
        "destination_port",
        "destination_country",
        "receivers_id",
        "ships_id",
        "week_number",
        "date",
        "port_of_shipment",
        "arrival_date",
        "region_of_origin_code",
        "shipment_condition",
        "created_at",
        "updated_at",
      ],
      data: null,
      query_name: "list_shipments",
      query: `
      query list_shipments($limit: Int, $offset: Int, $order: JSON, $columns_like: JSON, $filters: JSON){
        list_shipments(limit: $limit, offset: $offset, order: $order, columns_like: $columns_like){
          shipments_id,
          asoex_documents_id,
          species_name,
          varieties_name,
          boxes,
          weight,
          exporters_id,
          region,
          destination_region,
          destination_port,
          destination_country,
          receivers_id,
          ships_id,
          week_number,
          date,
          port_of_shipment,
          arrival_date,
          region_of_origin_code,
          shipment_condition,
          created_at,
          updated_at,
        }
        count_rows(table_name: "shipments", filters: $filters)
      }
      `,
      variables: {
        limit: 10,
        offset: 0,
        order: "[{'column':'shipments_id','order':'ASC'}]",
        columns_like: null,
        filters: null,
      },
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    },
  };

  useEffect(() => {
    const pageInit = () => {
      if (Object.keys(dataComponents).length === 0) {
        setDataComponents(defaultComponents);
      }
    };
    pageInit();
  }, []);

  const requestUpdate = async (
    component: string,
    query: string,
    variables: any,
    filters: any
  ) => {
    console.log("Executing query...");
    let gql_query = gql(query);
    let response = await executeQuery({
      variables: variables,
      query: gql_query,
    });
    let component_aux = { ...dataComponents[component] };
    component_aux["data"] = response.data;
    component_aux["variables"] = variables;
    component_aux["filters"] = filters;
    setDataComponents({ ...dataComponents, [component]: component_aux });
  };

  return (
    <div className="Dashboard">
      <Row
        className="Dashboard__components-grid justify-content-center"
        key="Dashboard__components-grid"
      >
        {/* Render Components */}
        {Object.keys(dataComponents).map(function (component) {
          if (component.includes("table")) {
            return (
              <div
                className="Dashboard__component-container"
                key={"Dashboard__component-container" + "-" + component}
              >
                <CCTable
                  key={component}
                  data={dataComponents[component]}
                  requestUpdate={requestUpdate}
                ></CCTable>
              </div>
            );
          } else {
            return null;
          }
        })}
      </Row>
    </div>
  );
}

export default Dashboard;
