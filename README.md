# lacnet-issuer-api

This api allows you to connect to lacnet node, create dids for issuers, issue and revoke credentials. This api have the following architecture:

![Alt text](/architecture.png "Optional title")

## Requirements:

<ul>
<li>A lacnet node deployed</li>
<li>Docker</li>
<li>SSI API Modified deployed. See <a href="https://github.com/acreditta/lacnet-ssi-api-modified.git">https://github.com/acreditta/lacnet-ssi-api-modified.git</a></li>
</ul>

<hr />

## Env config:

Create the following environment variables (Data contained here is a functional example with a testnet node address, but you must change this variables for your own environment):

```
SSI_API_URL: <<url where ssi-api modified is deployed>>
PORT: 3000
ALLOWED_ORIGINS: <<A string containing allowed origins separated  by ', ' (comma and a space), example "https://acreditta.com/, https://vc.acreditta.com/">>
AWS_ACCESS_KEY_ID: "AKIAZN26LT3ANY7D6I5K"
AWS_SECRET_ACCESS_KEY: "9K2sqAIr1IPcJMtiKKXhisnmlZlpSRRKS5CanRjV"
AWS_REGION: "us-east-1"
TABLES_PREFIX: "lacnet-"
CRYPTO_PASSWORD: 1234567890
CRYPTO_SALT: "helloworld"
NODE_ADDRESS: "0x62563b6608e45d8ffc97115695a076e900c2f6a2"
RPC_URL: "https://writer.lacchain.net"
NODE_EXPIRATION: 1836394529
ACCOUNT_DID: "did:lac:testnet:0x1b06d1a0c45c85f951d2d4bb3e6617f0d9472529"
ACCOUNT_ADDRESS: "did:lac:testnet:0x1b06d1a0c45c85f951d2d4bb3e6617f0d9472529"
ACCOUNT_PRIVATE_ENCRYPTION_KEY: "07c7976c13f9452931cf81240267a372ef10ade904595b6085809c550ff78bfe"
ACCOUNT_PUBLIC_KEY: "0x1b06d1a0c45c85f951d2d4bb3e6617f0d9472529"
ACCOUNT_PUBLIC_ENCRYPTION_KEY: "0x1b06d1a0c45c85f951d2d4bb3e6617f0d9472529"
ACCOUNT_PRIVATE_KEY: "07c7976c13f9452931cf81240267a372ef10ade904595b6085809c550ff78bfe"

```

### <b>Config guide:</b>


<ul>
<li>SSI_API_URL: url where ssi-api modified is deployed</li>
<li>PORT=3000: port where the node app will be running</li>
<li>ALLOWED_ORIGINS: allowed origins for cors policy separated by comma and space: ', '</li>
<li>AWS configuration:</li>
    <ul>
        <li>AWS_ACCESS_KEY_ID</li>
        <li>AWS_SECRET_ACCESS_KEY</li>
        <li>AWS_REGION=us-east-1</li>
        <li>TABLES_PREFIX="lacnet-": Prefix to be used on dynamo tables to prevent any conflict in the account (this for example will create the tables lacnet-config, lacnet-issuer, and lacnet-vc)</li>
        <li>CRYPTO_PASSWORD: Password to crypt and decrypt private keys and issuer private data</li>
        <li>CRYPTO_SALT: Salt to crypt and decrypt private keys and issuer private data (like another password)</li>
    </ul>
<li>LACNET configuration: all these variables will be taken from LacNET config support</li>
    <ul>
        <li>NODE_ADDRESS=</li>
        <li>REGISTRY_ADDRESS=</li>
        <li>RPC_URL=</li>
        <li>NODE_EXPIRATION=</li>
        <li>ACCOUNT_DID=</li>
        <li>ACCOUNT_ADDRESS=</li>
        <li>ACCOUNT_PRIVATE_ENCRYPTION_KEY=</li>
        <li>ACCOUNT_PUBLIC_KEY=</li>
        <li>ACCOUNT_PUBLIC_ENCRYPTION_KEY=</li>
        <li>ACCOUNT_PRIVATE_KEY=</li>
    </ul>
</ul>


<hr />


## Get started:

<ol>
<li>
  Set a docker-compose-override.yml file wwith the enviroment variables and deploy the container by running docker-compose up (run docker-compose build if you had a previous image). If you want to deploy directly from Docker file feel free to do it (remember to set the required enviroment variables).
</li>
<li>
  Check if this api is healthy and can connect to ssi_api by fetch /healty. It should return a 200 status whith the following object:

  ```
  {
      "message": "Healthy"
  }

  ```
  If it returns an error check the deployment, the ALLOWED_ORIGINS env variable (for CORS policy), or restart the deployment following this guide.
</li>
<li>
  Check if this api can connect to ssi_api by fetch /healty/ssiapi endpoints. It should return a 200 status whith the following object:

  ```
  {
      "message": "Healthy"
  }

  ```
  If it returns an error, it means that can't connect to ssi_api, so please check the ssi_api deployment on <a href="https://github.com/acreditta/lacnet-ssi-api-modified.git">https://github.com/acreditta/lacnet-ssi-api-modified.git</a>.
</li>
<li>
  Run a bash into the acreditta_api container:

  ```
  docker exec -it <<container_id>> /bin/sh
  ```
</li>
<li>
  Run the migrate command to create dynamo tables:

  ```
  yarn migrate

  ```
</li>
<li>Deploy REGISTRY and CLAIMS_VERIFIER contracts. If you already have the config table with registry and claims verifier addresses please ignore this step. If you currently have the addresses but not the table in dynamo, run this command, and then access dynamo and manually change the addresses of the contracts.

```
yarn lacchain:deploy

```
</li>
</ol>


The documentation over the endpoints can be found here: <a href="https://documenter.getpostman.com/view/7298513/2s93RKzwAG">https://documenter.getpostman.com/view/7298513/2s93RKzwAG</a>