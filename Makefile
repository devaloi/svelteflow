.PHONY: dev build test test-e2e lint format seed migrate

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

test-e2e:
	npm run test:e2e

lint:
	npm run lint

format:
	npm run format

seed:
	npm run seed

migrate:
	npm run migrate

check:
	npm run check
