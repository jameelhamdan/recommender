# Setup for Reccommender

1- install nodejs/npm

2- install neo4j https://neo4j.com/download/

3- after installing neo4j desktop, add a new graph db with username and password

4- then click on "manage" button on new graph then "plugins" and install "GRAPH ALGORITHMS" plugin 3.5.6.1

5- in project root there is a .env file change "NEO4J_USERNAME" and "NEO4J_PASSWORD" to the ones you entered when creating a graph

6- now you can run "npm start" in project root and the project should start and it will check for neo4j conn and initialize database schema
