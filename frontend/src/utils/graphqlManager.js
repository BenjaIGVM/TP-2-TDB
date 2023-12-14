
export function clientRequester(query, variables, updateCache) {

    return fetch('/api/graphql', {
        method: 'POST',
        body: JSON.stringify({ query: query, variables: variables, request: true, updateCache }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {
            throw error
        })
}

export function clientMutator(mutation, variables) {
    return fetch('/api/graphql', {
        method: 'POST',
        body: JSON.stringify({ mutation: mutation, variables: variables, request: false, updateCache : false }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {
            throw error
        })
}

const { ApolloClient, gql, InMemoryCache } = require('@apollo/client')

const endPoint = new ApolloClient({
    uri: 'http://localhost:4000', // Replace with your Apollo Server endpoint
    cache: new InMemoryCache()
})

export function serverRequester(req, variables, updateCache) {
    const query = gql`${req}`

    return endPoint
        .query({
            query,
            variables, // Provide any necessary variables
            fetchPolicy: (updateCache ? 'network-only' : 'cache-first'),
            context: {} // Provide any necessary context
        })
        .then(result => {
            return result.data
        })
        .catch(error => {
            throw error
        })
}


export function serverMutator(mutat, variables) {
    const mutation = gql`${mutat}`

    return endPoint
        .mutate({
            mutation,
            variables, // Provide any necessary variables 
            context: {} // Provide any necessary context
        })
        .then(result => {
            console.log(result.data) // Handle the query result
            return result.data
        })
        .catch(error => {
            throw error
        })
}