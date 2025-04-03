-- Load thư viện UI Fluent
local Fluent = loadstring(game:HttpGet("https://github.com/dawid-scripts/Fluent/releases/latest/download/main.lua"))()

-- Tạo cửa sổ Fluent
local Window = Fluent:CreateWindow({
    Title = "MintHub | MM2 Farm",
    SubTitle = "by Mint",
    TabWidth = 160,
    Size = UDim2.fromOffset(580, 460),
    Acrylic = true,
    Theme = "Dark",
    MinimizeKey = Enum.KeyCode.LeftControl
})

-- Tạo các tab
local Tabs = {
    Main = Window:AddTab({ Title = "Main Options", Icon = "coins" }),
    Discord = Window:AddTab({ Title = "Discord Server", Icon = "link" })
}

local Options = Fluent.Options

-- Khởi tạo dịch vụ và biến
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:FindFirstChild("Humanoid") or character:WaitForChild("Humanoid")
local teleportEnabled = false
local espEnabled = false
local avoidMurdererEnabled = false
local tweenSpeed = 16
local teleportDistanceThreshold = 50
local farmMode = "Default Farm"
local collectedCoins = 0
local isAdvancedAntiKickSupported = false
local roles, Murderer, Sheriff, Hero

-- Hàm đếm coin
local function collectCoin(coin)
    if coin and coin.Parent then
        collectedCoins = collectedCoins + 1
        coin:Destroy()
    end
end

-- Hàm tìm CoinContainer
local function findCoinContainer()
    for _, child in pairs(workspace:GetChildren()) do
        local coinContainer = child:FindFirstChild("CoinContainer")
        if coinContainer then
            return coinContainer
        end
    end
    return nil
end

-- Hàm kiểm tra trạng thái sống của player
local function isAlive(playerName)
    for i, v in pairs(roles) do
        if playerName == i then
            return not v.Killed and not v.Dead
        end
    end
    return false
end

-- Hàm kiểm tra khoảng cách đến Murderer
local function getMurdererDistance()
    if not Murderer or not Players:FindFirstChild(Murderer) then return math.huge end
    local murdererChar = Players[Murderer].Character
    if not murdererChar or not isAlive(Murderer) then return math.huge end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return math.huge end
    return (hrp.Position - murdererChar.HumanoidRootPart.Position).Magnitude
end

-- Hàm né Murderer
local function avoidMurderer(coinPosition)
    if not Murderer or not Players:FindFirstChild(Murderer) or not avoidMurdererEnabled then return coinPosition end
    local murdererChar = Players[Murderer].Character
    if not murdererChar or not isAlive(Murderer) then return coinPosition end
    
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return coinPosition end
    
    local murdererPos = murdererChar.HumanoidRootPart.Position
    local distanceToMurderer = (hrp.Position - murdererPos).Magnitude
    
    if distanceToMurderer < 30 then
        local direction = (hrp.Position - murdererPos).Unit
        return hrp.Position + (direction * 40)
    end
    return coinPosition
end

-- Hàm tìm coin gần nhất với tính năng né Murderer
local function findNearestCoin(maxRadius)
    local coinContainer = findCoinContainer()
    if not coinContainer then return nil end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return nil end
    local nearestCoin, nearestDistance = nil, maxRadius or math.huge
    for _, coin in pairs(coinContainer:GetChildren()) do
        if coin:IsA("BasePart") and coin:IsDescendantOf(workspace) then
            local adjustedPos = avoidMurderer(coin.Position)
            local dist = (adjustedPos - hrp.Position).Magnitude
            if dist < nearestDistance then
                nearestCoin = coin
                nearestDistance = dist
            end
        end
    end
    return nearestCoin, nearestDistance
end

-- Hàm teleport đến coin
local function teleportToCoin(coin)
    if not coin then return end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return end

    local targetPos = avoidMurderer(coin.Position)
    local targetCFrame = (farmMode == "Safe Farm (Beta)") 
        and CFrame.new(targetPos.X, targetPos.Y - 5, targetPos.Z)
        or CFrame.new(targetPos) + Vector3.new(0, 2.9, 0)
    
    local distance = (hrp.Position - targetPos).Magnitude
    if distance > 100 then
        humanoid.WalkSpeed = 100
        humanoid:MoveTo(targetPos)
        wait(distance / 100)
        humanoid.WalkSpeed = 16
    end
    hrp.CFrame = targetCFrame
    collectCoin(coin)
