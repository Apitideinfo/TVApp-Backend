@echo off
set /p user=Enter MySQL username: 
set /p pass=Enter MySQL password: 
mysql -u %user% -p%pass% tv_db < schema.sql
if %errorlevel% neq 0 (
    echo Database setup failed.
) else (
    echo Database setup successful.
)
pause
