SHELL := /usr/bin/env bash
.SHELLFLAGS := -euo pipefail -c

.PHONY: setup ci test test-unit test-smoke lint fmt build dev

setup:
	@echo "==> Installing dependencies"
	npm ci

fmt:
	@echo "==> Running format checks"
	npm run fmt

lint:
	@echo "==> Running lint checks"
	npm run lint

test: test-unit

test-unit:
	@echo "==> Running unit + integration tests"
	npm run test:unit

test-smoke:
	@echo "==> Running smoke test subset"
	npm run test:smoke

build:
	@echo "==> Building dist artifacts"
	npm run build

ci: setup fmt lint test-unit test-smoke build
	@echo "==> CI checks passed"

# serves the static build output
dev: build
	python3 -m http.server 4173 --directory dist
