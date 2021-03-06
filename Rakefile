require 'rake'
require 'date'
require 'shellwords'

BOOK_TYPES = [ "心理学", "经济", "管理", "社会学", "文艺", "哲学", "科普", "IT" ]

def push_dir(subdir, ref)
  sh "git add --all #{Shellwords.escape(subdir)}"

  files_changed = `git diff --name-only --cached | wc -l`.match(/\d+/)[0].to_i

  if files_changed > 0
    date = DateTime.now.strftime("%F")
    sh "git commit -m '#{date}'"
  end

  sh "git push origin #{ref}"
end

def push
  ref = ENV["REPO_REF"]

  # Dir.glob("*") do |subdir|
  #   push_dir(subdir, ref)
  # end
  push_dir(".", ref)

  puts "Pushed updated branch #{ref}"
end

def mount(path, i)
  sh "du -L -h -s #{path}"
  sh "mkdir -p /home/runner/btsync/#{i}/#{i}"
  sh "sudo mount --bind -v #{ENV["GITHUB_WORKSPACE"]}/#{path} /home/runner/btsync/#{i}/#{i}"
end

task :init do

    unless Dir.exist? "/home/runner/btsync/"
      sh "mkdir /home/runner/btsync/"
    end

    unless Dir.exist? "/home/runner/btsync/.sync/"
      sh "mkdir /home/runner/btsync/.sync/"
    end

    path = ENV["REPO_PATH"]
    case path
      when "books"
        BOOK_TYPES.each do |i|
          path = "books/#{i}"
          sh "mkdir -p #{path}"
          mount(path, i)
        end

      when "history", "politics", "military"
        M = {
          "history"  => "历史",
          "politics" => "政治",
          "military" => "军事",
        }
        i = M[path]
        mount(path, i)
    end

end

task :deploy do

    path = ENV["REPO_PATH"]
    case path
      when "books"
        Dir.chdir(path) do
          sh "rm '经济/经济学/教材/斯蒂芬·威廉森：宏观经济学 (第3版 扫描版).pdf' || true" # exceeds GitHub's file size limit of 100.00 MB
          # BOOK_TYPES.each do |i|
          #   Dir.chdir(i) { push }
          # end
          push
        end

      when "history", "politics", "military"
        Dir.chdir(path) { push }

      when "blog"
        sh "cp -r /home/runner/btsync/blog/blog/* blog/"
        Dir.chdir(path) { push }

      when "gfw"
        sh "cp -r /home/runner/btsync/gfw/* gfw/"
        Dir.chdir(path) { push }
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
        sh "du -L -h -s /home/runner/btsync/*"
      end

      sleep(1)
      i += 1

    end
  
end
