import { useEffect, useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Row } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";

// === Functions ===
import { generalDefaultConfiguration } from "../assets/resources/defaultConfiguration";

// === Components ===
import CCTable from "../components/CCTable/CCTable";

function Dashboard() {
  const {
    userConfiguration,
    setUserConfiguration,
    currentSection,
    setCurrentSection,
    currentPage,
    setCurrentPage,
  } = useAppContext();
  const [dataComponents, setDataComponents] = useState<any>([]);
  const [executeQuery] = useLazyQuery(gql`
    query list_shipments {
      list_shipments(limit: 1) {
        ships_id
      }
    }
  `);

  useEffect(() => {
    const pageInit = () => {
      if (!userConfiguration) {
        // Check user configuration
        if (false) {
          // user configuration already exist
        } else {
          // Setting default configuration
          let current_section =
            generalDefaultConfiguration.sections[0].section_name;
          let current_page =
            generalDefaultConfiguration.sections[0].pages[0].page_name;
          setCurrentSection(current_section);
          setCurrentPage(current_page);
          setUserConfiguration(generalDefaultConfiguration);
          // Save in DB new configuration
        }
      } else {
        // get page components
        let section = userConfiguration.sections.find(
          (el: any) => el.section_name === currentSection
        );
        let page = section?.pages.find(
          (el: any) => el.page_name === currentPage
        );
        let elements = page?.elements;
        setDataComponents(elements);
      }
    };
    pageInit();
  }, [userConfiguration, currentSection, currentPage]);

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
    let index = dataComponents.map((el: any) => el.id).indexOf(component);
    let component_aux = { ...dataComponents[index] };
    component_aux["data"] = response.data;
    component_aux["variables"] = variables;
    component_aux["filters"] = filters;
    let dataComponents_aux = [...dataComponents];
    dataComponents_aux[index] = component_aux;
    setDataComponents(dataComponents_aux);
  };

  return (
    <div className="Dashboard">
      {dataComponents.length > 0 ? (
        <Row
          className="Dashboard__components-grid justify-content-center"
          key="Dashboard__components-grid"
        >
          {/* Render Components */}
          {dataComponents.map(function (component: any) {
            // Render Tables
            if (component.element_type === "table") {
              return (
                <div
                  className="Dashboard__component-container"
                  key={"Dashboard__component-container" + "-" + component.id}
                >
                  <CCTable
                    key={component.id}
                    data={component}
                    requestUpdate={requestUpdate}
                  ></CCTable>
                </div>
              );
            } else {
              return null;
            }
          })}
        </Row>
      ) : null}
    </div>
  );
}

export default Dashboard;
