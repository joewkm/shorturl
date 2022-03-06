/*
 * Create and export configuration variables
 *
 * Date written : 01 Mar, 2002
 * Written by : JWong
 *
 */

// Container for all environments
var environments = {};

// Staging (default) environment
environments.staging = {
  'httpsPort' : 4001,
  'envName' : 'staging',
  'urlPrefix' : 'https://mini.url/',
  'dataPath' : './data/',
  'statsFile' : 'stats.json',
  'statsPath' : './statistics'
};

// Production environment
environments.production = {
  'httpsPort' : 8001,
  'envName' : 'production',
  'urlPrefix' : 'https://mini.url/',
  'dataPath' : './data/',
  'statsFile' : 'stats.json',
  'statsPath' : './statistics'
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
