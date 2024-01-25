const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const routes = require('./routes'); // TODO: Remove once graphql is implemented

const app = express();
const server = new ApolloServer({
	typeDefs,
	resolvers,
});
const PORT = process.env.PORT || 3001;

const startApolloServer = async () => {
	await server.start();

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	// if we're in production, serve client/build as static assets
	if (process.env.NODE_ENV === 'production') {
		app.use(express.static(path.join(__dirname, '../client/build')));

		// app.get('*', (req, res) => {
		//   res.sendFile(path.join(__dirname, '../client/dist/index.html'));
		// });
	}

	app.use(routes);

	db.once('open', () => {
		app.listen(PORT, () => {
			console.log(`🌍 Now listening on localhost:${PORT}`);
			console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
		});
	});
};

startApolloServer();
