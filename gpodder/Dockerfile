# Stage 1: Build stage
FROM alpine:latest as builder
EXPOSE 3005

WORKDIR /build

RUN apk update && apk add --no-cache curl tar

RUN curl -L -o gpodder2go.tar.gz https://github.com/oxtyped/gpodder2go/releases/download/v0.1.2/gpodder2go_Linux_x86_64.tar.gz
RUN tar xzf gpodder2go.tar.gz

# Stage 2: Final image
FROM alpine:latest

WORKDIR /gpodder2go

# Copy the gpodder2go binary from the build stage
COPY --from=builder /build/gpodder2go /gpodder2go/

# Run the gpodder2go binary
CMD ["sh", "-c", "VERIFIER_SECRET_KEY=hamilton ./gpodder2go -b 0.0.0.0:3005 serve"]
#-> need to init the DB once
#RUN ./gpodder2go init
#RUN ./gpodder2go accounts create moritz --email=Moritz.Kempkes@outlook.com --name="moritz" --password="password"
