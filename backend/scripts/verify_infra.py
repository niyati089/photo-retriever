import sys
import os
import asyncio
from dotenv import load_dotenv

# Add backend directory to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

print("Starting Infrastructure Verification Script...", flush=True)

try:
    from app.config import settings
    print("Imported settings", flush=True)
    from app.core.database import init_db, db
    print("Imported database module", flush=True)
except Exception as e:
    print(f"Failed to import modules: {e}", flush=True)
    import traceback
    traceback.print_exc()
    sys.exit(1)

async def verify_infrastructure():
    print("Starting Infrastructure Verification Logic...", flush=True)
    
    # Load env vars
    load_dotenv()
    print(f"DEBUG: MONGODB_URL from settings: {settings.mongodb_url}", flush=True)
    print(f"DEBUG: PINECONE_API_KEY from settings: {'*' * len(settings.pinecone_api_key) if settings.pinecone_api_key else 'None'}", flush=True)
    
    try:
        # Initialize connections
        print("Calling init_db()...", flush=True)
        await init_db()
        print("init_db() completed.", flush=True)
        
        # Verify MongoDB
        print("\nChecking MongoDB Connection...")
        if db.client:
            try:
                await db.client.admin.command('ping')
                print("MongoDB Connection: SUCCESS")
                print(f"   URL: {settings.mongodb_url}")
            except Exception as e:
                 print(f"MongoDB Connection: FAILED ({e})")
        else:
            print("MongoDB Client not initialized")

        # Verify Pinecone
        print("\nChecking Pinecone Connection...")
        if db.pinecone:
            try:
                # List indexes to verify API key
                indexes = db.pinecone.list_indexes()
                print("Pinecone API Connection: SUCCESS")
                print(f"   Environment: {settings.pinecone_env}")
                
                # Check specific index
                index_names = [i.name for i in indexes]
                if settings.pinecone_index_name in index_names:
                    print(f"Index '{settings.pinecone_index_name}': FOUND")
                    stats = db.pinecone_index.describe_index_stats()
                    print(f"   Stats: {stats}")
                else:
                    print(f"⚠️ Index '{settings.pinecone_index_name}': NOT FOUND (Will be created on app startup if configured correctly)")
            except Exception as e:
                print(f"Pinecone Connection: FAILED ({e})")
        else:
            print("⚠️ Pinecone Client not initialized (Check API Key)")

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"\nVerification Script Failed: {e}")

if __name__ == "__main__":
    asyncio.run(verify_infrastructure())
