import React, { Component } from "react";
import "../css/App.css";
import AddAppointments from "./AddAppointments";
import SearchAppointments from "./SearchAppointments";
import ListAppointments from "./ListAppointments";
import { without, findIndex } from "lodash";

export class App extends Component {
  constructor() {
    super();

    this.state = {
      myAppointments: [],
      formDisplay: false,
      orderBy: "petName",
      queryText: "",
      orderDir: "asc",
      index: 0,
    };

    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.filterApts = this.filterApts.bind(this)
    this.updateInfo = this.updateInfo.bind(this)
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);
    this.setState({
      myAppointments: tempApts,
    });
  }

  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay,
    });
  }

  addAppointment(apt) {
    let tempApts = this.state.myAppointments;
    apt.Id = this.state.index;
    tempApts.unshift(apt);
    this.setState({
      myAppointments: tempApts,
      index: this.state.index + 1,
    });
  }

  changeOrder(order, direction) {
    this.setState({
      orderBy: order,
      orderDir: direction,
    });
    console.log(this.state.orderDir);
  }


  filterApts(searchTerm) {
    this.setState({
      queryText: searchTerm
    })
  }


   updateInfo(property, newText, id) {
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex( tempApts, {
      Id: id
    })

    tempApts[aptIndex][property] = newText;
    this.setState({
      myAppointments: tempApts
    })
  }

  componentDidMount() {
    fetch("./data.json")
      .then((response) => response.json())
      .then((result) => {
        const apts = result.map((item) => {
          item.Id = this.state.index;
          this.setState({
            index: this.state.index + 1,
          });
          return item;
        });
        this.setState({
          myAppointments: apts,
        });
      });
  }

  render() {
    let order;
    let filteredApts = this.state.myAppointments;
    if (this.state.orderDir === "asc") {
      order = 1;
    } else {
      order = -1;
    }

    filteredApts = filteredApts
      .sort((a, b) => {
        if (
          a[this.state.orderBy].toLowerCase() <
          b[this.state.orderBy].toLowerCase()
        ) {
          return -1 * order;
        } else {
          return 1 * order;
        }
      })
      .filter((eachItem) => {
        return (eachItem.petName
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
          eachItem.ownerName
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
          eachItem.aptNotes
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase())
          )
      });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointment={this.addAppointment}
                />
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  filterApts={this.filterApts}
                />
                <ListAppointments
                  appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                  updateInfo={this.updateInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
