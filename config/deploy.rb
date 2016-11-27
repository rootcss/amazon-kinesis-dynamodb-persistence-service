# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'event-persistence'
set :repo_url, 'git@github.com:GetSimpl/event-persistence-service.git'

set :branch, ->() { ENV["DEPLOY_COMMIT"] || 'master' }
set :deploy_to, "/var/www/event-persistence"
