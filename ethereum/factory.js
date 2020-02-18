import web3 from './web3';
import CampaignFactory from './build/Factory.json';

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	// CampaignFactory.interface,
	"0xFb37754172c906127A74397419D910eceF98825D"
); 

export default instance;