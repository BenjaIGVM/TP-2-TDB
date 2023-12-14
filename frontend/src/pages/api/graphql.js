
const { ApolloClient, gql, InMemoryCache } = require('@apollo/client');

const endPoint = new ApolloClient({
    uri: 'http://localhost:4000/', // Replace with your Apollo Server endpoint
    cache: new InMemoryCache(),
});

export default function handler(req, res) {
    const { body } = req;

    if (body.request) {
        const query = gql`${body.query}`;
        endPoint
            .query({
                query,
                variables : body.variables, // Provide any necessary variables
                fetchPolicy : (body.updateCache ? 'network-only' : 'cache-first'),
                context: {}, // Provide any necessary context
            })
            .then((result) => {
                console.log(result.data); // Handle the query result
                res.status(200).json(result.data);
            })
            .catch((error) => {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } else {
        const mutation =  gql`${body.mutation}`;
        endPoint
            .mutate({
                mutation,
                variables: body.variables, // Provide any necessary variables
                context: {}, // Provide any necessary context
            })
            .then((result) => {
                console.log(result.data); // Handle the query result
                res.status(200).json(result.data);
            })
            .catch((error) => {
                console.error('Error:', error);
                res.status(500).json({ error: error });
            });
    }

}

