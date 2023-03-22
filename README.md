# lacnet-issuer-api

## Requirements:

<ul>
<li>Previously you must deploy the modified version of ssi-api for acreditta which includes necessary routes for deploy contracts and manage credentials.</li>
<li>Compatible node version: 14.17. It is recommend to use nvm to navigate across node versions</li>
</ul>


## Get started:

1. Install dependencies by running yarn
2. cp .env.example to .env and fill with the deploy env credentials (including AWS CLI credentials)
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