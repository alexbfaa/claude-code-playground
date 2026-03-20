#!/bin/bash
# Cleanup old data files to prevent unbounded growth
# Usage: ./scripts/cleanup_history.sh
#
# Retention policy:
#   - history/ files: 90 days (research findings already extracted into knowledge base)
#   - logs/ files: 30 days (session logs, low long-term value)
#   - routing/ files: 30 days (routing manifests, low long-term value)
#   - suggestions/archive/ files: NEVER deleted (audit trail)

cd "$(dirname "$0")/.."

DATA_DIR="data"
HISTORY_DAYS=90
LOGS_DAYS=30
ROUTING_DAYS=30

deleted_count=0

# Clean history/ files older than 90 days
if [ -d "$DATA_DIR/history" ]; then
  while IFS= read -r -d '' file; do
    rm "$file"
    deleted_count=$((deleted_count + 1))
  done < <(find "$DATA_DIR/history" -name "*.md" -mtime +$HISTORY_DAYS -print0 2>/dev/null)
fi

# Clean logs/ files older than 30 days
if [ -d "$DATA_DIR/logs" ]; then
  while IFS= read -r -d '' file; do
    rm "$file"
    deleted_count=$((deleted_count + 1))
  done < <(find "$DATA_DIR/logs" -name "*.md" -mtime +$LOGS_DAYS -print0 2>/dev/null)
fi

# Clean routing/ files older than 30 days
if [ -d "$DATA_DIR/routing" ]; then
  while IFS= read -r -d '' file; do
    rm "$file"
    deleted_count=$((deleted_count + 1))
  done < <(find "$DATA_DIR/routing" -name "*.json" -mtime +$ROUTING_DAYS -print0 2>/dev/null)
fi

echo "Cleanup complete: $deleted_count files removed"
