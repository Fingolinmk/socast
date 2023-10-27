# Stage 1: Build stage
FROM alpine:latest as builder
EXPOSE 3005

WORKDIR /build

# Install necessary tools
RUN apk update && apk add --no-cache curl tar

# Download and extract gpodder2go
RUN curl -L -o gpodder2go.tar.gz https://github.com/oxtyped/gpodder2go/releases/download/v0.1.2/gpodder2go_Linux_x86_64.tar.gz
RUN tar xzf gpodder2go.tar.gz

# Stage 2: Final image
FROM alpine:latest

# Set the working directory
WORKDIR /gpodder2go

# Copy the gpodder2go binary from the build stage
COPY --from=builder /build/gpodder2go /gpodder2go/
RUN ./gpodder2go init
RUN ./gpodder2go accounts create moritz --email=Moritz.Kempkes@outlook.com --name="moritz" --password="password"

# Run the gpodder2go binary
CMD ["sh", "-c", "VERIFIER_SECRET_KEY=hamilton ./gpodder2go -b 0.0.0.0:3005 serve"]
#CMD ["VERIFIER_SECRET_KEY="hamilton" ./gpodder2go serve"]