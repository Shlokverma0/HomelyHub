import httpx
from mcp.server.fastmcp import FastMCP

# Server ka naam
mcp = FastMCP("HomelyHub")

BASE_URL = "https://homelyhub-app-np20.onrender.com/api/v1/rent"

@mcp.tool()
async def list_properties(city: str) -> str:
    """Search for available property listings in a specific city. Use this when the user asks to find stays or properties in a location."""
    async with httpx.AsyncClient(timeout=50.0) as client:
        try:
            response = await client.get(f"{BASE_URL}/listing", params={"city": city})
            response.raise_for_status()
            return response.text
        except httpx.HTTPStatusError as e:
            return f"API Error {e.response.status_code}: Could not fetch properties. Details: {e.response.text}"
        except httpx.RequestError as e:
            return f"Network Error: Failed to connect to HomelyHub API. Details: {str(e)}"

@mcp.tool()
async def property_details(property_id: str) -> str:
    """Get detailed information about a specific property using its ID. Use this when the user wants to know more about a particular stay."""
    async with httpx.AsyncClient(timeout=50.0) as client:
        try:
            response = await client.get(f"{BASE_URL}/listing/{property_id}")
            response.raise_for_status()
            return response.text
        except httpx.HTTPStatusError as e:
            return f"API Error {e.response.status_code}: Property not found or server error. Details: {e.response.text}"
        except httpx.RequestError as e:
            return f"Network Error: Failed to connect to HomelyHub API. Details: {str(e)}"

if __name__ == "__main__":
    mcp.run()