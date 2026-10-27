# HomelyHub MCP Server

A Python MCP (Model Context Protocol) server that exposes the HomelyHub REST API as tools an LLM can call.

## Tools
- `list_properties`: lists available stays. Use when the user asks for places to stay.
- `property_details`: returns details of one property by ID.

## Run
cd mcp-server
pip install -r requirements.txt
mcp dev server.py

## Notes
- Handles HTTP errors, network failures and timeouts with httpx.
- The backend runs on Render Free, so the first request may be slow while it wakes up.