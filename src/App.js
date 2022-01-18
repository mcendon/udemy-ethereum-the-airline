import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";
import AirlineContract from "./airline";
import { AirlineService } from "./airlineService";
import { ToastContainer } from "react-toastr";

const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: null,
            balance: 0,
            flights: [],
            customerFlights: [],
            refundableBalance: 0
        };
    }

    async componentDidMount () {
        this.web3 = await getWeb3();
        this.toEther = converter(this.web3);
        this.airline = await AirlineContract(this.web3.currentProvider);
        this.airlineService = new AirlineService(this.airline);
        const account = (await this.web3.eth.getAccounts())[0];
        
        this.web3.currentProvider.on('accountsChanged', (accounts) => {
            const account = accounts[0];
            this.setState({
                account: account.toLowerCase()
            }, () => {
                this.load();
            });
        });

        const flightPurchased = this.airline.FlightPurchased();

        flightPurchased.watch((err, result) => {
            const { customer, price, name } = result.args;

            if (customer.toLowerCase() === this.state.account) {
                console.log(`You have purchased a flight to ${name} for ${this.toEther(price)} ether`);
            } else {
                this.container.success(
                    `Last customer purchased a flight to ${name} with a cost of ${this.toEther(price)} ether`
                , "Flight info");
            }
        });

        this.setState({
            account: account.toLowerCase()
        }, () => {
            this.load();
        });
    }   

    async load() {
        this.getBalance();
        this.getFlights();
        this.getCustomerFlights();
        this.getRefundableBalance();
    }

    async getBalance() {
        const weiBalance = await this.web3.eth.getBalance(this.state.account);
        this.setState({
            balance: this.toEther(weiBalance)
        });
    }

    async getFlights() {
        const flights = await this.airlineService.getFlights();
        this.setState({
            flights
        });
    }

    async getCustomerFlights() {
        const customerFlights = await this.airlineService.getCustomerFlights(this.state.account);
        this.setState({
            customerFlights
        });
    }

    async buyFlight(flightIndex, flight) {
        await this.airlineService.buyFlight(
            flightIndex, 
            this.state.account, 
            flight.price
        );
        this.load();
    }

    async getRefundableBalance() {
        const refundableBalance = await this.airlineService.getRefundableEther(this.state.account);
        this.setState({
            refundableBalance: this.toEther(refundableBalance)
        });
    }

    async redeemRefundableBalance() {
        await this.airlineService.redeemLoyaltyPoints(this.state.account);
        this.getBalance();
        this.getRefundableBalance();
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Decentralized Airline!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">
                        <p><strong>{this.state.account}</strong></p>
                        <span><strong>Balance:</strong> {this.state.balance}</span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">
                        <span>Refundable balance: {this.state.refundableBalance}</span>
                        {this.state.refundableBalance > 0 && 
                            (<button className="btn btn-sm btn-primary" onClick={() => {this.redeemRefundableBalance()}}>Redeem</button>)
                        }
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                        {this.state.flights.map((flight, i) => {
                            return <div key={i}>
                                        <span>{flight.name} - cost: {this.toEther(flight.price)}</span>
                                        <button className="btn btn-sm btn-success text-white" onClick={() => this.buyFlight(i, flight)}>Purchase</button>
                                    </div>
                        })}
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">
                    {this.state.customerFlights.map((flight, i) => {
                            return <div key={i}>
                                        <span>{flight.name}</span>
                                    </div>
                        })}
                    </Panel>
                </div>
            </div>
            <ToastContainer 
                ref={(input) => this.container = input}
                className="toast-top-right">
            </ToastContainer>
        </React.Fragment>
    }
}