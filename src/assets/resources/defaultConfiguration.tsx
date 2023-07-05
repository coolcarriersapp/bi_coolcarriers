import { FilterMatchMode } from "primereact/api";

const generalDefaultConfiguration = {
  sections: [
    {
      section_name: "General",
      pages: [
        {
          page_name: "ASOEX",
          elements: [
            {
              id: "components-table-1",
              element_type: "table",
              table_name: "shipments",
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
          ],
        },
        {
          page_name: "ASOEX SIMPLIFICADO",
          elements: [
            {
              id: "components-table-1",
              element_type: "table",
              table_name: "shipments",
              table_id: "shipments_id",
              columns: [
                "species_name",
                "varieties_name",
                "boxes",
                "weight",
              ],
              data: null,
              query_name: "list_shipments",
              query: `
        query list_shipments($limit: Int, $offset: Int, $order: JSON, $columns_like: JSON, $filters: JSON){
          list_shipments(limit: $limit, offset: $offset, order: $order, columns_like: $columns_like){
            species_name,
            varieties_name,
            boxes,
            weight,
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
          ],
        },
      ],
    },
  ],
};

export { generalDefaultConfiguration };
