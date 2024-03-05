FROM node:alpine

COPY . /src

ARG APP_NAME
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	export PNPM_HOME="/pnpm" \
	&& export PATH="$PNPM_HOME:$PATH" \
	&& corepack enable \
	&& pnpm install --dir=/src --frozen-lockfile \
	&& ADAPTER=node APP_NAME=${APP_NAME} BUILD_OUT_DIR=/app pnpm run --dir=/src build \
	&& cp /src/package.json /app/ \
	&& rm -rf /src

WORKDIR /app
EXPOSE 3000
CMD [ "node", "/app" ]
