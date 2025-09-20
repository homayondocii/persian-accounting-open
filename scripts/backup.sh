#!/bin/bash

# =================================
# Database Backup Script
# Comprehensive Accounting System
# =================================

set -e

# Configuration
DB_HOST="postgres"
DB_NAME="accounting_db"
DB_USER="accounting_user"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/accounting_backup_$DATE.sql"
COMPRESSED_FILE="$BACKUP_FILE.gz"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting database backup at $(date)"

# Create database backup
pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" --no-password > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Database backup completed successfully"
    
    # Compress the backup
    gzip "$BACKUP_FILE"
    echo "Backup compressed: $COMPRESSED_FILE"
    
    # Calculate file size
    BACKUP_SIZE=$(du -sh "$COMPRESSED_FILE" | cut -f1)
    echo "Backup size: $BACKUP_SIZE"
    
    # Remove old backups (keep only last 30 days)
    find "$BACKUP_DIR" -name "accounting_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "Old backups cleaned up (retention: $RETENTION_DAYS days)"
    
    # List current backups
    echo "Current backups:"
    ls -lah "$BACKUP_DIR"/accounting_backup_*.sql.gz | tail -10
    
    echo "Backup process completed successfully at $(date)"
else
    echo "ERROR: Database backup failed!"
    exit 1
fi