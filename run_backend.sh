#!/bin/bash
cd /home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter/backend
/home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter/backend/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
