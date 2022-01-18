const Airline = artifacts.require('Airline');

let instance;

beforeEach(async () => {
    instance = await Airline.new()
});

contract('Airline', accounts => {
    it('should have available flights', async () => {
        const total = await instance.totalFlights(); 
        assert(total > 0); 
    });

    it('should allow customers to buy a flight providing its value', async () => {
        const flight = await instance.flights(0);
        const [flightName, price] = flight;
        await instance.buyFlight(0, { from: accounts[0], value: price });
        const customerFlight = await instance.customerFlights(accounts[0], 0);
        const customerTotalFlights = await instance.customerTotalFlights(accounts[0]);
        assert(customerFlight[0], flightName);
        assert(customerFlight[1], price);
        assert(customerTotalFlights, 1);
    });

    it('should not allow customers to buy a flight under the price', async () => {
        const flight = await instance.flights(0);
        const price = flight[1] - 5000;
        try {
            await instance.buyFlight(0, { from: accounts[0], value: price });
        } catch(e) {
            return;
        }
        assert.fail();
    });

    it('should get the real balance of the contract', async () => {
        const flight = await instance.flights(0);
        const price = flight[1];
        const flight2 = await instance.flights(1);
        const price2 = flight2[1];

        await instance.buyFlight(0, { from: accounts[0], value: price });
        await instance.buyFlight(1, { from: accounts[0], value: price2 });

        let newAirlineBalance = await instance.getAirlineBalance();

        assert.equal(newAirlineBalance.toNumber(), price.toNumber() + price2.toNumber());
        
    });

    it('should allow customers to redeem loyalty points', async () => {
        const flight = await instance.flights(1);
        let price = flight[1];
        await instance.buyFlight(1, { from: accounts[0], value: price });
        let balance = await web3.eth.getBalance(accounts[0]);
        await instance.redeemLoyaltyPoints({from: accounts[0]});
        let finalBalance = await web3.eth.getBalance(accounts[0]);

        let customer = await instance.customers(accounts[0]);
        let loyaltyPoints = customer[0];

        assert.equal(loyaltyPoints, 0);
        assert(finalBalance > balance);
    });

});