# Railway Deployment Failure Analyzer

A comprehensive Python tool to analyze Railway deployment failures across your GitHub repositories. This tool helps identify common deployment issues and provides actionable recommendations to fix them.

## Features

- 🔍 **Automated Repository Analysis**: Fetches all your GitHub repositories and analyzes their Railway deployment status
- 📊 **Comprehensive Error Detection**: Identifies 10+ categories of common deployment failures
- 🛠️ **Actionable Recommendations**: Provides specific steps to fix identified issues
- 📋 **Detailed Reporting**: Generates comprehensive reports with findings and solutions
- 🚀 **Railway CLI Integration**: Uses Railway CLI to fetch real deployment logs
- ⚡ **Batch Processing**: Analyzes multiple repositories in one run

## Installation

1. **Install Python dependencies**:
   ```bash
   pip3 install -r requirements.txt
   ```

2. **Install Railway CLI** (optional, for real log fetching):
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Get GitHub Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` scope
   - Copy the token for use with the analyzer

## Usage

### Basic Usage

```bash
python3 railway_deployment_analyzer.py --github-user YOUR_USERNAME
```

The script will prompt you for your GitHub token if not provided.

### Advanced Usage

```bash
# With command line arguments
python3 railway_deployment_analyzer.py \
  --github-user YOUR_USERNAME \
  --github-token YOUR_TOKEN \
  --railway-token YOUR_RAILWAY_TOKEN \
  --limit 10

# Analyze specific number of repositories
python3 railway_deployment_analyzer.py --github-user YOUR_USERNAME --limit 5
```

### Command Line Options

- `--github-user`: Your GitHub username (required)
- `--github-token`: GitHub Personal Access Token (optional, will prompt if not provided)
- `--railway-token`: Railway API token (optional)
- `--limit`: Limit analysis to first N repositories (optional)

## Error Categories Detected

The analyzer detects and provides recommendations for:

### 1. **Missing Environment Variables**
- `OPENAI_API_KEY`, `DATABASE_URL`, `PORT`, etc.
- **Fix**: Add missing variables in Railway dashboard

### 2. **Port Binding Issues**
- Server not binding to `process.env.PORT`
- **Fix**: Ensure app listens on `process.env.PORT || 3000`

### 3. **Build Failures**
- npm install failures, missing dependencies
- **Fix**: Check package.json scripts and dependencies

### 4. **Runtime Errors**
- Uncaught exceptions, undefined variables
- **Fix**: Add proper error handling and testing

### 5. **Database Issues**
- Connection failures, SQLite errors
- **Fix**: Check DATABASE_URL and database accessibility

### 6. **Memory Issues**
- Out of memory errors, heap overflow
- **Fix**: Optimize memory usage or upgrade Railway plan

### 7. **Timeout Issues**
- Build timeouts, request timeouts
- **Fix**: Optimize build process and reduce bundle size

### 8. **Dependency Issues**
- Module not found, peer dependency conflicts
- **Fix**: Update dependencies and package-lock.json

### 9. **Railway Configuration**
- Missing railway.json, invalid config
- **Fix**: Create proper Railway configuration

### 10. **Railway Limits**
- Resource limits, quota exceeded
- **Fix**: Review usage and consider plan upgrade

## Sample Output

```
================================================================================
RAILWAY DEPLOYMENT FAILURE ANALYSIS REPORT
================================================================================
Generated: 2024-01-15 14:30:25
GitHub User: your_username
Repositories Analyzed: 5

📊 SUMMARY
----------------------------------------
Total Repositories: 5
Repositories with Issues: 3
Healthy Repositories: 2

============================================================
REPOSITORY: project-xavier
============================================================
URL: https://github.com/your_username/project-xavier
Last Updated: 2024-01-15T10:30:00Z
Status: ❌ 2 issue categories found

🔍 ISSUES FOUND:
  • Missing Env Vars:
    - missing environment variable
    - OPENAI_API_KEY
  • Port Binding:
    - port binding
    - listen EADDRINUSE

💡 RECOMMENDATIONS:
  🔧 Add missing environment variables in Railway dashboard
     - Check for OPENAI_API_KEY, DATABASE_URL, PORT, etc.
     - Ensure all required env vars are set in production
  🔧 Fix port binding issues
     - Ensure your app listens on process.env.PORT
     - Add: app.listen(process.env.PORT || 3000)
```

## Configuration Helper

The package also includes a configuration helper to set up Railway deployment files:

```bash
# For Node.js projects
python3 railway_config_helper.py /path/to/your/project --node

# For Python projects
python3 railway_config_helper.py /path/to/your/project --python
```

This creates:
- `railway.json` - Railway configuration
- `Procfile` - Process definition
- `Dockerfile` - Container configuration
- Environment variable checks

## Testing

Run the test suite to verify the analyzer works correctly:

```bash
python3 test_analyzer.py
```

## Troubleshooting

### Common Issues

1. **"Railway CLI not found"**
   - Install Railway CLI: `npm install -g @railway/cli`
   - Login: `railway login`

2. **"GitHub token invalid"**
   - Ensure token has `repo` scope
   - Check token hasn't expired

3. **"No logs found"**
   - Verify Railway CLI is authenticated
   - Check if projects are deployed on Railway

### Getting Help

- Check the generated report file for detailed analysis
- Review Railway documentation for deployment best practices
- Use the configuration helper to set up proper Railway configs

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details.