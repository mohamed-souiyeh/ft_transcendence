
game-dev: volumes front-end

back-end: volumes
	@docker compose -f ./dev-ops/docker-compose.yml up -d  back-end-dev

front-end: volumes
	@docker compose -f ./dev-ops/docker-compose.yml up -d front-end-dev


database: volumes
	@docker compose -f ./dev-ops/docker-compose.yml up -d postgres

volumes:
	@mkdir -p ./dev-ops/volumes/database
	@sudo chmod 777 ./dev-ops/volumes/database

down:
	@docker compose -f ./dev-ops/docker-compose.yml down

# deploy:
# 	docker-compose -f ./dev-ops/docker-compose.yml up 

.PHONY: game-dev back-end front-end down deploy
