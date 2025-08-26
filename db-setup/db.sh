#!/bin/bash
# Run this script to set up the tv_db database and tables
if [ -z "$DB_USER" ]; then
  read -p "Enter MySQL username: " DB_USER
fi
if [ -z "$DB_PASS" ]; then
  read -s -p "Enter MySQL password: " DB_PASS
  echo
fi
mysql -u "$DB_USER" -p"$DB_PASS" < schema.sql
if [ $? -eq 0 ]; then
  echo "Database setup completed successfully."
else
  echo "Database setup failed."
fi