end

-- Hàm move bằng Tween đến coin
local function moveToCoin(coin)
    if not coin then return end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return end

    local targetPosition = avoidMurderer((farmMode == "Safe Farm (Beta)") 
        and Vector3.new(coin.Position.X, coin.Position.Y - 5, coin.Position.Z)
        or coin.Position + Vector3.new(0, 2.9, 0))

    local distance = (targetPosition - hrp.Position).Magnitude
    local duration = distance / tweenSpeed

    local tweenInfo = TweenInfo.new(duration, Enum.EasingStyle.Linear)
    local tween = TweenService:Create(hrp, tweenInfo, {CFrame = CFrame.new(targetPosition)})
    tween:Play()
    tween.Completed:Wait()
    collectCoin(coin)
end

-- Vòng lặp farm
local function farmCycle()
    if not teleportEnabled then return end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return end

    local coin, distance = findNearestCoin(1e6)
    if not coin then return end

    if distance > teleportDistanceThreshold then
        teleportToCoin(coin)
    else
        moveToCoin(coin)
    end
end

-- ESP Functions
local function createHighlight()
    for _, v in pairs(Players:GetChildren()) do
        if v ~= player and v.Character and not v.Character:FindFirstChild("Highlight") then
            local highlight = Instance.new("Highlight", v.Character)
            highlight.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop
            highlight.OutlineColor = Color3.fromRGB(255, 255, 255)
            highlight.FillTransparency = 0.5
        end
    end
end

local function updateHighlights()
    for _, v in pairs(Players:GetChildren()) do
        if v ~= player and v.Character and v.Character:FindFirstChild("Highlight") then
            local highlight = v.Character:FindFirstChild("Highlight")
            highlight.Enabled = espEnabled
            
            if not roles then return end
            
            if v.Name == Murderer and isAlive(v.Name) then
                highlight.FillColor = Color3.fromRGB(225, 0, 0)
            elseif v.Name == Sheriff and isAlive(v.Name) then
                highlight.FillColor = Color3.fromRGB(0, 0, 225)
            elseif v.Name == Hero and isAlive(v.Name) and not isAlive(Sheriff) then
                highlight.FillColor = Color3.fromRGB(255, 250, 0)
            else
                highlight.FillColor = Color3.fromRGB(0, 225, 0)
            end
        end
    end
end

-- Cập nhật roles
local function updateRoles()
    roles = ReplicatedStorage:FindFirstChild("GetPlayerData", true):InvokeServer()
    for i, v in pairs(roles) do
        if v.Role == "Murderer" then Murderer = i
        elseif v.Role == "Sheriff" then Sheriff = i
        elseif v.Role == "Hero" then Hero = i
        end
    end
end

