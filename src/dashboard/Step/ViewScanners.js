import React, { Component } from 'react';

import {
    postRemoveUserFromScannerOfStepAPICALL,
    postAddUserToScannerOfStepAPICALL
} from '../../utils/requests';
import {withRouter} from 'react-router-dom';
import ReactCardFlip from 'react-card-flip';
import SearchBar from 'react-search-bar';
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";

let csvData= [["First Name", "Last Name", "Email", "Phone Number"]];


class ViewScanners extends Component {
  constructor (props) {
    super(props);
    this.state = {
        users: [],
        isFlipped: false,
        toSearch: ""
    };
    console.log("___________________________________________________________________________");
    console.log("ScannersReadyIDs");
    console.log(this.props.history.location.state.ScannersReady);
      // schemaParticipants.properties.listOfStrings.push(this.props.history.location.state.ParticipantIDs[0]);

      this.setState({
          users: this.props.history.location.state.ScannersReady
      });


    // Bind
      this.handleClickCard = this.handleClickCard.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
  }


    handleClickCard(e) {
      //Move to update user
        e.preventDefault();
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
        console.log("Switching to:" + this.state.isFlipped);
    }

    handleSearch(text, currentUsers){

        console.log(text);

        //Check if it contains digits only and is 5 characters long
        // if(!(/^\d+$/.test(text)) || (text.length !== 5)){
        if(!(/^\d+$/.test(text))){
            alert("Invalid ID");
            return;
        }

        return postAddUserToScannerOfStepAPICALL(this.props.history.location.state.hashedIDEvent, this.props.history.location.state.hashedIDStep, text, currentUsers)
            .then((res) => {
                if(res.data.status === "success"){
                    // console.log(res.data.data.userData);
                    alert("User was added successfully");
                    // for (let i = 0; i < this.state.users; i++) {
                    //     this.state.user.unshift(this.state.users[i]);
                    // }
                    // this.setState()
                    // console.log("__________");
                    // console.log(currentUsers);
                    // this.props.history.location.state.ScannersReady.unshift(res.data.data.userData);
                    // console.log(this.props.history.location.state.ScannersReady);
                    this.setState({
                        users: this.props.history.location.state.ScannersReady
                    });
                    alert("User added successfully");

                    // this.forceUpdate();
                }else{
                    alert("An error has occurred while while adding " + text)
                }
            })
    }


    removeUserFromScannerOfAStep(hashedIDEvent, hashedIDStep, hashedID, auiID){

        return postRemoveUserFromScannerOfStepAPICALL(hashedIDEvent, hashedIDStep, hashedID)
            .then(isDeleted => {
                return isDeleted;
            })
    }

    // removeUserFromList(hashedID){
    //     console.log("HERE");
    //     console.log(this.state.users.length);
    //     for (let i =0; i < this.state.users.length; i++)
    //         if (this.state.users[i].hashedID === hashedID) {
    //             this.state.users.splice(i,1);
    //             alert("User removed successfully");
    //             this.forceUpdate();
    //             break;
    //         }
    // }

