export default {
	server: {
		name: process.env.NAME || 'SSI API',
		ver: process.env.VERSION || '1.0',
		port: process.env.PORT || 8080,
		ip: process.env.BINDING_IP || '0.0.0.0',
		ssl: {
			enabled: process.env.SSL_ENABLED || false,
			key: process.env.SSL_KEY || '/certs/cert.key',
			crt: process.env.SSL_CRT || '/certs/cert.crt'
		}
	},
	network: {
		rpc: process.env.NETWORK_RPC || "https://writer.lacchain.net",
		nodeAddress: process.env.NODE_ADDRESS,
		expiration: process.env.NODE_EXPIRATION,
		name: process.env.NETWORK_NAME || "testnet"
	},
	account: {
		address: process.env.ACCOUNT_ADDRESS,
		privateKey: process.env.ACCOUNT_PRIVATE_KEY,
		encryptionKey: {
			publicKey: process.env.ACCOUNT_PUBLIC_ENCRYPTION_KEY,
			privateKey: process.env.ACCOUNT_PRIVATE_ENCRYPTION_KEY
		}
	},
	passport: {
		bearer: {
			accessMethodID: 'bearer',
			passReqToCallback: true
		}
	},
	logger: {
		level: process.env.LOGGER_LEVEL || 'error'
	}
}