-- Tạo các thành phần UI với Fluent
do
    -- Textbox chỉnh tốc độ farm
    Tabs.Main:AddInput("Speed", {
        Title = "Speed (1 - 17)",
        Default = "16",
        Numeric = true,
        Callback = function(value)
            local num = tonumber(value)
            if num then
                tweenSpeed = math.clamp(num, 1, 17)
            end
        end
    })

    -- Dropdown chọn chế độ farm
    Tabs.Main:AddDropdown("FarmMode", {
        Title = "Farm Mode",
        Values = {"Default Farm", "Safe Farm (Beta)"},
        Default = "Default Farm",
        Callback = function(selectedMode)
            farmMode = selectedMode
        end
    })

    -- Toggle Anti-AFK
    Tabs.Main:AddToggle("AntiAFK", {
        Title = "Anti-AFK",
        Default = false,
        Callback = function(value)
            if value then
                local vu = game:GetService("VirtualUser")
                player.Idled:Connect(function()
                    vu:Button2Down(Vector2.new(0,0), workspace.CurrentCamera.CFrame)
                    wait(1)
                    vu:Button2Up(Vector2.new(0,0), workspace.CurrentCamera.CFrame)
                end)
            end
            local status = value and "Enabled!" or "Disabled!"
            game:GetService("StarterGui"):SetCore("SendNotification", {
                Title = "AntiAFK",
                Text = status,
                Icon = "rbxassetid://79958200710618",
                Duration = 3
            })
        end
    })

    -- Toggle ESP
    Tabs.Main:AddToggle("ESP", {
        Title = "ESP Highlights",
        Default = false,
        Callback = function(value)
            espEnabled = value
            local status = value and "Enabled!" or "Disabled!"
            game:GetService("StarterGui"):SetCore("SendNotification", {
                Title = "ESP Highlights",
                Text = status,
                Icon = "rbxassetid://79958200710618",
                Duration = 3
            })
        end
    })

    -- Toggle Avoid Murderer
    Tabs.Main:AddToggle("AvoidMurderer", {
        Title = "Avoid Murderer",
        Default = false,
        Callback = function(value)
            avoidMurdererEnabled = value
            local status = value and "Enabled!" or "Disabled!"
            game:GetService("StarterGui"):SetCore("SendNotification", {
                Title = "Avoid Murderer",
                Text = status,
                Icon = "rbxassetid://79958200710618",
                Duration = 3
            })
        end
    })

    -- Toggle Coin Farm
    Tabs.Main:AddToggle("CoinFarm", {
        Title = "Coin Farm",
        Default = false,
        Callback = function(value)
            teleportEnabled = value
            
            if isAdvancedAntiKickSupported and getgenv().ED_AntiKick then
                getgenv().ED_AntiKick.Enabled = value
            elseif getgenv().ED_BasicAntiKick then
                getgenv().ED_BasicAntiKick.Enabled = value
            end
            getgenv().ED_AntiCheatBypass.Enabled = value

            if value then
                game:GetService("StarterGui"):SetCore("SendNotification", {
                    Title = "Anti-Kick",
                    Text = isAdvancedAntiKickSupported and "Advanced Anti-Kick Enabled!" or "Basic Anti-Kick Enabled!",
                    Icon = "rbxassetid://79958200710618",
                    Duration = 3
                })
                game:GetService("StarterGui"):SetCore("SendNotification", {
                    Title = "Anti-Cheat Bypass",
                    Text = "Basic Anti-Cheat Bypass Enabled!",
                    Icon = "rbxassetid://79958200710618",
                    Duration = 3
                })
            else
                game:GetService("StarterGui"):SetCore("SendNotification", {
                    Title = "Anti-Kick",
                    Text = isAdvancedAntiKickSupported and "Advanced Anti-Kick Disabled!" or "Basic Anti-Kick Disabled!",
                    Icon = "rbxassetid://79958200710618",
                    Duration = 3
                })
                game:GetService("StarterGui"):SetCore("SendNotification", {
                    Title = "Anti-Cheat Bypass",
                    Text = "Anti-Cheat Bypass Disabled!",
                    Icon = "rbxassetid://79958200710618",
                    Duration = 3
                })
            end
            local status = value and "Enabled!" or "Disabled!"
            game:GetService("StarterGui"):SetCore("SendNotification", {
                Title = "Auto Farm Coins",
                Text = status,
                Icon = "rbxassetid://79958200710618",
                Duration = 3
            })
        end
    })

    -- Button kiểm tra số coin
    Tabs.Main:AddButton({
        Title = "Check Coins Collected [Beta]",
        Callback = function()
            game:GetService("StarterGui"):SetCore("SendNotification", {
                Title = "Coin Tracker",
                Text = "Coins Collected: " .. collectedCoins,
                Icon = "rbxassetid://79958200710618",
                Duration = 3
            })
        end
    })

    -- Button Discord
    Tabs.Discord:AddButton({
        Title = "Join Discord",
        Callback = function()
            local discordLink = "https://discord.gg/y8ZDZuFm5F"
            setclipboard(discordLink)
            game:GetService("StarterGui"):SetCore("SendNotification", {
                Title = "Discord Link Copied",
                Text = "Link Discord was copied!",
                Icon = "rbxassetid://79958200710618",
                Duration = 3
            })
        end
    })
end

-- Kiểm tra executor có hỗ trợ anti-kick nâng cao không
local function checkExecutorSupport()
    if hookmetamethod and newcclosure then
        isAdvancedAntiKickSupported = true
    else
        isAdvancedAntiKickSupported = false
    end
