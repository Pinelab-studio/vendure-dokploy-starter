# Load Testing your Dokploy setup

This guide describes how to load test your Dokploy setup.

## Isolation

We want to make sure that one Docker container can not crash the entire VPS, or hog all CPU usage.

TODO
1. CPU isolation: Make Worker consume 100% CPU should still allow the API to function
2. Memory isolation: Make Worker consume 100% memory should still allow the API to function

## Load Testing

We want to get a general idea of how many concurrent users our setup can handle.

TODO
1. Create some Product reindexing jobs to give the worker and the database some load
2. Make the load test consume assets via the main instance
3. Make the load test fetch some products, add to cart, and remove them again.


