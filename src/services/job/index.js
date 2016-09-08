'use strict';

const service = require('feathers-mongoose');
const job = require('./job-model');
const hooks = require('./hooks');
const slack = require('../../slack');

module.exports = function() {
  const app = this;

  const options = {
    Model: job,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/jobs', service(options));

  // Get our initialize service to that we can bind hooks
  const jobService = app.service('/jobs');

  // Set up our before hooks
  jobService.before(hooks.before);

  // Set up our after hooks
  jobService.after(hooks.after);

  // Set up Slack bot
  slack(jobService);
}