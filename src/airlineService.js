export class AirlineService {
    constructor(contract) {
        this.contract = contract;
    }

    async buyFlight(flightIndex, from, value) {
        return this.contract.buyFlight(flightIndex, { from, value });
    }

    async getFlights() {
        const totalFlights = await this.getTotalFlights();
        const flights = [];
        for(let i = 0; i < totalFlights; i++) {
            flights.push(await this.contract.flights(i))
        }
        return this.mapFlights(flights);
    }

    async getTotalFlights() {
        return (await this.contract.totalFlights()).toNumber();
    }

    async getCustomerFlights(account) {
        const customerTotalFlights = await this.contract.customerTotalFlights(account);
        const flights = [];
        for (let i = 0; i < customerTotalFlights.toNumber(); i++) {
            flights.push(
                await this.contract.customerFlights(account, i)
            );
        }
        return this.mapFlights(flights);
    }

    mapFlights(flights) {
        return flights.map(flight => ({
            name: flight[0],
            price: flight[1].toNumber()
        }))
    }

    async getRefundableEther(account) {
        return (await this.contract.getRefundableEther({ from: account })).toNumber();
    }

    async redeemLoyaltyPoints(account) {
        await this.contract.redeemLoyaltyPoints({ from: account });
    }
}