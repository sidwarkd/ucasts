@config = {}
@config[:server] = "enter your server here"
@config[:port] = "enter your server port here"
@config[:db] = "database name"
@config[:user] = "username"
@config[:pw] = "password"

desc "Create a new episode template"
task :new_episode do
  title = ask('Title: ')
  permalink = ask('Permalink: ')
  caption = ask('Caption: ')
  episode_num = ask('Episode Number: ')

  episode_json = "{\n  \"title\": \"#{title}\",\n  \"permalink\": \"#{permalink}\",\n  \"caption\": \"#{caption}\",\n  "
  episode_json << "\"image\": \"\",\n  \"video\": \"\",\n  "
  episode_json << "\"resources\": [\n    {\"href\": \"\", \"text\": \"\" }\n  ],\n  "
  episode_json << "\"parts\": [\n    {\"name\": \"\", \"quantity\": 0 }\n  ],\n  "
  episode_json << "\"notes\": \"\",\n  \"tags\": [],\n  \"episode_num\": #{episode_num},\n  \"published\": false\n}"

  path = "./episodes/#{permalink}.json"
  unless File.exist? path
    File.open(path, "w") do |file|
      file.write(episode_json)
    end
    puts "New episode created for you at #{path}."
  else
    puts "I couldn't create an article for you because one already exists at #{path}."
  end
end

desc "Push an episode up to the database"
task :push_episode, :path do |t, args|
  path = args.path
  cmd = "python dbloader.py --server #{@config[:server]} --port #{@config[:port]} --db #{@config[:db]} --user #{@config[:user]} --pw \"#{@config[:pw]}\" --episode #{path}"
  # cmd = "python dbloader.py --episode #{path}"
  `#{cmd}`
  puts "Episode has been pushed to the database."
end

def ask message
  print message
  STDIN.gets.chomp
end