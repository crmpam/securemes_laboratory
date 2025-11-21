# start container
docker-compose up -d

# View running container
docker ps

# Restart server
docker restart ejabberd

# See last 20 logs
docker logs ejabberd --tail 20

# Send a message - this is from powershell or temrminal but you cna also go to localhost:5280 and send it from there and open pidgin and see it there
Invoke-EjabberdApi -Endpoint "send_message" -Method POST -Body @{
    type = "chat"
    from = "dgetov@dgetov"
    to = "dgetov2@dgetov"
    subject = "API Test"
    body = "Message sent from PowerShell!"
}

# Check offline count
Invoke-EjabberdApi -Endpoint "get_offline_count" -Method POST -Body @{
    user = "dgetov2"
    server = "dgetov"
}

# test connections
 Test-NetConnection -ComputerName localhost -Port 5222
 Get-NetTCPConnection -LocalPort 5269
 http://localhost:5280/admin/ - also - Test-NetConnection -ComputerName localhost -Port 5280



# See registered users
docker exec -it ejabberd ejabberdctl registered_users dgetov

# Register new user 
docker exec -it ejabberd ejabberdctl register dgetov dgetov dgetov


# Delete user
docker exec -it ejabberd ejabberdctl unregister username dgetov

# Check password 
docker exec -it ejabberd ejabberdctl check_password username dgetov password

# Change user pass
docker exec -it ejabberd ejabberdctl change_password username dgetov newpassword


# Container won't start
docker logs ejabberd
docker-compose down
docker-compose up -d

## Must have this to be able to send and receive messages. Save this in notes - powershell function setup
# Important docker needs to be running

function Invoke-EjabberdApi {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    $pair = "dgetov@dgetov:dgetov"
    $bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
    $base64 = [System.Convert]::ToBase64String($bytes)
    $headers = @{ Authorization = "Basic $base64" }
    
    $params = @{
        Uri = "http://localhost:5280/api/$Endpoint"
        Headers = $headers
        Method = $Method
    }
    
    if ($Body) {
        $params.Body = ($Body | ConvertTo-Json)
        $params.ContentType = "application/json"
    }
    
    Invoke-RestMethod @params
}

 # To enable the function permanently:
 # Create profile if it doesn't exist

if (!(Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -Type File -Force
}

# Edit profile
notepad $PROFILE

# Reload profile
. $PROFILE
