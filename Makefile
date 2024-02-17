build: volumes
	@docker compose up --build

# install:
# 	(curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh -s -- --no-package-manager --no-install


re: down build

volumes:
	@mkdir -p ./volumes/database

down:
	@docker compose down

vclean:
	@docker volume rm -f sharedv
	@docker volume rm -f postgres

clean: down vclean
	@docker system prune -af 

.PHONY: game-dev back-end front-end down deploy
