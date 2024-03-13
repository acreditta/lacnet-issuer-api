import crypto from 'crypto';
import dotenv from 'dotenv'
dotenv.config()

const config = {
    env : process.env.NODE_ENV || 'development',
    port : process.env.PORT || 3000,
    allowedOrigins : process.env.ALLOWED_ORIGINS?.split(', ') || [],
    dbUser : process.env.DB_USER || 'root',
    dbPassword : process.env.DB_PASSWORD || '',
    dbHost : process.env.DB_HOST || 'localhost',
    dbName : process.env.DB_NAME || 'test',
    dbPort : process.env.DB_PORT || 3306,
    awsRegion : process.env.AWS_REGION || 'us-east-1',
    tablesPrefix : process.env.TABLES_PREFIX || '',
    nodeAddress : process.env.NODE_ADDRESS || '',
    nodeExpiration: process.env.NODE_EXPIRATION || 1736394529,
    registryDidAddress : process.env.REGISTRY_DID_ADDRESS || '0x81a7f01A18EE444F57551e1fa2f0C12116f318Fb',
    rpcUrl : process.env.RPC_URL || '',
	ssiApiUrl : process.env.SSI_API_URL || '',
}

const algorithm = process.env.CRYPTO_ALGORITHM || 'aes-192-cbc'
const password = process.env.CRYPTO_PASSWORD || 'password'
const salt = process.env.CRYPTO_SALT || 'salt'
const iv = Buffer.alloc(16, 0)
const key = crypto.scryptSync(password, salt, 24)

export const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    const randomSuffix = crypto.randomBytes(16).toString('hex')
    const textWithRandomSuffix = `${text}${randomSuffix}`
    let encrypted = cipher.update(textWithRandomSuffix, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
}

export const decrypt = (text) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted.slice(0, -32)
}

export default config;