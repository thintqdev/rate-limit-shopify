import { GraphQLClient, gql } from "graphql-request";
import dotenv from "dotenv";
import {Headers} from 'node-fetch'
dotenv.config();

async function main() {
    const endpoint = `https://${process.env.SHOPIFY_API_KEY}:${process.env.SHOPIFY_API_SECRET}@${process.env.SHOP}/admin/api/2022-04/graphql.json`;
    let availableRateLimit = 0
    const numberOfParralleRequests = 3
    const rateLimitThreshold = 50
    const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
        },
    });
    const query = gql`
    query {
      products(first: 25) {
        edges {
          node {
            id
            title
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price
                }
              }
            }
          }
        }
      }
    }
  `;
    console.log(endpoint)
    const dataQuery = await graphQLClient.request(query).catch((error) => console.log(error));
    console.log(JSON.stringify(dataQuery, undefined, 2));

    const { data, errors, extensions, headers, status } = await graphQLClient.rawRequest(endpoint, query)
    console.log(`There are ${extensions.cost.throttleStatus.currrentlyAvailable} rate limit points available.`)
    console.log(JSON.stringify(data, undefined, 2));

    // const productEdges = data.products.edges;

    // for (let edge = 0; edge < productEdges.length; edge++) {
    //     const productId = productEdges[edge].node.id;
    //     const variantId = productEdges[edge].node.variants.edges[0].node.id;
    //     const variantWeight = productEdges[edge].node.variants.edges[0].node.variantWeight;
    //     console.log(`Product ${productId} has a variant ${variantId} with a weight of ${variantWeight}`);
    // }

    // const updatedPrice = (variantWeight * 60.52).toFixed(2)
    // const productUpdateMutation = gql`
    // mutation productUpdate($input: productInput!) {
    //     productUpdate(input: $input) {
    //         product {
    //             id
    //             title      
    //         }
    //         userErrors {
    //             field
    //             message
    //         }
    //     }
    // }`

    // const productInput = {
    //     id: productId,
    //     variants: [
    //         {
    //             id: variantId,
    //             price: updatedPrice
    //         }
    //     ]
    // }
    // if (edge % numberOfParralleRequests == 0) {
    //     await graphQLClient.rawRequest(productUpdateMutation, productInput).then(({ data, errors, extensions, headers, status }) => {
    //         console.log(JSON.stringify(data, undefined, 2));
    //         console.log(`There are ${extensions.cost.throttleStatus.currrentlyAvailable} rate limit points available.`)
    //         availableRateLimit = extensions.cost.throttleStatus.currrentlyAvailable
    //     }).catch((error) => console.log(error))
    // }
    // else {
    //     graphQLClient.rawRequest(productUpdateMutation, productInput).then(({ data, errors, extensions, headers, status }) => {
    //         console.log(JSON.stringify(data, undefined, 2));
    //         console.log(`There are ${extensions.cost.throttleStatus.currrentlyAvailable} rate limit points available.`)
    //         availableRateLimit = extensions.cost.throttleStatus.currrentlyAvailable
    //     }).catch((error) => console.log(error))
    // }
    // if(availableRateLimit < rateLimitThreshold){
    //     console.log('Not enough rate limit points. Waiting for 1 second.')
    //     await new Promise(resolve => setTimeout(function(){
    //         resolve('Rate limit wait')
    //         console.log('Done waiting - countinue request.')
    //     }, 1000));
    // }


}
main().catch((error) => console.error(error));
