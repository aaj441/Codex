#!/usr/bin/env python3
"""
Analyze Current Project for Railway Deployment Issues
====================================================

This script analyzes the current project (project-xavier) for common
Railway deployment issues and provides specific recommendations.
"""

import os
import json
import re
from pathlib import Path

def analyze_current_project():
    """Analyze the current project for Railway deployment issues."""
    print("🔍 Analyzing Current Project for Railway Deployment Issues")
    print("=" * 60)
    
    project_root = Path(__file__).parent
    issues = []
    recommendations = []
    
    # Check package.json
    package_json_path = project_root / "package.json"
    if package_json_path.exists():
        with open(package_json_path, 'r') as f:
            package_data = json.load(f)
        
        print("📦 Checking package.json...")
        
        # Check for start script
        scripts = package_data.get('scripts', {})
        if 'start' not in scripts:
            issues.append("Missing 'start' script in package.json")
            recommendations.append("Add 'start' script: 'node server/index.js'")
        else:
            print(f"   ✅ Start script: {scripts['start']}")
        
        # Check for build script
        if 'build' not in scripts:
            issues.append("Missing 'build' script in package.json")
            recommendations.append("Add 'build' script: 'vite build'")
        else:
            print(f"   ✅ Build script: {scripts['build']}")
        
        # Check dependencies
        dependencies = package_data.get('dependencies', {})
        dev_dependencies = package_data.get('devDependencies', {})
        
        print(f"   📊 Dependencies: {len(dependencies)} production, {len(dev_dependencies)} dev")
    
    # Check server configuration
    server_path = project_root / "server" / "index.js"
    if server_path.exists():
        print("\n🖥️  Checking server configuration...")
        
        with open(server_path, 'r') as f:
            server_content = f.read()
        
        # Check for PORT environment variable usage
        if 'process.env.PORT' in server_content:
            print("   ✅ Server uses process.env.PORT")
        else:
            issues.append("Server doesn't use process.env.PORT")
            recommendations.append("Update server to use: const PORT = process.env.PORT || 5000")
        
        # Check for proper port binding
        if 'app.listen(PORT' in server_content:
            print("   ✅ Server binds to PORT variable")
        else:
            issues.append("Server doesn't bind to PORT variable")
            recommendations.append("Update to: app.listen(PORT, () => { ... })")
    
    # Check for environment variable usage
    print("\n🔧 Checking environment variable usage...")
    env_vars_found = set()
    
    for root, dirs, files in os.walk(project_root):
        # Skip node_modules and .git
        if any(skip in root for skip in ['node_modules', '.git', '__pycache__']):
            continue
        
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                file_path = Path(root) / file
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Look for process.env usage
                    env_matches = re.findall(r'process\.env\.(\w+)', content)
                    env_vars_found.update(env_matches)
                except:
                    continue
    
    if env_vars_found:
        print(f"   📋 Environment variables found: {', '.join(sorted(env_vars_found))}")
    else:
        print("   ⚠️  No environment variables found")
        recommendations.append("Consider using environment variables for configuration")
    
    # Check for Railway configuration files
    print("\n🚂 Checking Railway configuration...")
    
    railway_files = ['railway.json', 'Procfile', 'Dockerfile']
    for file in railway_files:
        file_path = project_root / file
        if file_path.exists():
            print(f"   ✅ {file} exists")
        else:
            print(f"   ❌ {file} missing")
            if file == 'railway.json':
                recommendations.append("Create railway.json for Railway configuration")
            elif file == 'Procfile':
                recommendations.append("Create Procfile: web: npm start")
            elif file == 'Dockerfile':
                recommendations.append("Create Dockerfile for containerized deployment")
    
    # Check for common Railway issues
    print("\n🔍 Checking for common Railway issues...")
    
    # Check if there's a .env file (shouldn't be committed)
    env_file = project_root / ".env"
    if env_file.exists():
        print("   ⚠️  .env file found (should not be committed to git)")
        recommendations.append("Add .env to .gitignore and use Railway environment variables")
    
    # Check for hardcoded ports
    if server_path.exists():
        with open(server_path, 'r') as f:
            server_content = f.read()
        
        if re.search(r'listen\(\s*3000\s*\)', server_content):
            issues.append("Hardcoded port 3000 found")
            recommendations.append("Replace hardcoded port with process.env.PORT")
    
    # Generate report
    print("\n" + "=" * 60)
    print("📊 ANALYSIS REPORT")
    print("=" * 60)
    
    if issues:
        print(f"\n❌ Issues Found ({len(issues)}):")
        for i, issue in enumerate(issues, 1):
            print(f"   {i}. {issue}")
    else:
        print("\n✅ No issues found!")
    
    if recommendations:
        print(f"\n💡 Recommendations ({len(recommendations)}):")
        for i, rec in enumerate(recommendations, 1):
            print(f"   {i}. {rec}")
    
    # Next steps
    print("\n🚀 Next Steps:")
    print("1. Fix any issues identified above")
    print("2. Run: python3 railway_config_helper.py . --node")
    print("3. Set environment variables in Railway dashboard")
    print("4. Deploy to Railway")
    print("5. Run the full analyzer: python3 railway_deployment_analyzer.py --github-user YOUR_USERNAME")
    
    return len(issues) == 0

if __name__ == "__main__":
    success = analyze_current_project()
    exit(0 if success else 1)