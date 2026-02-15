.PHONY: setup ci test lint fmt build dev

setup:
	npm ci

fmt:
	npm run fmt

lint:
	npm run lint

test:
	npm run test

build:
	npm run build

ci: setup fmt lint test build

# serves the static build output
dev: build
	python3 -m http.server 4173 --directory dist
