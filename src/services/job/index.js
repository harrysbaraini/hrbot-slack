'use strict';

const service = require('feathers-mongoose');
const job = require('./job-model');
const hooks = require('./hooks');
const SlackBot = require('slackbots');

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

  // SlackBot
  var bot = new SlackBot({
    token: 'xoxb-74579415286-ia8qMSUGOhq8rUiWwbJ7OUJy',
    name: 'hrbot'
  });

  bot.on('start', function() {
    //
  });

  bot.on('message', function(data) {
    const pattern = /^(<@.+>)(.+)&gt;(.+)&gt;(.+)$/;

    if (data.text) {
      const matches = data.text.match(pattern);

      if (!matches) {
        return;
      }

      const count = Object.keys(matches).length;
      
      if (count > 4) {
        let job = '';
        let company = '';
        let description = '';

        job = matches[2].trim();
        company = matches[3].trim();
        description = matches[4].trim();

        // Model
        const model = {
          title: job,
          company: company,
          description: description
        };

        jobService.create(model).then(c => {
          console.log('new job', c);
        });
      }
    }
  });
};
