# Load Testing your Dokploy setup

This guide describes how to load test your Dokploy setup.

## Isolation

We want to make sure that one Docker container can not crash the entire VPS, or hog all available CPU.

### Memory Isolation and restart resilience

We are going to make the Vendure Worker consume all it's available memory, resulting in a crash of the container. We expect the container to be restarted automatically.

1. SSH in to your VPS and run `docker ps` to find the container ID of the Vendure Worker.
2. Run the following script to gradually ramp up memory usage until the container crashes.
```bash
docker exec -it <container_name_or_id> bash -c 'arr=(); while true; do arr+=("$(head -c 10485760 </dev/zero | tr "\0" "\1")"); sleep 0.2; done'
```

If all is configured well, you should see the memory increase up to the limit we have set in Dokploy, and the container should be restarted automatically.

**If you have not properly set a memory limit in Dokploy, the script will keep consuming memory untill the entire VPS crashes.** So, please monitor and press ctrl+c to stop the script if you see the memory usage is exceeding your container limit.

### CPU Isolation

We are going to make the Vendure Worker do a CPU intensive task, and check if it does not exceed the limit we have set in Dokploy.
1. SSH in to your VPS and run `docker ps` to find the container ID of the Vendure Worker.
2. Run `docker exec -it <container_name_or_id> sh -c "yes > /dev/null & yes > /dev/null & yes > /dev/null"` to make the Worker consume CPU. You can press `Ctrl+C` to stop the process.
3. Go to Application > Vendure Worker > Monitoring
4. If you have set the CPU limit to `500000000`, then the CPU usage should stay at around 50%.

## Load Testing

We want to get a general idea of how many concurrent users our setup can handle.

TODO
1. Create some Product reindexing jobs to give the worker and the database some load
2. Make the load test consume assets via the main instance
3. Make the load test fetch some products, add to cart, and remove them again.


