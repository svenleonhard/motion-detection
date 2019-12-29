Docker command to create network:
docker network create app-tier

Docker command to start rabbitmq:
docker run -d -p 15672:15672 -p 5672:5672 --hostname rabbitmq --network=app-tier --name rabbit rabbitmq:3-management

For use with Raspberry Pi:
start motion detector: python3 motion-detector

Setup on Raspberry PI:

1. Update Node
 - Download fitting node binary: https://nodejs.org/en/download/
 - cd node-v6.11.1-linux-armv6l/
 - sudo cp -R * /usr/local/

2. Install Python Dependencies
 - sudo pip3 pika
 - sudo pip3 pandas
 - sudo apt-get install python3-opencv

3. Install Docker
 - curl -sSL https://get.docker.com | sh
 - sudo usermod -aG docker pi
 - docker run hello-world
 - sudo apt-get install libffi-dev libssl-dev
 - sudo pip3 install docker-compose