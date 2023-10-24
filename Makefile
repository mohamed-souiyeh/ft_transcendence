
game-dev:
	docker-compose -f ./dev-ops/docker-compose.yml up --build game-dev

back-end:
	docker-compose -f ./dev-ops/docker-compose.yml up --build back-end-dev

front-end:
	docker-compose -f ./dev-ops/docker-compose.yml up --build front-end-dev

# deploy:
# 	docker-compose -f ./dev-ops/docker-compose.yml up 
