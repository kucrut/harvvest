FROM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
ARG APP_NAME
ENV APP_NAME=${APP_NAME}
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN ADAPTER=node BUILD_OUT_DIR=/app/build pnpm run build

FROM base
COPY --from=build /app/build /app
COPY --from=build /app/package.json /app/
WORKDIR /app
EXPOSE 3000
CMD [ "node", "/app" ]
