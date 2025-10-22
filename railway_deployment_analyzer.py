#!/usr/bin/env python3
"""
Railway Deployment Failure Analyzer
===================================

A comprehensive tool to analyze Railway deployment failures across GitHub repositories.
This script fetches deployment logs and provides detailed analysis of common failure patterns.

Usage:
    python railway_deployment_analyzer.py

Requirements:
    - GitHub Personal Access Token
    - Railway CLI installed and authenticated (optional)
    - Python packages: requests, subprocess, json, re, datetime
"""

import requests
import subprocess
import json
import re
import os
import sys
from datetime import datetime
from typing import List, Dict, Optional, Tuple
import argparse

class RailwayDeploymentAnalyzer:
    def __init__(self, github_user: str, github_token: str, railway_token: Optional[str] = None):
        self.github_user = github_user
        self.github_token = github_token
        self.railway_token = railway_token
        
        self.gh_headers = {
            "Authorization": f"token {github_token}",
            "Accept": "application/vnd.github.v3+json",
        }
        
        # Common Railway deployment failure patterns
        self.failure_patterns = {
            'missing_env_vars': [
                r'missing environment variable',
                r'undefined environment variable',
                r'process\.env\.\w+ is undefined',
                r'OPENAI_API_KEY',
                r'DATABASE_URL',
                r'PORT',
                r'RAILWAY_ENVIRONMENT'
            ],
            'port_binding': [
                r'port binding',
                r'port not bound',
                r'listen EADDRINUSE',
                r'address already in use',
                r'bind.*port',
                r'PORT.*required',
                r'listen.*failed'
            ],
            'build_failures': [
                r'build failed',
                r'npm install.*failed',
                r'node_modules.*not found',
                r'package\.json.*not found',
                r'build script.*failed',
                r'webpack.*error',
                r'vite.*error'
            ],
            'runtime_errors': [
                r'process crashed',
                r'uncaught exception',
                r'error.*at.*line',
                r'TypeError',
                r'ReferenceError',
                r'Cannot read property',
                r'undefined is not a function'
            ],
            'database_issues': [
                r'database.*connection.*failed',
                r'sqlite.*error',
                r'database.*locked',
                r'ENOENT.*database',
                r'SQL.*error'
            ],
            'memory_issues': [
                r'out of memory',
                r'heap.*out of memory',
                r'memory.*limit',
                r'process.*killed'
            ],
            'timeout_issues': [
                r'timeout',
                r'request.*timeout',
                r'deployment.*timeout',
                r'build.*timeout'
            ],
            'dependency_issues': [
                r'module.*not found',
                r'Cannot resolve',
                r'peer dependency',
                r'version.*conflict',
                r'npm.*error'
            ]
        }
        
        # Railway-specific error patterns
        self.railway_patterns = {
            'railway_config': [
                r'railway\.json.*not found',
                r'railway.*config.*error',
                r'deployment.*config.*invalid'
            ],
            'railway_limits': [
                r'resource.*limit',
                r'quota.*exceeded',
                r'deployment.*limit',
                r'build.*limit'
            ]
        }

    def get_github_repos(self) -> List[Dict]:
        """Fetch all repositories for the GitHub user."""
        print(f"🔍 Fetching repositories for user: {self.github_user}")
        
        repos = []
        page = 1
        per_page = 100
        
        while True:
            url = f"https://api.github.com/users/{self.github_user}/repos"
            params = {
                'per_page': per_page,
                'page': page,
                'type': 'owner',
                'sort': 'updated'
            }
            
            try:
                response = requests.get(url, headers=self.gh_headers, params=params)
                response.raise_for_status()
                page_repos = response.json()
                
                if not page_repos:
                    break
                    
                repos.extend(page_repos)
                page += 1
                
            except requests.exceptions.RequestException as e:
                print(f"❌ Error fetching repositories: {e}")
                break
        
        print(f"✅ Found {len(repos)} repositories")
        return repos

    def check_railway_cli(self) -> bool:
        """Check if Railway CLI is installed and authenticated."""
        try:
            result = subprocess.run(['railway', '--version'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                print("✅ Railway CLI is installed")
                return True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        
        print("⚠️  Railway CLI not found or not accessible")
        return False

    def get_railway_projects(self) -> List[Dict]:
        """Get Railway projects using CLI."""
        if not self.check_railway_cli():
            return []
        
        try:
            result = subprocess.run(['railway', 'status'], 
                                  capture_output=True, text=True, timeout=30)
            if result.returncode == 0:
                # Parse Railway status output
                projects = []
                lines = result.stdout.split('\n')
                for line in lines:
                    if 'project' in line.lower() and 'service' in line.lower():
                        # Extract project and service info
                        parts = line.split()
                        if len(parts) >= 2:
                            projects.append({
                                'name': parts[0],
                                'service': parts[1] if len(parts) > 1 else 'default'
                            })
                return projects
        except subprocess.TimeoutExpired:
            print("⏰ Railway CLI command timed out")
        except Exception as e:
            print(f"❌ Error running Railway CLI: {e}")
        
        return []

    def get_railway_logs(self, project_name: str, service_name: str = 'default') -> str:
        """Fetch Railway deployment logs using CLI."""
        if not self.check_railway_cli():
            return "Railway CLI not available"
        
        try:
            # Try to get logs for the specific project/service
            cmd = ['railway', 'logs', '--project', project_name]
            if service_name != 'default':
                cmd.extend(['--service', service_name])
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                return result.stdout
            else:
                return f"Error fetching logs: {result.stderr}"
                
        except subprocess.TimeoutExpired:
            return "Log fetch timed out"
        except Exception as e:
            return f"Error running Railway CLI: {e}"

    def analyze_logs(self, logs: str) -> Dict[str, List[str]]:
        """Analyze logs for common failure patterns."""
        findings = {}
        logs_lower = logs.lower()
        
        # Check each category of failure patterns
        for category, patterns in self.failure_patterns.items():
            matches = []
            for pattern in patterns:
                if re.search(pattern, logs_lower, re.IGNORECASE):
                    matches.append(pattern)
            
            if matches:
                findings[category] = matches
        
        # Check Railway-specific patterns
        for category, patterns in self.railway_patterns.items():
            matches = []
            for pattern in patterns:
                if re.search(pattern, logs_lower, re.IGNORECASE):
                    matches.append(pattern)
            
            if matches:
                findings[category] = matches
        
        return findings

    def generate_recommendations(self, findings: Dict[str, List[str]]) -> List[str]:
        """Generate actionable recommendations based on findings."""
        recommendations = []
        
        if 'missing_env_vars' in findings:
            recommendations.append("🔧 Add missing environment variables in Railway dashboard")
            recommendations.append("   - Check for OPENAI_API_KEY, DATABASE_URL, PORT, etc.")
            recommendations.append("   - Ensure all required env vars are set in production")
        
        if 'port_binding' in findings:
            recommendations.append("🔧 Fix port binding issues")
            recommendations.append("   - Ensure your app listens on process.env.PORT")
            recommendations.append("   - Add: app.listen(process.env.PORT || 3000)")
        
        if 'build_failures' in findings:
            recommendations.append("🔧 Fix build configuration")
            recommendations.append("   - Check package.json scripts")
            recommendations.append("   - Ensure all dependencies are in package.json")
            recommendations.append("   - Verify build commands work locally")
        
        if 'runtime_errors' in findings:
            recommendations.append("🔧 Fix runtime errors")
            recommendations.append("   - Check for undefined variables")
            recommendations.append("   - Add proper error handling")
            recommendations.append("   - Test locally before deploying")
        
        if 'database_issues' in findings:
            recommendations.append("🔧 Fix database configuration")
            recommendations.append("   - Check DATABASE_URL environment variable")
            recommendations.append("   - Ensure database is accessible from Railway")
            recommendations.append("   - Check SQLite file permissions")
        
        if 'memory_issues' in findings:
            recommendations.append("🔧 Optimize memory usage")
            recommendations.append("   - Check for memory leaks")
            recommendations.append("   - Optimize large data processing")
            recommendations.append("   - Consider upgrading Railway plan")
        
        if 'timeout_issues' in findings:
            recommendations.append("🔧 Fix timeout issues")
            recommendations.append("   - Optimize build process")
            recommendations.append("   - Reduce bundle size")
            recommendations.append("   - Check for long-running operations")
        
        if 'dependency_issues' in findings:
            recommendations.append("🔧 Fix dependency issues")
            recommendations.append("   - Run npm install locally")
            recommendations.append("   - Check for version conflicts")
            recommendations.append("   - Update package-lock.json")
        
        if 'railway_config' in findings:
            recommendations.append("🔧 Fix Railway configuration")
            recommendations.append("   - Check railway.json configuration")
            recommendations.append("   - Verify build and start commands")
        
        if 'railway_limits' in findings:
            recommendations.append("🔧 Check Railway limits")
            recommendations.append("   - Review resource usage")
            recommendations.append("   - Consider upgrading plan")
        
        return recommendations

    def analyze_repo(self, repo: Dict) -> Dict:
        """Analyze a single repository for deployment issues."""
        repo_name = repo['name']
        repo_url = repo['html_url']
        last_updated = repo['updated_at']
        
        print(f"\n📁 Analyzing: {repo_name}")
        print(f"   URL: {repo_url}")
        print(f"   Last updated: {last_updated}")
        
        # Try to get Railway logs
        logs = self.get_railway_logs(repo_name)
        
        # Analyze logs for failure patterns
        findings = self.analyze_logs(logs)
        
        # Generate recommendations
        recommendations = self.generate_recommendations(findings)
        
        # Determine overall status
        if not findings:
            status = "✅ No issues detected"
        else:
            status = f"❌ {len(findings)} issue categories found"
        
        return {
            'repo_name': repo_name,
            'repo_url': repo_url,
            'last_updated': last_updated,
            'status': status,
            'findings': findings,
            'recommendations': recommendations,
            'logs_preview': logs[:500] + "..." if len(logs) > 500 else logs
        }

    def generate_report(self, analyses: List[Dict]) -> str:
        """Generate a comprehensive report."""
        report = []
        report.append("=" * 80)
        report.append("RAILWAY DEPLOYMENT FAILURE ANALYSIS REPORT")
        report.append("=" * 80)
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"GitHub User: {self.github_user}")
        report.append(f"Repositories Analyzed: {len(analyses)}")
        report.append("")
        
        # Summary
        total_repos = len(analyses)
        repos_with_issues = len([a for a in analyses if a['findings']])
        repos_healthy = total_repos - repos_with_issues
        
        report.append("📊 SUMMARY")
        report.append("-" * 40)
        report.append(f"Total Repositories: {total_repos}")
        report.append(f"Repositories with Issues: {repos_with_issues}")
        report.append(f"Healthy Repositories: {repos_healthy}")
        report.append("")
        
        # Detailed analysis for each repo
        for analysis in analyses:
            report.append("=" * 60)
            report.append(f"REPOSITORY: {analysis['repo_name']}")
            report.append("=" * 60)
            report.append(f"URL: {analysis['repo_url']}")
            report.append(f"Last Updated: {analysis['last_updated']}")
            report.append(f"Status: {analysis['status']}")
            report.append("")
            
            if analysis['findings']:
                report.append("🔍 ISSUES FOUND:")
                for category, patterns in analysis['findings'].items():
                    report.append(f"  • {category.replace('_', ' ').title()}:")
                    for pattern in patterns:
                        report.append(f"    - {pattern}")
                report.append("")
                
                report.append("💡 RECOMMENDATIONS:")
                for rec in analysis['recommendations']:
                    report.append(f"  {rec}")
                report.append("")
            else:
                report.append("✅ No deployment issues detected")
                report.append("")
            
            if analysis['logs_preview']:
                report.append("📋 LOGS PREVIEW:")
                report.append("-" * 40)
                report.append(analysis['logs_preview'])
                report.append("")
        
        return "\n".join(report)

    def run_analysis(self, limit: Optional[int] = None) -> None:
        """Run the complete analysis."""
        print("🚀 Starting Railway Deployment Analysis")
        print("=" * 50)
        
        # Get repositories
        repos = self.get_github_repos()
        
        if limit:
            repos = repos[:limit]
            print(f"🔍 Limiting analysis to first {limit} repositories")
        
        # Analyze each repository
        analyses = []
        for i, repo in enumerate(repos, 1):
            print(f"\n[{i}/{len(repos)}] Analyzing {repo['name']}...")
            analysis = self.analyze_repo(repo)
            analyses.append(analysis)
        
        # Generate and save report
        report = self.generate_report(analyses)
        
        # Save report to file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_filename = f"railway_deployment_report_{timestamp}.txt"
        
        with open(report_filename, 'w') as f:
            f.write(report)
        
        print(f"\n📄 Report saved to: {report_filename}")
        print("\n" + "=" * 80)
        print("ANALYSIS COMPLETE")
        print("=" * 80)
        print(report)

def main():
    parser = argparse.ArgumentParser(description='Analyze Railway deployment failures')
    parser.add_argument('--github-user', required=True, help='GitHub username')
    parser.add_argument('--github-token', help='GitHub Personal Access Token (will prompt if not provided)')
    parser.add_argument('--railway-token', help='Railway API token (optional)')
    parser.add_argument('--limit', type=int, help='Limit analysis to first N repositories')
    
    args = parser.parse_args()
    
    # Get GitHub token if not provided
    github_token = args.github_token
    if not github_token:
        github_token = input("Enter your GitHub Personal Access Token: ").strip()
    
    if not github_token:
        print("❌ GitHub token is required")
        sys.exit(1)
    
    # Create analyzer and run analysis
    analyzer = RailwayDeploymentAnalyzer(
        github_user=args.github_user,
        github_token=github_token,
        railway_token=args.railway_token
    )
    
    try:
        analyzer.run_analysis(limit=args.limit)
    except KeyboardInterrupt:
        print("\n\n⏹️  Analysis interrupted by user")
    except Exception as e:
        print(f"\n❌ Analysis failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()