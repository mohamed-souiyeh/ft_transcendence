
game-dev:
	docker-compose -f ./dev-ops/docker-compose.yml up -d --build game-dev

back-end:
	docker-compose -f ./dev-ops/docker-compose.yml up -d --build back-end-dev

front-end:
	@cp front-end/package.json dev-ops/front-end-dev/utils/
	docker-compose -f ./dev-ops/docker-compose.yml up -d --build front-end-dev
	@rm dev-ops/front-end-dev/utils/package.json

# deploy:
# 	docker-compose -f ./dev-ops/docker-compose.yml up 

.PHONY: game-dev back-end front-end
