---
layout: page
title: Dev Footprints
permalink: /footprints/
ref: footprints
lang: en
menuitem: true
---

This page is a collection of cheat-sheets for things that I forget often how to do.

- [Databases](#databases)
    - [Finding out all stored procedures that reference a given table in SQL Server](#sqlserverproc)
- [Docker](#docker)
    - [Starting a RabbitMQ container](#rabbitmq)
- [Misc](#misc)
    - [Getting the HTTP status code for a URL](#curl)
    - [Finding out the PID of a process using a specific port (Windows)](#pid)
    - [Looking for all SQL Server Stored Procedures whose definition contain a given text](#procs)

## Databases
### <a name="sqlserverproc">Get all stored procedures that reference a given table</a>

In SQL Server, to find out all stored procedures that mention/use a given table, run this:

{% highlight sql %}
SELECT Name
FROM sys.procedures
WHERE OBJECT_DEFINITION(OBJECT_ID) LIKE '%TableNameOrWhatever%'

-- OR, a bit more detailed

SELECT 
    OBJECT_NAME(object_id) AS ProcedureName,
    definition
FROM 
    sys.sql_modules
WHERE 
    definition LIKE '%some text%'
    AND OBJECTPROPERTY(object_id, 'IsProcedure') = 1;
{% endhighlight %}

## Docker
### RabbitMQ
```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
```

## MISC

### CURL
To retrieve the HTTP status code of a URL, use the following command:

```
curl -s -o /dev/null -w "%{http_code}" https://carlosschults.net --ssl-no-revoke
```

### PID
As administrator, open the command prompt and run:
```
netstat -aon | findstr <PORT>
```

After finding out the PID of the offending process, kill it:
```
taskkill /PID <PID> /f
```
