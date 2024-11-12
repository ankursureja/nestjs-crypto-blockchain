<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Nest.js Redis-based Crypto Rates App

This application is a Nest.js backend service designed to fetch, store, and distribute cryptocurrency rates using Redis for caching and WebSockets for real-time updates.

## Features

- Fetch and cache cryptocurrency rates every 10 mintues
- Provide CRUD operations over Redis.
- Real-time broadcast of cryptocurrency rates updates to connected clients via WebSockets.
- Rate limiting to protect against brute force attacks.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- Redis server
- An API key from Coinlayer

### Installation

1. Clone the repository:
   `git clone git@github.com:razlevio/crypto-backend.git`

2. Install dependencies:
   `npm install`
3. Set up your environment variables:
   - The project provided with `.env` file populated with the redis upstash deployement and coinlayer api keys, In real world project, you should never commit the `.env` file and expose your secerts, this provided here for quick demonstration for the job position assignment.

## Usage

The application exposes several endpoints for interacting with cryptocurrency rates and Redis data:

- **GET `/last`**: Fetch the last stored crypto rates from Redis. This endpoint is rate-limited to maximum of 30 calls per hour to prevent abuse.
- **CRON `EVERY_10_MINUTES`**: Automatically fetches latest cryptocurrency rates from coinlayer api every 10 minutes and stores them in Redis that deployed in Upstash.

### WebSocket Events

- **subscribeToCryptoRates**: Clients can subscribe to this event to receive real-time updates on cryptocurrency rates.
- **broadcastUpdateSignal**: Broadcasts an update signal to all connected clients about new crypto rates.
- **broadcastUpdatedCryptoData**: Brodcasts the updated crypto rates to all connected clients.

### Development

- To start the application in development mode, use `npm run start:dev`.
- Ensure you have configured CORS paths properly in `main.ts` and `crypto.gateway.ts` for your development and production environments, instructions resides in the code as comments.

### Deployment

- This application is container-ready. You can deploy it using Docker or to any cloud provider that supports Node.js applications, such as Vercel, Heroku, or AWS.
- This application is kuberenets-ready. You have `k8s` folder with the deployment yaml scripts. You can deploy it to any kuberenets cluster cloud provider like Google Cloud Kuberenets Engine.

## Important

**`Make sure to adjust paths, URLs, and any specific installation or configuration instruction instructions provided above and as comment in the code`**

## Docker and Kuberenets CMD's

```bash
$ docker build -t razlevio/crypto-backend:latest .
$ docker run -p 4000:4000 --env-file .env razlevio/crypto-backend
$ docker push razlevio/crypto-backend:latest
$ kubectl create secret generic crypto-redis-secret --from-literal=UPSTASH_REDIS_REST_TOKEN='<your-upstash-redis-rest-token>'
$ kubectl create secret generic crypto-coinlayer-secret --from-literal=COINLAYER_API_KEY='<your-coinlayer-api-key>'
$ kubectl apply -f k8s/crypto-backend-deployment.yaml
$ kubectl apply -f k8s/crypto-backend-service.yaml
$ kubectl apply -f k8s/ingress.yaml
```
