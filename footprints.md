---
layout: page
title: Dev Footprints
permalink: /footprints/
ref: footprints
lang: en
menuitem: true
---

# Dev Footprints - Quick Reference

This page is a collection of cheat-sheets for things that I often need to remember.

## Table of Contents
- [Databases](#databases)
  - [SQL Server: Concatenate Grouped Values](#sqlserver-concat)
  - [SQL Server: Find Stored Procedures Referencing a Table](#sqlserver-proc-references)
  - [SQL Server: Search for Text in Stored Procedures](#sqlserver-proc-search)
- [Docker](#docker)
  - [Start a RabbitMQ Container](#docker-rabbitmq)
  - [Start a SQL Server Container](#docker-sqlserver)
- [System Administration](#system-admin)
  - [Get HTTP Status Code for a URL](#curl-status)
  - [Find Process Using a Specific Port (Windows)](#windows-port-pid)

## Databases {#databases}

### SQL Server: Concatenate Grouped Values {#sqlserver-concat}

Sometimes you need to group values from different rows and concatenate the results into a single string.

**Modern Approach (SQL Server 2017+):**
```sql
-- Using STR_AGG to concatenate employee names by department
SELECT
    Department,
    STR_AGG(FirstName, ', ') AS EmployeeNames
FROM Employees
GROUP BY Department
ORDER BY Department;
```

**Legacy Approach:**
```sql
-- Using STUFF with FOR XML PATH
SELECT
    Department,
    STUFF(
        (SELECT ', ' + FirstName
         FROM Employees e2
         WHERE e2.Department = e1.Department
         FOR XML PATH(''), TYPE).value('.', 'VARCHAR(MAX)'),
         1, 2, '') AS EmployeeNames
FROM Employees e1
GROUP BY Department
ORDER BY Department;
```

### SQL Server: Find Stored Procedures Referencing a Table {#sqlserver-proc-references}

To find all stored procedures that reference a specific table:

```sql
SELECT Name
FROM sys.procedures
WHERE OBJECT_DEFINITION(OBJECT_ID) LIKE '%TableNameOrWhatever%'
```

For more detailed results:

```sql
SELECT
    OBJECT_NAME(object_id) AS ProcedureName,
    definition
FROM
    sys.sql_modules
WHERE
    definition LIKE '%TableNameOrWhatever%'
    AND OBJECTPROPERTY(object_id, 'IsProcedure') = 1;
```

### SQL Server: Search for Text in Stored Procedures {#sqlserver-proc-search}

To find stored procedures containing specific text in their definition:

```sql
SELECT
    OBJECT_NAME(object_id) AS ProcedureName,
    definition
FROM
    sys.sql_modules
WHERE
    definition LIKE '%search text%'
    AND OBJECTPROPERTY(object_id, 'IsProcedure') = 1;
```

## Docker {#docker}

### Start a RabbitMQ Container {#docker-rabbitmq}

```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
```

### Start a SQL Server Container {#docker-sqlserver}

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=yourStrong(!)Password" \
  --name sql-server-container -p 1433:1433 -d mcr.microsoft.com/mssql/server:2019-latest
```

## System Administration {#system-admin}

### Get HTTP Status Code for a URL {#curl-status}

To retrieve just the HTTP status code of a URL:

```bash
curl -s -o /dev/null -w "%{http_code}" https://carlosschults.net --ssl-no-revoke
```

### Find Process Using a Specific Port (Windows) {#windows-port-pid}

As administrator, open the command prompt and run:

```bash
netstat -aon | findstr <PORT>
```

After finding the PID of the process, you can terminate it:

```bash
taskkill /PID <PID> /f
```