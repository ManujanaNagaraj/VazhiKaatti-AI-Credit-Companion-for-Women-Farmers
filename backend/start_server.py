#!/usr/bin/env python
"""
VazhiKaatti - Server Startup Script
Convenient script to start the backend server
"""

import os
import sys
import subprocess
import argparse


def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import joblib
        import sklearn
        import pandas
        print("✓ All dependencies installed")
        return True
    except ImportError as e:
        print(f"✗ Missing dependency: {e}")
        print("\nInstall dependencies with:")
        print("  pip install -r requirements.txt")
        return False


def check_model_files():
    """Check if model files exist"""
    model_path = os.path.join("models", "credit_model.pkl")
    scaler_path = os.path.join("models", "scaler.pkl")
    
    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        print("⚠  Model files not found!")
        print("\nTrain the model first:")
        print("  python train_model.py")
        return False
    
    print("✓ Model files found")
    return True


def start_server(host: str = "0.0.0.0", port: int = 8000, reload: bool = True):
    """Start the FastAPI server"""
    print("\n" + "="*70)
    print("🌾 VazhiKaatti Backend Server")
    print("="*70)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check model files
    if not check_model_files():
        response = input("\nContinue without model? (y/n): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    print(f"\n🚀 Starting server on http://{host}:{port}")
    print(f"📡 API Documentation: http://{host}:{port}/docs")
    print(f"🔄 Auto-reload: {'Enabled' if reload else 'Disabled'}")
    print("\n" + "="*70 + "\n")
    
    # Start uvicorn server
    cmd = [
        "uvicorn",
        "main:app",
        f"--host={host}",
        f"--port={port}"
    ]
    
    if reload:
        cmd.append("--reload")
    
    try:
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\n\n✓ Server stopped")
    except Exception as e:
        print(f"\n✗ Error starting server: {e}")
        sys.exit(1)


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="VazhiKaatti Backend Server")
    parser.add_argument(
        "--host",
        type=str,
        default="0.0.0.0",
        help="Host address (default: 0.0.0.0)"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Port number (default: 8000)"
    )
    parser.add_argument(
        "--no-reload",
        action="store_true",
        help="Disable auto-reload"
    )
    
    args = parser.parse_args()
    
    start_server(
        host=args.host,
        port=args.port,
        reload=not args.no_reload
    )


if __name__ == "__main__":
    main()
