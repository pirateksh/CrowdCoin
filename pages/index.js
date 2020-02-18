import React, {Component} from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
	static async getInitialProps() {
		// Class method i.e. instance of class
		// not needed to call this function. 
		const campaigns = await factory.methods.getDeployedCampaigns().call();
		return { campaigns };
	}

	// async componentDidMount() {const campaigns = await factory.methods.getDeployedCampaigns().call();
	// 	const campaigns = await factory.methods.getDeployedCampaigns().call();
	// 	console.log("Campaigns: ", campaigns);
	// }

	// Helper method to render lsit of campaigns
	renderCampaigns() {
		const items = this.props.campaigns.map(address => {
			// For each Campaign, does the following.
			return {
				header: address,
				description: (
					<Link route={`/campaigns/${address}`}>
						<a>View Campaign</a>
					</Link>
				),
				fluid: true
			};
		});

		return <Card.Group items={items}
/>;	}

	render() {
		return ( 
			<Layout>
			<div>
				<h3>Open Campaigns</h3>
				
				<Link route="/campaigns/new">
					<a>
						<Button 
						floated="right"
						content="Create Campaign"
						icon="add circle"
						primary
						/>
					</a>
				</Link>
				{this.renderCampaigns()}
			</div>
		</Layout>
		);
	}
}

export default CampaignIndex;