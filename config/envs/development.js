module.exports = {
    NODE_ENV: 'development',
    APP_PORT: process.env.APP_PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/dev_db',
    REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_key',
    CACHE_PREFIX: 'dev_cache',
};
