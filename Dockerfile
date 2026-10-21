FROM node:22-alpine
WORKDIR /app
COPY cli ./cli
COPY integrations ./integrations
EXPOSE 3000
CMD ["node","integrations/slack-bot.mjs"]
