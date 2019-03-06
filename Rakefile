require 'rake'
require 'date'

GIT_NAME = "program-think-mirrors"
GIT_EMAIL = "program-think-mirrors@github.com"

def check_destination_blog
  if Dir.exist? "/home/travis/mirrors/blog"
    Dir.chdir("/home/travis/mirrors/blog") { sh "git pull" }
  else
    sh "git clone git@github.com:program-think-mirrors/blog.git /home/travis/mirrors/blog"
  end
end

def check_destination_books
  if Dir.exist? "/home/travis/mirrors/books"
    Dir.chdir("/home/travis/mirrors/books") { sh "git pull" }
  else
    sh "git clone git@github.com:program-think-mirrors/books.git /home/travis/mirrors/books"
  end
end

def clean
  if `ls | wc -l`.match(/\d+/)[0].to_i > 0
    puts "\ncleaning"
    files = `git rm -rf . | wc -l`.match(/\d+/)[0]
    puts "#{files} files cleaned\n"
  end
end

def push
  date = DateTime.now.strftime("%F")
  sh "git add --all ."
  
  files_changed = `git status --short | wc -l`.match(/\d+/)[0].to_i
  
  if files_changed > 0
    sh "git commit -m '#{date}'"
  end

  sh "git push --quiet origin master"
  puts "Pushed updated branch master"
end

task :init do

    unless Dir.exist? "/home/travis/btsync/"
      sh "mkdir /home/travis/btsync/"
    end

    unless Dir.exist? "/home/travis/btsync/.sync/"
      sh "mkdir /home/travis/btsync/.sync/"
    end

    unless Dir.exist? "/home/travis/btsync/blog/"
      sh "mkdir /home/travis/btsync/blog/"
    end

    unless Dir.exist? "/home/travis/btsync/books/"
      sh "mkdir /home/travis/btsync/books/"
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
    check_destination_blog
    check_destination_books

    # clean
    Dir.chdir("/home/travis/mirrors/blog") { clean }
    Dir.chdir("/home/travis/mirrors/books") { clean }

    sh "cp -r /home/travis/btsync/blog/blog/* /home/travis/mirrors/blog/"

    Dir.chdir("/home/travis/mirrors/blog") { push }
    Dir.chdir("/home/travis/mirrors/books") { push }

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
        sh "du -h -s /home/travis/btsync/*"
      end

      sleep(1)
      i += 1

    end
  
end

