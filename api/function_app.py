import os
import logging
import time
import azure.functions as func
from azure.cosmos import CosmosClient
import uuid

app = func.FunctionApp()

# --- NEW SLIDING WINDOW RATE LIMITER TRACKER ---
# Format: { "client_ip": [timestamp1, timestamp2, ...] }
ip_tracker = {}
MAX_REQUESTS_PER_MIN = 3
TIME_WINDOW = 60.0  # 1 minute in seconds

@app.route(route="visitor_counter", methods=["GET"], auth_level=func.AuthLevel.ANONYMOUS)
def visitor_counter(req: func.HttpRequest) -> func.HttpResponse:
    document_id = "1"
    
    # 1. Advanced Rate Limiting Check
    forwarded_for = req.headers.get("X-Forwarded-For")
    client_ip = forwarded_for.split(',')[0].strip() if forwarded_for else "unknown_ip"
    current_time = time.time()

    if client_ip != "unknown_ip":
        # Initialize list for new IP addresses
        if client_ip not in ip_tracker:
            ip_tracker[client_ip] = []
        
        # Remove timestamps older than 60 seconds from this client's history
        ip_tracker[client_ip] = [t for t in ip_tracker[client_ip] if current_time - t < TIME_WINDOW]
        
        # Check if the client has already used up their 3 requests this minute
        if len(ip_tracker[client_ip]) >= MAX_REQUESTS_PER_MIN:
            logging.warning(f"Rate limit exceeded (3 req/min) for client IP: {client_ip}")
            return func.HttpResponse(
                "Too Many Requests. You can only refresh 3 times per minute.", 
                status_code=429
            )
        
        # Log the current request timestamp
        ip_tracker[client_ip].append(current_time)

    # Periodic cleanup of global tracker memory to avoid infinite growth
    if len(ip_tracker) > 1000:
        ip_tracker.clear()
        
    # Lazy load environment variables inside the execution scope
    endpoint = os.environ.get("COSMOS_ENDPOINT")
    key = os.environ.get("COSMOS_KEY")

    if not endpoint or not key:
        logging.error("Database connection configuration missing from app settings.")
        return func.HttpResponse(
            "Server configuration error.", 
            status_code=500
        )
        
    try:
        # Initialize client cleanly on invocation
        client = CosmosClient(endpoint, key)
        database = client.get_database_client("portfolio")
        container = database.get_container_client("counter")

        # Atomic Read-Modify-Write via Cosmos Patch
        patch_operations = [
            {"op": "incr", "path": "/count", "value": 1}
        ]
        
        updated_item = container.patch_item(
            item=document_id, 
            partition_key=document_id, 
            patch_operations=patch_operations
        )
        
        new_count = updated_item.get("count", 0)
        
        return func.HttpResponse(
            f"Visitor count updated to: {new_count}", 
            status_code=200
        )
        
    except Exception as e:
        logging.error(f"Cosmos DB Operation failure: {str(e)}")
        return func.HttpResponse(
            "An error occurred while updating the visitor count.", 
            status_code=500
        )
    
# --- NEW MESSAGE TICKET HANDLER ---    
    
@app.route(route="send_message", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
def send_message(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing a new message ticket.')

    try:
        # 1. Parse inbound form data safely
        req_body = req.get_json()
        name = req_body.get('name')
        email = req_body.get('email')
        message = req_body.get('message')

        # Simple validation check
        if not name or not email or not message:
            return func.HttpResponse("Missing required fields.", status_code=400)

        # 2. Lazy load environment variables
        endpoint = os.environ.get("COSMOS_ENDPOINT")
        key = os.environ.get("COSMOS_KEY")
        
        # 3. Initialize client and connect to the messages container
        client = CosmosClient(endpoint, key)
        database = client.get_database_client("portfolio")
        container = database.get_container_client("messages")

        # 4. Construct the document object
        ticket_document = {
            "id": str(uuid.uuid4()),  # Generates a unique ID for every ticket
            "name": name,
            "email": email,
            "message": message,
            "timestamp": time.time()
        }

        # Save to database
        container.create_item(body=ticket_document)

        return func.HttpResponse("Ticket sent successfully!", status_code=201)

    except ValueError:
        return func.HttpResponse("Invalid JSON payload.", status_code=400)
    except Exception as e:
        logging.error(f"Failed to process ticket: {str(e)}")
        return func.HttpResponse("Internal server error.", status_code=500)