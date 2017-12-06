module.exports = {
  apps : [
    {
      name: 'test-jira-webhook',
      script: 'app.js',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: '/var/log/cats-api/out.log',
      error_file: '/var/log/cats-api/err.log',
    }
  ]
};