end

-- Anti-Kick nâng cao
local function setupAdvancedAntiKick()
    if getgenv().ED_AntiKick then return end

    getgenv().ED_AntiKick = {
        Enabled = false,
        SendNotifications = true,
        CheckCaller = true
    }

    local OldNamecall
    OldNamecall = hookmetamethod(game, "__namecall", newcclosure(function(...)
        local self, message = ...
        local method = getnamecallmethod()

        if getgenv().ED_AntiKick.Enabled and method == "Kick" and not checkcaller() then
            if getgenv().ED_AntiKick.SendNotifications then
                game:GetService("StarterGui"):SetCore("SendNotification", {
                    Title = "Anti-Kick",
                    Text = "Intercepted attempted kick! (Advanced)",
                    Icon = "rbxassetid://79958200710618",
                    Duration = 2
                })
            end
            return
        end
        return OldNamecall(...)
    end))

    local OldFunction
    OldFunction = hookfunction(player.Kick, function(...)
        if getgenv().ED_AntiKick.Enabled then
            if getgenv().ED_AntiKick.SendNotifications then
                game:GetService("StarterGui"):SetCore("SendNotification", {
                    Title = "Anti-Kick",
                    Text = "Intercepted attempted kick! (Advanced)",
                    Icon = "rbxassetid://79958200710618",
                    Duration = 2
                })
            end
            return
        end
    end)
end

-- Anti-Kick cơ bản
local function setupBasicAntiKick()
    if getgenv().ED_BasicAntiKick then return end

    getgenv().ED_BasicAntiKick = {
        Enabled = false
    }

    local mt = getrawmetatable(game)
    local oldNamecall = mt.__namecall
    setreadonly(mt, false)

    mt.__namecall = function(self, ...)
        local method = getnamecallmethod()
        if getgenv().ED_BasicAntiKick.Enabled and method == "Kick" then
            game:GetService("StarterGui"):SetCore("SendNotification", {
                Title = "Anti-Kick",
                Text = "Intercepted attempted kick! (Basic)",
                Icon = "rbxassetid://79958200710618",
                Duration = 2
            })
            return nil
        end
        return oldNamecall(self, ...)
    end

    setreadonly(mt, true)
end

-- Bypass Anti-Cheat cơ bản
local function setupAntiCheatBypass()
    if getgenv().ED_AntiCheatBypass then return end

    getgenv().ED_AntiCheatBypass = {
        Enabled = false
    }

    local oldIndex
    local mt = getrawmetatable(game)
    setreadonly(mt, false)
    oldIndex = mt.__index
    mt.__index = newcclosure(function(self, key)
        if getgenv().ED_AntiCheatBypass.Enabled and tostring(self) == "NetworkClient" and key == "ReplicationFocus" then
            return player.Character
        end
        return oldIndex(self, key)
    end)
    setreadonly(mt, true)

    spawn(function()
        while wait(0.5) do
            if getgenv().ED_AntiCheatBypass.Enabled and character and humanoid then
                humanoid.WalkSpeed = math.clamp(humanoid.WalkSpeed, 0, 16)
            end
        end
    end)
end

-- Khởi tạo Anti-Kick và Anti-Cheat Bypass
checkExecutorSupport()
if isAdvancedAntiKickSupported then
    setupAdvancedAntiKick()
else
    setupBasicAntiKick()
end
setupAntiCheatBypass()

-- Xử lý respawn
player.CharacterAdded:Connect(function(newCharacter)
    character = newCharacter
    humanoid = character:FindFirstChild("Humanoid") or character:WaitForChild("Humanoid")
    wait(1)
end)

-- Khi nhân vật chết
if humanoid then
    humanoid.Died:Connect(function()
        wait(1)
    end)
end

-- Main loops
spawn(function()
    while wait(0.1) do
        if teleportEnabled then
            pcall(farmCycle)
        end
    end
end)

spawn(function()
    while wait(0.1) do
        pcall(function()
            updateRoles()
            createHighlight()
            updateHighlights()
        end)
    end
end)

-- Chọn tab mặc định
Window:SelectTab(1)

-- Thông báo khi script chạy
Fluent:Notify({
    Title = "MintHub",
    Content = "The script has been loaded.",
    Duration = 5
})
