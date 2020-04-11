require 'rake'
require 'date'

GIT_NAME = "program-think-mirrors"
GIT_EMAIL = "program-think-mirrors@github.com"

def check_destination_gfw
  if Dir.exist? "/home/travis/mirrors/gfw"
    Dir.chdir("/home/travis/mirrors/gfw") { sh "git pull" }
  else
    sh "git clone --depth=1 git@github.com:program-think-mirrors/gfw.git /home/travis/mirrors/gfw"
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

def timing_output
  puts "\ntiming_output"

  maxtime = (45 - 1) * 60 + 40
  n = 0

  while n < maxtime do

    if n % 30 == 0 then
      puts ""
      puts DateTime.now
    end

    sleep(1)
    n += 1

  end
end

task :init do

    if File.exist? "/home/travis/zip/btsync.zip"
      Dir.chdir("/") do
        sh "sudo unzip /home/travis/zip/btsync.zip"
        sh "sudo chown -R travis:travis /home/travis/btsync/"
      end
    end

    unless Dir.exist? "/home/travis/btsync/"
      sh "mkdir /home/travis/btsync/"
    end

    unless Dir.exist? "/home/travis/btsync/.sync/"
      sh "mkdir /home/travis/btsync/.sync/"
    end

    unless Dir.exist? "/home/travis/btsync/gfw/"
      sh "mkdir /home/travis/btsync/gfw/"
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

    check_destination_gfw
    sh "cp -r /home/travis/btsync/gfw/* /home/travis/mirrors/gfw/"
    puts "files copied"
    Dir.chdir("/home/travis/mirrors/gfw") { push }

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

task :timing_output do

    timing_output

end
