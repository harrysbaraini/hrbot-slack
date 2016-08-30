// Establish a Socket.io connection
const socket = io();

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks());

  // Get the Feathers services we want to use
const jobService = app.service('jobs');

var vm = new Vue({
  el: 'body',
  data: {
    jobs: []
  },

  filters: {
    moment: date => {
      return moment(date).format('MMM Do, hh:mm:ss');
    }
  },

  created() {
    //
  },

  ready() {
    jobService.find().then(page => {
      this.jobs = page.data;
    });

    jobService.on('created', job => {
      this.jobs.push(job);
    });
  }
});