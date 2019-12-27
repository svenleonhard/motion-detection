Docker command to create network:
docker network create app-tier

Docker command to start rabbitmq:
docker run -d -p 15672:15672 -p 5672:5672 --hostname rabbitmq --network=app-tier --name rabbit rabbitmq:3-management

For use with Raspberry Pi:
start motion detector: python3 motion-detector