# Check if docker is running
docker_state=$(docker info >/dev/null 2>&1)
if [[ $? -ne 0 ]]; then
    echo "Docker is no-bueno"
    exit 1
fi
