Polymer({
  next: function() {
    if (!this.player.job) {
      this.invalid = true;
    } else {
      this.super();
    }
  },

  ready: function() {
    this.jobs = [
      { id: 'doctor', desc: 'Doctor', salary: 50000, summary:'is a Doctor'},
      { id: 'journalist', desc: 'Journalist', salary: 24000, summary: 'is a Journalist'},
      { id: 'lawyer', desc: 'Lawyer', salary: 50000, summary: 'is a Lawyer'},
      { id: 'teacher', desc: 'Teacher', salary: 20000, summary: 'is a Teacher'},
      { id: 'physicist', desc: 'Physicist', salary: 30000, summary: 'is a Physicist'},
      { id: 'university', desc: 'University Student', salary: 16000, summary: 'is a University Student'},
      { id: 'business', desc: 'Business Degree', salary: 12000, summary: 'has a Business Degree'}
    ];
    this.jobsById = {};
    this.jobs.reduce(function(o, job) {
      o[job.id] = job;
      return o;
    }, this.jobsById);
  },

  setJob: function(event, detail, sender) {
    this.invalid = false;
    this.player.job = this.jobsById[sender.value];
  }
});