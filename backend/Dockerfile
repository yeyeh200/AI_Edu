FROM denoland/deno:1.40.0

WORKDIR /app

# Cache dependencies
COPY deno.json deno.lock ./
RUN deno cache src/main.ts

# Copy source code
COPY . .

EXPOSE 8000

# Run the server
CMD ["run", "-A", "src/main.ts"]
