const routes = require('next-routes')(); // require statement here returns a function thus a parenthesis.

// Adding new route mapping
routes
	.add('/campaigns/new', '/campaigns/new') // Added before as :address was taking 'new'RL.
	.add('/campaigns/:address', '/campaigns/show')
	.add('/campaigns/:address/requests', '/campaigns/requests/index')
	.add('/campaigns/:address/requests/new', '/campaigns/requests/new');
// : represents wildcard
// arg1: the new route
// arg2: What component do we need to show.

module.exports = routes;
// This routes object has various helpers that allows
// our users to automatically navigate through the pages.