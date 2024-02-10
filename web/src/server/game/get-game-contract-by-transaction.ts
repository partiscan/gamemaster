'use server';

export const getGameContractByTransaction = async (txHash: string) => {
  const query = {
    query: getGameContractByTransactionQuery,
    variables: {
      identifier: txHash,
    },
  };

  const response = await fetch(
    'https://backend.browser.testnet.partisiablockchain.com/graphql/query',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(query),
    },
  );

  
  const result = await response.json();
  
  if (!response.ok || !result.data) {
    return { result: 'not-found' };
  }

  const { executionSucceeded, address } =
    result.data.transaction.event.events[0].events[0].events[0].events[0];

  if (!executionSucceeded) {
    return { result: 'execution-failed' };
  }

  return {
    result: 'success',
    contract: address,
  };
};

const getGameContractByTransactionQuery = `
  query GetGameContractByTransaction($identifier: HASH!) {
    transaction(identifier: $identifier) {
      event {
        events {
          ... on InnerTransaction {
            events {
              ... on InnerCallback {
                events {
                  ... on InnerCallbackToContract {
                    events {
                      ... on InnerDeploy {
                        address
                        executionSucceeded
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;
