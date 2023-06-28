import { useEffect, useState } from "react";
import Papa from "papaparse";
import axios from "axios";

// === Components ===
import CCTable from "../components/CCTable/CCTable";
import CCChart from "../components/CCChart/CCChart";

function Dashboard() {
  const [exampleData, setExampleData] = useState(null);
  const [chartData1, setChartData1] = useState({
    data: [],
    xkey: "",
    ykey: "",
    name: "",
  });
  const [chartData2, setChartData2] = useState({
    data: [],
    xkey: "",
    ykey: "",
    name: "",
  });
  const [chartData3, setChartData3] = useState({
    data: [],
    xkey: "",
    ykey: "",
    name: "",
  });

  const convertCSVtoJSON = (csv: any) => {
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
      let chartData1_ = response.data.slice(0, 1000);
      chartData1_ = chartData1_
        .filter((el: any) => el.specialty === "ARANDANOS")
        .map(function (el: any) {
          return { weight: parseFloat(el.weight), arrive_date: el.arrive_date };
        });
      setChartData1({
        data: chartData1_,
        xkey: "arrive_date",
        ykey: "weight",
        name: "Arandanos (Arrive date vs Weight)",
      });
      let chartData2_ = response.data.slice(0, 1000);
      let chartData2Aux = response.data.slice(0, 1000);
      chartData2_ = [...new Set(chartData2_.map((el: any) => el.exporter))];
      chartData2_ = chartData2_.map(function (el: any) {
        let number = chartData2Aux.filter(
          (el_: any) => el_.exporter === el
        ).length;
        return {
          exporter: el,
          shipments: number,
        };
      });
      setChartData2({
        data: chartData2_,
        xkey: "exporter",
        ykey: "shipments",
        name: "Shipments by Exporter",
      });

      let chartData3_ = response.data.slice(0, 1000);
      let chartData3Aux = response.data.slice(0, 1000);
      chartData3_ = [
        ...new Set(chartData3_.map((el: any) => el.port_of_shipment)),
      ];
      chartData3_ = chartData3_.map(function (el: any) {
        let number = chartData3Aux.filter(
          (el_: any) => el_.port_of_shipment === el
        ).length;
        return {
          port_of_shipment: el,
          shipments: number,
        };
      });
      console.log("test", chartData3_);
      setChartData3({
        data: chartData3_,
        xkey: "port_of_shipment",
        ykey: "shipments",
        name: "Shipments by Ports",
      });
      console.log(chartData3_);
    } catch (e) {
      console.log(e);
    }
  };
  
  // const [getData] = useLazyQuery(
  //   gql`
  //     query list_shipments {
  //       list_shipments {
  //         shipments_id
  //         species_name
  //         varieties_name
  //       }
  //     }
  //   `,
  //   {
  //     onCompleted: (data_) => {
  //       console.log(data_);
  //       setData(data_.list_languages);
  //     },
  //   }
  // );

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
        <div className="Dashboard__chart-container">
          <div className="card" style={{ marginRight: "20px", padding: "1%" }}>
            <label style={{ color: "#000000" }}>{chartData1.name}</label>
            <CCChart
              data={chartData1.data}
              xkey={chartData1.xkey}
              ykey={chartData1.ykey}
              type="line"
            ></CCChart>
          </div>
          <div className="card" style={{ marginRight: "20px", padding: "1%" }}>
            <label style={{ color: "#000000" }}>{chartData2.name}</label>
            <CCChart
              data={chartData2.data}
              xkey={chartData2.xkey}
              ykey={chartData2.ykey}
              type="bar"
            ></CCChart>
          </div>
          <div className="card" style={{ marginRight: "20px", padding: "1%" }}>
            <label style={{ color: "#000000" }}>{chartData3.name}</label>
            <CCChart
              data={chartData3.data}
              xkey={chartData3.xkey}
              ykey={chartData3.ykey}
              type="radar"
            ></CCChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
