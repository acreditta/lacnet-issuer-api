const config = {
    env : process.env.NODE_ENV || 'development',
    port : process.env.PORT || 3000,
    allowedOrigins : process.env.ALLOWED_ORIGINS?.split(', ') || [],
    dbUser : process.env.DB_USER || 'root',
    dbPassword : process.env.DB_PASSWORD || '',
    dbHost : process.env.DB_HOST || 'localhost',
    dbName : process.env.DB_NAME || 'test',
    dbPort : process.env.DB_PORT || 3306,
}

export default config;