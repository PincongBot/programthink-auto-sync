require 'rake'
require 'date'

USERNAME = "program-think-mirrors"
REPO = "blog"

GIT_NAME = "program-think-mirrors"
GIT_EMAIL = "program-think-mirrors@github.com"

def check_destination
  if Dir.exist? "repo"
    Dir.chdir("repo") { sh "git pull" }
  else
    sh "git clone git@github.com:#{USERNAME}/#{REPO}.git repo"
  end
end

task :deploy do

    # Detect pull request
    if ENV['TRAVIS_PULL_REQUEST'].to_s.to_i > 0
      puts 'Pull request detected.'
      exit
    end

    # Configure git if this is run in Travis CI
    if ENV["TRAVIS"]
      sh "git config --global user.name '#{GIT_NAME}'"
      sh "git config --global user.email '#{GIT_EMAIL}'"
      sh "git config --global push.default simple"
    end

    # Make sure destination folder exists as git repo
    check_destination

    # clean
    Dir.chdir("repo") { 
      puts "\ncleaning"
      files = `git rm -rf . | wc -l`.match(/\d+/)[0]
      puts "#{files} files cleaned\n"
    }

    sh "cp /home/travis/btsync/blog/ repo"

    Dir.chdir("repo") do
      date = DateTime.now.strftime("%F")
      sh "git add --all ."
      sh "git commit -m '#{date}'"
      sh "git push --quiet origin master"
      puts "Pushed updated branch master to GitHub Pages"
    end

end

task :sync, [:minutes] do |t, args|

    args.with_defaults(:minutes => 10)
    minutes = args.minutes.to_i

    max = (minutes - 1) * 60 + 40
    i = 0

    puts "\nsyncing"

    while i < max do

      if i % 30 == 0 then
        puts ""
        sh "du -h -s programthink/books/*"
      end

      sleep(1)
      i += 1

    end
  
end

