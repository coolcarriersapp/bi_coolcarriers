import { useEffect, useState } from "react";
import { useAppContext } from "../libs/contextLib";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import axios from "axios";

// === Components ===
import CCTable from "../components/CCTable/CCTable";

function Dashboard() {
  const { setIsAuthenticated } = useAppContext();
  let navigate = useNavigate();

  const [exampleData, setExampleData] = useState(null);

  const convertCSVtoJSON = (csv) => {
    // csv = csv.split("NaN").join(0);
    csv = Papa.parse(csv).data;
    let data = [];
    for (let i = 1; i < csv.length; i++) {
      data.push({
        id: i,
        specialty: csv[i][0],
        variaty: csv[i][1],
        boxes: csv[i][2],
        weight: csv[i][3],
        exporter: csv[i][4],
        region_destiny: csv[i][5],
        port_destiny: csv[i][6],
        country_destiny: csv[i][7],
        receiver: csv[i][8],
        ship: csv[i][9],
        ship_type: csv[i][10],
        week_number: csv[i][11],
        date: csv[i][12],
        port_of_shipment: csv[i][13],
        arrive_date: csv[i][14],
        origin_code: csv[i][15],
        condition: csv[i][16],
      });
    }
    return { headers: csv[0], data: data };
  };

  const getData = async () => {
    try {
      let response = await axios
        .get(
          "https://coolcarriers-public-storage.s3.amazonaws.com/frutadia.csv"
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err));
      response = convertCSVtoJSON(response);
      setExampleData(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const pageInit = () => {
      if (!exampleData) {
        getData();
      }
    };
    pageInit();
  }, []);

  return (
    <div className="Dashboard">
      <div className="Dashboard__content">
        <div className="Dashboard__table-container card">
          <CCTable data={exampleData}></CCTable>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
