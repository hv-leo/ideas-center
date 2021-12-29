call heroku login
call heroku container:login

call cd backend 
call heroku container:push web --context-path=.. --arg env=prod --app salty-ravine-34635
call heroku container:release web --app salty-ravine-34635

call cd ../frontend
call heroku container:push web --context-path=.. --arg env=prod --app vast-falls-51494
call heroku container:release web --app vast-falls-51494

call heroku open --app vast-falls-51494
call cd ..
