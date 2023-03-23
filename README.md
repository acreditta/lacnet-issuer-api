# lacnet-issuer-api

## Requirements:

<ul>
<li>Previously you must deploy the modified version of ssi-api for acreditta which includes necessary routes for deploy contracts and manage credentials.</li>
<li>Compatible node version: 14.17. It is recommend to use nvm to navigate across node versions</li>
</ul>


## Get started:

This api have the following architecture:

![Alt text](/architecture.png "Optional title")

1. Install dependencies by running yarn
2. cp .env.example to .env and fill with the deploy env credentials (including AWS CLI credentials). To know more about env variables see Env config.
3. Create dynamo tables, :
```
yarn migrate

```
4. Deploy REGISTRY and CLAIMS_VERIFIER contracts. If you already have the config table with registry and claims verifier addresses please ignore this step. If you currently have the addresses but not the table in dynamo, run this command, and then access dynamo and manually change the addresses of the contracts.
```
lacchain:deploy

```

Now the app is ready to be deployed manually, or using docker by running docker-compose up (run docker-compose build if you had a previous image). Using docker you will get the app running on nginx using port 80.

The documentation over the endpoints can be found here: <a href="https://documenter.getpostman.com/view/7298513/2s93RKzwAG">https://documenter.getpostman.com/view/7298513/2s93RKzwAG</a>

## Env config:

<ul>
<li>PORT=3000: port where the node app will be running (this port will be taken for the nginx container, so if you modify this, please modofy also the nginx/nginx.conf)</li>
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
<li>SSI_API_URL=http://localhost:8080: The host where the custom ssi-api is running. The docker file is set to deploy it over port 8080. See ssi-api acreditta repo.</li>
</ul>