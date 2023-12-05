game-dev: volumes front-end

back-end: volumes
	@doppler run -- docker compose -f ./dev-ops/docker-compose.yml up -d  back-end-dev

front-end: volumes
	@docker compose -f ./dev-ops/docker-compose.yml up -d front-end-dev


database: volumes
	@docker compose -f ./dev-ops/docker-compose.yml up -d postgres

volumes:
	@mkdir -p ./dev-ops/volumes/database

down:
	@docker compose -f ./dev-ops/docker-compose.yml down

rm_vols:
	@docker volume rm -f $$(docker volume ls -q)

clean: down rm_vols
	@docker system prune -af

# deploy:
# 	docker-compose -f ./dev-ops/docker-compose.yml up 

.PHONY: game-dev back-end front-end down deploy
