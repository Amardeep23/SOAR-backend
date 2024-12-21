module.exports = {
    NODE_ENV: 'production',
    APP_PORT: process.env.APP_PORT || 8080,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/prod_db',
    REDIS_URL: process.env.REDIS_URL || 'redis://redis:6379',
    JWT_SECRET: process.env.JWT_SECRET || 'prod_secret_key',
    CACHE_PREFIX: 'prod_cache',
};
