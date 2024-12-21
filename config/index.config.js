require('dotenv').config();

const environments = {
    development: require('./envs/development'),
    production: require('./envs/production'),
};

const NODE_ENV = process.env.NODE_ENV || 'development';
const config = environments[NODE_ENV];

if (!config.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET in environment variables.');
}

module.exports = config;
