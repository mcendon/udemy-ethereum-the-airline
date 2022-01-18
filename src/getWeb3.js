import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

const getWeb3 = () => {
    return new Promise( (resolve, reject) => {
        window.addEventListener('load', async () => {
            const provider = await detectEthereumProvider();
            if(provider) {
                web3 = new Web3(provider);
                resolve(web3);
            } else {
                console.log("No provider found, please install Metamask");
                reject();
            }
        });
    });
};

export default getWeb3;