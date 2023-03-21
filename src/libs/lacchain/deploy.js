import fetch from "node-fetch";
import config from "../../config/index.js";
import * as configModel from "../database/models/config.js";

// deploy registry
fetch(`${config.ssiApiUrl}/registry/credentials/deploy`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
})
.then((res) => res.json())
.then(async (json) => {
    console.log( "Registry deployed at: ", json.address );
    await configModel.put( { id: "lacchain", name: "registryAddress", value: json.address } );
    await configModel.put( { id: "lacchain", name: "registryAddressTransactionHash", value: json.hash } );
    
    // deploy claims verifier
    fetch(`${config.ssiApiUrl}/registry/verifier/deploy`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            credentialsRegistry: json.address
        })
    }).then((res) => res.json())
    .then(async (json) => {
        console.log( "Claims verifier deployed at: ", json.address );
        await configModel.put( { id: "lacchain", name: "claimsVerifierAddress", value: json.address } );
        await configModel.put( { id: "lacchain", name: "claimsVerifierAddressTransactionHash", value: json.hash } );
    }).catch((err) => {
        console.log(err);
    });
});