    createTable = () => {
        let table = [];
        this.state.users = this.props.history.location.state.ScannersReady;

        console.log(this.state.users);
        // Outer loop to create parent

        let arrays = [], size = 5;

        while (this.state.users.length > 0)
            arrays.push(this.state.users.splice(0, size));

        {arrays.map((array => {
                let children = [];
                //Inner loop to create children
                // for (let j = 0; j < 5; j++) {
                {array.map(participant => {
                    if(participant.isDisplayable){
                        csvData.push([participant.firstName, participant.lastName, participant.email, participant.phoneNumber]);

                        children.push(
                        <td key={participant.hashedID.toString()}>
                            <ReactCardFlip isFlipped={this.state.isFlipped}>
                                <div key="front" style={styles.card}>
                                    <div style={{float: 'right'}}>
                                        <text style={{fontWeight: "bold", color:'gray'}}>Aui ID: </text>
                                        <text style={{color:'gray'}}>{participant.auiID}<br/></text>
                                    </div>
                                    {
                                        (participant.isNew)?
                                            <text style={{color: "red"}}>New</text>
                                            :<text></text>
                                    }
                                    <text style={{fontWeight: "bold"}}><br/><br/>First Name: </text>
                                    <text>{participant.firstName}<br/></text>
                                    <text style={{fontWeight: "bold"}}>Last Name: </text>
                                    <text>{participant.lastName}<br/></text>
                                    <text style={{fontWeight: "bold"}}>Email: </text>
                                    <text>{participant.email}<br/></text>
                                    <text style={{fontWeight: "bold"}}>Phone Number: </text>
                                    <text>{participant.phoneNumber}<br/></text>
                                    <text style={{fontWeight: "bold"}}>System ID: </text>
                                    <text>{participant.hashedID}<br/><br/></text>

                                    <div >
                                        <button className='btn btn-primary' style={{width: "100%"}} onClick={this.handleClickCard}>
                                            More info
                                        </button>
                                        <button  className='btn btn-danger' style={{width: "100%"}} onClick={()=>{
                                            let answer = window.prompt("Are you sure want to remove this user from the participants list? Please enter the ID of the user:")
                                            if(answer === participant.auiID){
                                                this.removeUserFromScannerOfAStep(this.props.history.location.state.hashedIDEvent, this.props.history.location.state.hashedIDStep ,participant.hashedID, participant.auiID)
                                                    .then((isDeleted)=>{
                                                        if(isDeleted){
                                                            participant.isDisplayable = false;
                                                            // this.forceUpdate();
                                                            alert("Scanner privilege revoked");

                                                        }else{
                                                            alert("An Error has occurred while revoking the scanner privilege to " + participant.auiID);
                                                        }
                                                    })
                                            }else{
                                                alert("The IDs don't match. Aborting...")
                                            }
                                            console.log(answer);
                                        }}>
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div key="back" style={styles.card}>
                                    <text style={{fontWeight: "bold"}}>Aui ID: </text>
                                    <text>{participant.auiID}<br/></text>
                                    <text style={{fontWeight: "bold"}}>First Name: </text>
                                    <text>{participant.firstName}<br/></text>
                                    <text style={{fontWeight: "bold"}}>Last Name: </text>
                                    <text>{participant.lastName}<br/></text>
                                    <text style={{fontWeight: "bold"}}>Email: </text>
                                    <text>{participant.email}<br/></text>
                                    <text style={{fontWeight: "bold"}}>Country: </text>
                                    <text>{participant.country}<br/></text>
                                    <text style={{fontWeight: "bold"}}>Phone Number: </text>
                                    <text>{participant.phoneNumber}<br/></text>
                                    <text style={{fontWeight: "bold"}}>System ID: </text>
                                    <text>{participant.hashedID}<br/></text>

                                    <button className='btn btn-primary' onClick={this.handleClickCard}>
                                        Back
                                    </button>
                                    {/*<button className='btn btn-info' onClick={() => {}}>*/}
                                    {/*More Info ...*/}
                                    {/*</button>*/}
                                </div>
                            </ReactCardFlip>
                        </td>)
                    }
                })}

                // }
                //Create the parent and add the children
                table.push(<tr>{children}</tr>)
        }))}

        return table
    };

    // onSearch(inputID){
    //     return getUserData(inputID)
    //         .then(data => {
    //                if(Object.entries(data).length === 0 && data.constructor === Object){
    //                     alert("User not found");
    //                }else{
    //                     //insert object in the begining of this.state.user
    //                    //maybe also add a new flag that would mean thtt the user was newly added
    //                      alert("User Was added successfully");
    //                      //Use unshift
    //                }
    //             }
    //         )
    // }

  render () {
    return (
        <div>
            <h2 className='title' style={{marginBottom: '20px'}}>Step Scanners</h2>
            <div>
                <CSVLink filename={"step_scanners.csv"} data={csvData} className="btn btn-primary">Download CSV File</CSVLink>
                <div>
                    <button style={{float: 'right', marginTop: '0px'}} className='btn btn-info' onClick={()=>{
                        this.handleSearch(this.state.toSearch, this.state.users);
                    }}>
                        Add
                    </button>
                    <SearchBar
                        style={{flexDirection:"row", float: 'right', marginTop: '2px', marginBottom: '30px',  width: '30%'}}
                        placeholder="Please enter an ID"
                        onChange={(newString) => {
                            this.setState({
                                toSearch: newString
                            })
                        }}
                        onSearch={this.handleSearch}
                        suggestions={[]}/>

                </div>
            </div>
            <label style={{marginBottom: '50px'}}>Number of Scanners: {this.props.history.location.state.ScannersReady.length}</label>

            <table>
                {this.createTable()}
            </table>
        </div>
    )
  }
}

const styles = {
    card: {
        border: '1px solid #eeeeee',
        borderRadius: '3px',
        padding: '15px',
        width: '250px'
    },
    image: {
        height: '200px',
        width: '250px'
    },
    buttonStyleContainer: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 5,
    }
};


export default withRouter(ViewScanners);