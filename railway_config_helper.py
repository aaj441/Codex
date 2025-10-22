#!/usr/bin/env python3
"""
Railway Configuration Helper
============================

This script helps create and validate Railway configuration files
for your projects to prevent common deployment issues.
"""

import json
import os
import sys
from pathlib import Path
from typing import List

def create_railway_json(project_path: str, node_project: bool = True) -> None:
    """Create a railway.json configuration file for the project."""
    railway_config = {
        "$schema": "https://railway.app/railway.schema.json",
        "build": {
            "builder": "NIXPACKS"
        },
        "deploy": {
            "startCommand": "npm start",
            "healthcheckPath": "/api/health",
            "healthcheckTimeout": 100,
            "restartPolicyType": "ON_FAILURE",
            "restartPolicyMaxRetries": 10
        }
    }
    
    if node_project:
        railway_config["build"]["buildCommand"] = "npm run build"
        railway_config["deploy"]["startCommand"] = "npm start"
    else:
        # For Python projects
        railway_config["build"]["buildCommand"] = "pip install -r requirements.txt"
        railway_config["deploy"]["startCommand"] = "python main.py"
    
    config_path = os.path.join(project_path, "railway.json")
    
    with open(config_path, 'w') as f:
        json.dump(railway_config, f, indent=2)
    
    print(f"✅ Created railway.json at {config_path}")

def create_procfile(project_path: str, start_command: str = "npm start") -> None:
    """Create a Procfile for Railway deployment."""
    procfile_path = os.path.join(project_path, "Procfile")
    
    with open(procfile_path, 'w') as f:
        f.write(f"web: {start_command}\n")
    
    print(f"✅ Created Procfile at {procfile_path}")

def check_environment_variables(project_path: str) -> List[str]:
    """Check for common environment variable issues in the project."""
    issues = []
    
    # Check package.json for start script
    package_json_path = os.path.join(project_path, "package.json")
    if os.path.exists(package_json_path):
        with open(package_json_path, 'r') as f:
            package_data = json.load(f)
            
        scripts = package_data.get('scripts', {})
        if 'start' not in scripts:
            issues.append("Missing 'start' script in package.json")
        
        if 'build' not in scripts:
            issues.append("Missing 'build' script in package.json")
    
    # Check for environment variable usage
    env_vars_found = set()
    for root, dirs, files in os.walk(project_path):
        # Skip node_modules
        if 'node_modules' in root:
            continue
            
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Look for process.env usage
                    import re
                    env_matches = re.findall(r'process\.env\.(\w+)', content)
                    env_vars_found.update(env_matches)
                except:
                    continue
    
    # Check for common missing env vars
    common_vars = ['PORT', 'DATABASE_URL', 'NODE_ENV']
    for var in common_vars:
        if var not in env_vars_found:
            issues.append(f"Consider using process.env.{var} for Railway compatibility")
    
    return issues

def create_dockerfile(project_path: str, node_version: str = "18") -> None:
    """Create a Dockerfile for Railway deployment."""
    dockerfile_content = f"""FROM node:{node_version}-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
"""
    
    dockerfile_path = os.path.join(project_path, "Dockerfile")
    
    with open(dockerfile_path, 'w') as f:
        f.write(dockerfile_content)
    
    print(f"✅ Created Dockerfile at {dockerfile_path}")

def main():
    """Main function to set up Railway configuration."""
    if len(sys.argv) < 2:
        print("Usage: python railway_config_helper.py <project_path> [--node|--python]")
        sys.exit(1)
    
    project_path = sys.argv[1]
    project_type = "node"
    
    if len(sys.argv) > 2:
        if sys.argv[2] == "--python":
            project_type = "python"
        elif sys.argv[2] == "--node":
            project_type = "node"
    
    if not os.path.exists(project_path):
        print(f"❌ Project path does not exist: {project_path}")
        sys.exit(1)
    
    print(f"🔧 Setting up Railway configuration for {project_type} project at {project_path}")
    
    # Create configuration files
    if project_type == "node":
        create_railway_json(project_path, node_project=True)
        create_procfile(project_path, "npm start")
        create_dockerfile(project_path)
    else:
        create_railway_json(project_path, node_project=False)
        create_procfile(project_path, "python main.py")
    
    # Check for common issues
    print("\n🔍 Checking for common issues...")
    issues = check_environment_variables(project_path)
    
    if issues:
        print("\n⚠️  Potential issues found:")
        for issue in issues:
            print(f"  • {issue}")
    else:
        print("✅ No obvious issues found")
    
    print("\n📋 Next steps:")
    print("1. Review the generated configuration files")
    print("2. Set environment variables in Railway dashboard")
    print("3. Deploy your project to Railway")
    print("4. Run the deployment analyzer to check for issues")

if __name__ == "__main__":
    main()