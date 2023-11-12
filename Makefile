
game-dev:
	docker-compose -f ./dev-ops/docker-compose.yml up -d --build game-dev

back-end:
	docker-compose -f ./dev-ops/docker-compose.yml up -d --build back-end-dev

front-end:
	docker-compose -f ./dev-ops/docker-compose.yml up -d --build front-end-dev

down:
	@docker-compose -f ./dev-ops/docker-compose.yml down

# deploy:
# 	docker-compose -f ./dev-ops/docker-compose.yml up 

.PHONY: game-dev back-end front-end
