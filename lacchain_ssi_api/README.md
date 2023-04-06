## SSI API Modified to be used for Acreditta

This is the source code of lacnet ssi-api (see README ORIG.md) with the following modifications to be used for Acreditta:

<ul>
<li>Modify config to include the network name (testnet or mainnet)</li>
<li>Modify the vc router (swagger and service) to include "issue" route that receives the following params:
    <ul>
        <li>claimsVerifier: The address of the claims verifier contract</li>
        <li>credential: The credential object (Open Badge 3.0)</li>
        <li>issuer: The issuer addres (without the did:... prefix, only the public key 0x...)</li>
        <li>privateKey: The issuer private key</li>
        <li>distribute: Boolean parameter to choose if register credential on blockchain or not</li>
    </ul>
</li>
<li>Modify the vc router (swagger and service) to include "revokeHash" route that allows to revoke a credential only by its hash. It is important to know that only distributed credentials (credentials that where distributed on blockchain) can be revoked. The route url schema is /revoke/:registry/:hash, where:
    <ul>
        <li>registry: The address of the registry contract</li>
        <li>hash: The credential hash to revoke</li>
    </ul>
</li>
<li><b>¡WARNING! </b>Also a did router was created to manage did methods, but it has an incompatibility with the node version. The code is still there to future development but it <b>MUST NOT BE USED</b>
</li>
</ul>

## Deployment

This API must be deployed with docker, and will create two containers:

<ul>
    <li>mongo: auxiliar mongo container that stores the issued credentials and the transactions</li>
    <li>app: THe container that runs the ssi-api on port 8080</li>
</ul>

To deploy run:

```
docker-compose build
docker-compose up

```