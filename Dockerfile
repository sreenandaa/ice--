
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY intercollege/pom.xml .
COPY intercollege/src ./src

RUN mvn -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/intercollege-0.0.1-SNAPSHOT.jar app.jar
COPY intercollege/data ./data

EXPOSE 8080

CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
