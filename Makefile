game-dev: volumes front-end

back-end: volumes studio
	@doppler run -- docker compose -f ./dev-ops/docker-compose.yml up -d --build  back-end-dev

front-end: volumes
	@doppler run -- docker compose -f ./dev-ops/docker-compose.yml up -d --build front-end-dev


database: volumes studio
	@doppler run -- docker compose -f ./dev-ops/docker-compose.yml up -d postgres

studio: volumes
	@doppler run -- docker compose -f ./dev-ops/docker-compose.yml up -d studio

volumes:
	@mkdir -p ./dev-ops/volumes/database

down:
	@docker compose -f ./dev-ops/docker-compose.yml down

clean: down
	@docker volume rm -f sharedv
	@docker volume rm -f postgres
	@docker system prune -af

# deploy:
# 	docker-compose -f ./dev-ops/docker-compose.yml up 

.PHONY: game-dev back-end front-end down deploy
