require 'rake'
require 'date'

BOOK_TYPES = [ "政治", "心理学", "历史", "经济", "管理", "社会学", "文艺", "哲学", "科普", "军事", "IT" ]

def push
  sh "git pull"
  sh "git add --all ."
  
  files_changed = `git status --short | wc -l`.match(/\d+/)[0].to_i
  
  if files_changed > 0
    date = DateTime.now.strftime("%F")
    sh "git commit -m '#{date}'"
  end

  sh "git push --quiet origin master"
  puts "Pushed updated branch master"
end

task :init do

    unless Dir.exist? "/home/runner/btsync/"
      sh "mkdir /home/runner/btsync/"
    end

    unless Dir.exist? "/home/runner/btsync/.sync/"
      sh "mkdir /home/runner/btsync/.sync/"
    end

end

task :deploy do

    BOOK_TYPES.each do |i|
      if Dir.exist? "/home/runner/btsync/#{i}"
        sh "rm -rf #{ENV["GITHUB_WORKSPACE"]}/books/#{i}"
        sh "cp -r /home/runner/btsync/#{i}/#{i} #{ENV["GITHUB_WORKSPACE"]}/books/"
      end
    end
    puts "files copied"
    
    Dir.chdir("#{ENV["GITHUB_WORKSPACE"]}/books") do
      sh "rm '经济/经济学/教材/斯蒂芬·威廉森：宏观经济学 (第3版 扫描版).pdf'" # exceeds GitHub's file size limit of 100.00 MB
      push
    end

    sh "cp -r /home/runner/btsync/blog/blog/* #{ENV["GITHUB_WORKSPACE"]}/blog/"
    Dir.chdir("#{ENV["GITHUB_WORKSPACE"]}/blog") { push }

    sh "cp -r /home/runner/btsync/gfw/* #{ENV["GITHUB_WORKSPACE"]}/gfw/"
    Dir.chdir("#{ENV["GITHUB_WORKSPACE"]}/gfw") { push }

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
        sh "du -h -s /home/runner/btsync/*"
      end

      sleep(1)
      i += 1

    end
  
end
