build: volumes install
	@./doppler run -- docker compose -f ./dev-ops/docker-compose.yml up -d --build

install:
	(curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh -s -- --no-package-manager --no-install


re: down build

volumes:
	@mkdir -p ./dev-ops/volumes/database

down:
	@docker compose -f ./dev-ops/docker-compose.yml down

vclean:
	@docker volume rm -f sharedv
	@docker volume rm -f postgres

clean: down vclean
	@docker system prune -af

# deploy:
# 	docker-compose -f ./dev-ops/docker-compose.yml up 

.PHONY: game-dev back-end front-end down deploy
