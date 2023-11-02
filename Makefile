
game-dev:
	docker-compose -f ./dev-ops/docker-compose.yml up -d --build game-dev

back-end:
	docker-compose -f ./dev-ops/docker-compose.yml up -d --build back-end-dev

front-end:
	docker-compose -f ./dev-ops/docker-compose.yml up -d --build front-end-dev

# deploy:
# 	docker-compose -f ./dev-ops/docker-compose.yml up 

.PHONY: game-dev back-end front-end
