#!/bin/bash

# Function to check if a package is installable
check_installable() {
    local package="$1"
    local policy_output

    # Get the policy information for the package
    policy_output=$(apt-cache policy "$package" 2>/dev/null)

    # Check if there is a candidate version available
    if grep -q "Candidate: (none)" <<< "$policy_output"; then
        echo "$package is not installable."
        return 1
    else
        echo "$package is installable."
        return 0
    fi
}

# Update package lists
apt update -y || { echo "Failed to update package lists."; exit 1; }

# Check if Firefox is installable
if check_installable "firefox"; then
    apt install -y firefox || { echo "Failed to install Firefox."; exit 1; }
else
    echo "Firefox is not installable. Checking for Firefox ESR..."
    
    # Check if Firefox ESR is installable
    if check_installable "firefox-esr"; then
        apt install -y firefox-esr || { echo "Failed to install Firefox ESR."; exit 1; }
    else
        echo "Neither Firefox nor Firefox ESR is installable."
        # Here you could add logic to install from Mozilla's repository or suggest an alternative
        apt-get install -y apt-transport-https curl
        curl -fsSLo /usr/share/keyrings/mozilla-archive-keyring.gpg https://packages.mozilla.org/apt/repo-signing-key.gpg
        echo "deb [signed-by=/usr/share/keyrings/mozilla-archive-keyring.gpg] https://packages.mozilla.org/apt mozilla main" | sudo tee -a /etc/apt/sources.list.d/mozilla.list > /dev/null
        apt-get update -y && apt-get install -y firefox
    fi
fi
