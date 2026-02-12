#!/bin/bash
#
# Clawdbot Setup Script
# Run this on EC2 to set up Clawdbot from scratch
#
# Usage: bash setup.sh
#

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 Clawdbot Setup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BASE_DIR="/opt/clawdbot"
REPO_URL="https://github.com/thiagocesardacruz-svg/aios-lab.git"

# Step 1: Create directory structure
echo ""
echo "📁 Step 1: Creating directory structure..."
sudo mkdir -p $BASE_DIR/{scripts,config,state,logs/{activity,errors,audit},cache/{notion,clickup}}
sudo chown -R $USER:$USER $BASE_DIR

echo "   ✅ Directories created"

# Step 2: Clone repository
echo ""
echo "📦 Step 2: Cloning aios-lab repository..."
if [ -d "$BASE_DIR/repo" ]; then
    echo "   Repository exists, pulling latest..."
    cd $BASE_DIR/repo && git pull origin main
else
    git clone $REPO_URL $BASE_DIR/repo
fi
echo "   ✅ Repository ready"

# Step 3: Remove old thiago-os references (if any)
echo ""
echo "🗑️  Step 3: Cleaning old references..."
if [ -d "$BASE_DIR/docs/thiago-os" ]; then
    rm -rf $BASE_DIR/docs/thiago-os
    echo "   Removed old thiago-os docs"
fi
if ls $BASE_DIR/config/old-*.yaml 1> /dev/null 2>&1; then
    rm -f $BASE_DIR/config/old-*.yaml
    echo "   Removed old config files"
fi
echo "   ✅ Cleanup complete"

# Step 4: Create symlinks
echo ""
echo "🔗 Step 4: Creating symlinks..."
ln -sf $BASE_DIR/repo/shared/budget-limits.yaml $BASE_DIR/config/budget-limits.yaml
echo "   ✅ Symlinks created"

# Step 5: Install Python dependencies
echo ""
echo "🐍 Step 5: Installing Python dependencies..."
pip3 install --quiet requests pyyaml slack_sdk 2>/dev/null || pip3 install requests pyyaml slack_sdk
echo "   ✅ Dependencies installed"

# Step 6: Copy scripts
echo ""
echo "📜 Step 6: Copying scripts..."
SCRIPTS_SRC="$BASE_DIR/repo/squads/ops/clawdbot/scripts-ec2"
if [ -d "$SCRIPTS_SRC" ]; then
    cp -v $SCRIPTS_SRC/*.py $BASE_DIR/scripts/
    chmod +x $BASE_DIR/scripts/*.py
    echo "   ✅ Scripts copied and made executable"
else
    echo "   ⚠️  Scripts source not found, please copy manually"
fi

# Step 7: Initialize state
echo ""
echo "💾 Step 7: Initializing state..."
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
TODAY=$(date +%Y-%m-%d)

echo "{\"initialized\": true, \"timestamp\": \"$TIMESTAMP\"}" > $BASE_DIR/state/current_state.json
echo "{\"date\": \"$TODAY\", \"total\": 0, \"by_source\": {}}" > $BASE_DIR/state/daily_costs.json
echo "[]" > $BASE_DIR/state/processed_tasks.json

echo "   ✅ State initialized"

# Step 8: Setup cron
echo ""
echo "⏰ Step 8: Setting up cron jobs..."
CRON_FILE="/tmp/clawdbot_cron"
cat > $CRON_FILE << 'CRON'
# Clawdbot Cron Jobs
# Poll ClickUp for delegated tasks every 5 minutes
*/5 * * * * /usr/bin/python3 /opt/clawdbot/scripts/clickup_poller.py >> /opt/clawdbot/logs/cron.log 2>&1

# Monitor spending every 30 minutes
*/30 * * * * /usr/bin/python3 /opt/clawdbot/scripts/spend_monitor.py >> /opt/clawdbot/logs/cron.log 2>&1

# Health check every 30 minutes
*/30 * * * * /usr/bin/python3 /opt/clawdbot/scripts/health_check.py >> /opt/clawdbot/logs/cron.log 2>&1

# Update repository daily at midnight
0 0 * * * cd /opt/clawdbot/repo && git pull origin main >> /opt/clawdbot/logs/cron.log 2>&1

# Daily digest at 9 AM
0 9 * * * /usr/bin/python3 /opt/clawdbot/scripts/daily_digest.py >> /opt/clawdbot/logs/cron.log 2>&1
CRON

crontab $CRON_FILE
rm $CRON_FILE
echo "   ✅ Cron jobs installed"

# Step 9: Verify setup
echo ""
echo "🔍 Step 9: Verifying setup..."
echo ""
echo "Directory structure:"
ls -la $BASE_DIR/

echo ""
echo "Scripts:"
ls -la $BASE_DIR/scripts/

echo ""
echo "Configuration:"
ls -la $BASE_DIR/config/

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SETUP COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Create Slack config: nano $BASE_DIR/config/slack-config.yaml"
echo "2. Test health check: python3 $BASE_DIR/scripts/health_check.py"
echo "3. Test poller: python3 $BASE_DIR/scripts/clickup_poller.py"
echo ""
echo "Documentation:"
echo "  $BASE_DIR/repo/squads/ops/clawdbot/ONBOARDING.md"
echo ""
echo "Source of Truth:"
echo "  Repository: aios-lab (NOT thiago-os)"
echo "  Branch: main"
echo ""
